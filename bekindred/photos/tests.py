from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase
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
            'order': 1
        }

    def login(self):
        # Just for post login form
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/photo/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
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
            'resource_uri': '/api/v1/photo/{0}/'.format(self.photo.pk)
        })

    def test_post_list(self):
        self.response = self.login()
        # Check how many are there first.
        self.assertEqual(FacebookPhoto.objects.count(), 1)
        self.assertHttpCreated(self.api_client.post('/api/v1/photo/', format='json',
                                                    data=self.post_data))
        # Verify a new one has been added.
        self.assertEqual(FacebookPhoto.objects.count(), 2)

    def test_put_detail(self):
        self.response = self.login()
        # Grab the current data & modify it slightly.
        original_data = self.deserialize(self.api_client.get(self.detail_url, format='json'))
        new_data = original_data.copy()
        new_data['order'] = 1

        self.assertEqual(FacebookPhoto.objects.count(), 1)
        self.assertHttpAccepted(self.api_client.put(self.detail_url, format='json', data=new_data, ))
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(FacebookPhoto.objects.count(), 1)
        # Check for updated data.
        self.assertEqual(FacebookPhoto.objects.get(pk=self.photo.id).order, 1)