from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase
from tastypie.utils import now
from events.models import Event


class TestEventResource(ResourceTestCase):
    def setUp(self):
        super(TestEventResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.event = Event.objects.create(name="Play piano", user=self.user, location=[7000, 22965.83])
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
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/events/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/events/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 1)
        # Here, we're checking an entire structure for the expected data.
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            'id': self.event.id,
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'resource_uri': '/api/v1/events/{0}/'.format(self.event.pk),
            'description': None,
            'ends_on': None,
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'',
            'starts_on': None,
        })

    def test_create_simple_event(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'description': 'Test description',
            'ends_on': None,
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': now(),
        }
        self.response = self.login()
        self.assertHttpCreated(self.api_client.post('/api/v1/events/', format='json', data=post_data))
