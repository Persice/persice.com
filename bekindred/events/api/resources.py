import random
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource, Resource
from events.models import Event
from friends.models import Friend
from goals.utils import calculate_distance, calculate_distance_events
from photos.api.resources import UserResource


class EventResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        always_return_data = True
        queryset = Event.objects.all().order_by('-starts_on')
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
        queryset = Event.objects.all().order_by('starts_on')
        list_allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(MyEventFeedResource, self).get_object_list(request).\
            filter(user=request.user.pk).order_by('starts_on')

    def dehydrate(self, bundle):
        bundle.data['common_goals_offers_interests'] = 0
        bundle.data['totalFriends'] = 0
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id, bundle.data['location'])
        return bundle


class AllEventFeedResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        resource_name = 'feed/events/all'
        queryset = Event.objects.all().order_by('starts_on')
        list_allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        bundle.data['common_goals_offers_interests'] = 0
        bundle.data['totalFriends'] = 0
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id, bundle.data['location'])
        return bundle


class FriendsEventFeedResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        resource_name = 'feed/events/friends'
        queryset = Event.objects.all().order_by('starts_on')
        list_allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        bundle.data['common_goals_offers_interests'] = 0
        bundle.data['totalFriends'] = 0
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id, bundle.data['location'])
        return bundle

    def get_object_list(self, request):
        friends = Friend.objects.all_my_friends(user_id=request.user.id)
        return super(FriendsEventFeedResource, self).get_object_list(request).\
            filter(user__in=friends).order_by('starts_on')
