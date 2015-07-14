from geopy.distance import distance as geopy_distance
from django.contrib.gis.measure import Distance
from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from goals.utils import calculate_distance
from world.models import UserLocation


class GeoCoordinateTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        UserLocation.objects.create(user=self.user, position=[7000, 22965.83])
        UserLocation.objects.create(user=self.user1, position=[0.5, 32000])
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
            point = [location[1], location[2]]
            location_obj = UserLocation(user=self.user, position=point)
            location_obj.save()

    def test_create_simple_coordinates(self):
        coordinates = UserLocation.objects.all()
        self.assertEqual(len(coordinates), 16)

    def test_calculate_distance(self):
        geo = UserLocation.objects.filter(user=self.user).order_by('-timestamp')[0]
        distance = UserLocation.objects.distance(geo.geometry).filter(user=self.user1)[0].distance
        self.assertEqual(distance.mi, 6229.787089256057)

    def test_calculate_distance2(self):
        user = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        user1 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        user_location1 = UserLocation.objects.create(user=user, position=[38.53, 77.02])
        user_location2 = UserLocation.objects.create(user=user1, position=[41.50, 87.37])
        distance = UserLocation.objects.distance(user_location1.geometry).filter(user=self.user1)[0].distance
        self.assertEqual(distance.mi, 7633.7030636078425)

    def test_calculate_distance_from_utils(self):
        user = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        user1 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        user_location1 = UserLocation.objects.create(user=user, position=[38.53, 77.02])
        user_location2 = UserLocation.objects.create(user=user1, position=[41.50, 87.37])
        distance = calculate_distance(user.id, user1.id)
        self.assertEqual(distance, [718, 'miles'])

    def test_calculate_distance_from_utils2(self):
        user = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        user1 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        user_location1 = UserLocation.objects.create(user=user, position=[-87.627696, 41.880745])
        user_location2 = UserLocation.objects.create(user=user1, position=[-87.62749695, 41.88316957])
        distance = calculate_distance(user.id, user1.id)
        self.assertEqual(distance, [269, 'meters'])

    def test_calculate_distance_from_utils_Less_10_meters(self):
        user = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        user1 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        user_location1 = UserLocation.objects.create(user=user, position=[-87.62749670, 41.883169])
        user_location2 = UserLocation.objects.create(user=user1, position=[-87.62749695, 41.88316957])
        distance = calculate_distance(user.id, user1.id)
        self.assertEqual(distance, [10, 'meters'])