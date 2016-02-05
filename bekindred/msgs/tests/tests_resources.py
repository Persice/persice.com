from datetime import timedelta
from django.utils.timezone import now
from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase
from events.models import Event, Membership
from friends.models import Friend
from msgs.models import ChatMessage
from postman.api import pm_write
from postman.models import Message


class TestMessagesResource(ResourceTestCase):
    def setUp(self):
        super(TestMessagesResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        for x in range(10):
            pm_write(self.user, self.user1, 'test %s' % x)
        for x in range(10):
            pm_write(self.user1, self.user2, 'test %s' % x)
        for x in range(10):
            pm_write(self.user, self.user2, 'test %s' % x)

        self.detail_url = '/api/v1/messages/'
        self.body = 'new test body'
        self.post_data = {
            'sender': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'recipient': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'body': '{0}'.format(self.body),
            }

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get(self.detail_url, format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get(self.detail_url, format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 20)

    def test_post_list(self):
        self.response = self.login()
        self.assertHttpCreated(self.api_client.post('/api/v1/messages/', format='json',
                                                    data=self.post_data))
        # Verify a new one has been added.
        self.assertEqual(Message.objects.count(), 31)


class TestInboxResource(ResourceTestCase):
    def setUp(self):
        super(TestInboxResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')

        for x in range(10):
            pm_write(self.user, self.user1, 'test %s' % x)
        for x in range(10):
            pm_write(self.user1, self.user2, 'test %s' % x)
        for x in range(10):
            pm_write(self.user, self.user2, 'test %s' % x)

        self.post_data = {
            'sender': '/api/v1/auth/user/{0}/'.format(self.user.pk)
            }

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list(self):
        self.response = self.login()
        self.api_client.get('/api/v1/inbox/?sender_id=1', format='json')
        self.assertEqual(Message.objects.inbox_unread_count(self.user), 0)


class TestInboxLastResource(ResourceTestCase):
    def get_credentials(self):
        pass

    def setUp(self):
        super(TestInboxLastResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(
            username='user_a', password='test', facebook_id=12345)
        self.user1 = FacebookCustomUser.objects.create_user(
            username='user_b', password='test', facebook_id=12346)
        self.user2 = FacebookCustomUser.objects.create_user(
            username='user_c', password='test', facebook_id=12347)
        Friend.objects.create(friend1=self.user, friend2=self.user1, status=1)
        for x in range(10):
            pm_write(self.user1, self.user, 'test %s' % x)
        for x in range(10):
            pm_write(self.user2, self.user, 'test %s' % x)

        self.resource_url = '/api/v1/inbox/last/'

    def login(self):
        return self.api_client.client.post(
            '/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get(self.resource_url, format='json'))

    def test_get_list(self):
        self.response = self.login()
        resp = self.api_client.get(self.resource_url, format='json')
        expected_last_message = {
            'facebook_id': u'12346',
            'first_name': u'',
            'friend_id': u'2',
            'id': u'1',
            'image': None,
            'last_message_body': u'',
            'last_name': u'',
            'read_at': None,
            'recipient_id': u'/api/v1/auth/user/1/',
            'resource_uri': u'/api/v1/inbox/last/1/',
            'sender_id': u'/api/v1/auth/user/2/',
            'unread_counter': 10
        }
        actual_response = self.deserialize(resp)['objects'][0]
        # Remove sent_at
        del actual_response['sent_at']
        self.assertEqual(actual_response, expected_last_message)


class TestUnreadMessageCounter(ResourceTestCase):
    def get_credentials(self):
        pass

    def setUp(self):
        super(TestUnreadMessageCounter, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(
            username='user_a', password='test', facebook_id=12345)
        self.user1 = FacebookCustomUser.objects.create_user(
            username='user_b', password='test', facebook_id=12346)
        self.user2 = FacebookCustomUser.objects.create_user(
            username='user_c', password='test', facebook_id=12347)
        Friend.objects.create(friend1=self.user, friend2=self.user1, status=1)
        for x in range(10):
            pm_write(self.user1, self.user, 'test %s' % x)
        for x in range(10):
            pm_write(self.user2, self.user, 'test %s' % x)

        self.resource_url = '/api/v1/inbox/unread_counter/'

    def login(self):
        return self.api_client.client.post(
            '/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get(self.resource_url, format='json'))

    def test_get_list(self):
        self.response = self.login()
        resp = self.api_client.get(self.resource_url, format='json')
        actual_response = self.deserialize(resp)
        self.assertEqual(actual_response['objects'][0]['unread_counter'], 20)


class TestChatMessageResource(ResourceTestCase):
    def get_credentials(self):
        pass

    def setUp(self):
        super(TestChatMessageResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.user3 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        self.resource_url = '/api/v1/chat/'

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get(self.resource_url, format='json'))

    def test_get_list(self):
        self.response = self.login()
        resp = self.api_client.get(self.resource_url, format='json')
        self.assertEqual(self.deserialize(resp)['objects'], [])

    def test_post_message(self):
        self.response = self.login()
        event1 = Event.objects.create(name="Play piano1", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        Membership.objects.create(user=self.user, event=event1, is_organizer=True)
        Membership.objects.create(user=self.user1, event=event1, rsvp='yes')
        Membership.objects.create(user=self.user2, event=event1, rsvp='yes')
        ChatMessage.objects.create(sender=self.user3, body='test', event=event1)
        post_data = {
            'body': "new",
            'event': "/api/v1/event/{}/".format(event1.id),
            'sender': "/api/v1/auth/user/{}/".format(self.user.id)
        }
        resp = self.api_client.post(self.resource_url, format='json', data=post_data)
