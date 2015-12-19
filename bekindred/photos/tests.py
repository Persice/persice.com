from tastypie.test import ResourceTestCase

from django_facebook.models import FacebookCustomUser
from members.models import OnBoardingFlow
from photos.models import FacebookPhoto

ResourceTestCase.maxDiff = None


class FacebookPhotoResourceTest(ResourceTestCase):
    def setUp(self):
        super(FacebookPhotoResourceTest, self).setUp()
        self.PHOTO_URL = 'https://scontent-a.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/' \
                         '10325735_766522586720922_6094805479414606575_n.jpg?oh=23b6bf251efe0021187fde75aafbd003&oe=54EBDC1C'
        self.PHOTO_URL1 = 'https://scontent-b.xx.fbcdn.net/hphotos-ash2/v/t1.0-9/s130x130/' \
                          '532133_439316379441546_842271884_n.jpg?oh=67a1455aafe942630ba68e142d3633e3&oe=54E653FB'
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.photo = FacebookPhoto.objects.create(user=self.user, photo=self.PHOTO_URL, order=0)

        self.detail_url = '/api/v1/photo/{0}/'.format(self.photo.pk)
        self.post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'photo': self.PHOTO_URL1,
            'order': 1,
            'cropped_photo': ''
        }

    def login(self):
        # Just for post login form
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/photo/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json_photo(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/photo/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 1)
        # Here, we're checking an entire structure for the expected data.
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            'id': self.photo.pk,
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'photo': self.PHOTO_URL,
            'order': 0,
            'resource_uri': '/api/v1/photo/{0}/'.format(self.photo.pk),
            'cropped_photo': ''
        })

    def test_post_list(self):
        self.response = self.login()
        # Check how many are there first.
        self.assertEqual(FacebookPhoto.objects.count(), 1)
        self.assertHttpCreated(self.api_client.post('/api/v1/photo/', format='json',
                                                    data=self.post_data))
        # Verify a new one has been added.
        self.assertEqual(FacebookPhoto.objects.count(), 2)

    def test_delete_detail(self):
        self.response = self.login()
        self.assertEqual(FacebookPhoto.objects.count(), 1)
        self.assertHttpAccepted(self.api_client.delete(self.detail_url, format='json'))
        self.assertEqual(FacebookPhoto.objects.count(), 0)


class TestOnBoardingFlowResource(ResourceTestCase):
    def get_credentials(self):
        pass

    def setUp(self):
        super(TestOnBoardingFlowResource, self).setUp()
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects. \
            create_user(username='user_b', password='test')
        self.flow = OnBoardingFlow.objects.\
            create(user=self.user, is_complete=True)

    def login(self):
        return self.api_client.client.post('/login/',
                                           {
                                               'username': 'user_a',
                                               'password': 'test'
                                           })

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(
                self.api_client.get('/api/v1/onboardingflow/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/onboardingflow/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 1)

    def test_create_onboardingflow(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'is_complete': True,
        }
        self.response = self.login()
        resp = self.api_client.post(
                '/api/v1/onboardingflow/',
                format='json', data=post_data
        )
        self.assertEqual(self.deserialize(resp)['is_complete'], True)
