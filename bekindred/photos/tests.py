import json

from django.utils.encoding import filepath_to_uri
from tastypie.test import ResourceTestCase

from django_facebook.models import FacebookCustomUser
from members.models import OnBoardingFlow
from photos.models import FacebookPhoto

ResourceTestCase.maxDiff = None


class TestUserResource(ResourceTestCase):
    def get_credentials(self):
        pass

    def setUp(self):
        super(TestUserResource, self).setUp()
        self.user = FacebookCustomUser.objects. \
            create_user(username='user_a', password='test', about_me='test')
        self.detail_url = '/api/v1/user_profile/{}/'.format(self.user.pk)

    def login(self):
        # Just for post login form
        return self.api_client.client.post('/login/', {'username': 'user_a',
                                                       'password': 'test'})

    def test_put_detail(self):
        # Grab the current data & modify it slightly.
        self.login()
        original_data = self.deserialize(
                self.api_client.get(self.detail_url, format='json')
        )
        new_data = original_data.copy()
        new_data['about_me'] = 'Updated: about me'

        self.assertEqual(FacebookCustomUser.objects.count(), 2)
        self.assertHttpAccepted(
                self.api_client.put(self.detail_url, format='json',
                                    data=new_data)
        )
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(FacebookCustomUser.objects.count(), 2)
        # Check for updated data.
        self.assertEqual(FacebookCustomUser.objects.get(pk=self.user.pk).about_me, 'Updated: about me')


class FacebookPhotoResourceTest(ResourceTestCase):
    def setUp(self):
        super(FacebookPhotoResourceTest, self).setUp()
        self.PHOTO_URL = 'scontent-a.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/' \
                         '10325735_766522586720922_6094805479414606575_n.jpg?oh=23b6bf251efe0021187fde75aafbd003&oe=54EBDC1C'
        self.PHOTO_URL1 = 'scontent-b.xx.fbcdn.net/hphotos-ash2/v/t1.0-9/s130x130/' \
                          '532133_439316379441546_842271884_n.jpg?oh=67a1455aafe942630ba68e142d3633e3&oe=54E653FB'
        self.user = FacebookCustomUser.objects.create_user(username='user_a',
                                                           password='test',
                                                           image=self.PHOTO_URL1)
        self.photo = FacebookPhoto.objects.create(user=self.user, photo=self.PHOTO_URL, order=0)

        self.detail_url = '/api/v1/photo/{0}/'.format(self.photo.pk)
        self.post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'photo': self.PHOTO_URL1,
            'order': 0,
            'cropped_photo': '',
            'bounds': json.dumps({'left': 170, 'upper': 170, 'right': 468, 'lower': 468})
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
            'cropped_photo': '',
            'bounds': ''
        })

    def test_post_list(self):
        self.response = self.login()
        # Check how many are there first.
        self.assertEqual(FacebookPhoto.objects.count(), 1)
        self.assertHttpCreated(self.api_client.post('/api/v1/photo/', format='json',
                                                    data=self.post_data))
        # Verify a new one has been added.
        self.assertEqual(FacebookPhoto.objects.count(), 2)
        bounds = FacebookPhoto.objects.filter(user=self.user, order=0)[0].bounds
        self.assertEqual(bounds, self.post_data['bounds'])

    def test_create_profile_photo(self):
        self.response = self.login()
        # Check how many are there first.
        original_image = FacebookCustomUser.objects.get(pk=self.user.id).image
        self.assertTrue(bool(original_image))
        self.assertEqual(FacebookPhoto.objects.count(), 1)
        self.assertHttpCreated(self.api_client.post('/api/v1/photo/',
                                                    format='json',
                                                    data=self.post_data))
        # Verify a new one has been added.
        self.assertEqual(FacebookPhoto.objects.count(), 2)
        image = FacebookCustomUser.objects.get(pk=self.user.id).image
        self.assertEqual(image.url,
                         '/media/{}'.format(filepath_to_uri(self.PHOTO_URL1)))

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
        self.PHOTO_URL1 = 'https://scontent-b.xx.fbcdn.net/hphotos-ash2/v/' \
                          't1.0-9/s130x130/532133_439316379441546_842271884' \
                          '_n.jpg?oh=67a1455aafe942630ba68e142d3633e3&' \
                          'oe=54E653FB'
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', password='test',
                        image=self.PHOTO_URL1)
        self.user1 = FacebookCustomUser.objects. \
            create_user(username='user_b', password='test',
                        image=self.PHOTO_URL1)
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
