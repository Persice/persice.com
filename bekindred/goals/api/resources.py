import re
import logging

from django.db.models import Q

from django_facebook.models import FacebookLike
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource

from tastypie.validation import Validation

from accounts.api.authentication import JSONWebTokenAuthentication
from goals.models import Subject, MatchFilterState, Goal, Offer
from photos.api.resources import UserResource

logger = logging.getLogger(__name__)


class SubjectResource(ModelResource):
    class Meta:
        always_return_data = True
        queryset = Subject.objects.all()
        resource_name = 'subject'
        fields = ['description']

        filtering = {
            'description': ALL
        }
        limit = 30
        max_limit = limit
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def dehydrate_description(self, bundle):
        return bundle.data['description'].lower()


class MatchFilterStateResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        always_return_data = True
        queryset = MatchFilterState.objects.all()
        resource_name = 'filter/state'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(MatchFilterStateResource, self).\
            get_object_list(request).filter(user_id=request.user.id)


class GoalValidation(Validation):
    def is_valid(self, bundle, request=None):
        if not bundle.data:
            return {'__all__': 'Not quite what I had in mind.'}

        errors = {}

        goal_subject = bundle.data.get('goal_subject').lower()
        if not goal_subject:
            errors['error'] = ['Please use goal_subject']

        subject = None
        try:
            subject = Subject.objects.filter(description=goal_subject)[0]
        except IndexError as err:
            logger.error()

        user = re.findall(r'/(\d+)/', bundle.data['user'])[0]
        goals = Goal.objects.filter(goal_id=subject.id, user_id=user)
        offers = Offer.objects.filter(offer_id=subject.id, user_id=user)

        if goals:
            errors['error'] = ['Goal already exists']

        if offers:
            errors['error'] = ["Goal couldn't be  equivalent to Offer"]

        return errors


class OfferValidation(Validation):
    def is_valid(self, bundle, request=None):
        if not bundle.data:
            return {'__all__': 'Not quite what I had in mind.'}

        errors = {}

        offer_subject = bundle.data.get('offer_subject').lower()
        if not offer_subject:
            errors['error'] = ['Please use offer_subject']

        subject = None
        try:
            subject = Subject.objects.filter(description=offer_subject)[0]
        except IndexError as err:
            logger.error(err)

        user = re.findall(r'/(\d+)/', bundle.data['user'])[0]
        goals = Goal.objects.filter(goal_id=subject.id, user_id=user)
        offers = Offer.objects.filter(offer_id=subject.id, user_id=user)

        if offers:
            errors['error'] = ['Offer already exists']

        if goals:
            errors['error'] = ["Offer couldn't be equivalent to Offer"]

        return errors


class GoalResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    goal = fields.ForeignKey(SubjectResource, 'goal')

    class Meta:
        queryset = Goal.objects.all()
        fields = ['user', 'goal', 'id']
        always_return_data = True
        resource_name = 'goal'
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()
        validation = GoalValidation()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(GoalResource, self).get_object_list(request).\
            filter(user_id=user)

    def obj_create(self, bundle, **kwargs):
        goal_subject = bundle.data.get('goal_subject').lower()
        try:
            subject, created = Subject.objects.get_or_create(
                description=goal_subject
            )
            return super(GoalResource, self).obj_create(bundle, goal=subject)
        except IndexError as err:
            logger.error(err)
        return super(GoalResource, self).obj_create(bundle, **kwargs)

    def obj_update(self, bundle, skip_errors=False, **kwargs):
        goal_subject = bundle.data['goal_subject'].lower()
        try:
            subject, created = Subject.objects.get_or_create(
                description=goal_subject
            )
            bundle.data['goal'] = '/api/v1/subject/{0}/'.format(subject.id)
            return super(GoalResource, self).obj_update(
                bundle, goal='/api/v1/subject/{0}/'.format(subject.id)
            )
        except IndexError as err:
            logger.error(err)
        return self.save(bundle, skip_errors=skip_errors)

    def dehydrate(self, bundle):
        bundle.data["subject"] = bundle.obj
        return bundle


class OfferResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    offer = fields.ForeignKey(SubjectResource, 'offer')

    class Meta:
        queryset = Offer.objects.all()
        fields = ['user', 'offer', 'id']
        resource_name = 'offer'
        always_return_data = True
        validation = OfferValidation()
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(OfferResource, self).get_object_list(request).\
            filter(user_id=user)

    def obj_create(self, bundle, **kwargs):
        offer_subject = bundle.data.get('offer_subject').lower()
        try:
            subject, created = Subject.objects.get_or_create(
                description=offer_subject
            )
            return super(OfferResource, self).obj_create(bundle, offer=subject)
        except IndexError as err:
            logger.error(err)
        return super(OfferResource, self).obj_create(bundle, **kwargs)

    def obj_update(self, bundle, skip_errors=False, **kwargs):
        offer_subject = bundle.data['offer_subject'].lower()
        try:
            subject, created = Subject.objects.get_or_create(
                description=offer_subject
            )
            bundle.data['offer'] = '/api/v1/subject/{0}/'.format(subject.id)
            return super(OfferResource, self).obj_update(
                bundle, offer='/api/v1/subject/{0}/'.format(subject.id)
            )
        except IndexError as err:
            logger.error(err)
        return self.save(bundle, skip_errors=skip_errors)

    def dehydrate(self, bundle):
        bundle.data["subject"] = bundle.obj
        return bundle


class FacebookLikeResource(ModelResource):
    class Meta:
        queryset = FacebookLike.objects.all()
        fields = ['id', 'name', 'facebook_id', 'picture', 'fan_count',
                  'created_time']
        list_allowed_methods = ['get']
        resource_name = 'likes'
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(FacebookLikeResource, self).get_object_list(request).\
            filter(user_id=user)


class FacebookMutualLikeResource(ModelResource):
    class Meta:
        queryset = FacebookLike.objects.all()
        fields = ['id', 'name', 'facebook_id', 'picture', 'fan_count',
                  'created_time']
        list_allowed_methods = ['get']
        resource_name = 'mutual_likes'
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.user.id
        target_user = request.GET.get('user_id')
        target_user_likes = FacebookLike.objects.filter(
            user_id=target_user
        ).values_list('facebook_id', flat=True)
        return super(FacebookMutualLikeResource, self).get_object_list(request).\
            filter(user_id=user, facebook_id__in=target_user_likes).\
            order_by('-fan_count', '-created_time')


class FacebookOtherLikeResource(ModelResource):
    class Meta:
        queryset = FacebookLike.objects.all()
        fields = ['id', 'name', 'facebook_id', 'picture', 'fan_count',
                  'created_time']
        list_allowed_methods = ['get']
        resource_name = 'other_likes'
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.user.id
        target_user = request.GET.get('user_id', request.user.id)
        target_user_likes = FacebookLike.objects.filter(
            user_id=user
        ).values_list('facebook_id', flat=True)
        return super(FacebookOtherLikeResource, self).get_object_list(request). \
            filter(Q(user_id=target_user) & ~Q(facebook_id__in=target_user_likes)). \
            order_by('-fan_count', '-created_time')
