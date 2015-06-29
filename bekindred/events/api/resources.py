import json

from django.db import IntegrityError
from django.utils.timezone import now
import redis
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.exceptions import BadRequest
from tastypie.resources import ModelResource

from tastypie.validation import Validation

from events.models import Event, Membership, EventFilterState
from friends.models import Friend
from goals.utils import calculate_distance_events, calculate_distance
from match_engine.models import MatchEngineManager
from members.models import FacebookCustomUserActive
from photos.api.resources import UserResource


class EventValidation(Validation):
    def is_valid(self, bundle, request=None):
        if not bundle.data:
            return {'__all__': 'Not quite what I had in mind.'}

        errors = {}

        if bundle.obj.starts_on < now():
            errors['error'] = ['The event start date and time must occur in the future.']

        if bundle.obj.ends_on < now():
            errors['error'] = ['The event end date and time must occur in the future.']

        if bundle.obj.starts_on >= bundle.obj.ends_on:
            errors['error'] = ['The event end date and time must occur after the start date and time.']

        return errors


class EventResource(ModelResource):
    members = fields.OneToManyField('events.api.resources.MembershipResource',
                                    attribute=lambda bundle: bundle.obj.membership_set.all(),
                                    full=True, null=True)
    attendees = fields.OneToManyField('events.api.resources.MembershipResource',
                                      attribute=lambda bundle: bundle.obj.membership_set.
                                      filter(user__in=Friend.objects.all_my_friends(user_id=bundle.request.user.id),
                                             rsvp='yes'),
                                      full=True, null=True)

    class Meta:
        always_return_data = True
        queryset = Event.objects.all().order_by('-starts_on')
        resource_name = 'event'
        excludes = ['search_index']

        filtering = {
            'description': ALL
        }
        validation = EventValidation()
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        user_id = bundle.request.user.id
        friends = Friend.objects.all_my_friends(user_id=user_id)
        attendees = Event.objects.get(pk=bundle.obj.pk). \
            membership_set.filter(user__in=friends, rsvp='yes')
        bundle.data['friend_attendees_count'] = attendees.count()

        cumulative_match_score = 0
        for friend_id in friends:
            cumulative_match_score += MatchEngineManager. \
                count_common_goals_and_offers(friend_id, user_id)
        bundle.data['cumulative_match_score'] = cumulative_match_score
        bundle.data['most_common_elements'] = MatchEngineManager. \
            most_common_match_elements(user_id,
                                       attendees.values_list('user_id', flat=True))
        return bundle

    def obj_create(self, bundle, **kwargs):
        bundle = super(EventResource, self).obj_create(bundle, **kwargs)
        Membership.objects.create(user=bundle.request.user, event=bundle.obj,
                                  is_organizer=True, rsvp='yes')
        return bundle

    def obj_delete(self, bundle, **kwargs):
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        event = Event.objects.get(pk=int(kwargs['pk']))
        members = event.membership_set.filter(rsvp__in=['yes', 'maybe'], is_organizer=False)
        organizer = event.membership_set.filter(is_organizer=True)[0]
        data = {'event_name': event.name,
                'event_start_date': str(event.starts_on),
                'event_organizer_name': organizer.user.first_name}
        for member in members:
            r.publish('event_deleted.%s' % member.user.id, json.dumps(data))

        return super(EventResource, self).obj_delete(bundle, **kwargs)

    def save_m2m(self, bundle):
        for field_name, field_object in self.fields.items():
            if not getattr(field_object, 'is_m2m', False):
                continue

            if not field_object.attribute:
                continue

            for field in bundle.data[field_name]:
                kwargs = {'event': Event.objects.get(pk=bundle.obj.id),
                          'user': field.obj.user}
                try:
                    Membership.objects.get_or_create(**kwargs)
                except IntegrityError:
                    continue

    def update_in_place(self, request, original_bundle, new_data):
        ends_on = original_bundle.data['ends_on']
        if ends_on < now():
            raise BadRequest(
                'Users cannot edit events which have an end date that occurred in the past.'
            )
        return super(EventResource, self).update_in_place(
            request, original_bundle, new_data
        )


class EventFilterStateResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        always_return_data = True
        queryset = EventFilterState.objects.all()
        resource_name = 'events/filter/state'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(EventFilterStateResource, self).get_object_list(request).\
            filter(user_id=request.user.id)


class UserResourceShort(ModelResource):
    class Meta:
        queryset = FacebookCustomUserActive.objects.all()
        resource_name = 'auth/user'
        fields = ['first_name', 'last_name', 'facebook_id']
        authentication = SessionAuthentication()
        authorization = Authorization()


class MembershipResource(ModelResource):
    event = fields.ToOneField(EventResource, 'event')
    user = fields.ToOneField(UserResourceShort, 'user')

    class Meta:
        always_return_data = True
        queryset = Membership.objects.all()
        resource_name = 'member'
        authentication = SessionAuthentication()
        authorization = Authorization()


class MyEventFeedResource(ModelResource):
    members = fields.OneToManyField('events.api.resources.MembershipResource',
                                    'membership_set', full=True)

    class Meta:
        resource_name = 'feed/events/my'
        queryset = Event.objects.all().order_by('starts_on')
        list_allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        efs = EventFilterState.objects.filter(user_id=request.user.id)
        if request.GET.get('filter') == 'true' and efs:
            tsquery = ' | '.join(efs[0].keyword.split(','))
            return super(MyEventFeedResource, self).get_object_list(request).\
                filter(membership__user=request.user.pk, ends_on__gt=now()).\
                search(tsquery, raw=True).\
                order_by('starts_on')
        else:
            return super(MyEventFeedResource, self).get_object_list(request). \
                filter(membership__user=request.user.pk, ends_on__gt=now()).order_by('starts_on')

    def dehydrate(self, bundle):
        user_id = bundle.request.user.id
        friends = Friend.objects.all_my_friends(user_id=user_id)
        attendees = Event.objects.get(pk=bundle.obj.pk). \
            membership_set.filter(user__in=friends, rsvp='yes')
        bundle.data['friend_attendees_count'] = attendees.count()
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id,
                                                            bundle.data['location'])
        cumulative_match_score = 0
        for friend_id in friends:
            cumulative_match_score += MatchEngineManager. \
                count_common_goals_and_offers(friend_id, user_id)
        bundle.data['cumulative_match_score'] = cumulative_match_score
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id, bundle.data['location'])
        return bundle


class AllEventFeedResource(ModelResource):
    members = fields.OneToManyField('events.api.resources.MembershipResource',
                                    'membership_set', full=True)

    class Meta:
        resource_name = 'feed/events/all'
        queryset = Event.objects.all()
        list_allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(AllEventFeedResource, self).get_object_list(request). \
            filter(ends_on__gt=now()).order_by('starts_on')

    def dehydrate(self, bundle):
        user_id = bundle.request.user.id
        friends = Friend.objects.all_my_friends(user_id=user_id)
        attendees = Event.objects.get(pk=bundle.obj.pk). \
            membership_set.filter(user__in=friends, rsvp='yes')
        bundle.data['friend_attendees_count'] = attendees.count()

        cumulative_match_score = 0
        for friend_id in friends:
            cumulative_match_score += MatchEngineManager. \
                count_common_goals_and_offers(friend_id, user_id)
        bundle.data['cumulative_match_score'] = cumulative_match_score
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id, bundle.data['location'])
        return bundle


class FriendsEventFeedResource(ModelResource):
    members = fields.OneToManyField('events.api.resources.MembershipResource',
                                    'membership_set', full=True)

    class Meta:
        resource_name = 'feed/events/friends'
        queryset = Event.objects.all()
        list_allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        user_id = bundle.request.user.id
        friends = Friend.objects.all_my_friends(user_id=user_id)
        attendees = Event.objects.get(pk=bundle.obj.pk). \
            membership_set.filter(user__in=friends, rsvp='yes')
        bundle.data['friend_attendees_count'] = attendees.count()

        cumulative_match_score = 0
        for friend_id in friends:
            cumulative_match_score += MatchEngineManager. \
                count_common_goals_and_offers(friend_id, user_id)
        bundle.data['cumulative_match_score'] = cumulative_match_score
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id, bundle.data['location'])
        return bundle

    def get_object_list(self, request):
        friends = Friend.objects.all_my_friends(user_id=request.user.id)
        return super(FriendsEventFeedResource, self).get_object_list(request). \
            filter(membership__user__in=friends, ends_on__gt=now(),
                   membership__is_organizer=True).order_by('starts_on')


