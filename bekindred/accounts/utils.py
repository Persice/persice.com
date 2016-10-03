import logging

import sys

import json
from django.conf import settings
from django.db.utils import IntegrityError
from django.db import transaction
from django_facebook.connect import _update_image
from django_facebook.utils import mass_get_or_create
from open_facebook.api import OpenFacebook
from geoposition import Geoposition
from django.utils.timezone import now
import googlemaps

from events.models import FacebookEvent, Event, Membership
from members.models import FacebookCustomUserActive

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


def get_google_maps_geocode(client, query):
    clean_query = query.split(')')[0]
    try:
        response = client.geocode(clean_query)
        latitude = response[0]['geometry']['location']['lat']
        longitude = response[0]['geometry']['location']['lng']
    except Exception:
        latitude = 0
        longitude = 0
    return latitude, longitude


def _store_fb_events(user):
    events = get_fb_events(user)
    maps_client = googlemaps.Client(key=settings.GOOGLE_PLACES_API_KEY)
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

            place = event.get('place')
            place_text = json.dumps(place) if place else None

            location_gp = None
            location_name = place.get('name') if place else None
            location = event.get('place', {}).get('location')
            if location:
                location_gp = Geoposition(
                    location.get('latitude', 0),
                    location.get('longitude', 0)
                )
            else:
                if location_name:
                    latitude, longitude = get_google_maps_geocode(
                        maps_client, location_name
                    )
                    if latitude and longitude:
                        location_gp = Geoposition(latitude, longitude)

            description = event.get('description')
            description_text = description[:1000] if description else None

            default_dict[event['id']] = dict(
                name=event.get('name'),
                description=description_text,
                rsvp_status=event.get('rsvp_status'),
                attending_count=event.get('attending_count'),
                category=event.get('category'),
                owner=owner_text,
                cover=cover_text,
                picture=picture_text,
                place=place_text,
                raw_data=raw_data,
                start_time=start_time,
                end_time=end_time,
                type=event.get('type'),
                location=location_gp,
                location_name=location_name
            )
        current_events, inserted_events = mass_get_or_create(
            FacebookEvent, base_queryset, id_field, default_dict,
            global_defaults)
        logger.debug('found %s events and inserted %s new events',
                     len(current_events), len(inserted_events))


def store_events(user):
    # store likes and friends if configured
    sid = transaction.savepoint()
    try:
        _store_fb_events(user)
        transaction.savepoint_commit(sid)
    except IntegrityError as e:
        logger.warn(u'Integrity error encountered during save events, '
                    'probably a double submission %s' % e,
                    exc_info=sys.exc_info(), extra={
                'data': {
                    'body': unicode(e),
                }
            })
        transaction.savepoint_rollback(sid)


def refresh_events(user):
    fb_events = FacebookEvent.objects.filter(
        type='public', start_time__gt=now(), user_id=user.id
    )
    for fb_event in fb_events:
        try:
            event = Event.objects.get(eid=fb_event.facebook_id)
        except Event.DoesNotExist:
            event = None
        image_name, image_file = (None, None)
        try:
            cover = json.loads(fb_event.cover)
            if cover.get('source'):
                image_name, image_file = _update_image(
                    fb_event.facebook_id,
                    cover.get('source'))
        except (ValueError, TypeError) as err:
            logger.error(err.msg)

        if event:
            event.name = fb_event.name
            event.description = fb_event.description
            event.access_level = 'public'
            event.starts_on = fb_event.start_time
            event.ends_on = fb_event.end_time
            event.event_photo = image_file
            event.event_type = 'facebook'
            event.event_url = u'https://facebook.com/{}'.format(event.eid)
            event.location_name = fb_event.location_name
            event.location = fb_event.location
            event.save()
        else:
            event = Event.objects.create(
                eid=fb_event.facebook_id,
                name=fb_event.name,
                description=fb_event.description,
                access_level='public',
                starts_on=fb_event.start_time,
                ends_on=fb_event.end_time,
                event_photo=image_file,
                event_type='facebook',
                event_url=u'https://facebook.com/{}'.format(event.eid),
                location_name=fb_event.location_name,
                location=fb_event.location
            )

        prs_user = FacebookCustomUserActive.objects.filter(
            facebook_id=fb_event.owner_info.get('id', -11)
        ).first()
        if prs_user:
            Membership.objects.get_or_create(user=user, event=event,
                                             is_organizer=True, rsvp=u'yes')
        else:
            Membership.objects.get_or_create(user=user, event=event,
                                             is_organizer=False, rsvp=u'yes')
        users = FacebookCustomUserActive.objects.all()
        from events.tasks import assign_perm_task
        assign_perm_task.delay('view_event', users, event)
