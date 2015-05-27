from datetime import date
from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from events.models import Event


class EventTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', facebook_id=1234567,
                                                           password='test', date_of_birth=date(1989, 5, 20))
        Event.objects.create(name="Play piano", user=self.user, location=[7000, 22965.83])

    def test_event_name(self):
        event = Event.objects.get(name="Play piano")
        self.assertEqual(event.name, "Play piano")
