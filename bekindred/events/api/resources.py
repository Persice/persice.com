import json
import logging

import hashlib
import re
import time
from datetime import datetime

import redis
from django.conf.urls import url
from django.contrib.humanize.templatetags.humanize import intcomma
from django.core.cache import cache
from django.core.paginator import InvalidPage, Paginator
from django.db import IntegrityError
from django.forms import model_to_dict
from django.http import Http404
from django.utils.timezone import now
from guardian.shortcuts import assign_perm
from haystack.backends import SQ
from haystack.query import SearchQuerySet

from matchfeed.api.resources import A
from postman.api import pm_write
from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.bundle import Bundle
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.exceptions import BadRequest, ImmediateHttpResponse, NotFound
from tastypie.http import HttpUnauthorized
from tastypie.resources import ModelResource, Resource
from tastypie.utils import trailing_slash
from tastypie.validation import Validation
from tastypie.cache import SimpleCache

from accounts.api.authentication import JSONWebTokenAuthentication
from events.authorization import GuardianAuthorization
from events.models import Event, FilterState, Membership, FacebookEvent
from events.tasks import (
    assign_perm_task,
    publish_to_redis_channel,
    remove_perm_task
)
from events.utils import ResourseObject
from friends.models import Friend
from friends.utils import NeoFourJ
from goals.models import Goal, Offer
from goals.utils import calculate_age, get_current_position, get_lives_in
from interests import Interest
from matchfeed.utils import (
    MatchEvent,
    MatchQuerySet,
    NonMatchUser,
    build_organizer
)
from members.models import FacebookCustomUserActive
from photos.api.resources import UserResource
from photos.models import FacebookPhoto

logger = logging.getLogger(__name__)


class Object(object):
    pass


class EventValidation(Validation):
    def is_valid(self, bundle, request=None):
        if not bundle.data:
            return {'__all__': 'Not quite what I had in mind.'}

        errors = {}

        if bundle.obj.starts_on < now():
            errors['error'] = [
                'The event start date and time must occur in the future.']

        if bundle.obj.ends_on < now():
            errors['error'] = [
                'The event end date and time must occur in the future.']

        if bundle.obj.starts_on >= bundle.obj.ends_on:
            errors['error'] = [
                'The event end date and time must occur '
                'after the start date and time.']

        return errors


class MultiPartResource(object):
    def deserialize(self, request, data, format=None):
        if not format:
            format = request.META.get('CONTENT_TYPE', 'application/json')

        if format == 'application/x-www-form-urlencoded':
            return request.POST

        if format.startswith('multipart/form-data'):
            multipart_data = request.POST.copy()
            multipart_data.update(request.FILES)
            return multipart_data

        return super(MultiPartResource, self). \
            deserialize(request, data, format)

    def put_detail(self, request, **kwargs):
        if request.META.get('CONTENT_TYPE', '').\
                startswith('multipart/form-data') \
                and not hasattr(request, '_body'):
            request._body = ''
        return super(MultiPartResource, self).put_detail(request, **kwargs)

    def patch_detail(self, request, **kwargs):
        if request.META.get('CONTENT_TYPE', '').\
                startswith('multipart/form-data') \
                and not hasattr(request, '_body'):
            request._body = ''
        return super(MultiPartResource, self).patch_detail(request, **kwargs)


class FilterStateResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        always_return_data = True
        queryset = FilterState.objects.all()
        resource_name = 'filter/state2'
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(FilterStateResource, self).get_object_list(request). \
            filter(user_id=request.user.id)

    def obj_update(self, bundle, **kwargs):
        bundle.data['updated'] = str(datetime.now())
        return super(FilterStateResource, self).obj_update(bundle, **kwargs)


class EventResource(MultiPartResource, ModelResource):
    members = fields.OneToManyField('events.api.resources.MembershipResource',
                                    attribute=lambda bundle:
                                    bundle.obj.membership_set.all(),
                                    full=True, null=True)
    attendees = fields.OneToManyField(
        'events.api.resources.MembershipResource',
        attribute=lambda bundle:
        # TODO: fix user bundle.request.user.id
        #
        bundle.obj.membership_set.filter(
            user__in=NeoFourJ().get_my_friends_ids(bundle.request.user.id) +
            [bundle.request.user.id], rsvp='yes'),
        full=True, null=True)
    event_photo = fields.FileField(attribute="event_photo", null=True,
                                   blank=True)

    class Meta:
        always_return_data = True
        queryset = Event.objects.all().order_by('-starts_on')
        resource_name = 'event'
        excludes = ['search_index']

        filtering = {
            'description': ALL
        }
        validation = EventValidation()
        authentication = JSONWebTokenAuthentication()
        authorization = GuardianAuthorization(
            view_permission_code='view_event',
            # create_permission_code='add_event',
        )

    def dehydrate(self, bundle):
        user_id = bundle.request.user.id
        friends = NeoFourJ().get_my_friends_ids(user_id)
        try:
            bundle.data['hosted_by'] = bundle.obj.membership_set. \
                filter(is_organizer=True, rsvp='yes')[0].user.get_full_name()
        except IndexError:
            bundle.data['hosted_by'] = ''

        # Total number of event attendees
        total_attendees = bundle.obj. \
            membership_set.filter(rsvp='yes').count()
        bundle.data['total_attendees'] = total_attendees

        # the number of people with RSVP = yes AND
        # are also a connection of the user who is viewing the event
        attendees = bundle.obj. \
            membership_set.filter(user__in=friends + [user_id], rsvp='yes')
        bundle.data['friend_attendees_count'] = attendees.count()

        # spots_remaining = max_attendees - total_attendees
        # TODO: max_attendees in ICE-938
        bundle.data['spots_remaining'] = int(
            bundle.obj.max_attendees) - total_attendees

        matched_users = MatchQuerySet.attendees(user_id)
        bundle.data['attendees_yes'] = MatchEvent.get_attendees(
            user_id, bundle.obj, matched_users, rsvp='yes')
        bundle.data['attendees_no'] = MatchEvent.get_attendees(
            user_id, bundle.obj, matched_users, rsvp='no')
        bundle.data['attendees_maybe'] = MatchEvent.get_attendees(
            user_id, bundle.obj, matched_users, rsvp='maybe')

        bundle.data['cumulative_match_score'] = MatchEvent.get_cum_score(
            user_id, bundle.obj, matched_users)

        try:
            bundle.data['distance'] = MatchQuerySet.user_event(
                    bundle.request.user.id,
                    bundle.obj.pk
            )[0].distance
        except IndexError:
            bundle.data['distance'] = [10000, 'mi']
        bundle.data['organizer'] = build_organizer(bundle.obj)
        return bundle

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/search%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('get_search'), name="api_get_search"),
        ]

    def get_search(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        self.is_authenticated(request)
        self.throttle_check(request)

        # Do the query.
        query = request.GET.get('q', '')
        sqs = SearchQuerySet().models(Event).load_all(). \
            filter(SQ(name=query) | SQ(description=query))
        paginator = Paginator(sqs, 10)

        try:
            page = paginator.page(int(request.GET.get('page', 1)))
        except InvalidPage:
            raise Http404("Sorry, no results on that page.")

        objects = []

        for result in page.object_list:
            bundle = self.build_bundle(obj=result.object, request=request)
            bundle = self.full_dehydrate(bundle)
            objects.append(bundle)

        object_list = {
            'objects': objects,
        }

        self.log_throttled_access(request)
        return self.create_response(request, object_list)

    def obj_create(self, bundle, **kwargs):
        bundle = super(EventResource, self).obj_create(bundle, **kwargs)
        assign_perm('view_event', bundle.request.user, bundle.obj)
        Membership.objects.create(user=bundle.request.user, event=bundle.obj,
                                  is_organizer=True, rsvp='yes')

        if bundle.obj.access_level == 'public':
            users = FacebookCustomUserActive.objects.all(). \
                exclude(pk=bundle.request.user.id)
            assign_perm_task.delay('view_event', users, bundle.obj)
        elif bundle.obj.access_level == 'private':
            if bundle.obj.access_user_list:
                try:
                    user_ids = map(int, bundle.obj.access_user_list.split(','))
                    users = FacebookCustomUserActive.objects.\
                        filter(pk__in=user_ids)
                    assign_perm_task.delay('view_event', users, bundle.obj)
                except TypeError as e:
                    logger.error(e)
        elif bundle.obj.access_level == 'connections':
            user_ids = []
            if bundle.obj.access_user_list:
                try:
                    user_ids = map(int, bundle.obj.access_user_list.split(','))
                except TypeError as e:
                    logger.error(e)
            else:
                user_ids = NeoFourJ().get_my_friends_ids(bundle.request.user.id)

            users = FacebookCustomUserActive.objects.filter(pk__in=user_ids)
            assign_perm_task.delay('view_event', users, bundle.obj)

        return bundle

    def obj_update(self, bundle, skip_errors=False, **kwargs):
        new_access_level = bundle.data.get('access_level', '')
        current_access_level = bundle.obj.access_level
        event_photo = bundle.data.get('event_photo', '')
        if isinstance(event_photo, unicode) and event_photo.startswith('http'):
            bundle.data['event_photo'] = \
                event_photo.split('cloudfront.net/')[-1]
        bundle = super(EventResource, self).obj_update(bundle, **kwargs)
        if current_access_level != new_access_level:
            if new_access_level == 'public':
                users = FacebookCustomUserActive.objects.all(). \
                    exclude(pk=bundle.request.user.id)
                assign_perm_task.delay('view_event', users, bundle.obj)

            elif new_access_level == 'private':
                users = FacebookCustomUserActive.objects.all(). \
                    exclude(pk=bundle.request.user.id)
                remove_perm_task.delay('view_event', users, bundle.obj)

                if bundle.obj.access_user_list:
                    try:
                        user_ids = map(int,
                                       bundle.obj.access_user_list.split(','))
                        users_ = FacebookCustomUserActive.objects. \
                            filter(pk__in=user_ids)
                        assign_perm_task.delay('view_event', users_, bundle.obj)
                    except TypeError as e:
                        logger.error(e)

            elif new_access_level == 'connections':
                users = FacebookCustomUserActive.objects.all(). \
                    exclude(pk=bundle.request.user.id)
                remove_perm_task.delay('view_event', users, bundle.obj)

                user_ids = []
                if bundle.obj.access_user_list:
                    try:
                        user_ids = map(int,
                                       bundle.obj.access_user_list.split(','))
                    except TypeError as e:
                        logger.error(e)
                else:
                    user_ids = NeoFourJ().get_my_friends_ids(
                        bundle.request.user.id
                    )

                users_ = FacebookCustomUserActive.objects. \
                    filter(pk__in=user_ids)
                assign_perm_task.delay('view_event', users_, bundle.obj)
        return bundle

    def obj_delete(self, bundle, **kwargs):
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        event = Event.objects.get(pk=int(kwargs['pk']))
        members = event.membership_set.filter(rsvp__in=['yes', 'maybe'],
                                              is_organizer=False)
        organizer = event.membership_set.filter(is_organizer=True)[0]
        recipients = FacebookCustomUserActive.objects. \
            filter(id__in=members.values_list('user_id', flat=True))
        data = {u'event_name': unicode(event.name),
                u'event_start_date': unicode(event.starts_on),
                u'event_organizer_name': unicode(organizer.user.first_name)}

        for recipient in recipients:
            message_data = {u'sent_at': now().isoformat(),
                            u'sender': '/api/auth/user/{}/'.format(
                                organizer.user.id),
                            u'recipient': '/api/auth/user/{}/'.format(
                                recipient.id),
                            u'body': u"""
                                    The event {event_name} on {event_start_date} has been
                                    cancelled by {event_organizer_name},
                                    the event host. We apologize for any inconvenience.
                                    (This is an automated message.)"
                                    """.format(**data)}
            pm_write(bundle.request.user, recipient, '',
                     body=message_data['body'])
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
                'Users cannot edit events which have an end date that '
                'occurred in the past.'
            )
        return super(EventResource, self).update_in_place(
            request, original_bundle, new_data
        )


class EventResourceSmall(ModelResource):
    members = fields.OneToManyField('events.api.resources.MembershipResource',
                                    attribute=lambda bundle:
                                    bundle.obj.membership_set.all(),
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
        authentication = JSONWebTokenAuthentication()
        authorization = GuardianAuthorization(
            view_permission_code='view_event'
        )


class UserResourceShort(ModelResource):
    image = fields.FileField(attribute='image', null=True, readonly=True)

    class Meta:
        queryset = FacebookCustomUserActive.objects.all()
        resource_name = 'auth/user'
        fields = ['first_name', 'last_name', 'facebook_id', 'image', 'about_me']
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()
        filtering = {
            'first_name': ALL
        }


class UserProfileResource(ModelResource):
    image = fields.FileField(attribute='image', null=True, readonly=True)

    class Meta:
        queryset = FacebookCustomUserActive.objects.all()
        resource_name = 'user_profile'
        fields = ['first_name', 'last_name', 'facebook_id', 'image', 'about_me']
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()
        filtering = {
            'first_name': ALL
        }


class AboutMeResource(ModelResource):
    image = fields.FileField(attribute='image', null=True, readonly=True)

    class Meta:
        queryset = FacebookCustomUserActive.objects.all()
        resource_name = 'me'
        fields = ['id', 'first_name', 'last_name', 'facebook_id', 'image']
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()
        filtering = {
            'first_name': ALL
        }

    def get_object_list(self, request):
        return super(AboutMeResource, self).get_object_list(request).\
            filter(pk=request.user.id)

    def dehydrate(self, bundle):
        raw_data = {}
        user_id = bundle.obj.id
        # if bundle.obj.raw_data:
        #     raw_data = json.loads(bundle.obj.raw_data)
        bundle.data['position'] = get_current_position(bundle.obj)
        bundle.data['lives_in'] = get_lives_in(bundle.obj)
        bundle.data.update(raw_data)
        bundle.data['goals_count'] = Goal.objects.filter(
            user_id=user_id).count()
        bundle.data['offers_count'] = Offer.objects.\
            filter(user_id=user_id).count()
        bundle.data['interest_count'] = Interest.objects.\
            filter(user=user_id).count()
        return bundle


class MembershipResource(ModelResource):
    event = fields.ToOneField(EventResourceSmall, 'event')
    user = fields.ToOneField(UserResourceShort, 'user')

    class Meta:
        always_return_data = True
        queryset = Membership.objects.all()
        resource_name = 'member'
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def obj_create(self, bundle, **kwargs):
        # Check how to calculate
        # bundle.data =
        # {
        #  'event': u'/api/v1/event/1/',
        #  'is_invited': False,
        #  'user': u'/api/v1/auth/user/2/'
        # }
        bundle.data.get('event')
        if not bundle.data.get('is_invited', True) \
                and bundle.data.get('is_invited') is not None:
            event_id = re.findall(r'/(\d+)/', bundle.data['event'])[0]
            event = Event.objects.get(pk=int(event_id))

            user_id = re.findall(r'/(\d+)/', bundle.data['user'])[0]
            recipient = FacebookCustomUserActive.objects.get(pk=int(user_id))

            data = {'event_name': event.name,
                    'event_url': "/#/event/details/" + event_id}

            message_data = {'sent_at': now().isoformat(),
                            'sender': '/api/auth/user/{}/'.format(
                                bundle.request.user.id),
                            'recipient': '/api/auth/user/{}/'.format(
                                recipient.id),
                            'body': """
                        You've been invited to the following event:
                        <br><br>
                        <a href="{event_url}">{event_name}</a>
                        <br><br>
                        This is an automated message.
                        """.format(**data)}
            pm_write(bundle.request.user, recipient, '',
                     body=message_data['body'])
            publish_to_redis_channel.delay(recipient, message_data)
        return super(MembershipResource, self).obj_create(bundle, **kwargs)

    def obj_delete_list(self, bundle, **kwargs):
        raise ImmediateHttpResponse(
            response=HttpUnauthorized(
                json.dumps(
                    {'error': 'You can\'t delete membership without id'})
            )
        )


class EventConnections(Resource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name', null=True)
    friend_id = fields.IntegerField(attribute='friend_id', null=True)
    facebook_id = fields.CharField(attribute='facebook_id', null=True)
    image = fields.CharField(attribute='image', null=True)
    tagline = fields.CharField(attribute='tag_line', null=True)
    age = fields.IntegerField(attribute='age', null=True)
    common_goals_offers_interests = fields.IntegerField(
        attribute='common_goals_offers_interests', null=True)
    mutual_friends_count = fields.IntegerField(
        attribute='mutual_friends_count', null=True)
    events = fields.ListField(attribute='events', null=True)

    class Meta:
        resource_name = 'events/connections'
        object_class = ResourseObject
        authentication = JSONWebTokenAuthentication()
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
            new_obj.image = getattr(friend, position_friend).image
            new_obj.age = calculate_age(
                getattr(friend, position_friend).date_of_birth)
            new_obj.tag_line = 'tagline for my connection'
            new_obj.events = [model_to_dict(m) for m in
                              Membership.objects.filter(
                                  user_id=getattr(friend, position_friend).id)]

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


class EventAttendees(ModelResource):
    event = fields.ToOneField(EventResource, 'event')
    user = fields.ToOneField(UserResourceShort, 'user')

    class Meta:
        resource_name = 'attendees'
        queryset = Membership.objects.all()
        list_allowed_methods = ['get']
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()
        filtering = {
            'rsvp': ALL,
            'event': ALL,
            'is_organizer': ALL,
            'user': ALL_WITH_RELATIONS
        }

    def get_object_list(self, request):
        return super(EventAttendees, self).get_object_list(request)

    def dehydrate(self, bundle):
        bundle.data['username'] = bundle.obj.user.username
        bundle.data['first_name'] = bundle.obj.user.first_name
        bundle.data['facebook_id'] = bundle.obj.user.facebook_id
        bundle.data['image'] = FacebookPhoto.objects.profile_photo(
            bundle.obj.user.id
        )
        bundle.data['age'] = calculate_age(bundle.obj.user.date_of_birth)
        bundle.data['total_mutual_friends'] = 0
        bundle.data['mutual_match_score'] = 0
        bundle.data['tagline'] = 'tagline for my connection'
        bundle.data['is_connection'] = Friend.objects. \
            checking_friendship(bundle.obj.user.id, bundle.request.user.id)
        return bundle


class Attendees(ModelResource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name')
    facebook_id = fields.CharField(attribute='facebook_id')
    username = fields.CharField(attribute='username')
    image = fields.FileField(attribute="image", null=True, blank=True)
    user_id = fields.CharField(attribute='user_id')
    twitter_provider = fields.CharField(attribute='twitter_provider',
                                        null=True)
    twitter_username = fields.CharField(attribute='twitter_username',
                                        null=True)
    linkedin_provider = fields.CharField(attribute='linkedin_provider',
                                         null=True)
    age = fields.IntegerField(attribute='age')
    distance = fields.ListField(attribute='distance', null=True)
    about = fields.CharField(attribute='about', null=True)
    gender = fields.CharField(attribute='gender', default=u'all')

    photos = fields.ListField(attribute='photos', null=True)
    goals = fields.ListField(attribute='goals', null=True)
    offers = fields.ListField(attribute='offers', null=True)
    interests = fields.ListField(attribute='interests', null=True)
    top_interests = fields.ListField(attribute='top_interests', null=True)

    score = fields.IntegerField(attribute='score', null=True, default=0)
    mutual_likes_count = fields.IntegerField(
        attribute='mutual_likes_count',
        null=True)
    total_likes_count = fields.IntegerField(attribute='total_likes_count',
                                            null=True)
    es_score = fields.FloatField(attribute='es_score', null=True, default=0)
    friends_score = fields.IntegerField(attribute='friends_score',
                                        null=True)
    last_login = fields.DateField(attribute='last_login', null=True)
    keywords = fields.ListField(attribute='keywords', null=True)
    position = fields.DictField(attribute='position', null=True)
    lives_in = fields.CharField(attribute='lives_in', null=True)
    connected = fields.BooleanField(attribute='connected', default=False)

    class Meta:
        # max_limit = 10
        resource_name = 'attendees'
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()

    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}
        if isinstance(bundle_or_obj, Bundle):
            kwargs['pk'] = bundle_or_obj.obj.id
        else:
            kwargs['pk'] = bundle_or_obj.id

        return kwargs

    def get_object_list(self, request):
        now = time.time()
        rsvp = request.GET.get('rsvp')
        event_id = request.GET.get('event_id')
        if rsvp is None and event_id is None:
            logger.error('rsvp and event_id is required')
            raise BadRequest('rsvp and event_id is required')
        if rsvp not in ('yes', 'no', 'maybe'):
            logger.error('rsvp is incorrect rsvp: {}'.format(rsvp))
            raise BadRequest('Please use correct rsvp: yes, no or maybe')
        attendees_ids = Membership.objects.filter(
            rsvp=rsvp, event_id=event_id, is_organizer=False
        ).values_list('user_id', flat=True)

        if rsvp == 'yes':
            attendees_ids = list(attendees_ids)

        match_users = MatchQuerySet.all(request.user.id,
                                        is_filter=False, exclude_ids=())
        attendees = []
        matched_attendees_ids = []
        for match_user in match_users:
            if match_user.id in attendees_ids:
                attendees.append(match_user)
                matched_attendees_ids.append(match_user.id)
        non_match_attendees = set(attendees_ids) - set(matched_attendees_ids)
        for non_match_attendee in non_match_attendees:
            try:
                non_match_user = NonMatchUser(request.user.id,
                                              non_match_attendee)
                attendees.append(non_match_user)
            except FacebookCustomUserActive.DoesNotExist as er:
                logger.error(er)

        logger.info('/api/v2/attendees/: {}'.format(time.time() - now))
        return sorted(attendees, key=lambda x: (-x.score,
                                                -x.connected))

    def obj_get_list(self, bundle, **kwargs):
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass

    def obj_delete(self, bundle, **kwargs):
        pass

    def apply_filters(self, request, applicable_filters):
        pass

    def obj_update(self, bundle, **kwargs):
        pass

    def obj_delete_list(self, bundle, **kwargs):
        pass

    def obj_create(self, bundle, **kwargs):
        pass

    def obj_delete_list_for_update(self, bundle, **kwargs):
        pass

    def dehydrate_distance(self, bundle):
        if bundle.data['distance']:
            bundle.data['distance'] = [intcomma(bundle.data['distance'][0]),
                                       bundle.data['distance'][1]]
        bundle.data['position'] = get_current_position(bundle.data['id'])
        return bundle.data['distance']


class EventFeedResource(Resource):
    id = fields.CharField(attribute='id')
    name = fields.CharField(attribute='name')
    city = fields.CharField(attribute='city', null=True)
    country = fields.CharField(attribute='country', null=True)
    state = fields.CharField(attribute='state', null=True)
    street = fields.CharField(attribute='street', null=True)
    repeat = fields.CharField(attribute='repeat', null=True)
    zipcode = fields.CharField(attribute='zipcode', null=True)
    full_address = fields.CharField(attribute='full_address', null=True)
    location = fields.CharField(attribute='location', null=True)
    location_name = fields.CharField(attribute='location_name', null=True)
    max_attendees = fields.IntegerField(attribute='max_attendees')
    event_score = fields.IntegerField(
        attribute='recommended_event_score')
    cumulative_match_score = fields.IntegerField(
        attribute='cumulative_match_score')
    friend_attendees_count = fields.IntegerField(
        attribute='friend_attendees_count')
    description = fields.CharField(attribute='description', null=True)
    ends_on = fields.DateTimeField(attribute='ends_on', null=True)
    event_type = fields.CharField(attribute='event_type', null=True)
    starts_on = fields.DateTimeField(attribute='starts_on')
    distance = fields.ListField(attribute='distance')
    attendees_yes = fields.ListField(attribute='attendees_yes')
    attendees_no = fields.ListField(attribute='attendees_no')
    attendees_maybe = fields.ListField(attribute='attendees_maybe')
    event_photo = fields.FileField(attribute="event_photo", null=True,
                                   blank=True)
    organizer = fields.DictField(null=True, attribute='organizer')

    class Meta:
        resource_name = 'events2'
        list_allowed_methods = ['get']
        authentication = JSONWebTokenAuthentication()
        authorization = GuardianAuthorization()

    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}
        if isinstance(bundle_or_obj, Bundle):
            kwargs['pk'] = bundle_or_obj.obj.id
        else:
            kwargs['pk'] = bundle_or_obj.id

        return kwargs

    def get_object_list(self, request):
        match = []
        if request.GET.get('filter') == 'true':
            if request.GET.get('feed') == 'my':
                feed = 'my'
            elif request.GET.get('feed') == 'all':
                feed = 'all'
            elif request.GET.get('feed') == 'connections':
                feed = 'connections'
            else:
                feed = 'all'
            cache_key = 'e_%s_%s' % (feed, request.user.id)
            cached_match = cache.get(cache_key)
            if cached_match:
                match = cached_match
            else:
                match = MatchQuerySet. \
                    all_event(request.user.id, feed=feed,
                              is_filter=True)
                cache.set('e_%s_%s' % (feed, request.user.id), match, 180)
            fs = FilterState.objects.filter(user=request.user.id)
            if fs:
                if fs[0].order_criteria == 'match_score':
                    return sorted(
                        match, key=lambda x: -x.cumulative_match_score)
                elif fs[0].order_criteria == 'event_score':
                    return sorted(match,
                                  key=lambda x: -x.recommended_event_score)
                elif fs[0].order_criteria == 'mutual_friends':
                    return sorted(
                        match, key=lambda x: -x.friend_attendees_count)
                elif fs[0].order_criteria == 'date':
                    return sorted(match, key=lambda x: x.starts_on)
        else:
            match = MatchQuerySet.all_event(request.user.id, feed='my')

        return match

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)


class OrganizerResource(ModelResource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name', null=True, blank=True)
    last_name = fields.CharField(attribute='last_name', null=True, blank=True)
    name = fields.CharField(attribute='name', null=True, blank=True)
    facebook_id = fields.CharField(attribute='facebook_id', null=True, blank=True)
    username = fields.CharField(attribute='username', null=True, blank=True)
    image = fields.FileField(attribute="image", null=True, blank=True)
    user_id = fields.CharField(attribute='user_id', null=True, blank=True)
    age = fields.IntegerField(attribute='age', null=True, blank=True)
    distance = fields.ListField(attribute='distance', null=True)
    about = fields.CharField(attribute='about', null=True)
    gender = fields.CharField(attribute='gender', default=u'all')

    photos = fields.ListField(attribute='photos', null=True)
    goals = fields.ListField(attribute='goals', null=True)
    offers = fields.ListField(attribute='offers', null=True)
    interests = fields.ListField(attribute='interests', null=True)
    top_interests = fields.ListField(attribute='top_interests', null=True)

    score = fields.IntegerField(attribute='score', null=True, default=0)
    mutual_likes_count = fields.IntegerField(
        attribute='mutual_likes_count',
        null=True)
    total_likes_count = fields.IntegerField(attribute='total_likes_count',
                                            null=True)
    es_score = fields.FloatField(attribute='es_score', null=True, default=0)
    friends_score = fields.IntegerField(attribute='friends_score',
                                        null=True)
    last_login = fields.DateField(attribute='last_login', null=True)
    keywords = fields.ListField(attribute='keywords', null=True)
    position = fields.DictField(attribute='position', null=True)
    lives_in = fields.CharField(attribute='lives_in', null=True)
    connected = fields.BooleanField(attribute='connected', default=False)
    event_type = fields.CharField(attribute='event_type', null=True)
    url = fields.CharField(attribute='link', null=True)

    class Meta:
        resource_name = 'organizer'
        authentication = JSONWebTokenAuthentication()
        authorization = Authorization()
        allowed_methods = ['get']

    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}
        if isinstance(bundle_or_obj, Bundle):
            kwargs['pk'] = bundle_or_obj.obj.id
        else:
            kwargs['pk'] = bundle_or_obj.id

        return kwargs

    def obj_get(self, bundle, **kwargs):
        event_id = int(kwargs.get('pk'))
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            raise NotFound("Organizer not found")
        if event.organizer:
            event_organizer = event.organizer
            match_user = MatchQuerySet.between(
                user_id1=bundle.request.user.id, user_id2=event_organizer.id
            )
            if match_user:
                match_user = match_user[0]
                match_user.id = event_id
            else:
                match_user = NonMatchUser(
                    bundle.request.user.id, event_organizer.id
                )
            match_user.event_type = event.event_type
        else:
            fb_event = FacebookEvent.objects.filter(
                facebook_id=event.eid).first()
            obj = A()
            obj.id = event.id
            obj.first_name = fb_event.owner_info.get('name')
            obj.link = 'https://www.facebook.com/{}/'.format(
                fb_event.owner_info.get('id')
            )
            obj.event_type = event.event_type
            return obj
        return match_user

    def get_object_list(self, request):
        return []

    def obj_get_list(self, bundle, **kwargs):
        return self.get_object_list(bundle.request)
