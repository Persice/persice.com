import string
from django.db import models
from django_facebook.models import FacebookCustomUser, FacebookLike
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManager

remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)


class InterestManager(models.Manager):
    @staticmethod
    def match_interests_to_interests(user_id, exclude_friends):
        """
        Return the list of matched user interests to interests
        """
        u_interests = Interest.objects.filter(user_id=user_id)
        target_interests = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends)

        match_interests = []
        for interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.description).translate(remove_punctuation_map).split())
            match_interests.extend(target_interests.search(tsquery, raw=True))

        return match_interests

    @staticmethod
    def match_fb_likes_to_interests(user_id, exclude_friends):
        """
        Return the list of matched user Facebook likes to interests
        """
        fb_likes = FacebookLike.objects.filter(user_id=user_id)
        target_interests = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends)

        matches_interests = []
        for fb_like in fb_likes:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(fb_like.name).translate(remove_punctuation_map).split())
            matches_interests.extend(target_interests.search(tsquery, raw=True))

        return matches_interests

    @staticmethod
    def count_interests_fb_likes(user_id1, user_id2):
        u_interests = Interest.objects.filter(user_id=user_id1)
        target_interests = Interest.objects.filter(user_id=user_id2)

        match_interests1 = []
        for interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.description).translate(remove_punctuation_map).split())
            match_interests1.extend(target_interests.search(tsquery, raw=True))

        fb_likes = FacebookLike.objects.filter(user_id=user_id1)
        target_interests = Interest.objects.filter(user_id=user_id2)

        matches_interests2 = []
        for fb_like in fb_likes:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(fb_like.name).translate(remove_punctuation_map).split())
            matches_interests2.extend(target_interests.search(tsquery, raw=True))

        u_interests = Interest.objects.filter(user_id=user_id1)
        target_likes = FacebookLike.objects.filter(user_id=user_id2)

        matches_likes = []
        for u_interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(u_interest.description).translate(remove_punctuation_map).split())
            matches_likes.extend(target_likes.search(tsquery, raw=True))

        fb_likes = FacebookLike.objects.filter(user_id=user_id1)
        target_likes = FacebookLike.objects.filter(user_id=user_id2)

        match_likes2 = []
        for fb_like in fb_likes:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(fb_like.name).translate(remove_punctuation_map).split())
            matches_likes.extend(target_likes.search(tsquery, raw=True))

        res1 = set()
        res2 = set()
        for m_interest in match_interests1 + matches_interests2:
            res1.add(m_interest.id)

        for m_like in matches_likes + match_likes2:
            res2.add(m_like.id)
        return len(res1) + len(res2)


class Interest(models.Model):
    description = models.CharField(max_length=50, null=False, blank=False)
    user = models.ForeignKey(FacebookCustomUser)

    search_index = VectorField()

    objects = SearchManager(
        fields=('description', ),
        config='pg_catalog.english',
        search_field='search_index',
        auto_update_search_field=True
    )

    search_subject = InterestManager()

    def __unicode__(self):
        return self.description

    class Meta:
        unique_together = ("user", "description")

