import json

from django.contrib.gis.measure import D
from django.core import serializers
from django.db import IntegrityError
from django.forms import model_to_dict

from django.utils.timezone import now
import re
import redis
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.bundle import Bundle
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.exceptions import BadRequest
from tastypie.resources import ModelResource, Resource

from tastypie.validation import Validation

from events.models import Event, Membership, EventFilterState
from friends.models import Friend
from goals.models import MatchFilterState
from goals.utils import calculate_distance_events, get_user_location, calculate_age
from match_engine.models import MatchEngineManager
from members.models import FacebookCustomUserActive
from photos.api.resources import UserResource
from postman.api import pm_write


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
                                      filter(user__in=Friend.objects.all_my_friends(user_id=bundle.request.user.id) +
                                             [bundle.request.user.id],
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
        event = Event.objects.get(pk=bundle.obj.pk)
        try:
            bundle.data['hosted_by'] = event.membership_set.\
                filter(is_organizer=True, rsvp='yes')[0].user.get_full_name()
        except IndexError:
            bundle.data['hosted_by'] = ''

        # Total number of event attendees
        total_attendees = event. \
            membership_set.filter(rsvp='yes').count()
        bundle.data['total_attendees'] = total_attendees

        # the number of people with RSVP = yes AND
        # are also a connection of the user who is viewing the event
        attendees = event. \
            membership_set.filter(user__in=friends + [user_id], rsvp='yes')
        bundle.data['friend_attendees_count'] = attendees.count()

        # spots_remaining = max_attendees - total_attendees
        # TODO: max_attendees in ICE-938
        bundle.data['spots_remaining'] = 0

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
        recipients = FacebookCustomUserActive.objects. \
            filter(id__in=members.values_list('user_id', flat=True))
        data = {'event_name': event.name,
                'event_start_date': str(event.starts_on),
                'event_organizer_name': organizer.user.first_name}

        for recipient in recipients:
            message_data = {'sent_at': now().isoformat(),
                            'sender': '/api/auth/user/{}/'.format(organizer.user.id),
                            'recipient': '/api/auth/user/{}/'.format(recipient.id),
                            'body': """
                                    The event {event_name} on {event_start_date} has been
                                    cancelled by {event_organizer_name},
                                    the event host. We apologize for any inconvenience.
                                    (This is an automated message.)"
                                    """.format(**data)}
            pm_write(bundle.request.user, recipient, '', body=message_data['body'])
            r.publish('message.%s' % recipient.id, json.dumps(message_data))

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
        return super(EventFilterStateResource, self).get_object_list(request). \
            filter(user_id=request.user.id)


class UserResourceShort(ModelResource):
    class Meta:
        queryset = FacebookCustomUserActive.objects.all()
        resource_name = 'auth/user'
        fields = ['first_name', 'last_name', 'facebook_id']
        authentication = SessionAuthentication()
        authorization = Authorization()
        filtering = {
            'first_name': ALL
        }


class MembershipResource(ModelResource):
    event = fields.ToOneField(EventResource, 'event')
    user = fields.ToOneField(UserResourceShort, 'user')

    class Meta:
        always_return_data = True
        queryset = Membership.objects.all()
        resource_name = 'member'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def obj_create(self, bundle, **kwargs):
        # Check how to calculate
        # bundle.data =
        # {'event': u'/api/v1/event/1/', 'is_invited': False, 'user': u'/api/v1/auth/user/2/'}
        if not bundle.data.get('is_invited', True) and bundle.data.get('is_invited') is not None:
            r = redis.StrictRedis(host='localhost', port=6379, db=0)
            event_id = re.findall(r'/(\d+)/', bundle.data['event'])[0]
            event = Event.objects.get(pk=int(event_id))

            user_id = re.findall(r'/(\d+)/', bundle.data['user'])[0]
            recipient = FacebookCustomUserActive.objects.get(pk=int(user_id))

            data = {'event_name': event.name,
                    'event_start_date': str(event.starts_on)}

            message_data = {'sent_at': now().isoformat(),
                            'sender': '/api/auth/user/{}/'.format(bundle.request.user.id),
                            'recipient': '/api/auth/user/{}/'.format(recipient.id),
                            'body': """
                                    "You've been invited to the event {event_name}
                                    on {event_start_date} at <start_time>.
                                    (This is an automated message.)"
                                    """.format(**data)}
            pm_write(bundle.request.user, recipient, '', body=message_data['body'])
            r.publish('message.%s' % recipient.id, json.dumps(message_data))
        return super(MembershipResource, self).obj_create(bundle, **kwargs)


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
        mfs = MatchFilterState.objects.filter(user_id=request.user.id)
        distance_unit = 'km'
        if mfs:
            distance_unit = mfs[0].distance_unit
            if distance_unit == 'miles':
                distance_unit = 'mi'
        if request.GET.get('filter') == 'true' and efs:
            tsquery = ' | '.join(efs[0].keyword.split(','))
            user_point = get_user_location(request.user.id)
            distance = D(**{distance_unit: efs[0].distance}).m

            return super(MyEventFeedResource, self).get_object_list(request). \
                filter(membership__user=request.user.pk, ends_on__gt=now()). \
                search(tsquery, raw=True). \
                filter(point__distance_lte=(user_point, distance)). \
                order_by('starts_on')
        else:
            return super(MyEventFeedResource, self).get_object_list(request). \
                filter(membership__user=request.user.pk, ends_on__gt=now(),
                       membership__rsvp__in=['yes', 'maybe'],
                       ).order_by('starts_on')

    def dehydrate(self, bundle):
        user_id = bundle.request.user.id
        friends = Friend.objects.all_my_friends(user_id=user_id)
        friend_attendees = Event.objects.get(pk=bundle.obj.pk). \
            membership_set.filter(user__in=friends, rsvp='yes')
        bundle.data['friend_attendees_count'] = friend_attendees.count()

        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id,
                                                            bundle.obj.pk)
        cumulative_match_score = 0

        members = Membership.objects.filter(event_id=bundle.obj.pk, rsvp='yes').\
            values_list('user_id', flat=True)
        for friend_id in members:
            cumulative_match_score += MatchEngineManager. \
                count_common_goals_and_offers(friend_id, user_id)
        bundle.data['cumulative_match_score'] = cumulative_match_score
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

        efs = EventFilterState.objects.filter(user_id=request.user.id)
        mfs = MatchFilterState.objects.filter(user_id=request.user.id)
        distance_unit = 'km'
        if mfs:
            distance_unit = mfs[0].distance_unit
            if distance_unit == 'miles':
                distance_unit = 'mi'
        if request.GET.get('filter') == 'true' and efs:
            tsquery = ' | '.join(efs[0].keyword.split(','))
            user_point = get_user_location(request.user.id)
            distance = D(**{distance_unit: efs[0].distance}).m

            return super(AllEventFeedResource, self).get_object_list(request). \
                filter(ends_on__gt=now()). \
                search(tsquery, raw=True). \
                filter(point__distance_lte=(user_point, distance)). \
                order_by('starts_on')
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
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id,
                                                            bundle.obj.pk)
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
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id,
                                                            bundle.obj.pk)
        return bundle

    def get_object_list(self, request):
        # TODO: Added unit tests
        friends = Friend.objects.all_my_friends(user_id=request.user.id)
        efs = EventFilterState.objects.filter(user_id=request.user.id)
        mfs = MatchFilterState.objects.filter(user_id=request.user.id)
        distance_unit = 'km'
        if mfs:
            distance_unit = mfs[0].distance_unit
            if distance_unit == 'miles':
                distance_unit = 'mi'
        if request.GET.get('filter') == 'true' and efs:
            tsquery = ' | '.join(efs[0].keyword.split(','))
            user_point = get_user_location(request.user.id)
            distance = D(**{distance_unit: efs[0].distance}).m
            return super(FriendsEventFeedResource, self).get_object_list(request). \
                filter(membership__user_id__in=friends,
                       ends_on__gt=now()). \
                search(tsquery, raw=True). \
                filter(point__distance_lte=(user_point, distance)). \
                order_by('starts_on').distinct()

        return super(FriendsEventFeedResource, self).get_object_list(request). \
            filter(membership__user__in=friends,
                   ends_on__gt=now()).\
            order_by('starts_on').distinct()


class ResourseObject(object):
    def __init__(self, initial=None):
        self.__dict__['_data'] = {}

        if hasattr(initial, 'items'):
            self.__dict__['_data'] = initial

    def __getattr__(self, name):
        return self._data.get(name, None)

    def __setattr__(self, name, value):
        self.__dict__['_data'][name] = value

    def to_dict(self):
        return self._data


class EventConnections(Resource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name', null=True)
    friend_id = fields.IntegerField(attribute='friend_id', null=True)
    facebook_id = fields.CharField(attribute='facebook_id', null=True)
    tagline = fields.CharField(attribute='tag_line', null=True)
    age = fields.IntegerField(attribute='age', null=True)
    common_goals_offers_interests = fields.IntegerField(attribute='common_goals_offers_interests', null=True)
    mutual_friends_count = fields.IntegerField(attribute='mutual_friends_count', null=True)
    events = fields.ListField(attribute='events', null=True)

    class Meta:
        resource_name = 'events/connections'
        object_class = ResourseObject
        authentication = SessionAuthentication()
        authorization = Authorization()

    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}

        if isinstance(bundle_or_obj, Bundle):
            kwargs['pk'] = bundle_or_obj.obj.id
        else:
            kwargs['pk'] = bundle_or_obj.id

        return kwargs

    def get_object_list(self, request):
        friends = Friend.objects.friends(request.user.id)
        results = []

        for friend in friends:
            new_obj = ResourseObject()
            if friend.friend1.pk == request.user.id:
                position_friend = 'friend2'
            else:
                position_friend = 'friend1'

            new_obj.id = friend.id
            new_obj.friend_id = getattr(friend, position_friend).id
            new_obj.first_name = getattr(friend, position_friend).first_name
            new_obj.facebook_id = getattr(friend, position_friend).facebook_id
            new_obj.age = calculate_age(getattr(friend, position_friend).date_of_birth)
            new_obj.tag_line = 'tagline for my connection'
            new_obj.events = [model_to_dict(m) for m in
                              Membership.objects.filter(user_id=getattr(friend, position_friend).id)]

            first_name = request.GET.get('first_name')

            if first_name:
                if first_name in new_obj.first_name.lower():
                    results.append(new_obj)
                else:
                    continue
            else:
                results.append(new_obj)

        return results

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def obj_get(self, bundle, **kwargs):
        return ResourseObject()
