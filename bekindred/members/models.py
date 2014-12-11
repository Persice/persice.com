from django.db import models
from django.contrib.auth.models import UserManager
from django_facebook.models import FacebookCustomUser, FacebookLike


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
        Return the list of matched user_ids
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
    def match_activities_to_fb_likes(user_id):
        pass


    @staticmethod
    def match_fb_likes_to_activities(user_id):
        pass


class FacebookLikeProxy(FacebookLike):
    class Meta:
        proxy = True

    objects = FacebookLikeProxyManager()
