from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase

from events.models import Event, Membership
from friends.models import Friend


class TestEventConnections(ResourceTestCase):
    def setUp(self):
        super(TestEventConnections, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test',
                                                           first_name='Andrii', last_name='Soldatenko')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test',
                                                            first_name='Andrii', last_name='Soldatenko')
        self.event = Event.objects.create(starts_on='2055-06-13T05:15:22.792659',
                                          ends_on='2055-06-14T05:15:22.792659',
                                          name="Play piano", location=[7000, 22965.83])
        self.event1 = Event.objects.create(starts_on='2055-06-13T05:15:22.792659',
                                           ends_on='2055-06-14T05:15:22.792659',
                                           name="Play piano", location=[7000, 22965.83])
        self.membership = Membership.objects.create(user=self.user, event=self.event,
                                                    is_organizer=True, rsvp='yes')
        Friend.objects.create(friend1=self.user, friend2=self.user1, status=1)
        self.response = self.login()

    def get_credentials(self):
        pass

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_login(self):
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_simple1(self):
        resp = self.api_client.get('/api/v1/events/connections/', format='json')
        self.assertEqual(self.deserialize(resp)['objects'][0]['first_name'], u'Andrii')

    def test_get_list_simple2(self):
        Membership.objects.create(user=self.user1, event=self.event,
                                  is_organizer=False, rsvp='yes', is_invited=False)
        Membership.objects.create(user=self.user1, event=self.event1,
                                  is_organizer=False, rsvp='yes', is_invited=True)
        resp = self.api_client.get('/api/v1/events/connections/', format='json')
        ar = self.deserialize(resp)
        self.assertEqual(len(ar['objects'][0]['events']), 2)

    def test_filter_first_name(self):
        resp = self.api_client.get('/api/v1/events/connections/', format='json', data={'first_name': 'andr'})
        self.assertEqual(self.deserialize(resp)['objects'][0]['first_name'], u'Andrii')

    def test_filter_first_name_non_match(self):
        resp = self.api_client.get('/api/v1/events/connections/', format='json', data={'first_name': 'test'})
        self.assertEqual(self.deserialize(resp)['objects'], [])

    def test_filter_first_name_empty(self):
        resp = self.api_client.get('/api/v1/events/connections/', format='json', data={'first_name': ''})
        self.assertEqual(self.deserialize(resp)['objects'][0]['first_name'], u'Andrii')
