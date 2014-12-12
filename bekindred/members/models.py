from django.db import models
from django.contrib.auth.models import UserManager
from django_facebook.models import FacebookCustomUser, FacebookLike
from interests.models import Interest


class ActiveManager(UserManager):
    def get_queryset(self):
        return super(ActiveManager, self).get_queryset().filter(is_active=True)


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
            tsquery = ' | '.join(unicode(like.name).split())
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
            tsquery = ' | '.join(unicode(interest.description).split())
            match_likes.extend(target_likes.search(tsquery, raw=True))

        return match_likes


class FacebookLikeProxy(FacebookLike):
    class Meta:
        proxy = True

    objects = FacebookLikeProxyManager()
