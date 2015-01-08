from datetime import date
import oauth2 as oauth
import json
import pprint
from social_auth.backends import build_consumer_oauth_request
from social_auth.backends.twitter import *
from social_auth.backends.utils import consumer_oauth_url_request
from social_auth.db.django_models import UserSocialAuth
from social_auth.utils import get_backend_name
from friends.models import TwitterListFriends, TwitterListFollowers


def calculate_age(born):
    today = date.today()
    if born is None:
        return 0
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))


def calculate_date_of_birth(age):
    today = date.today()
    return today.replace(year=today.year - age)


def linkedin_connections(uid, oauth_token, oauth_token_secret):
    # refactor for different
    from bekindred.settings.local import LINKEDIN_CONSUMER_KEY, LINKEDIN_CONSUMER_SECRET

    url = "https://api.linkedin.com/v1/people/%s" \
          ":(relation-to-viewer:(related-connections:(id,first-name,last-name,picture-url)))" \
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
    result = {'mutual_linkedin': None, 'mutual_linkedin_count': 0}
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
        pass


def get_mutual_twitter_friends(user_id1, user_id2):
    result = dict(mutual_twitter_friends=None,
                  mutual_twitter_followers=None,
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
        result['mutual_twitter_friends'] = tf1
        result['mutual_twitter_followers'] = tfo1
        result['count_mutual_twitter_friends'] = tf1.count()
        result['count_mutual_twitter_followers'] = tfo1.count()
    except IndexError:
        pass