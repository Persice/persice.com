import string
from django.db import models
from django.contrib.auth.models import UserManager
from django.db.models import Q
from django_facebook.models import FacebookCustomUser, FacebookLike
from interests.models import Interest

remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)


class ActiveManager(UserManager):
    def get_queryset(self):
        return super(ActiveManager, self).get_queryset().\
            filter(is_active=True, is_superuser=False).exclude(pk=-1)


class FacebookCustomUserActive(FacebookCustomUser):
    class Meta:
        proxy = True
    
    objects = ActiveManager()


class FacebookLikeProxyManager(models.Manager):
    @staticmethod
    def match_fb_likes_to_fb_likes(user_id, exclude_friends):
        """
        Return the list of matched Facebook user likes
        """
        u_likes = FacebookLike.objects.filter(user_id=user_id)
        target_likes = FacebookLike.objects.exclude(user_id__in=[user_id] + exclude_friends)

        match_likes = []
        for like in u_likes:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(like.name).translate(remove_punctuation_map).split())
            match_likes.extend(target_likes.search(tsquery, raw=True))

        return match_likes

    @staticmethod
    def match_interests_to_fb_likes(user_id, exclude_friends):
        """
        Return the list of matched Facebook user likes
        """
        u_interests = Interest.objects.filter(user_id=user_id)
        target_likes = FacebookLike.objects.exclude(user_id__in=[user_id] + exclude_friends)

        match_likes = []
        for interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.interest.description).translate(remove_punctuation_map).split())
            match_likes.extend(target_likes.search(tsquery, raw=True))

        return match_likes


class FacebookLikeProxy(FacebookLike):
    class Meta:
        proxy = True

    objects = FacebookLikeProxyManager()


from django.conf import settings
from django.db import models

from django.contrib.sessions.models import Session


class UserSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    session = models.ForeignKey(Session)


from django.contrib.auth.signals import user_logged_in


def user_logged_in_handler(sender, request, user, **kwargs):
    UserSession.objects.get_or_create(
        user=user,
        session_id=request.session.session_key
    )


user_logged_in.connect(user_logged_in_handler, sender=Session)


def delete_user_sessions(user):
    user_sessions = UserSession.objects.filter(user = user)
    for user_session in user_sessions:
        user_session.session.delete()