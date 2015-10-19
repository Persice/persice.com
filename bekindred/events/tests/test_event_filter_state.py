from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from events.models import EventFilterState


class TestEventFilterState(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')

    def test_simple_save(self):
        self.assertEqual(EventFilterState.objects.
                         filter(user_id=self.user.id).count(), 1)
