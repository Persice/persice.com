from datetime import timedelta

from django.utils.timezone import now
from tastypie.test import ResourceTestCase
from django_facebook.models import FacebookCustomUser

from events.models import Event
from postman.models import Message


class TestEventsMembership(ResourceTestCase):
    def setUp(self):
        super(TestEventsMembership, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83],
                                          starts_on=now(), ends_on=now() + timedelta(days=10)
                                          )

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_create_invitation(self):
        self.response = self.login()
        self.post_data = {'event': "/api/v1/event/{}/".format(self.event.id),
                          'is_invited': False,
                          'is_organizer': True,
                          'user': "/api/v1/auth/user/{}/".format(self.user1.id)}
        self.assertEqual(Message.objects.all().count(), 0)
        resp = self.api_client.post('/api/v1/member/', data=self.post_data,
                                    format='json')
        self.assertEqual(Message.objects.all().count(), 1)
