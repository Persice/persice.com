from django.contrib.gis.geos import Point, fromstr
from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase

from goals.models import Goal
from world.models import UserLocation


class TestUserLocationResource(ResourceTestCase):
    def setUp(self):
        super(TestUserLocationResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.location = UserLocation.objects.create(user=self.user, geometry=Point(7000, 22965.83))
        self.location1 = UserLocation.objects.create(user=self.user1, geometry=Point(0.5, 32000))
        location_data = [('NicNonnalds', '-87.627675', '41.881925'),
                         ('Boundaries Books', '-87.6281729688', '41.881849562'),
                         ('Field Marshal Department Store', '-87.62839', '41.88206'),
                         ('RadioShock', '-87.6269801114', '41.8814058757'),
                         ('CAN Insurance', '-87.6266873845', '41.8818595588'),
                         ('SuperWay Sandwiches', '-87.6266580795', '41.8813617549'),
                         ('911 Convenience Store', '-87.6285777569', '41.8810785557'),
                         ('Nobel Barnes Books', '-87.627834', '41.880856'),
                         ('Decade Park', '-87.62929387', '41.88207029'),
                         ('Burrito Bell', '-87.6282415079', '41.8830285557'),
                         ('Seals Tower', '-87.627696', '41.880745'), ('Lake Hotel', '-87.627696', '41.880745'),
                         ('Weekly Plaza', '-87.627696', '41.880745'),
                         ('Forest Museum', '-87.62749695', '41.88316957'), ]

        for location in location_data:
            point = fromstr("POINT(%s %s)" % (location[1], location[2]))
            location_obj = UserLocation(user=self.user, geometry=point)
            location_obj.save()

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/location/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/location/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 15)
        # Here, we're checking an entire structure for the expected data.
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            u'altitude': None,
            u'altitude_accuracy': None,
            u'geometry': u'POINT (7000.0000000000000000 22965.8300000000017462)',
            u'heading': None,
            u'id': self.location.pk,
            u'resource_uri': u'/api/v1/location/{}/'.format(self.location.pk),
            u'speed': None,
            u'user': u'/api/v1/auth/user/{}/'.format(self.user.pk)
        })

    def test_create_location(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'geometry': u'POINT (7000.0000000000000000 22965.8300000000017462)',
        }
        self.response = self.login()
        self.assertHttpCreated(self.api_client.post('/api/v1/location/', format='json', data=post_data))

    def test_delete_detail(self):
        self.response = self.login()
        self.assertEqual(UserLocation.objects.count(), 16)
        self.assertHttpAccepted(self.api_client.delete('/api/v1/location/%s/' % self.location.pk, format='json'))
        self.assertEqual(UserLocation.objects.count(), 15)
