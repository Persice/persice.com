from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase


class TestEventResource(ResourceTestCase):
    def setUp(self):
        super(TestEventResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')

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
