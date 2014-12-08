from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase
from interests.models import Interest


class TestInterestResource(ResourceTestCase):
    def setUp(self):
        super(TestInterestResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.DESCRIPTION = 'learn django'
        self.DESCRIPTION2 = 'learn python'
        self.DESCRIPTION3 = 'learn ruby'
        self.DESCRIPTION4 = 'learn javascript'
        self.interest = Interest.objects.create(description=self.DESCRIPTION, user=self.user)
        self.interest2 = Interest.objects.create(description=self.DESCRIPTION2, user=self.user)
        self.interest3 = Interest.objects.create(description=self.DESCRIPTION3, user=self.user)


        self.detail_url = '/api/v1/interest/{0}/'.format(self.interest.pk)
        self.post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'description': '{}'.format(self.DESCRIPTION4),
            }

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/interest/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/interest/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 3)
        # Here, we're checking an entire structure for the expected data.
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'description': '{}'.format(self.interest),
            'resource_uri': '/api/v1/interest/{0}/'.format(self.interest.pk)
        })

    def test_post_list(self):
        self.response = self.login()
        # Check how many are there first.
        self.assertEqual(Interest.objects.count(), 3)
        self.assertHttpCreated(self.api_client.post('/api/v1/interest/', format='json',
                                                    data=self.post_data))
        # Verify a new one has been added.
        self.assertEqual(Interest.objects.count(), 4)

    def test_put_detail(self):
        self.response = self.login()
        # Grab the current data & modify it slightly.
        original_data = self.deserialize(self.api_client.get(self.detail_url, format='json'))
        new_data = original_data.copy()
        new_data['subject'] = '/api/v1/interest/{}/'.format(self.interest3.pk)

        self.assertEqual(Interest.objects.count(), 3)
        self.assertHttpAccepted(self.api_client.put(self.detail_url, format='json', data=new_data))
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(Interest.objects.count(), 3)
        # Check for updated data.
        self.assertEqual(Interest.objects.get(pk=self.interest3.id).id, self.interest3.pk)

    def test_delete_detail(self):
        self.response = self.login()
        self.assertEqual(Interest.objects.count(), 3)
        self.assertHttpAccepted(self.api_client.delete(self.detail_url, format='json'))
        self.assertEqual(Interest.objects.count(), 2)