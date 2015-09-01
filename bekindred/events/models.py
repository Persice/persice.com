from django.utils.timezone import now
from geoposition.fields import GeopositionField
from django_facebook.models import FacebookCustomUser
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManagerMixIn, SearchQuerySet
from django.contrib.gis.db import models
from django.contrib.gis.geos import fromstr

from django.contrib.gis.db.models.query import GeoQuerySet


class GeoPgFullTextQuerySet(GeoQuerySet, SearchQuerySet):
    pass


class GeoPgFullTextManager(SearchManagerMixIn, models.GeoManager):
    def get_query_set(self):
        return GeoPgFullTextQuerySet(self.model, using=self._db)


class Event(models.Model):
    REPEAT_CHOICES = (
        ('D', 'Daily'),
        ('W', 'Weekly'),
        ('Y', 'Yearly'),
    )

    description = models.CharField(max_length=300, null=True, blank=True)
    name = models.CharField(max_length=300)
    location = GeopositionField()
    point = models.PointField(null=True)
    location_name = models.CharField(max_length=255, null=True)
    country = models.CharField(max_length=255, null=True)
    full_address = models.CharField(max_length=255, null=True)
    starts_on = models.DateTimeField()
    ends_on = models.DateTimeField()
    repeat = models.CharField(max_length=1, choices=REPEAT_CHOICES)
    street = models.CharField(max_length=300, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zipcode = models.CharField(max_length=7, null=True, blank=True)
    state = models.CharField(max_length=3, null=True, blank=True)
    members = models.ManyToManyField(FacebookCustomUser, through='Membership')
    max_attendees = models.IntegerField(default=10)

    search_index = VectorField()

    # geo_objects = gis_models.GeoManager()
    objects = GeoPgFullTextManager(
        fields=('description', 'name'),
        config='pg_catalog.english',
        search_field='search_index',
        auto_update_search_field=True
    )

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        point = fromstr("POINT(%s %s)" % (self.location.longitude, self.location.latitude))
        self.point = point
        super(Event, self).save(*args, **kwargs)


class Membership(models.Model):
    RSVP_CHOICES = (
        ('yes', 'Yes'),
        ('no', 'No'),
        ('maybe', 'Maybe'),
    )
    user = models.ForeignKey(FacebookCustomUser)
    event = models.ForeignKey(Event)
    is_organizer = models.BooleanField(default=False)
    is_invited = models.BooleanField(default=False)
    rsvp = models.CharField(max_length=5, choices=RSVP_CHOICES, null=True)
    updated = models.DateTimeField(default=now())

    class Meta:
        unique_together = (('user', 'event', 'is_organizer'),)

    def __unicode__(self):
        return '%s - %s' % (self.user.get_full_name(),
                            self.event.name)

    # def save(self, *args, **kwargs):
    #     from events.tasks import cum_score
    #     cum_score.apply_async(self.event_id)
    #     super(Membership, self).save(*args, **kwargs)


class CumulativeMatchScore(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    event = models.ForeignKey(Event)
    score = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'event')


# class CumulativeMatchScoreUser(models.Model):
#     user1 = models.ForeignKey(FacebookCustomUser, related_name='user1')
#     user2 = models.ForeignKey(FacebookCustomUser, related_name='user2')
#     score = models.IntegerField(default=0)
#
#     class Meta:
#         unique_together = ('user', 'event')


class EventFilterState(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    distance = models.IntegerField(default=1)
    cumulative_match_score = models.IntegerField(default=0)
    keyword = models.CharField(max_length=50)
    order_criteria = models.CharField(max_length=20, default='distance')
