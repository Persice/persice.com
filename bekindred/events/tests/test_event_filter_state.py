from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from events.models import EventFilterState


class TestEventFilterState(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')

    def test_simple_save(self):
        EventFilterState.objects.create(user=self.user, distance=100,
                                        keyword='django,python')
        self.assertEqual(EventFilterState.objects.all().count(), 1)

