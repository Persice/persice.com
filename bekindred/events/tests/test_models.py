from datetime import date, timedelta
from django.test import TestCase
from django.utils.timezone import now
from django_facebook.models import FacebookCustomUser
from events.models import Event, Membership


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
