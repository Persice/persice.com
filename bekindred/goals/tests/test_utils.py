import json
from datetime import date

from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from social_auth.db.django_models import UserSocialAuth

from events.models import FilterState
from goals.utils import calculate_distance_es, get_current_position


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
        self.assertEqual(d, [10, 'meters'])

    def test_m_gte_50(self):
        user_object = {'sort': [0.9]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [899, 'meters'])

    def test_1_km(self):
        user_object = {'sort': [1.0]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [999, 'meters'])

    def test_gte_1_km(self):
        user_object = {'sort': [1.1]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [1099, 'meters'])


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
        self.assertEqual(d, [10, 'meters'])

    def test_m_gte_50(self):
        user_object = {'sort': [0.9]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [1448, 'meters'])

    def test_1_mi(self):
        user_object = {'sort': [1.0]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [1, 'miles'])

    def test_gte_1_mi(self):
        user_object = {'sort': [1.7]}
        d = calculate_distance_es(self.user.id, user_object)
        self.assertEqual(d, [1, 'miles'])


class TestPosition(TestCase):
    def setUp(self):
        data_fb = {
                    "work": [
                        {
                            "position": {
                                "id": "109542932398298",
                                "name": "Software Engineer"
                            },
                            "start_date": "0000-00",
                            "employer": {
                                "id": "111759188836818",
                                "name": "Wargaming.net"
                            }
                        },
                        {
                            "employer": {
                                "id": "112243035457778",
                                "name": "Luxoft"
                            }
                        }
                    ],
                    "is_shared_login": False,
                    "id": "784349768271537"
                }
        self.user = FacebookCustomUser.objects. \
            create_user(username='user_a', facebook_id=1234567,
                        raw_data=json.dumps(data_fb),
                        password='test', date_of_birth=date(1989, 5, 20))

        self.user1 = FacebookCustomUser.objects. \
            create_user(username='user_b', facebook_id=1234568,
                        raw_data=json.dumps(data_fb),
                        password='test1', date_of_birth=date(1989, 5, 20))

        self.user2 = FacebookCustomUser.objects. \
            create_user(username='user_c', facebook_id=1234569,
                        password='test2', date_of_birth=date(1989, 5, 20))
        data = {
            "public_profile_url": "https://www.linkedin.com/in/andriisoldatenko",
            "first_name": "Andrii",
            "last_name": "Soldatenko",
            "positions": {
                "position": [
                    {
                        "is-current": "true",
                        "start-date": {
                            "month": "10",
                            "year": "2015"
                        },
                        "company": {
                            "industry": "Information Technology and Services",
                            "size": "51-200 employees",
                            "type": "Privately Held",
                            "id": "2672915",
                            "name": "Toptal"
                        },
                        "id": "728854075",
                        "title": "Software Engineer"
                    }
                ]
            }
        }
        UserSocialAuth.objects.create(
            user_id=self.user.id,
            provider='linkedin',
            extra_data=json.dumps(data)
        )

    def test_simple_linkedin_position(self):
        position = get_current_position(self.user)
        self.assertEqual(position.get('job'), u'Software Engineer')
        self.assertEqual(position.get('company'), u'Toptal')

    def test_simple_facebook_position(self):
        position = get_current_position(self.user1)
        self.assertEqual(position.get('job'), u'Software Engineer')
        self.assertEqual(position.get('company'), u'Wargaming.net')

    def test_empty_position(self):
        position = get_current_position(self.user2)
        self.assertIsNone(position.get('job'))
        self.assertIsNone(position.get('company'))
