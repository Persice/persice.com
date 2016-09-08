from __future__ import absolute_import

import logging

from django.db.models.signals import post_save
from django.utils.timezone import now
from geoposition.fields import GeopositionField
from django_facebook.models import FacebookCustomUser
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManagerMixIn, SearchQuerySet
from django.contrib.gis.db import models
from django.contrib.gis.geos import fromstr
from easy_thumbnails.fields import ThumbnailerImageField
from django.contrib.gis.db.models.query import GeoQuerySet

logger = logging.getLogger(__name__)


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

    ACCESS_LEVEL_CHOICES = (
        ('PUBLIC', 'public'),
        ('PRIVATE', 'private'),
        ('CONNECTIONS', 'connections')
    )

    class Meta:
        permissions = (
            ("view_event", "View event"),
        )

    description = models.TextField(null=True, blank=True)
    name = models.CharField(max_length=300)
    location = GeopositionField(default="0,0",
                                blank=True, null=True)
    point = models.PointField(null=True)
    location_name = models.CharField(max_length=255, null=True)
    country = models.CharField(max_length=255, null=True)
    full_address = models.CharField(max_length=255, null=True)
    starts_on = models.DateTimeField(null=True, blank=True)
    ends_on = models.DateTimeField(null=True, blank=True)
    repeat = models.CharField(max_length=1, choices=REPEAT_CHOICES)
    street = models.CharField(max_length=300, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zipcode = models.CharField(max_length=7, null=True, blank=True)
    state = models.CharField(max_length=3, null=True, blank=True)
    members = models.ManyToManyField(FacebookCustomUser, through='Membership')
    max_attendees = models.IntegerField(default=10)
    access_level = models.CharField(choices=ACCESS_LEVEL_CHOICES,
                                    default=ACCESS_LEVEL_CHOICES[0],
                                    max_length=20)
    access_user_list = models.TextField(null=True, blank=True)
    event_photo = ThumbnailerImageField(null=True,
                                        upload_to='event_photos/%Y/%m/%d')
    eid = models.BigIntegerField(blank=True, null=True)

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
        if self.location:
            point = fromstr("POINT(%s %s)" % (self.location.longitude,
                                              self.location.latitude))
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


class EventFilterState(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    distance = models.IntegerField(default=1)
    cumulative_match_score = models.IntegerField(default=0)
    keyword = models.CharField(max_length=50)
    order_criteria = models.CharField(max_length=20, default='distance')


class FilterState(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    distance = models.IntegerField(default=10000)
    distance_unit = models.CharField(max_length=5, default='miles')
    cumulative_match_score = models.IntegerField(default=0)
    gender = models.CharField(max_length=3, default='m,f')
    keyword = models.CharField(max_length=50, default='')
    order_criteria = models.CharField(max_length=20, default='match_score')
    min_age = models.CharField(max_length=3, default=25)
    max_age = models.CharField(max_length=4, default=60)
    updated = models.DateTimeField(auto_now=True, null=True)


def create_user_profile(sender, instance, created, **kwargs):
    logger.debug('create_user_profile signal triggered')
    if created:
        EventFilterState.objects.get_or_create(user=instance)
        FilterState.objects.get_or_create(user=instance)

post_save.connect(create_user_profile, sender=FacebookCustomUser)


class FacebookEvent(models.Model):
    # in order to be able to easily move these to an another db,
    # use a user_id and no foreign key
    user_id = models.IntegerField()
    facebook_id = models.BigIntegerField()
    name = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    type = models.CharField(max_length=10, blank=True, null=True)
    rsvp_status = models.CharField(max_length=20, blank=True, null=True)
    owner = models.TextField(blank=True, null=True)
    attending_count = models.IntegerField(blank=True, null=True)
    category = models.CharField(max_length=30, blank=True, null=True)
    cover = models.TextField(blank=True, null=True)
    picture = models.TextField(blank=True, null=True)
    location = GeopositionField(blank=True, null=True)
    place = models.TextField(blank=True, null=True)
    raw_data = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return u"{} - {}".format(self.facebook_id, self.name)
