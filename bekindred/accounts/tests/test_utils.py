from django.test import TestCase
from django_facebook.models import FacebookCustomUser

from accounts.utils import get_fb_events, refresh_events
from events.models import FacebookEvent


class GetFaceBookEventsTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects. \
            create_user(username='user_a', password='test',
                        first_name='Andrii', last_name='Soldatenko')

    def test_refresh_events(self):
        FacebookEvent.objects.create(
            user_id=self.user.id, facebook_id=1581472222157278)
        refresh_events(self.user)
        self.assertEqual(1, 2)
