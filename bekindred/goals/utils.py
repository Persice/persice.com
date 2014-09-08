from datetime import date
import oauth2 as oauth
import json
import pprint
from social_auth.backends import build_consumer_oauth_request
from social_auth.backends.twitter import *
from social_auth.backends.utils import consumer_oauth_url_request
from social_auth.db.django_models import UserSocialAuth
from social_auth.utils import get_backend_name


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
        return rels['relationToViewer']['relatedConnections']['values']
    return {}


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