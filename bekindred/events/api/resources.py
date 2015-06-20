from django.db import IntegrityError
from django.utils.timezone import now
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.exceptions import BadRequest

from tastypie.resources import ModelResource

from tastypie.validation import Validation

from events.models import Event, Membership
from friends.models import Friend
from goals.utils import calculate_distance_events
from match_engine.models import MatchEngineManager
from members.models import FacebookCustomUserActive
from photos.api.resources import UserResource


class EventValidation(Validation):
    def is_valid(self, bundle, request=None):
        if not bundle.data:
            return {'__all__': 'Not quite what I had in mind.'}

        errors = {}

        if bundle.obj.starts_on < now():
            errors['error'] = ['starts_on should be more or equals than today']

        if bundle.obj.ends_on < now():
            errors['error'] = ['ends_on should be more or equals than today']

        if bundle.obj.starts_on >= bundle.obj.ends_on:
            errors['error'] = ['ends_to should be greater than starts_on']
        return errors


class EventResource(ModelResource):
    members = fields.OneToManyField('events.api.resources.MembershipResource',
                                    attribute=lambda bundle: bundle.obj.membership_set.all(),
                                    full=True,
                                    null=True)
    attendees = fields.OneToManyField('events.api.resources.MembershipResource',
                                      attribute=lambda bundle: bundle.obj.membership_set.
                                      filter(user__in=Friend.objects.all_my_friends(user_id=bundle.request.user.id),
                                             rsvp='yes'),
                                      full=True,
                                      null=True)

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
        bundle.data['friend_attendees_count'] = Event.objects.get(pk=bundle.obj.pk).\
            membership_set.filter(user__in=friends, rsvp='yes').count()

        cumulative_match_score = 0
        for friend_id in friends:
            cumulative_match_score += MatchEngineManager.\
                count_common_goals_and_offers(friend_id, user_id)
        bundle.data['cumulative_match_score'] = cumulative_match_score
        return bundle

    def obj_create(self, bundle, **kwargs):
        bundle = super(EventResource, self).obj_create(bundle, **kwargs)
        Membership.objects.create(user=bundle.request.user, event=bundle.obj, is_organizer=True)
        return bundle

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
        return super(MyEventFeedResource, self).get_object_list(request). \
            filter(membership__user=request.user.pk, ends_on__gt=now()).order_by('starts_on')

    def dehydrate(self, bundle):
        bundle.data['common_goals_offers_interests'] = 0
        bundle.data['totalFriends'] = 0
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
        bundle.data['common_goals_offers_interests'] = 0
        bundle.data['totalFriends'] = 0
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
        bundle.data['common_goals_offers_interests'] = 0
        bundle.data['totalFriends'] = 0
        bundle.data['distance'] = calculate_distance_events(bundle.request.user.id, bundle.data['location'])
        return bundle

    def get_object_list(self, request):
        friends = Friend.objects.all_my_friends(user_id=request.user.id)
        return super(FriendsEventFeedResource, self).get_object_list(request). \
            filter(membership__user__in=friends, ends_on__gt=now(),
                   membership__is_organizer=True).order_by('starts_on')
