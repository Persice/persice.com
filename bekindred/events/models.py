from django.db import models
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
    user = models.ForeignKey(FacebookCustomUser)
    starts_on = models.DateField(null=True, blank=True)
    ends_on = models.DateField(null=True, blank=True)
    repeat = models.CharField(max_length=1, choices=REPEAT_CHOICES)
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
