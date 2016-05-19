from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from py2neo import Node
from tastypie.test import ResourceTestCase
from friends.models import Friend
from friends.utils import NeoFourJ


class TestFriendResource(ResourceTestCase):
    def setUp(self):
        super(TestFriendResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.user3 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        self.user4 = FacebookCustomUser.objects.create_user(username='user_e', password='test')
        self.user5 = FacebookCustomUser.objects.create_user(username='user_f', password='test')
        self.user6 = FacebookCustomUser.objects.create_user(username='user_g', password='test')

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/friends/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_request_friend_request(self):
        post_data = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': 0,
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data)
        self.assertHttpCreated(resp)
        self.assertFalse(Friend.objects.checking_friendship(self.user.pk, self.user1.pk))

    def test_request_friend_request_swap(self):
        post_data = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'status': 0,
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data)
        self.assertHttpCreated(resp)
        self.assertFalse(Friend.objects.checking_friendship(self.user.pk, self.user1.pk))

    def test_accept_friend_request(self):
        post_data1 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': 0,
        }
        post_data2 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': 1,
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data1)
        self.assertHttpCreated(resp)
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data2)
        self.assertHttpCreated(resp)
        self.assertTrue(Friend.objects.checking_friendship(self.user.pk, self.user1.pk))

    def test_accept_friend_request_swap(self):
        post_data1 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': 0,
        }
        post_data2 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'status': 1,
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data1)
        self.assertHttpCreated(resp)
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data2)
        self.assertHttpCreated(resp)
        self.assertTrue(Friend.objects.checking_friendship(self.user.pk, self.user1.pk))
        self.assertTrue(Friend.objects.checking_friendship(self.user1.pk, self.user.pk))

    def test_decline_friend_request(self):
        post_data1 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': 0,
        }
        post_data2 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': -1,
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data1)
        self.assertHttpCreated(resp)
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data2)
        self.assertHttpCreated(resp)
        self.assertFalse(Friend.objects.checking_friendship(self.user.pk, self.user1.pk))
        self.assertFalse(Friend.objects.checking_friendship(self.user1.pk, self.user.pk))

    def test_decline_friend_request_swap(self):
        post_data1 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': 0,
        }
        post_data2 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'status': -1,
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data1)
        self.assertHttpCreated(resp)
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data2)
        self.assertHttpCreated(resp)
        self.assertFalse(Friend.objects.checking_friendship(self.user.pk, self.user1.pk))
        self.assertFalse(Friend.objects.checking_friendship(self.user1.pk, self.user.pk))

    def test_more_difficult(self):
        post_data1 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': 0,
        }
        post_data2 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'status': 1,
        }
        post_data3 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user2.pk),
            'status': 0,
        }
        post_data4 = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user2.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'status': 1,
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data1)
        self.assertHttpCreated(resp)
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data2)
        self.assertHttpCreated(resp)
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data3)
        self.assertHttpCreated(resp)
        resp = self.api_client.post('/api/v1/friends/', format='json', data=post_data4)
        self.assertHttpCreated(resp)
        self.assertTrue(Friend.objects.checking_friendship(self.user.pk, self.user1.pk))
        self.assertTrue(Friend.objects.checking_friendship(self.user1.pk, self.user.pk))
        self.assertTrue(Friend.objects.checking_friendship(self.user2.pk, self.user.pk))
        self.assertTrue(Friend.objects.checking_friendship(self.user.pk, self.user2.pk))


class TestFriendsNewResource(ResourceTestCase):
    def get_credentials(self):
        pass

    def setUp(self):
        super(TestFriendsNewResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a',
                                                           password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b',
                                                            password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c',
                                                            password='test')

    def login(self):
        return self.api_client.client.post(
            '/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(
            self.api_client.get('/api/v1/new_connections/counter/',
                                format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_request_friend_request(self):
        Friend.objects.create(friend1=self.user,
                              friend2=self.user2, status=1)
        post_data = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': 1,
        }

        self.response = self.login()
        resp = self.api_client.post('/api/v1/friends/', format='json',
                                    data=post_data)
        self.assertHttpCreated(resp)
        self.assertTrue(Friend.objects.checking_friendship(self.user.pk,
                                                           self.user1.pk))
        resp = self.api_client.get('/api/v1/new_connections/counter/',
                                   format='json')
        self.assertEqual(self.deserialize(resp)['objects'],
                         [{u'new_connection_counter': 2,
                           u'resource_uri': u''}])


class FriendUtilsTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a',
                                                           password='test',
                                                           first_name='Ani',
                                                           last_name='Lendel')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b',
                                                            password='test',
                                                            first_name='Sneja',
                                                            last_name='Yerson')
        self.neo = NeoFourJ()
        self.neo.graph.delete_all()

    def test_create_person(self):
        self.neo.create_person(self.neo.person(self.user))
        neo_user = self.neo.get_person(self.user)
        self.assertEqual(neo_user.properties['user_id'], self.user.id)
        self.assertEqual(
            neo_user.properties['name'], u'{} {}'.format(self.user.first_name,
                                                         self.user.last_name)
        )

    def test_add_to_friend(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        self.neo.add_to_friends(n1, n2)
        self.neo.add_to_friends(n2, n1)
        friends = self.neo.get_my_friends(self.user.id)
        self.assertEqual(friends.one['n.name'], n2.properties['name'])

    def test_check_friends(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        self.neo.add_to_friends(n1, n2)
        self.neo.add_to_friends(n2, n1)
        friends = self.neo.check_friendship(self.user.id, self.user1.id)
        self.assertEqual(friends.one['n.name'], n2.properties['name'])
