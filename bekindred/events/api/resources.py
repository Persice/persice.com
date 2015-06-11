import random
from django_facebook.models import FacebookCustomUser
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource, Resource
from events.models import Event, Membership
from friends.models import Friend
from goals.utils import calculate_distance, calculate_distance_events
from photos.api.resources import UserResource


class EventResource(ModelResource):
    class Meta:
        always_return_data = True
        queryset = Event.objects.all().order_by('-starts_on')
        resource_name = 'event'
        excludes = ['search_index']

        filtering = {
            'description': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()

    def obj_create(self, bundle, **kwargs):
        bundle = super(EventResource, self).obj_create(bundle, **kwargs)
        Membership.objects.create(user=bundle.request.user, event=bundle.obj)
        return bundle


class MembershipResource(ModelResource):
    event = fields.ToOneField(EventResource, 'event')
    user = fields.ToOneField(UserResource, 'user')

    class Meta:
        always_return_data = True
        queryset = Membership.objects.all()
        resource_name = 'member'
        authentication = SessionAuthentication()
        authorization = Authorization()


class MyEventFeedResource(ModelResource):
    class Meta:
        resource_name = 'feed/events/my'
        queryset = Event.objects.all().order_by('starts_on')
        list_allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(MyEventFeedResource, self).get_object_list(request).\
            filter(id__in=Membership.objects.filter(user_id=request.user.pk).
                   values_list('event_id', flat=True)).order_by('starts_on')

    def dehydrate(self, bundle):
        bundle.data['common_goals_offers_interests'] = 0
        bundle.data['totalFriends'] = 0
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id, bundle.data['location'])
        return bundle


class AllEventFeedResource(ModelResource):

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
        return super(FriendsEventFeedResource, self).get_object_list(request). \
            filter(id__in=Membership.objects.filter(user__in=friends).
                   values_list('event_id', flat=True)).order_by('starts_on')
