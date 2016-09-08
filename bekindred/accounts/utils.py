import logging

import sys

import json
from django.conf import settings
from django.db.utils import IntegrityError
from django.db import transaction
from django_facebook.utils import mass_get_or_create
from open_facebook.api import OpenFacebook

from events.models import FacebookEvent
try:
    from dateutil.parser import parse as parse_date
except ImportError:
    from django_facebook.utils import parse_like_datetime as parse_date


logger = logging.getLogger(__name__)


def get_fb_events(user, fb_access_token=None, limit=5000):
    """
    Parses the facebook response and returns the likes
    """
    if user:
        access_token = user.access_token
    else:
        access_token = fb_access_token

    open_facebook = OpenFacebook(access_token)
    fields = settings.FACEBOOK_DEFAULT_EVENTS_FIELDS
    events_response = open_facebook.get('me/events', limit=limit,
                                        fields=','.join(fields))
    events = events_response and events_response.get('data')
    logger.info('found %s events', len(events))
    return events


def _store_fb_events(user):
    events = get_fb_events(user)
    if events:
        FacebookEvent.objects.filter(user_id=user.id).delete()
        base_queryset = []
        global_defaults = dict(user_id=user.id)
        id_field = 'facebook_id'
        default_dict = {}
        for event in events:
            start_time_string = event.get('start_time')
            start_time = None
            if start_time_string:
                start_time = parse_date(event['start_time'])

            end_time_string = event.get('end_time')
            end_time = None
            if end_time_string:
                end_time = parse_date(event['end_time'])

            try:
                raw_data = json.dumps(event)
            except (ValueError, TypeError) as err:
                raw_data = None

            owner = event.get('owner')
            owner_text = json.dumps(owner) if owner else None

            cover = event.get('cover')
            cover_text = json.dumps(cover) if cover else None

            picture = event.get('picture')
            picture_text = json.dumps(picture) if picture else None

            default_dict[event['id']] = dict(
                name=event.get('name'),
                description=event.get('description'),
                rsvp_status=event.get('rsvp_status'),
                attending_count=event.get('attending_count'),
                category=event.get('category'),
                owner=owner_text,
                cover=cover_text,
                picture=picture_text,
                place=json.dumps(event.get('place')),
                raw_data=raw_data,
                start_time=start_time,
                end_time=end_time,
                type=event.get('type')
            )
        current_events, inserted_events = mass_get_or_create(
            FacebookEvent, base_queryset, id_field, default_dict,
            global_defaults)
        logger.debug('found %s events and inserted %s new events',
                     len(current_events), len(inserted_events))


def store_events(user, request):
    # store likes and friends if configured
    sid = transaction.savepoint()
    try:
        _store_fb_events(user)
        transaction.savepoint_commit(sid)
    except IntegrityError as e:
        logger.warn(u'Integrity error encountered during save events, '
                    'probably a double submission %s' % e,
                    exc_info=sys.exc_info(), extra={
                'request': request,
                'data': {
                    'body': unicode(e),
                }
            })
        transaction.savepoint_rollback(sid)
