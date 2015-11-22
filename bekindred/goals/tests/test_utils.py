from datetime import date

from django.test import TestCase
from django_facebook.models import FacebookCustomUser

from events.models import FilterState
from goals.utils import calculate_distance_es


class DistanceKmTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', facebook_id=1234567,
                        password='test', date_of_birth=date(1989, 5, 20))
        FilterState.objects.all().delete()
        FilterState.objects.create(user=self.user, distance=10,
                                   distance_unit='km')

    def test_km(self):
        user_object = {'sort': [5.323]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [5, 'km'])

    def test_m_50(self):
        user_object = {'sort': [0.0]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [10, 'm'])

    def test_m_gte_50(self):
        user_object = {'sort': [0.9]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [899, 'm'])

    def test_1_km(self):
        user_object = {'sort': [1.0]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [999, 'm'])

    def test_gte_1_km(self):
        user_object = {'sort': [1.1]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [1099, 'm'])


class DistanceMilesTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects. \
            create_user(username='user_a', facebook_id=1234567,
                        password='test', date_of_birth=date(1989, 5, 20))
        FilterState.objects.all().delete()
        FilterState.objects.create(user=self.user, distance=10,
                                   distance_unit='miles')

    def test_mi(self):
        user_object = {'sort': [5.323]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [5, 'miles'])

    def test_m_50(self):
        user_object = {'sort': [0.0]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [10, 'm'])

    def test_m_gte_50(self):
        user_object = {'sort': [0.9]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [1448, 'm'])

    def test_1_mi(self):
        user_object = {'sort': [1.0]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [1, 'miles'])

    def test_gte_1_mi(self):
        user_object = {'sort': [1.7]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [1, 'miles'])
