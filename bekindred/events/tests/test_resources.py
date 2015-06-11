from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase
from tastypie.utils import now

from events.models import Event, Membership
from friends.models import Friend


class TestEventResource(ResourceTestCase):
    def setUp(self):
        super(TestEventResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83])
        self.detail_url = '/api/v1/events/{0}/'.format(self.event.pk)
        self.post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'events': '/api/v1/event/{0}/'.format(self.event.pk),
        }

    def get_credentials(self):
        pass

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/event/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/event/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 1)
        # Here, we're checking an entire structure for the expected data.
        self.maxDiff = None
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            'id': self.event.id,
            'resource_uri': '/api/v1/event/{0}/'.format(self.event.pk),
            'description': None,
            'ends_on': None,
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'',
            'starts_on': None,
            'city': None,
            'zipcode': None,
            'state': None,
            'street': None
        })

    def test_create_simple_event(self):
        post_data = {
            'description': 'Test description',
            'ends_on': None,
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': now()
        }
        self.response = self.login()
        self.assertHttpCreated(self.api_client.post('/api/v1/event/', format='json', data=post_data))


class TestAllEventFeedResource(ResourceTestCase):
    def setUp(self):
        super(TestAllEventFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83])
        self.event1 = Event.objects.create(name="Play piano1", location=[7000, 22965.83])
        self.event2 = Event.objects.create(name="Play piano2", location=[7000, 22965.83])
        Membership.objects.create(user=self.user, event=self.event)
        Membership.objects.create(user=self.user, event=self.event1)
        Membership.objects.create(user=self.user, event=self.event2)

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/feed/events/all/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 3)


class TestMyEventFeedResource(ResourceTestCase):
    def setUp(self):
        super(TestMyEventFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83])
        self.event1 = Event.objects.create(name="Play piano1", location=[7000, 22965.83])
        self.event2 = Event.objects.create(name="Play piano2", location=[7000, 22965.83])
        Membership.objects.create(user=self.user, event=self.event)
        Membership.objects.create(user=self.user, event=self.event1)
        Membership.objects.create(user=self.user, event=self.event2)

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/feed/events/my/', format='json')
        self.assertValidJSONResponse(resp)
        # Scope out the data for correctness.
        res = sorted(self.deserialize(resp)['objects'], key=lambda x: x['name'])
        self.assertEqual(res[0]['name'], self.event.name)


class TestFriendsEventFeedResource(ResourceTestCase):
    def setUp(self):
        super(TestFriendsEventFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83])
        self.event1 = Event.objects.create(name="Play piano1", location=[7000, 22965.83])
        self.event2 = Event.objects.create(name="Play piano2", location=[7000, 22965.83])
        Membership.objects.create(user=self.user, event=self.event)
        Membership.objects.create(user=self.user, event=self.event1)
        Membership.objects.create(user=self.user, event=self.event2)
        Friend.objects.create(friend1=self.user, friend2=self.user1, status=1)

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/feed/events/friends/', format='json')
        self.assertValidJSONResponse(resp)
        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 0)
