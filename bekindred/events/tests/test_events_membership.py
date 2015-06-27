from datetime import date, timedelta
from django.test import TestCase
from django.utils.timezone import now
from events.models import Membership, Event
from django_facebook.models import FacebookCustomUser

class TestEventsMembership(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83],
                                          starts_on=now(), ends_on=now() + timedelta(days=10)
                                          )
        self.membership = Membership.objects.create(user=self.user, event=self.event)

    def test_create_invitation(self):
        m = Membership.objects.filter(user=self.user, event=self.event)
        self.assertEqual(m[0].event.id, self.event.id)
