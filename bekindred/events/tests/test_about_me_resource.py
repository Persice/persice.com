from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase

from accounts.tests.test_resources import JWTResourceTestCase


class TestAboutMeResource(JWTResourceTestCase):
    def setUp(self):
        super(TestAboutMeResource, self).setUp()
        self.user = FacebookCustomUser.objects. \
            create_user(username='user_a', password='test',
                        first_name='Andrii', last_name='Soldatenko')
        self.detail_url = '/api/v1/me/'

    def test_get_list_unauthorized(self):
        self.assertHttpUnauthorized(self.api_client.get(self.detail_url,
                                                        format='json'))

    def test_get_list_json(self):
        resp = self.api_client.get(
            self.detail_url, format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)

        data = self.deserialize(resp)
        self.assertEqual(data['objects'][0]['first_name'], 'Andrii')
        self.assertEqual(data['objects'][0]['last_name'], 'Soldatenko')
