from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django_facebook.models import FacebookCustomUser, FacebookLike
import re
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.http import HttpGone, HttpMultipleChoices
from tastypie.resources import ModelResource
from tastypie.validation import Validation, FormValidation
from goals.forms import GoalForm
from goals.models import Subject, MatchFilterState, Goal, Offer
from members.models import FacebookCustomUserActive
from photos.api.resources import UserResource


class SubjectResource(ModelResource):
    class Meta:
        always_return_data = True
        queryset = Subject.objects.all()
        resource_name = 'subject'
        fields = ['description']

        filtering = {
            'description': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()


class MatchFilterStateResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = MatchFilterState.objects.all()
        resource_name = 'filter/state'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(MatchFilterStateResource, self).get_object_list(request).filter(user_id=request.user.id)


class GoalValidation(Validation):
    def is_valid(self, bundle, request=None):
        if not bundle.data:
            return {'__all__': 'Not quite what I had in mind.'}

        errors = {}

        goal = re.search(r'\d+', bundle.data['goal']).group()
        user = re.search(r'\d+', bundle.data['user']).group()
        goals = Goal.objects.filter(goal_id=int(goal), user_id=user)
        offers = Offer.objects.filter(offer_id=int(goal), user_id=user)

        if goals:
            errors['error'] = ['Goal already exists']

        if offers:
            errors['error'] = ['Goal couldn\'t be  equivalent to Offer']

        return errors


class OfferValidation(Validation):
    def is_valid(self, bundle, request=None):
        if not bundle.data:
            return {'__all__': 'Not quite what I had in mind.'}

        errors = {}

        offer = re.search(r'\d', bundle.data['offer']).group()
        user = re.search(r'\d+', bundle.data['user']).group()
        offers = Offer.objects.filter(offer_id=int(offer), user_id=user)
        goals = Goal.objects.filter(goal_id=int(offer), user_id=user)

        if offers:
            errors['error'] = ['Offer already exists']

        if goals:
            errors['error'] = ['Offer couldn\'t be equivalent to Goal']

        return errors


class GoalResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    goal = fields.ForeignKey(SubjectResource, 'goal')

    class Meta:
        queryset = Goal.objects.all()
        fields = ['user', 'goal']
        always_return_data = True
        resource_name = 'goal'
        authentication = SessionAuthentication()
        authorization = Authorization()
        validation = GoalValidation()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(GoalResource, self).get_object_list(request).filter(user_id=user)

    def dehydrate(self, bundle):
        bundle.data["subject"] = bundle.obj
        return bundle


class OfferResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    offer = fields.ForeignKey(SubjectResource, 'offer')

    class Meta:
        queryset = Offer.objects.all()
        fields = ['user', 'offer']
        resource_name = 'offer'
        always_return_data = True
        validation = OfferValidation()
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(OfferResource, self).get_object_list(request).filter(user_id=user)

    def dehydrate(self, bundle):
        bundle.data["subject"] = bundle.obj
        return bundle


class FacebookLikeResource(ModelResource):

    class Meta:
        queryset = FacebookLike.objects.all()
        fields = ['id', 'name', 'facebook_id']
        list_allowed_methods = ['get']
        resource_name = 'likes'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(FacebookLikeResource, self).get_object_list(request).filter(user_id=user)
