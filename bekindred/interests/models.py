from django.db import models
from django_facebook.models import FacebookCustomUser
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManager


class InterestManager(models.Manager):
    def search_interest(self, user_id):

        user_interests = Interest.objects.filter(user=FacebookCustomUser.objects.get(pk=user_id))

        interests = Interest.objects.exclude(id__in=user_interests.values_list('id', flat=True))
        search_desc = []
        for interest in user_interests:
            search_desc.extend(interests.search(interest))

        return search_desc

    def search_interest_to_interest(self, exclude_friends, search_desc):
        return list(Interest.objects.exclude(user_id__in=exclude_friends).
                    filter(goal__in=search_desc).values_list('user', flat=True))



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

