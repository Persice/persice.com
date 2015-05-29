import random
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource, Resource
from events.models import Event
from friends.models import Friend
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

    def get_object_list(self, request):
        return super(MyEventFeedResource, self).get_object_list(request).filter(user=request.user.pk)

    def dehydrate(self, bundle):
        bundle.data['common_goals_offers_interests'] = 5
        bundle.data['totalFriends'] = 5
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
        bundle.data['common_goals_offers_interests'] = 5
        bundle.data['totalFriends'] = 5
        return bundle


class FriendsEventFeedResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        resource_name = 'feed/events/friends'
        queryset = Event.objects.all()
        list_allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        bundle.data['common_goals_offers_interests'] = 5
        bundle.data['totalFriends'] = 5
        return bundle

    def get_object_list(self, request):
        friends = Friend.objects.all_my_friends(user_id=request.user.id)
        return super(FriendsEventFeedResource, self).get_object_list(request).filter(user__in=friends)
