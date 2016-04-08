import json

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from django.utils.encoding import filepath_to_uri
from tastypie.test import ResourceTestCase

from django_facebook.models import FacebookCustomUser
from members.models import OnBoardingFlow
from photos.models import FacebookPhoto

ResourceTestCase.maxDiff = None


class TestFacebookPhoto(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects. \
            create_user(username='user_a', password='test', about_me='test')

    def test_save_cropped_photo(self):
        pk = FacebookPhoto.objects.create(
            user=self.user,
            bounds='{"left": 170, "upper": 170, "right": 468, "lower": 468}',
            order=0,
            photo='https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/'
                  '11073058_639702779498180_1466183275475347856_n.jpg?'
                  'oh=87bf52793774bc854bfacb32c82c66d1&oe=5764DDDF'
        )
        self.assertEqual(FacebookPhoto.objects.all().count(), 1)
        self.assertIsNotNone(FacebookPhoto.objects.get(pk=pk.id).cropped_photo.url)

    def test_update_order_photo(self):
        pk = FacebookPhoto.objects.create(
            user=self.user,
            bounds='{"left": 170, "upper": 170, "right": 468, "lower": 468}',
            order=0,
            photo='https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/'
                  '11073058_639702779498180_1466183275475347856_n.jpg?'
                  'oh=87bf52793774bc854bfacb32c82c66d1&oe=5764DDDF'
        )
        self.assertEqual(FacebookPhoto.objects.all().count(), 1)
        self.assertIsNotNone(FacebookPhoto.objects.get(pk=pk.id).cropped_photo.url)


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
        self.PHOTO_URL = \
            'https://scontent-fra3-1.xx.fbcdn.net/hphotos-xft1' \
            '/v/t1.0-9/11046342_962374947135684_624952069961722' \
            '2869_n.jpg?oh=1e7c381e7c15d070552869a1d6174e99&oe=57616753'

        self.PHOTO_URL1 = \
            'https://scontent-fra3-1.xx.fbcdn.net/hphotos-xft1' \
            '/v/t1.0-9/11046342_962374947135684_624952069961722' \
            '2869_n.jpg?oh=1e7c381e7c15d070552869a1d6174e99&oe=57616753'

        self.user = FacebookCustomUser.objects.create_user(username='user_a',
                                                           password='test',
                                                           image=self.PHOTO_URL)
        self.photo = FacebookPhoto.objects.create(user=self.user,
                                                  photo=self.PHOTO_URL,
                                                  order=0)

        self.detail_url = '/api/v1/photo/{0}/'.format(self.photo.pk)
        self.post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'photo': self.PHOTO_URL1,
            'order': 0,
            'cropped_photo': '',
            'bounds': json.dumps({'left': 170, 'upper': 170,
                                  'right': 468, 'lower': 468})
        }

    def login(self):
        # Just for post login form
        return self.api_client.client.post(
            '/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/photo/',
                                                        format='json'))

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
        ar = self.deserialize(resp)['objects'][0]
        del ar['cropped_photo']
        self.assertEqual(ar, {
            'id': self.photo.pk,
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'photo': self.PHOTO_URL,
            'order': 0,
            'resource_uri': '/api/v1/photo/{0}/'.format(self.photo.pk),
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
        self.assertIsNotNone(image.url)

    def test_delete_detail(self):
        self.response = self.login()
        self.assertEqual(FacebookPhoto.objects.count(), 1)
        # Yo can't delete last photo by design
        self.assertHttpUnauthorized(self.api_client.delete(self.detail_url,
                                                           format='json'))
        self.assertEqual(FacebookPhoto.objects.count(), 1)
