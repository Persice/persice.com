from django_facebook.models import FacebookCustomUser
from social_auth.db.django_models import UserSocialAuth
import twitter
from friends.models import TwitterListFriends, TwitterListFollowers
from members.models import FacebookCustomUserActive
from settings.local import TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET
from urlparse import parse_qs


def load_twitter_user_friends(backend, user, social_user, is_new=False, new_association=False, *args, **kwargs):
    """
        Part of SOCIAL_AUTH_PIPELINE. Works with django-social-auth==0.7.21 or newer
        @backend - social_auth.backends.twitter.TwitterBackend (or other) object
        @user - User (if is_new) or django.utils.functional.SimpleLazyObject (if new_association)
        @social_user - UserSocialAuth object
    """
    if backend.name == 'twitter':
        if user:
            access_token = social_user.extra_data['access_token']
            parsed_tokens = parse_qs(access_token)
            oauth_token = parsed_tokens['oauth_token'][0]
            oauth_secret = parsed_tokens['oauth_token_secret'][0]
            twitter_friends(user, oauth_token, oauth_secret)
            twitter_followers(user, oauth_token, oauth_secret)
    return None



def twitter_friends(user, oauth_token, oauth_secret):
    """
        Tweet when the user is logged in for the first time or
        when new Twitter account is associated.

        @oauth_token - string
        @oauth_secret - string
    """
    api = twitter.Api(consumer_key=TWITTER_CONSUMER_KEY,
                      consumer_secret=TWITTER_CONSUMER_SECRET,
                      access_token_key=oauth_token,
                      access_token_secret=oauth_secret)
    users = api.GetFriends()

    twitter_id1 = UserSocialAuth.objects.get(provider='twitter', user_id=user.id).uid
    _user = FacebookCustomUserActive.objects.get(pk=user.id)
    # profile_image_url1 = _user.img_url
    name1 = "%s %s" % (_user.first_name, _user.last_name)
    for user in users:
        TwitterListFriends.objects.get_or_create(
            twitter_id1=twitter_id1,
            twitter_id2=user.id,
            name1=name1,
            name2=user.name,
            profile_image_url1='',
            profile_image_url2=user.profile_image_url
        )


def twitter_followers(user, oauth_token, oauth_secret):
    """
        Tweet when the user is logged in for the first time or
        when new Twitter account is associated.

        @oauth_token - string
        @oauth_secret - string
    """
    api = twitter.Api(consumer_key=TWITTER_CONSUMER_KEY,
                      consumer_secret=TWITTER_CONSUMER_SECRET,
                      access_token_key=oauth_token,
                      access_token_secret=oauth_secret)
    followers = api.GetFollowers()

    twitter_id1 = UserSocialAuth.objects.get(provider='twitter', user_id=user.id).uid
    _user = FacebookCustomUserActive.objects.get(pk=user.id)
    # profile_image_url1 = _user.img_url
    name1 = "%s %s" % (_user.first_name, _user.last_name)
    for follower in followers:
        TwitterListFollowers.objects.get_or_create(
            twitter_id1=twitter_id1,
            twitter_id2=follower.id,
            name1=name1,
            name2=follower.name,
            profile_image_url1='',
            profile_image_url2=follower.profile_image_url
        )