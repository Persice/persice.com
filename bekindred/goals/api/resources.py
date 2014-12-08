from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django_facebook.models import FacebookCustomUser
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.http import HttpGone, HttpMultipleChoices
from tastypie.resources import ModelResource
from goals.models import Subject, MatchFilterState, Goal, Offer
from members.models import FacebookCustomUserActive
from photos.api.resources import UserResource


class SubjectResource(ModelResource):
    class Meta:
        queryset = Subject.objects.all()
        fields = ['description']
        allowed_methods = ['get']
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


class GoalResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    goal = fields.ForeignKey(SubjectResource, 'goal')

    class Meta:
        queryset = Goal.objects.all()
        fields = ['user', 'goal']
        resource_name = 'goal'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(GoalResource, self).get_object_list(request).filter(user_id=request.user.id)

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
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(OfferResource, self).get_object_list(request).filter(user=request.user.id)

    def dehydrate(self, bundle):
        bundle.data["subject"] = bundle.obj
        return bundle