from django.db import models
from django.utils.timezone import now
from geoposition.fields import GeopositionField
from django.contrib.gis.db import models as gis_models
from django_facebook.models import FacebookCustomUser
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManager


class Event(models.Model):
    REPEAT_CHOICES = (
        ('D', 'Daily'),
        ('W', 'Weekly'),
        ('Y', 'Yearly'),
    )

    description = models.CharField(max_length=300, null=True, blank=True)
    name = models.CharField(max_length=300)
    location = GeopositionField()
    starts_on = models.DateTimeField()
    ends_on = models.DateTimeField()
    repeat = models.CharField(max_length=1, choices=REPEAT_CHOICES)
    street = models.CharField(max_length=300, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zipcode = models.IntegerField(max_length=7, null=True, blank=True)
    state = models.CharField(max_length=3, null=True, blank=True)

    search_index = VectorField()

    geo_objects = gis_models.GeoManager()
    objects = SearchManager(
        fields=('description',),
        config='pg_catalog.english',
        search_field='search_index',
        auto_update_search_field=True
    )

    def __unicode__(self):
        return self.name


class Membership(models.Model):
    RSVP_CHOICES = (
        ('yes', 'Yes'),
        ('no', 'No'),
        ('maybe', 'Maybe'),
    )
    user = models.ForeignKey(FacebookCustomUser)
    event = models.ForeignKey(Event)
    is_organizer = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default=False)
    rsvp = models.CharField(max_length=5, choices=RSVP_CHOICES, null=True)
    updated = models.DateTimeField(default=now())

    class Meta:
        unique_together = (('user', 'event', 'is_organizer'),)
