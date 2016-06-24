from __future__ import absolute_import

import logging

import twitter
from celery import task
from django.conf import settings
from social_auth.db.django_models import UserSocialAuth

from friends.models import TwitterListFriends, TwitterListFollowers
from members.models import FacebookCustomUserActive


logger = logging.getLogger(__name__)


@task
def twitter_friends(user, oauth_token, oauth_secret):
    """
        Tweet when the user is logged in for the first time or
        when new Twitter account is associated.

        @oauth_token - string
        @oauth_secret - string
    """
    api = twitter.Api(consumer_key=settings.TWITTER_CONSUMER_KEY,
                      consumer_secret=settings.TWITTER_CONSUMER_SECRET,
                      access_token_key=oauth_token,
                      access_token_secret=oauth_secret)
    users = api.GetFriends(count=200)

    twitter_id1 = UserSocialAuth.objects.get(provider='twitter', user_id=user.id).uid
    _user = FacebookCustomUserActive.objects.get(pk=user.id)
    # profile_image_url1 = _user.img_url
    name1 = "%s %s" % (_user.first_name, _user.last_name)
    for user in users:
        TwitterListFriends.objects.get_or_create(
            twitter_id1=twitter_id1,
            twitter_id2=user.id,
            screen_name2=user.screen_name,
            name1=name1,
            name2=user.name,
            profile_image_url1='',
            profile_image_url2=user.profile_image_url
        )


@task
def twitter_followers(user, oauth_token, oauth_secret):
    """
        Tweet when the user is logged in for the first time or
        when new Twitter account is associated.

        @oauth_token - string
        @oauth_secret - string
    """
    api = twitter.Api(consumer_key=settings.TWITTER_CONSUMER_KEY,
                      consumer_secret=settings.TWITTER_CONSUMER_SECRET,
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
            screen_name2=follower.screen_name,
            name1=name1,
            name2=follower.name,
            profile_image_url1='',
            profile_image_url2=follower.profile_image_url
        )
