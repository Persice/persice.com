from datetime import date
import json
import pprint

from django.contrib.gis.geoip import GeoIP
from django.contrib.gis.geos import GEOSGeometry, Point
from django.contrib.humanize.templatetags.humanize import intcomma
from django_facebook.models import FacebookCustomUser

from geopy.distance import distance as geopy_distance, Distance
import oauth2 as oauth

from social_auth.db.django_models import UserSocialAuth

from events.models import Event, FilterState
from friends.models import TwitterListFriends, TwitterListFollowers
from goals.models import UserIPAddress, MatchFilterState
from interests.models import ReligiousView, PoliticalView
from members.models import FacebookCustomUserActive
from world.models import UserLocation


def calculate_age(born):
    today = date.today()
    if born is None:
        return 0
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))


def calculate_date_of_birth(age):
    today = date.today()
    return today.replace(year=today.year - age)


def get_user_location(user_id):
    """
    :param user_id:
    """
    g = GeoIP()
    user_location = None
    try:
        # import ipdb; ipdb.set_trace()
        user1_location = UserLocation.objects.filter(user_id=user_id).order_by('-timestamp')[0]
        user_location = user1_location.geometry
    except IndexError:
        try:
            user_ip = str(UserIPAddress.objects.get(user_id=user_id).ip)
            point = g.geos(user_ip)
            user_location = point
        except UserIPAddress.DoesNotExist:
            pass
    if user_location is None:
        user_location = Point(x=0, y=0)
    return user_location


def miles_to_km(x):
    return 1.60934 * x


def km_to_mile(x):
    return x * 0.62137


def miles_to_meters(x):
    return x * 1609.34


def calculate_distance_es(user_id, user_object):
    distance = user_object.get('sort', [0])[0]
    return format_distance(distance, user_id)


def format_distance(distance, user_id):
    """
    :param distance: in miles or Distance class
    :param user_id:
    :return: list [int, unit_name] e.g [5, "miles"]
    """
    _units = FilterState.objects.filter(user_id=user_id)[0].distance_unit

    if isinstance(distance, Distance):
        # convert to float number
        distance = getattr(distance, _units)

    if _units == 'km':
        distance = km_to_mile(distance)

    if distance < 1.0:
        if miles_to_meters(distance) <= 10.0:
            return [10, 'm']
        else:
            return [int(miles_to_meters(distance)), 'm']

    if _units == 'km':
        return [int(miles_to_km(distance)), 'km']

    return [int(distance), 'miles']


def get_event_location(event_id):
    e = Event.objects.get(pk=event_id)
    return e.point


def calculate_distance_user_event(user_id, event_id):
    user_location = get_user_location(user_id)
    event_location = get_event_location(event_id)
    distance = geopy_distance(user_location, event_location)
    return format_distance(distance, user_id)


def calculate_distance(user_id1, user_id2, units='miles'):
    """
    calculate distance
    https://docs.djangoproject.com/en/1.8/ref/contrib/gis/measure/#supported-units
    km	Kilometre, Kilometer
    mi	Mile
    m	Meter, Metre
    """
    g = GeoIP()
    distance = [10000, 'miles']

    try:
        user1_location = UserLocation.objects.filter(user_id=user_id1).order_by('-timestamp')[0]
        user1_point = user1_location.geometry
    except IndexError:
        try:
            user_id1_ip = str(UserIPAddress.objects.get(user_id=user_id1).ip)
            point = g.geos(user_id1_ip)
            if not point:
                return distance
            user1_point = GEOSGeometry(point)
        except UserIPAddress.DoesNotExist:
            return distance

    try:
        user2_location = UserLocation.objects.filter(user_id=user_id2).order_by('-timestamp')[0]
        user2_point = user2_location.geometry
    except IndexError:
        try:
            user_id2_ip = str(UserIPAddress.objects.get(user_id=user_id2).ip)
            point = g.geos(user_id2_ip)
            if not point:
                return distance
            user2_point = GEOSGeometry(point)
        except UserIPAddress.DoesNotExist:
            return distance
    try:
        _units = FilterState.objects.filter(user_id=user_id1)[0].distance_unit
        if _units in ('miles', 'km'):
            units = _units
    except IndexError:
        pass

    distance = geopy_distance(user1_point, user2_point)
    if getattr(distance, units) < 1.0:
        if getattr(distance, 'm') <= 10.0:
            return [10, 'meters']
        else:
            return [int(getattr(distance, 'm')), 'meters']
    else:
        return [int(getattr(distance, units)), units]


def calculate_distance_events(user_id, event_id):
    """
    calculate distance
    https://docs.djangoproject.com/en/1.8/ref/contrib/gis/measure/#supported-units
    km	Kilometre, Kilometer
    mi	Mile
    m	Meter, Metre
    """
    g = GeoIP()
    distance = [intcomma(10000), 'miles']
    dist = None
    units = 'miles'

    try:
        units = MatchFilterState.objects.filter(user_id=user_id)[0].distance_unit
    except (MatchFilterState.DoesNotExist, IndexError):
        pass

    try:
        user_location = UserLocation.objects.filter(user_id=user_id).\
            order_by('-timestamp')[0]
        dist = Event.objects.distance(user_location.geometry).filter(id=event_id)[0].distance
    except IndexError:
        try:
            user_id1_ip = str(UserIPAddress.objects.get(user_id=user_id).ip)
            point = g.geos(user_id1_ip)
            if not point:
                return distance
            # Fix after finishing
            user1_point = GEOSGeometry(point)
            dist = Event.objects.distance(user1_point).filter(id=event_id)[0].distance
        except UserIPAddress.DoesNotExist:
            return distance

    if not event_id or (dist is None):
        return distance

    distance = dist

    if (distance.mi < 1.0) or (distance.km < 1.0):
        if distance.m <= 10.0:
            return [10, 'meters']
        else:
            return [intcomma(int(distance.m)), 'meters']
    else:
        if units == 'miles':
            return [intcomma(int(distance.mi)), 'miles']
        # meters
        else:
            return [intcomma(int(distance.km)), 'km']


def linkedin_connections(uid, oauth_token, oauth_token_secret):
    # refactor for different
    # https://github.com/ozgur/python-linkedin
    from bekindred.settings.local import LINKEDIN_CONSUMER_KEY, LINKEDIN_CONSUMER_SECRET

    url = "https://api.linkedin.com/v1/people/%s" \
          ":(relation-to-viewer:(related-connections:(id,first-name,last-name,picture-urls::(original))))" \
          "?format=json" % uid
    try:
        consumer = oauth.Consumer(key=LINKEDIN_CONSUMER_KEY, secret=LINKEDIN_CONSUMER_SECRET)
        token = oauth.Token(key=oauth_token, secret=oauth_token_secret)
        client = oauth.Client(consumer, token)
        resp, content = client.request(url)
        rels = json.loads(content)
        try:
            if rels['relationToViewer']['relatedConnections']['_total'] > 0:
                return rels['relationToViewer']['relatedConnections']['values'], \
                       rels['relationToViewer']['relatedConnections']['_total']
        except KeyError:
            pass
    except Exception:
        pass
    return list(), list()


def get_twitter_friends(uid, oauth_token, oauth_token_secret):
    url = 'https://api.twitter.com/1.1/friends/list.json?include_user_entities=false&skip_status=true'
    from bekindred.settings.local import TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET

    consumer = oauth.Consumer(key=TWITTER_CONSUMER_KEY, secret=TWITTER_CONSUMER_SECRET)
    token = oauth.Token(key=oauth_token, secret=oauth_token_secret)
    client = oauth.Client(consumer, token)
    resp, content = client.request(url)

    result = []
    users = json.loads(content)
    if not users.get('errors'):
        pprint.pprint(users)
        result.extend(users['users'])

        while users['next_cursor'] != 0:
            resp, content = client.request(url + "&cursor=" + users['next_cursor_str'])
            users = json.loads(content)
            if not users.get('errors'):
                result.extend(users['users'])
        result = [(x.get('id'), x.get('name'), x.get('profile_image_url')) for x in result]
        print result
        return result
    return result


def get_twitter_followers(uid, oauth_token, oauth_token_secret):
    url = 'https://api.twitter.com/1.1/friends/list.json?cursor=-1&count=5000'
    from bekindred.settings.local import TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET

    consumer = oauth.Consumer(key=TWITTER_CONSUMER_KEY, secret=TWITTER_CONSUMER_SECRET)
    token = oauth.Token(key=oauth_token, secret=oauth_token_secret)
    client = oauth.Client(consumer, token)
    resp, content = client.request(url)
    rels = json.loads(content)
    return rels


def get_mutual_linkedin_connections(user_id1, user_id2):
    result = {'mutual_linkedin': [], 'mutual_linkedin_count': 0}
    try:
        current_auth_user = UserSocialAuth.objects.filter(
            user_id=user_id1, provider='linkedin')[0]
        requested_auth_user = UserSocialAuth.objects.filter(
            user_id=user_id2, provider='linkedin')[0]
        oauth_token = current_auth_user.tokens['oauth_token']
        oauth_token_secret = current_auth_user.tokens['oauth_token_secret']
        # TODO:
        # result['mutual_linkedin'], result['mutual_linkedin_count'] = \
        #     linkedin_connections(requested_auth_user.uid,
        #                          oauth_token, oauth_token_secret)
        return result
    except IndexError:
        return result


def get_mutual_twitter_friends(user_id1, user_id2):
    result = dict(mutual_twitter_friends=[],
                  mutual_twitter_followers=[],
                  count_mutual_twitter_friends=0,
                  count_mutual_twitter_followers=0)
    try:
        current_auth_user = UserSocialAuth.objects.filter(user_id=user_id1, provider='twitter')[0]
        requested_auth_user = UserSocialAuth.objects.filter(user_id=user_id2, provider='twitter')[0]
        tf2 = TwitterListFriends.objects.filter(twitter_id1=requested_auth_user.uid).values_list('twitter_id2',
                                                                                                 flat=True)
        tf1 = TwitterListFriends.objects.filter(twitter_id1=current_auth_user.uid,
                                                twitter_id2__in=tf2)

        tfo2 = TwitterListFollowers.objects.filter(twitter_id1=requested_auth_user.uid).values_list('twitter_id2',
                                                                                                    flat=True)
        tfo1 = TwitterListFollowers.objects.filter(twitter_id1=current_auth_user.uid,
                                                   twitter_id2__in=tfo2)
        for tf in tf1:
            result['mutual_twitter_friends'].append(
                dict(name=tf.name2,
                     screen_name=tf.screen_name2,
                     profile_image_url=tf.profile_image_url2)
            )

        for tfo in tfo1:
            result['mutual_twitter_followers'].append(
                dict(name=tfo.name2,
                     screen_name=tfo.screen_name2,
                     profile_image_url=tfo.profile_image_url2)
            )

        result['count_mutual_twitter_friends'] = tf1.count()
        result['count_mutual_twitter_followers'] = tfo1.count()

        return result
    except Exception:
        return result


def social_extra_data(user_id):
    twitter_name, twitter_provider, linkedin_provider = None, None, None
    try:
        qs = UserSocialAuth.objects.filter(user_id=user_id, provider='twitter')[0]
        twitter_provider = qs.extra_data['name']
        twitter_name = qs.extra_data['screen_name']
    except IndexError:
        pass
    try:
        linkedin_provider = UserSocialAuth.objects.filter(user_id=user_id, provider='linkedin')[0].extra_data[
            'public_profile_url']
    except IndexError:
        pass
    return twitter_provider, linkedin_provider, twitter_name


def get_current_position(user):
    position = {'job': None, 'company': None}
    if isinstance(user, int):
        user = FacebookCustomUser.objects.get(pk=user)
    elif isinstance(user, basestring):
        try:
            user = FacebookCustomUserActive.objects.get(pk=int(user))
        except (ValueError, IndexError):
            return position
    user_id = user.id
    try:
        qs = UserSocialAuth.objects.filter(user_id=user_id, provider='linkedin')[0]
        positions = qs.extra_data.get('positions', {}).get('position')

        if isinstance(positions, list):
            position['company'] = positions[0].get('company', {}).get('name')
            position['job'] = positions[0].get('title')
        elif isinstance(positions, dict):
            position['company'] = positions.get('company', {}).get('name')
            position['job'] = positions.get('title')
    except (ValueError, IndexError):
        pass
    if (not position['company']) or (not position['job']):
        try:
            raw_data = json.loads(user.raw_data)
            works = raw_data.get('work')
            if works:
                position['company'] = works[0].get('employer', {}).get('name')
                position['job'] = works[0].get('position', {}).get('name')
        except TypeError as e:
            pass
    return position


def get_lives_in(user):
    lives_in = None
    if isinstance(user, int):
        user = FacebookCustomUser.objects.get(pk=user)
    elif isinstance(user, basestring):
        try:
            user = FacebookCustomUserActive.objects.get(pk=int(user))
        except (ValueError, IndexError):
            return lives_in
    try:
        raw_data = json.loads(user.raw_data)
        lives_in = raw_data.get('location', {}).get('name')
    except TypeError as e:
        pass
    return lives_in


def get_religious_views(user_id):
    return [rv.religious_index.name for rv in
            ReligiousView.objects.filter(user_id=user_id)]


def get_political_views(user_id):
    return [pv.political_index.name for pv in
            PoliticalView.objects.filter(user_id=user_id)]
