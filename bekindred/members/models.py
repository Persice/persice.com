from __future__ import absolute_import
import string

from django.conf import settings
from django.contrib.auth.models import UserManager
from django.contrib.auth.signals import user_logged_in
from django.contrib.sessions.models import Session
from django.db import models
from django.db.models.signals import post_save
from django.http import QueryDict

from django_facebook.models import FacebookCustomUser, FacebookLike, \
    FacebookModel
from django_facebook.connect import _update_image
from open_facebook import OpenFacebook

from goals.models import MatchFilterState
from interests.models import Interest
from photos.models import FacebookPhoto

remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)


class ActiveManager(UserManager):

    def get_queryset(self):
        """
        Exclude Anonymous user and Admin user
        """
        return super(ActiveManager, self).get_queryset().\
            filter(is_active=True, is_superuser=False).exclude(pk=-1)


class FacebookCustomUserActive(FacebookCustomUser):

    class Meta:
        proxy = True

    objects = ActiveManager()


class OnBoardingFlow(models.Model):
    user = models.OneToOneField(FacebookCustomUser)
    is_complete = models.BooleanField(default=False)

    def __unicode__(self):
        return "%s %s" % (self.user, self.is_complete)


class MyCustomProfile(FacebookModel):
    """
    Not abstract version of the facebook profile model
    Use this by setting
    AUTH_PROFILE_MODULE = 'django_facebook.FacebookProfile'
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    religion = models.CharField(max_length=255, blank=True, null=True)


class FacebookLikeProxyManager(models.Manager):

    @staticmethod
    def match_fb_likes_to_fb_likes(user_id, exclude_friends):
        """
        Return the list of matched Facebook user likes
        """
        u_likes = FacebookLike.objects.filter(user_id=user_id)
        target_likes = FacebookLike.objects.exclude(
            user_id__in=[user_id] + exclude_friends)

        match_likes = []
        for like in u_likes:
            # FTS extension by default uses plainto_tsquery instead of
            # to_tosquery, for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(like.name).translate(
                remove_punctuation_map).split())
            match_likes.extend(target_likes.search(tsquery, raw=True))

        return match_likes

    @staticmethod
    def match_interests_to_fb_likes(user_id, exclude_friends):
        """
        Return the list of matched Facebook user likes
        """
        u_interests = Interest.objects.filter(user_id=user_id)
        target_likes = FacebookLike.objects.exclude(
            user_id__in=[user_id] + exclude_friends)

        match_likes = []
        for interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of
            # to_tosquery,for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.interest.description).
                                 translate(remove_punctuation_map).split())
            match_likes.extend(target_likes.search(tsquery, raw=True))

        return match_likes


class FacebookLikeProxy(FacebookLike):

    class Meta:
        proxy = True

    def __unicode__(self):
        return self.name

    objects = FacebookLikeProxyManager()


class UserSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    session = models.ForeignKey(Session)


def user_logged_in_handler(sender, request, user, **kwargs):
    UserSession.objects.get_or_create(
        user=user,
        session_id=request.session.session_key
    )


user_logged_in.connect(user_logged_in_handler, sender=Session)


def delete_user_sessions(user):
    user_sessions = UserSession.objects.filter(user=user)
    for user_session in user_sessions:
        user_session.session.delete()


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        MatchFilterState.objects.get_or_create(user=instance)


def create_default_photo(sender, instance, created, **kwargs):
    if created:
        facebook = OpenFacebook(instance.user.access_token)
        data = facebook.get('me', fields='picture.hight(1000).width(1000)')
        image_url = data.get('picture', {}).get('data', {}).get('url', {})
        FacebookPhoto.objects.get_or_create(
            photo=image_url,
            order=0,
            user=instance.user
        )

post_save.connect(create_user_profile, sender=FacebookCustomUser)
post_save.connect(create_default_photo, sender=OnBoardingFlow)
