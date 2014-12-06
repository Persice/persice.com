from django.db import models
from django_facebook.models import FacebookCustomUser, FacebookLike
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManager
from members.models import FacebookCustomUserActive


class InterestManager(models.Manager):
    @staticmethod
    def search_interest(user_id):

        user_interests = Interest.objects.filter(user=FacebookCustomUserActive.objects.get(pk=user_id))

        interests = Interest.objects.exclude(id__in=user_interests.values_list('id', flat=True))
        search_desc = []
        for interest in user_interests:
            search_desc.extend(interests.search(interest.description))
        res = [i.description for i in search_desc]
        return res

    @staticmethod
    def search_interest_to_interest(exclude_friends, search_desc):
        return list(Interest.objects.exclude(user_id__in=exclude_friends).
                    filter(description__in=search_desc).values_list('user', flat=True))

    @staticmethod
    def search_interest_to_like(user_id, exclude_friends):
        user_interest = Interest.objects.filter(user=FacebookCustomUserActive.objects.get(pk=user_id))
        user_likes = FacebookLike.objects.exclude(user_id__in=[user_id] + exclude_friends)

        search_matches = []
        for interest in user_interest:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest).split())
            search_matches.extend(user_likes.search(tsquery, raw=True))
        matched_ids = [uid.user_id for uid in search_matches]

        return search_matches


    @staticmethod
    def search_like_to_interest(user_id):
        user_likes = FacebookLike.objects.filter(user_id=user_id)
        user_interests = Interest.objects.exclude(user_id__in=[user_id])

        search_interests = []
        for like in user_likes:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(like.name).split())
            search_interests.extend(user_interests.search(tsquery, raw=True))

        return search_interests


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

