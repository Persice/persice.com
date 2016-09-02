from datetime import date

from django_facebook.models import FacebookCustomUser

from accounts.tests.test_resources import JWTResourceTestCase
from friends.utils import NeoFourJ
from goals.models import Subject
from world.models import UserLocation


class TestMatchFeedResource2(JWTResourceTestCase):
    def setUp(self):
        super(TestMatchFeedResource2, self).setUp()
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', facebook_id=999234567,
                        password='test', date_of_birth=date(1989, 5, 20))
        self.user1 = FacebookCustomUser.objects.\
            create_user(username='user_b', facebook_id=12345671,
                        password='test', date_of_birth=date(1989, 1, 9))
        self.user2 = FacebookCustomUser.objects.\
            create_user(username='user_c', facebook_id=12345672, gender='m',
                        password='test', date_of_birth=date(1998, 1, 11))
        self.user3 = FacebookCustomUser.objects.\
            create_user(username='user_d', facebook_id=12345673, gender='f',
                        password='test', date_of_birth=date(1950, 3, 1))
        self.user4 = FacebookCustomUser.objects.\
            create_user(username='user_e', facebook_id=12345674,
                        password='test', date_of_birth=date(1970, 2, 1))
        self.user5 = FacebookCustomUser.objects.\
            create_user(username='user_f', facebook_id=12345675,
                        password='test', date_of_birth=date(1973, 11, 1))
        self.user6 = FacebookCustomUser.objects.\
            create_user(username='user_g', facebook_id=123456123213,
                        password='test', date_of_birth=date(1989, 10, 1))
        self.user7 = FacebookCustomUser.objects.\
            create_user(username='user_h', facebook_id=123456751112,
                        password='test', date_of_birth=date(1935, 11, 1))
        self.description = 'learn django'
        self.description2 = 'learn python'
        self.description3 = 'learn ruby'
        self.description4 = 'teach django'
        self.description5 = 'teach python'
        self.description6 = 'teach ruby'
        self.description7 = 'find mountain biking partner'
        self.description8 = 'find people to go mountain biking with'
        self.description9 = 'django'

        self.subject = Subject.objects.create(description=self.description)
        self.subject2 = Subject.objects.create(description=self.description2)
        self.subject3 = Subject.objects.create(description=self.description3)
        self.subject4 = Subject.objects.create(description=self.description4)
        self.subject5 = Subject.objects.create(description=self.description5)
        self.subject6 = Subject.objects.create(description=self.description6)
        self.subject7 = Subject.objects.create(description=self.description7)
        self.subject8 = Subject.objects.create(description=self.description8)
        self.subject9 = Subject.objects.create(description=self.description9)

        UserLocation.objects.\
            create(user=self.user, position=[-87.627696, 41.880745])
        UserLocation.objects.\
            create(user=self.user1, position=[-87.627675, 41.881925])
        UserLocation.objects.\
            create(user=self.user2, position=[-87.6281729688, 41.881849562])
        UserLocation.objects.\
            create(user=self.user3, position=[-87.62839, 41.88206])
        UserLocation.objects.\
            create(user=self.user4, position=[-87.6269801114, 41.8814058757])
        UserLocation.objects.\
            create(user=self.user5, position=[38.53, 77.02])
        UserLocation.objects.\
            create(user=self.user6, position=[41.50, 87.37])
        UserLocation.objects.\
            create(user=self.user7, position=[-87.62749695, 41.88316957])

        self.resource_url = '/api/v1/matchfeed/'

    def test_get_matchfeed_list(self):
        self.assertHttpUnauthorized(self.api_client.get(self.resource_url,
                                                        format='json'))

    def test_get_list_json(self):
        resp = self.api_client.get(
            '/api/v1/matchfeed/', format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)
        self.assertEqual(len(self.deserialize(resp)), 2)


class TestProfileResource2(JWTResourceTestCase):
    def setUp(self):
        super(TestProfileResource2, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(
            username='user_a',
            facebook_id=999234567,
            password='test',
            date_of_birth=date(1989, 5, 20)
        )
        self.user1 = FacebookCustomUser.objects.create_user(
            username='user_b',
            facebook_id=99923456709,
            password='test',
            date_of_birth=date(1979, 6, 21)
        )
        self.resource_url = '/api/v1/profile/'

    def test_get_profile_list(self):
        self.assertHttpUnauthorized(
            self.api_client.get(self.resource_url, format='json'))

    def test_get_empty_list_json(self):
        resp = self.api_client.get(
            '/api/v1/profile/', format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)


class TestMutualConnectionsResource(JWTResourceTestCase):
    def setUp(self):
        super(TestMutualConnectionsResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(
            username='user_a',
            facebook_id=999234567,
            password='test',
            date_of_birth=date(1989, 5, 20)
        )
        self.user1 = FacebookCustomUser.objects.create_user(
            username='user_b',
            facebook_id=99923456709,
            password='test',
            date_of_birth=date(1979, 6, 21)
        )
        self.user2 = FacebookCustomUser.objects.create_user(
            username='user_c',
            facebook_id=99923456710,
            password='test',
            date_of_birth=date(1989, 6, 21)
        )
        self.resource_url = '/api/v2/mutual-connections/'
        self.neo = NeoFourJ()
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        n3 = self.neo.create_person(self.neo.person(self.user2))
        self.neo.add_to_friends(n1, n2)
        self.neo.add_to_friends(n2, n1)
        self.neo.add_to_friends(n1, n3)
        self.neo.add_to_friends(n3, n1)
        self.neo.add_to_friends(n3, n2)
        self.neo.add_to_friends(n2, n3)

    def tearDown(self):
        self.neo.graph.delete_all()

    def test_get_mutual_connections(self):
        resp = self.api_client.get(
            self.resource_url, format='json', data={"user_id": self.user1.id},
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)
        data = self.deserialize(resp)
        self.assertEqual(data, [])
