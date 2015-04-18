import string
from django.db import models
from django.db.models import Q
from django_facebook.models import FacebookLike, FacebookCustomUser
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManager

remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)


class InterestManager(models.Manager):
    pass


class MatchInterestManager(models.Manager):
    @staticmethod
    def match_interests_to_interests(user_id, exclude_friends):
        u_interest_id = Interest.objects.filter(user_id=user_id).values_list('interest_id', flat=True)
        u_interests = InterestSubject.objects.filter(id__in=u_interest_id)
        target_interest_id = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('interest_id', flat=True)
        target_interests = InterestSubject.objects.filter(id__in=target_interest_id)

        match_interests = []
        for interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.description).translate(remove_punctuation_map).split())
            match_interests.extend(target_interests.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_interests]
        result = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(interest__in=subject_ids)
        return result

    @staticmethod
    def match_fb_likes_to_interests(user_id, exclude_friends):
        """
        Return the list of matched user Facebook likes to interests
        """
        fb_likes = FacebookLike.objects.filter(user_id=user_id)
        target_interest_id = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('interest_id', flat=True)
        target_interests = InterestSubject.objects.filter(id__in=target_interest_id)

        match_interests = []
        for fb_like in fb_likes:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(fb_like.name).translate(remove_punctuation_map).split())
            match_interests.extend(target_interests.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_interests]
        result = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(interest__in=subject_ids)
        return result

    def count_interests_fb_likes(self, user_id1, user_id2):
        exclude_friends = FacebookCustomUser.objects.exclude(id__in=[user_id1, user_id2]).\
            values_list('id', flat=True)
        exclude_friends = list(exclude_friends)
        match_interests1 = self.match_interests_to_interests(user_id1, exclude_friends)
        matches_interests2 = self.match_fb_likes_to_interests(user_id1, exclude_friends)

        res1 = set()

        for m_interest in (match_interests1 | matches_interests2):
            res1.add(m_interest.id)

        return len(res1)


class InterestSubject(models.Model):
    description = models.CharField(max_length=100, null=False, blank=False, unique=True)

    search_index = VectorField()

    objects = SearchManager(
        fields=('description', ),
        config='pg_catalog.english',
        search_field='search_index',
        auto_update_search_field=True
    )

    def __unicode__(self):
        return self.description

    def clean(self):
        self.description = self.description.lower()


class Interest(models.Model):
    interest = models.ForeignKey(InterestSubject)
    user = models.ForeignKey(FacebookCustomUser)
    objects = InterestManager()
    objects_search = MatchInterestManager()

    def __unicode__(self):
        return self.interest.description

    class Meta:
        unique_together = ("user", "interest")
