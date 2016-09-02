import json
import urllib

import os
from cStringIO import StringIO

from PIL import Image
from django.conf.urls import url
from django.core.exceptions import ObjectDoesNotExist
from django.core.files import File
from django.core.paginator import InvalidPage, Paginator
from django.db.models import F, Max
from django.http import Http404
from django_facebook.models import FacebookCustomUser
from haystack.backends import SQ
from haystack.query import SearchQuerySet
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.exceptions import Unauthorized
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash

from accounts.api.authentication import JSONWebTokenAuthentication
from friends.models import Friend

from goals.utils import calculate_age, social_extra_data, calculate_distance, \
    get_current_position, get_lives_in, get_religious_views, \
    get_political_views
from match_engine.models import MatchEngine
from members.models import FacebookCustomUserActive, OnBoardingFlow
from photos.models import FacebookPhoto

import logging

from photos.utils import update_image_base64, _update_image, crop_photo

logger = logging.getLogger(__name__)


class OnBoardingFlowResource(ModelResource):
    user = fields.ForeignKey('photos.api.resources.UserResource', 'user')

    class Meta:
        queryset = OnBoardingFlow.objects.all()
        resource_name = 'onboardingflow'
        fields = ['is_complete']
        always_return_data = True
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(OnBoardingFlowResource, self).get_object_list(request). \
            filter(user_id=user)


class UserResource(ModelResource):
    goals = fields.OneToManyField('goals.api.resources.GoalResource',
                                  attribute=lambda bundle:
                                  bundle.obj.goal_set.all(),
                                  full=True, null=True)
    offers = fields.OneToManyField('goals.api.resources.OfferResource',
                                   attribute=lambda bundle:
                                   bundle.obj.offer_set.all(),
                                   full=True, null=True)
    interests = fields.OneToManyField('interests.api.resources.'
                                      'InterestResource',
                                      attribute=lambda bundle:
                                      bundle.obj.interest_set.all(),
                                      full=True, null=True)

    onboardingflow = fields.OneToOneField(OnBoardingFlowResource,
                                          'onboardingflow',
                                          full=True, null=True)
    image = fields.FileField(attribute='image', null=True, readonly=True)

    class Meta:
        queryset = FacebookCustomUserActive.objects.all()
        resource_name = 'auth/user'
        fields = ['username', 'first_name', 'last_name', 'last_login',
                  'about_me', 'facebook_id', 'id', 'date_of_birth',
                  'facebook_profile_url', 'gender', 'image', 'email', 'date_joined']
        filtering = {
            'facebook_id': ALL
        }
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        bundle.data['distance'] = calculate_distance(bundle.request.user.id,
                                                     bundle.obj.id)

        bundle.data['mutual_friends'] = \
            len(Friend.objects.mutual_friends(bundle.request.user.id,
                                              bundle.obj.id))

        bundle.data['age'] = calculate_age(bundle.data['date_of_birth'])

        # TODO chane user_id to url from user_id
        bundle.data['twitter_provider'], bundle.data['linkedin_provider'], \
            bundle.data['twitter_username'], bundle.data['linkedin_first_name'] = \
            social_extra_data(bundle.request.user.id)

        if bundle.obj.id != bundle.request.user.id:
            bundle.data['match_score'] = MatchEngine.objects. \
                count_common_goals_and_offers(bundle.obj.id,
                                              bundle.request.user.id)
        else:
            bundle.data['match_score'] = 0

        bundle.data['position'] = get_current_position(bundle.obj)
        bundle.data['lives_in'] = get_lives_in(bundle.obj)
        bundle.data['religious_views'] = get_religious_views(
            bundle.request.user.id
        )
        bundle.data['political_views'] = get_political_views(
            bundle.request.user.id
        )
        bundle.data['image'] = FacebookPhoto.objects.profile_photo(
            bundle.obj.id
        )
        return bundle

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/search%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('get_search'), name="api_get_search"),
        ]

    def get_search(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        self.is_authenticated(request)
        self.throttle_check(request)

        # Do the query.
        query = request.GET.get('q', '')
        sqs = SearchQuerySet().models(FacebookCustomUserActive).load_all(). \
            filter(SQ(first_name=query) |
                   SQ(last_name=query) |
                   SQ(goals=query) |
                   SQ(offers=query) |
                   SQ(likes=query) |
                   SQ(interests=query)).\
            exclude(id=request.user.id)
        paginator = Paginator(sqs, 10)

        try:
            page = paginator.page(int(request.GET.get('page', 1)))
        except InvalidPage:
            raise Http404("Sorry, no results on that page.")

        objects = []

        for result in page.object_list:
            bundle = self.build_bundle(obj=result.object, request=request)
            bundle = self.full_dehydrate(bundle)
            objects.append(bundle)

        object_list = {
            'objects': objects,
        }

        self.log_throttled_access(request)
        return self.create_response(request, object_list)


class FacebookPhotoResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    cropped_photo = fields.FileField(attribute="cropped_photo", null=True,
                                     blank=True, readonly=True)

    class Meta:
        queryset = FacebookPhoto.objects.all()
        resource_name = 'photo'
        ordering = ['order']
        always_return_data = True
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(FacebookPhotoResource, self).get_object_list(request).\
            filter(user_id=user)

    def dehydrate(self, bundle):
        photo_url = bundle.data.get('photo', '')
        if not photo_url.startswith('/media/') and \
                not photo_url.startswith('http'):
            bundle.data['photo'] = u'/media/{}'.format(bundle.data['photo'])
        return bundle

    def obj_create(self, bundle, **kwargs):
        return super(FacebookPhotoResource, self).obj_create(bundle, **kwargs)

    def obj_update(self, bundle, skip_errors=False, **kwargs):
        return super(FacebookPhotoResource, self).obj_update(bundle, **kwargs)

    def obj_delete(self, bundle, **kwargs):
        qs = FacebookPhoto.objects.filter(
            user_id=bundle.request.user.id)
        count = qs.count()
        max_order = qs.aggregate(Max('order')).get('order__max')
        photo_id = kwargs.get('pk')
        target = qs.get(pk=photo_id)
        try:
            if count == 1:
                raise Unauthorized()
            elif target.order == 0:
                qs.exclude(order=0).update(order=F('order') - 1)
            elif target.order == max_order:
                pass
            else:
                qs.filter(order__gt=target.order).update(order=F('order') - 1)
        except Unauthorized as e:
            self.unauthorized_result(e)
        return super(FacebookPhotoResource, self).obj_delete(bundle, **kwargs)
