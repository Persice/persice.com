import random
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource, Resource
from events.models import Event
from photos.api.resources import UserResource


class EventResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        always_return_data = True
        queryset = Event.objects.all()
        resource_name = 'events'
        excludes = ['search_index']

        filtering = {
            'description': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()


class MyEventFeedResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        resource_name = 'feed/events/my'
        queryset = Event.objects.all()
        list_allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def apply_authorization_limits(self, request, object_list):
        return object_list.filter(user=request.user)

    def dehydrate(self, bundle):
        bundle.data['common_goals_offers_interests'] = random.randint(1, 10)
        bundle.data['totalFriends'] = random.randint(1, 10)
        return bundle


class AllEventFeedResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        resource_name = 'feed/events/all'
        queryset = Event.objects.all()
        list_allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        bundle.data['common_goals_offers_interests'] = random.randint(1, 10)
        bundle.data['totalFriends'] = random.randint(1, 10)
        return bundle