from datetime import date
from django.contrib.gis.geoip import GeoIP
from django.core.exceptions import ObjectDoesNotExist
from geopy.distance import distance as geopy_distance
import oauth2 as oauth
import json
import pprint
from social_auth.backends import build_consumer_oauth_request
from social_auth.backends.twitter import *
from social_auth.backends.utils import consumer_oauth_url_request
from social_auth.db.django_models import UserSocialAuth
from social_auth.utils import get_backend_name
from friends.models import TwitterListFriends, TwitterListFollowers
from goals.models import UserIPAddress


def calculate_age(born):
    today = date.today()
    if born is None:
        return 0
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))


def calculate_date_of_birth(age):
    today = date.today()
    return today.replace(year=today.year - age)


def calculate_distance(user_id1, user_id2):
    """
    calculate distance
    """
    g = GeoIP()
    distance = 10000
    try:
        point1 = g.lon_lat(str(UserIPAddress.objects.get(user=user_id1).ip))
        point2 = g.lon_lat(str(UserIPAddress.objects.get(user=user_id2).ip))
        distance = geopy_distance(point1, point2).miles
    except ObjectDoesNotExist:
        pass
    return int(distance)


def linkedin_connections(uid, oauth_token, oauth_token_secret):
    # refactor for different
    # https://github.com/ozgur/python-linkedin
    from bekindred.settings.local import LINKEDIN_CONSUMER_KEY, LINKEDIN_CONSUMER_SECRET

    url = "https://api.linkedin.com/v1/people/%s" \
          ":(relation-to-viewer:(related-connections:(id,first-name,last-name,picture-urls::(original))))" \
          "?format=json" % uid
    consumer = oauth.Consumer(key=LINKEDIN_CONSUMER_KEY, secret=LINKEDIN_CONSUMER_SECRET)
    token = oauth.Token(key=oauth_token, secret=oauth_token_secret)
    client = oauth.Client(consumer, token)
    resp, content = client.request(url)
    rels = json.loads(content)
    if rels['relationToViewer']['relatedConnections']['_total'] > 0:
        return rels['relationToViewer']['relatedConnections']['values'], rels['relationToViewer']['relatedConnections']['_total']
    return None, None


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
        result['mutual_linkedin'], result['mutual_linkedin_count'] = linkedin_connections(requested_auth_user.uid,
                                                                                          oauth_token,
                                                                                          oauth_token_secret)
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
    except IndexError:
        return result


def social_extra_data(user_id):
    twitter_provider, linkedin_provider = None, None
    try:
        twitter_provider = UserSocialAuth.objects.filter(user_id=user_id, provider='twitter')[0].extra_data
    except IndexError:
        pass
    try:
        linkedin_provider = UserSocialAuth.objects.filter(user_id=user_id, provider='linkedin')[0].extra_data
    except IndexError:
        pass
    return twitter_provider, linkedin_provider