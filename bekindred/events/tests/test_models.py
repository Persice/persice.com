from datetime import date, timedelta
from django.test import TestCase
from django.utils.timezone import now
from django_facebook.models import FacebookCustomUser
from events.models import Event, Membership

from django.contrib.gis.geos import GEOSGeometry, LineString, Point, fromstr
from django.contrib.gis.measure import D  # alias for Distance

class EventTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', facebook_id=1234567,
                                                           password='test', date_of_birth=date(1989, 5, 20))
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83],
                                          starts_on=now(), ends_on=now() + timedelta(days=10))
        Membership.objects.create(user=self.user, event=self.event)

    def test_event_name(self):
        event = Event.objects.filter(name="Play piano")[0]
        self.assertEqual(event.name, "Play piano")

    def test_event_distance(self):
        """
        'POINT(latitude, longitude)'
        SELECT ST_Distance(
            ST_GeomFromText('POINT(-72.1235 42.3521)', 4326),
            ST_GeomFromText('POINT(-95.370401017314293 29.704867409475465)', 4326)
        );
        26.464521516695402
        """
        latitude, longitude = (-72.1235, 42.3521)
        location = [latitude, longitude]

        self.event = Event.objects.create(name="Play piano", location=location,
                                          starts_on=now(), ends_on=now() + timedelta(days=10))
        lagrange = fromstr('POINT(-95.370401017314293 29.704867409475465)')
        distance = Event.objects.distance(lagrange)[0].distance
        self.assertEqual(distance.m, 2390142.6461919)

    def test_event_filter_distance(self):
        latitude, longitude = (-72.1235, 42.3521)
        location = [latitude, longitude]

        self.event = Event.objects.create(name="Ruby conference piano", location=location,
                                          starts_on=now(), ends_on=now() + timedelta(days=10))
        lagrange = fromstr('POINT(-95.370401017314293 29.704867409475465)')
        self.assertEqual(Event.objects.all().count(), 2)

        # for e in Event.objects.distance(lagrange):
        #     print (e.name, e.distance)

        event = Event.objects.filter(point__distance_lte=(lagrange, D(km=15000).m)).search('ruby')
        self.assertEqual(len(event), 1)
        self.assertEqual(event[0].name, 'Ruby conference piano')

        event = Event.objects.filter(point__distance_lte=(lagrange, D(km=15000).m))
        self.assertEqual(len(event), 2)
        self.assertEqual(event[1].name, 'Ruby conference piano')
