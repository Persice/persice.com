from datetime import date
import json
import pprint

from django.contrib.gis.geoip import GeoIP
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.humanize.templatetags.humanize import intcomma

from geopy.distance import distance as geopy_distance
import oauth2 as oauth

from social_auth.db.django_models import UserSocialAuth

from events.models import Event, FilterState
from friends.models import TwitterListFriends, TwitterListFollowers
from goals.models import UserIPAddress, MatchFilterState
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
    """
    g = GeoIP()

    try:
        user1_location = UserLocation.objects.filter(user_id=user_id).order_by('-timestamp')[0]
        return user1_location.geometry
    except IndexError:
        try:
            user_ip = str(UserIPAddress.objects.get(user_id=user_id).ip)
            point = g.geos(user_ip)
            return point
        except UserIPAddress.DoesNotExist:
            pass


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
        current_auth_user = UserSocialAuth.objects.filter(user_id=user_id1, provider='linkedin')[0]
        requested_auth_user = UserSocialAuth.objects.filter(user_id=user_id2, provider='linkedin')[0]
        oauth_token = current_auth_user.tokens['oauth_token']
        oauth_token_secret = current_auth_user.tokens['oauth_token_secret']
        # result['mutual_linkedin'], result['mutual_linkedin_count'] = linkedin_connections(requested_auth_user.uid,
        #                                                                                   oauth_token,
        #                                                                                   oauth_token_secret)
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
                dict(name=tf.name2, profile_image_url=tf.profile_image_url2)
            )

        for tfo in tfo1:
            result['mutual_twitter_followers'].append(
                dict(name=tfo.name2, profile_image_url=tfo.profile_image_url2)
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
