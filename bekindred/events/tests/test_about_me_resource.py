from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase


class TestAboutMeResource(ResourceTestCase):
    def setUp(self):
        super(TestAboutMeResource, self).setUp()
        self.user = FacebookCustomUser.objects. \
            create_user(username='user_a', password='test',
                        first_name='Andrii', last_name='Soldatenko')
        self.detail_url = '/api/v1/me/'

    def get_credentials(self):
        pass

    def login(self, username='user_a', password='test'):
        return self.api_client.client.post('/login/', {'username': username,
                                                       'password': password})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get(self.detail_url,
                                                        format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get(self.detail_url, format='json')
        self.assertValidJSONResponse(resp)

        data = self.deserialize(resp)
        self.assertEqual(data['objects'][0]['first_name'], 'Andrii')
        self.assertEqual(data['objects'][0]['last_name'], 'Soldatenko')
