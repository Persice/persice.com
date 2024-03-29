import json

from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from py2neo import Node
from tastypie.test import ResourceTestCase

from accounts.tests.test_resources import JWTResourceTestCase
from friends.models import Friend
from friends.utils import NeoFourJ


class TestFriendResource(JWTResourceTestCase):
    def setUp(self):
        super(TestFriendResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(
            username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(
            username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(
            username='user_c', password='test')
        self.user3 = FacebookCustomUser.objects.create_user(
            username='user_d', password='test')
        self.user4 = FacebookCustomUser.objects.create_user(
            username='user_e', password='test')
        self.user5 = FacebookCustomUser.objects.create_user(
            username='user_f', password='test')
        self.user6 = FacebookCustomUser.objects.create_user(
            username='user_g', password='test')

    def test_get_list_unauthorized(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/friends/',
                                                        format='json'))

    def test_request_friend_request(self):
        post_data = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': 0,
        }
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        self.assertFalse(Friend.objects.checking_friendship(self.user.pk,
                                                            self.user1.pk))

    def test_request_friend_request_swap(self):
        post_data = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'status': 0,
        }
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        self.assertFalse(Friend.objects.checking_friendship(
            self.user.pk, self.user1.pk))

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
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data1,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data2,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        self.assertTrue(Friend.objects.checking_friendship(
            self.user.pk, self.user1.pk))

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
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data1,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data2,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        self.assertTrue(Friend.objects.checking_friendship(
            self.user.pk, self.user1.pk))
        self.assertTrue(Friend.objects.checking_friendship(
            self.user1.pk, self.user.pk))

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
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data1,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data2,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        self.assertFalse(Friend.objects.checking_friendship(
            self.user.pk, self.user1.pk))
        self.assertFalse(Friend.objects.checking_friendship(
            self.user1.pk, self.user.pk))

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
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data1,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data2,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        self.assertFalse(Friend.objects.checking_friendship(
            self.user.pk, self.user1.pk))
        self.assertFalse(Friend.objects.checking_friendship(
            self.user1.pk, self.user.pk))

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
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data1,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data2,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data3,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data4,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        self.assertTrue(Friend.objects.checking_friendship(
            self.user.pk, self.user1.pk))
        self.assertTrue(Friend.objects.checking_friendship(
            self.user1.pk, self.user.pk))
        self.assertTrue(Friend.objects.checking_friendship(
            self.user2.pk, self.user.pk))
        self.assertTrue(Friend.objects.checking_friendship(
            self.user.pk, self.user2.pk))


class TestFriendsNewResource(JWTResourceTestCase):
    def setUp(self):
        super(TestFriendsNewResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a',
                                                           password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b',
                                                            password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c',
                                                            password='test')

    def test_get_list_unauthorized(self):
        self.assertHttpUnauthorized(
            self.api_client.get('/api/v1/new_connections/counter/',
                                format='json'))

    def test_request_friend_request(self):
        Friend.objects.create(friend1=self.user,
                              friend2=self.user2, status=1)
        post_data = {
            'friend1': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'friend2': '/api/v1/auth/user/{0}/'.format(self.user1.pk),
            'status': 1,
        }

        resp = self.api_client.post(
            '/api/v1/friends/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        self.assertTrue(Friend.objects.checking_friendship(self.user.pk,
                                                           self.user1.pk))
        resp = self.api_client.get(
            '/api/v1/new_connections/counter/', format='json',
            authentication=self.get_credentials(),
        )
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
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c',
                                                            password='test',
                                                            first_name='Alena',
                                                            last_name='Winner')
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
        self.assertEqual(friends.one['node_name'], n2.properties['name'])

    def test_passes_friend(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        self.neo.pass_friend(n1, n2)
        friends = self.neo.get_my_passes(self.user.id)
        self.assertEqual(friends.one['node_name'], n2.properties['name'])

    def test_check_friends(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        self.neo.add_to_friends(n1, n2)
        self.neo.add_to_friends(n2, n1)
        friends = self.neo.check_friendship(self.user.id, self.user1.id)
        self.assertEqual(friends.one['n.name'], n2.properties['name'])

    def test_get_or_create(self):
        self.neo.create_person(self.neo.person(self.user))
        p, c = self.neo.get_or_create_node(self.user)
        self.assertFalse(c)
        self.assertEqual(p['user_id'], self.user.id)

    def test_get_my_friends_ids(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        n3 = self.neo.create_person(self.neo.person(self.user2))
        self.neo.add_to_friends(n1, n2)
        self.neo.add_to_friends(n2, n1)
        self.neo.add_to_friends(n2, n3)
        self.neo.add_to_friends(n3, n2)
        self.neo.add_to_friends(n1, n3)
        self.neo.add_to_friends(n3, n1)
        user_ids = self.neo.get_my_friends_ids(self.user.id)
        self.assertEqual(sorted(user_ids),
                         sorted([self.user1.id, self.user2.id]))

    def test_get_my_friends_icontains_name(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        n3 = self.neo.create_person(self.neo.person(self.user2))
        self.neo.add_to_friends(n1, n2)
        self.neo.add_to_friends(n2, n1)
        self.neo.add_to_friends(n2, n3)
        self.neo.add_to_friends(n3, n2)
        self.neo.add_to_friends(n1, n3)
        self.neo.add_to_friends(n3, n1)
        user_id = self.neo.get_my_friends_icontains_name(self.user.id, 'sne')
        self.assertIn(self.user1.id, user_id)
        user_id = self.neo.get_my_friends_icontains_name(self.user.id, 'ens')
        self.assertEqual(user_id, list())
        user_id = self.neo.get_my_friends_icontains_name(self.user.id, '')
        self.assertEqual(user_id, list())
        user_id = self.neo.get_my_friends_icontains_name(self.user.id, 'Alena')
        self.assertIn(self.user2.id, user_id)

    def test_remove_from_friends(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        self.neo.add_to_friends(n1, n2)
        self.neo.add_to_friends(n2, n1)
        self.neo.remove_from_friends(self.user.id, self.user1.id)
        ids = self.neo.get_my_friends_ids(self.user.id)
        self.assertEqual(ids, [])

    def test_check_friendsip(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        self.neo.add_to_friends(n1, n2)
        self.assertTrue(
            self.neo.check_friendship_rel(self.user.id, self.user1.id)
        )

    def test_check_friendship_negative(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        self.neo.add_to_friends(n2, n1)
        self.assertFalse(
            self.neo.check_friendship_rel(self.user.id, self.user1.id)
        )

    def test_get_new_friends(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        n3 = self.neo.create_person(self.neo.person(self.user2))
        self.neo.add_to_friends(n1, n2)
        self.neo.add_to_friends(n2, n1)
        self.neo.add_to_friends(n1, n3)
        self.neo.add_to_friends(n3, n1)
        self.neo.add_to_friends(n3, n2)
        self.neo.add_to_friends(n2, n3)
        count = self.neo.get_new_friends_count(n1['user_id'])
        self.assertEqual(count, 2)

    def test_update_rel_seen(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        self.neo.add_to_friends(n1, n2)
        self.neo.add_to_friends(n2, n1)
        self.assertEqual(self.neo.get_new_friends_count(n1['user_id']), 1)
        self.neo.update_rel_seen(n1['user_id'], n2['user_id'])
        self.assertEqual(self.neo.get_new_friends_count(n1['user_id']), 0)
        self.assertEqual(self.neo.get_new_friends_count(n2['user_id']), 1)

    def test_mutual_friends(self):
        n1 = self.neo.create_person(self.neo.person(self.user))
        n2 = self.neo.create_person(self.neo.person(self.user1))
        n3 = self.neo.create_person(self.neo.person(self.user2))
        self.neo.add_to_friends(n1, n2)
        self.neo.add_to_friends(n2, n1)
        self.neo.add_to_friends(n1, n3)
        self.neo.add_to_friends(n3, n1)
        self.neo.add_to_friends(n3, n2)
        self.neo.add_to_friends(n2, n3)
        mutual_friends = self.neo.get_mutual_friends(self.user.id,
                                                     self.user2.id)
        self.assertEqual(mutual_friends, [self.user1.id])


class NeoFriendsResourceTestCase(JWTResourceTestCase):
    def setUp(self):
        super(NeoFriendsResourceTestCase, self).setUp()
        self.neo = NeoFourJ()
        self.neo.graph.delete_all()
        self.user = FacebookCustomUser.objects.create_user(username='user_a',
                                                           password='test',
                                                           first_name='Andrii',
                                                           last_name='So')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b',
                                                            password='test',
                                                            first_name='Tata',
                                                            last_name='MCJ')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c',
                                                            password='test',
                                                            first_name='Ti',
                                                            last_name='Bao')
        self.n1 = self.neo.create_person(self.neo.person(self.user))
        self.n2 = self.neo.create_person(self.neo.person(self.user1))
        self.n3 = self.neo.create_person(self.neo.person(self.user2))
        self.neo.add_to_friends(self.n1, self.n2)
        self.neo.add_to_friends(self.n2, self.n1)

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(
            self.api_client.get('/api/v2/friends/',
                                format='json'))

    def test_get_my_friends(self):
        resp = self.api_client.get(
            '/api/v2/friends/', format='json',
            authentication=self.get_credentials()
        )
        deserialized_resp = self.deserialize(resp)
        self.assertEqual(
            deserialized_resp['objects'],
            [{u'resource_uri': u'/api/v2/friends/{}/'.format(self.n2._id),
              u'user_id': self.user1.id,
              u'id': self.n2._id,
              u'name': u'Tata MCJ'}]
        )

    def test_add_to_friends(self):
        self.data = {'user_id': self.user2.id}
        resp = self.api_client.post(
            '/api/v2/friends/', format='json', data=self.data,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        deserialized_resp = self.deserialize(resp)
        self.assertEqual(deserialized_resp['user_id'], self.user2.id)

    def test_pass_friend(self):
        self.data = {'user_id': self.user2.id, 'action': 'pass'}
        resp = self.api_client.post(
            '/api/v2/friends/', format='json', data=self.data,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        deserialized_resp = self.deserialize(resp)
        self.assertEqual(deserialized_resp['user_id'], self.user2.id)

    def test_remove_from_friends(self):
        resp = self.api_client.delete(
            '/api/v2/friends/', format='json',
            authentication=self.get_credentials(),
            data=json.dumps({'user_id': self.user1.id})
        )
        self.assertHttpAccepted(resp)
        self.assertEqual(self.neo.get_my_friends_ids(self.user.id), [])

    def test_disconnect_friend(self):
        self.data = {'user_id': self.user1.id, 'action': 'disconnect'}
        resp = self.api_client.post(
            '/api/v2/friends/', format='json',
            authentication=self.get_credentials(),
            data=self.data
        )
        self.assertHttpCreated(resp)
        deserialized_resp = self.deserialize(resp)
        self.assertEqual(deserialized_resp['user_id'], self.user1.id)
        self.assertFalse(self.neo.check_friendship_rel(self.user.id,
                                                       self.user1.id))
