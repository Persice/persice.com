from django.db import models
from django_facebook.models import FacebookCustomUser
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManager


class InterestSubject(models.Model):
    description = models.CharField(max_length=100, null=False, blank=False, unique=True)

    search_index = VectorField()

    objects = SearchManager(
        fields=('description',),
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

    def __unicode__(self):
        return self.interest.description

    class Meta:
        unique_together = ("user", "interest")


class ReligiousIndex(models.Model):
    name = models.CharField(max_length=300, null=False, blank=False,
                            default='other')

    def __unicode__(self):
        return self.name


class ReligiousView(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    religious_index = models.ForeignKey(ReligiousIndex)

    def __unicode__(self):
        return self.religious_index.name

    class Meta:
        unique_together = ("user", "religious_index")


class PoliticalIndex(models.Model):
    name = models.CharField(max_length=300, null=False, blank=False,
                            default='other')

    def __unicode__(self):
        return self.name


class PoliticalView(models.Model):
    user = models.OneToOneField(FacebookCustomUser)
    political_index = models.ForeignKey(PoliticalIndex)

    def __unicode__(self):
        return self.political_index.name

    class Meta:
        unique_together = ("user", "political_index")
