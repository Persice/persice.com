from datetime import timedelta

from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase
from tastypie.utils import now

from events.models import Event, Membership
from friends.models import Friend


class TestEventResource(ResourceTestCase):
    def setUp(self):
        super(TestEventResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.event = Event.objects.create(starts_on='2055-06-13T05:15:22.792659', ends_on='2055-06-14T05:15:22.792659',
                                          name="Play piano", location=[7000, 22965.83])
        self.detail_url = '/api/v1/event/{0}/'.format(self.event.pk)
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
            'ends_on': '2055-06-14T05:15:22.792659',
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'',
            'starts_on': '2055-06-13T05:15:22.792659',
            'city': None,
            'zipcode': None,
            'state': None,
            'street': None,
            u'members': [],
        })

    def test_create_simple_event(self):
        post_data = {
            'description': 'Test description',
            'ends_on': str(now() + timedelta(days=2)),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': str(now() + timedelta(days=1))
        }
        self.response = self.login()
        self.assertHttpCreated(self.api_client.post('/api/v1/event/', format='json', data=post_data))

    def test_update_simple_event(self):
        self.response = self.login()
        Membership.objects.create(user=self.user, event=self.event)
        self.assertEqual(Event.objects.filter(membership__user=self.user, name='Play piano')[0].name, 'Play piano')
        original_data = self.deserialize(self.api_client.get(self.detail_url, format='json'))
        new_data = original_data.copy()
        new_data['name'] = 'learn erlang'

        self.api_client.put(self.detail_url, format='json', data=new_data)
        self.assertEqual(Event.objects.filter(membership__user=self.user, name='learn erlang')[0].name, 'learn erlang')

    def test_update_if_ends_on_in_past(self):
        self.response = self.login()

        event = Event.objects.create(starts_on=now() - timedelta(days=10), ends_on=now() - timedelta(days=9),
                             name="Play piano", location=[7000, 22965.83])
        Membership.objects.create(user=self.user, event=event)

        detail_url = '/api/v1/event/{0}/'.format(event.pk)

        original_data = self.deserialize(self.api_client.get(detail_url, format='json'))
        new_data = original_data.copy()
        new_data['name'] = 'learn erlang'
        new_data['ends_on'] = now() + timedelta(days=2)
        new_data['starts_on'] = now() + timedelta(days=1)

        resp = self.api_client.patch(detail_url, format='json', data=new_data)
        self.assertEqual(self.deserialize(resp),
                         {u'error': u'Users cannot edit events which have an end date that occurred in the past.'})

    def test_create_event_which_starts_in_the_past(self):
        post_data = {
            'description': 'Test description',
            'ends_on': now() + timedelta(days=1),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': now() - timedelta(days=1)
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/event/', format='json', data=post_data)
        self.assertEqual(self.deserialize(resp),
                         {u'event': {u'error': [u'starts_on should be more or equals than today']}})

    def test_create_event_which_ends_in_the_past(self):
        post_data = {
            'description': 'Test description',
            'ends_on': now() - timedelta(days=7),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': now() - timedelta(days=9)
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/event/', format='json', data=post_data)
        self.assertEqual(self.deserialize(resp),
                         {u'event': {u'error': [u'ends_on should be more or equals than today']}})

    def test_create_event_which_starts_eq_ends(self):
        post_data = {
            'description': 'Test description',
            'ends_on': now() + timedelta(days=1),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': now() + timedelta(days=1)
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/event/', format='json', data=post_data)
        self.assertEqual(self.deserialize(resp),
                         {u'event': {u'error': [u'ends_to should be greater than starts_on']}})

class TestAllEventFeedResource(ResourceTestCase):
    def setUp(self):
        super(TestAllEventFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83],
                                          starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event1 = Event.objects.create(name="Play piano1", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event2 = Event.objects.create(name="Play piano2", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event3 = Event.objects.create(name="Play piano2", location=[7000, 22965.83],
                                           starts_on=now() - timedelta(days=11), ends_on=now() - timedelta(days=10))
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

    def test_filter_past_event(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/feed/events/all/', format='json')
        res = self.deserialize(resp)
        self.assertEqual(res['meta']['total_count'], 3)


class TestMyEventFeedResource(ResourceTestCase):
    def setUp(self):
        super(TestMyEventFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83],
                                          starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event1 = Event.objects.create(name="Play piano1", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event2 = Event.objects.create(name="Play piano2", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
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

    def test_only_display_events_that_end_in_the_future(self):
        self.response = self.login()

        event1 = Event.objects.create(name="Ruby", location=[7000, 22965.83],
                                      starts_on=now() - timedelta(days=9), ends_on=now() - timedelta(days=7))
        event2 = Event.objects.create(name="Python", location=[7000, 22965.83],
                                      starts_on=now() + timedelta(days=7), ends_on=now() + timedelta(days=8))
        Membership.objects.create(user=self.user, event=event1)
        Membership.objects.create(user=self.user, event=event2)
        resp = self.api_client.get('/api/v1/feed/events/my/', format='json')
        res = self.deserialize(resp)['objects']
        self.assertEqual(len(res), 4)


class TestFriendsEventFeedResource(ResourceTestCase):
    def setUp(self):
        super(TestFriendsEventFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83],
                                          starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event1 = Event.objects.create(name="Play piano1", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event2 = Event.objects.create(name="Play piano2", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
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
