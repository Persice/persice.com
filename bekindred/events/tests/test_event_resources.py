from datetime import timedelta, date
import json
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command

from django_facebook.models import FacebookCustomUser
from guardian.shortcuts import assign_perm
from haystack.management.commands import update_index
from tastypie.test import ResourceTestCase
from django.utils.timezone import now

from accounts.tests.test_resources import JWTResourceTestCase
from events.models import Event, Membership, EventFilterState
from friends.models import Friend
from friends.utils import NeoFourJ
from goals.models import Subject, Goal, Offer, MatchFilterState
from match_engine.tests.test_models import BaseTestCase
from world.models import UserLocation


class TestEventResource(JWTResourceTestCase):
    def setUp(self):
        super(TestEventResource, self).setUp()
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', password='test',
                        first_name='Andrii', last_name='Soldatenko')
        UserLocation.objects.create(user=self.user,
                                    position=[-87.627696, 41.880745])
        self.event = Event.objects.\
            create(starts_on='2055-06-13T05:15:22.792659',
                   ends_on='2055-06-14T05:15:22.792659',
                   name="Play piano", location=[7000, 22965.83])
        self.membership = Membership.objects.\
            create(user=self.user, event=self.event,
                   is_organizer=True, rsvp='yes')
        assign_perm('view_event', self.user, self.event)
        self.detail_url = '/api/v1/event/{0}/'.format(self.event.pk)
        self.post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'events': '/api/v1/event/{0}/'.format(self.event.pk),
        }
        self.neo = NeoFourJ()
        self.neo.graph.delete_all()

    def test_get_list_unauthorized(self):
        self.assertHttpUnauthorized(self.api_client.get(
            '/api/v1/event/', format='json'
        ))

    def test_get_list_json(self):
        resp = self.api_client.get(
            '/api/v1/event/{}/'.format(self.event.id), format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)

        self.maxDiff = None
        json = self.deserialize(resp)
        self.assertEqual(json['hosted_by'], 'Andrii Soldatenko')
        self.assertEqual(json['name'], 'Play piano')
        self.assertEqual(json['location'], u'7000,22965.83')
        self.assertEqual(json['total_attendees'], 1)

    def test_hosted_by(self):
        resp = self.api_client.get(
            '/api/v1/event/', format='json',
            authentication=self.get_credentials()
        )
        self.assertEqual(self.deserialize(resp)['objects'][0]['hosted_by'],
                         'Andrii Soldatenko')

    def test_cumulative_match_score(self):
        user1 = FacebookCustomUser.objects.create_user(
            username='user_b', password='test')
        user2 = FacebookCustomUser.objects.create_user(
            username='user_c', password='test')
        UserLocation.objects.create(user=user1,
                                    position=[-87.627696, 41.880745])
        UserLocation.objects.create(user=user2,
                                    position=[-87.627696, 41.880745])
        self.subject = Subject.objects.create(description='Python')
        self.subject2 = Subject.objects.create(description='Ruby')
        self.subject3 = Subject.objects.create(description='Erlang')

        Goal.objects.create(user=self.user, goal=self.subject)
        Offer.objects.create(user=self.user, offer=self.subject2)
        Goal.objects.create(user=user1, goal=self.subject2)
        Offer.objects.create(user=user1, offer=self.subject)
        Goal.objects.create(user=user2, goal=self.subject2)

        Friend.objects.create(friend1=user1, friend2=self.user, status=1)
        Friend.objects.create(friend1=user2, friend2=self.user, status=1)
        event = Event.objects.create(
            starts_on='2055-06-13T05:15:22.792659',
            ends_on='2055-06-14T05:15:22.792659',
            name="Play piano", location=[7000, 22965.83])
        Membership.objects.create(
            user=self.user, event=event, is_organizer=True)
        Membership.objects.create(user=user1, event=event, rsvp='yes')
        Membership.objects.create(user=user2, event=event, rsvp='yes')
        detail_url = '/api/v1/event/{0}/'.format(event.pk)
        assign_perm('view_event', self.user, event)
        resp = self.api_client.get(
            detail_url, format='json',
            authentication=self.get_credentials()
        )
        # TODO: because of need read test celery tasks
        self.assertEqual(self.deserialize(resp)['cumulative_match_score'], 0)

    def test_create_simple_event(self):
        post_data = {
            'description': 'Test description',
            'ends_on': str(now() + timedelta(days=2)),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': str(now() + timedelta(days=1))
        }
        self.assertHttpCreated(self.api_client.post(
            '/api/v1/event/', format='json', data=post_data,
            authentication=self.get_credentials()
        ))

    def test_create_public_event(self):
        post_data = {
            'description': 'Test description',
            'ends_on': str(now() + timedelta(days=2)),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'access_level': 'public',
            'starts_on': str(now() + timedelta(days=1))
        }
        self.assertHttpCreated(self.api_client.post(
            '/api/v1/event/', format='json', data=post_data,
            authentication=self.get_credentials()
        ))

    def test_update_simple_event(self):
        user1 = FacebookCustomUser.objects.create_user(
            username='user_b_new', password='test')
        user2 = FacebookCustomUser.objects.create_user(
            username='user_c_new', password='test')
        Membership.objects.create(user=user1, event=self.event, rsvp='yes')
        Membership.objects.create(user=user2, event=self.event, rsvp='yes')
        self.assertEqual(Event.objects.filter(
            membership__user=self.user, name='Play piano')[0].name, 'Play piano')
        original_data = self.deserialize(self.api_client.get(
            self.detail_url, format='json',
            authentication=self.get_credentials()
        ))
        new_data = original_data.copy()
        new_data['name'] = 'learn erlang'

        self.api_client.put(
            self.detail_url, format='json', data=new_data,
            authentication=self.get_credentials()
        )
        self.assertEqual(
            Event.objects.filter(
                membership__user=self.user, name='learn erlang')[0].name,
            'learn erlang'
        )

    def test_update_public_event_to_private(self):
        user1 = FacebookCustomUser.objects.create_user(username='user_b_new',
                                                       password='test')
        post_data = {
            'description': 'Test description',
            'ends_on': str(now() + timedelta(days=2)),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'access_level': 'public',
            'starts_on': str(now() + timedelta(days=1))
        }
        resp = self.api_client.post(
            '/api/v1/event/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        original_event = self.deserialize(resp)
        detail_url = '/api/v1/event/{}/'.format(original_event['id'])

        new_data = original_event.copy()
        new_data['access_level'] = 'private'
        self.api_client.put(
            self.detail_url, format='json', data=new_data,
            authentication=self.get_credentials()
        )
        e = Event.objects.get(pk=int(original_event['id']))
        self.assertEqual(user1.has_perm('view_event', e), False)

    def test_update_private_event_to_public(self):
        user1 = FacebookCustomUser.objects.create_user(username='user_b_new',
                                                       password='test')
        post_data = {
            'description': 'Test description',
            'ends_on': str(now() + timedelta(days=2)),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'access_level': 'private',
            'starts_on': str(now() + timedelta(days=1))
        }
        resp = self.api_client.post(
            '/api/v1/event/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        original_event = self.deserialize(resp)
        detail_url = '/api/v1/event/{}/'.format(original_event['id'])

        new_data = original_event.copy()
        new_data['access_level'] = 'public'
        self.api_client.put(
            self.detail_url, format='json', data=new_data,
            authentication=self.get_credentials()
        )
        e = Event.objects.get(pk=int(original_event['id']))
        self.assertEqual(user1.has_perm('view_event', e), True)

    def test_total_number_of_event_attendees(self):
        user1 = FacebookCustomUser.objects.create_user(
            username='user_b_new', password='test')
        user2 = FacebookCustomUser.objects.create_user(
            username='user_c_new', password='test')
        user3 = FacebookCustomUser.objects.create_user(
            username='user_d_new', password='test')
        user4 = FacebookCustomUser.objects.create_user(
            username='user_e_new', password='test')

        Membership.objects.create(user=user1, event=self.event, rsvp='yes')
        Membership.objects.create(user=user2, event=self.event, rsvp='no')
        Membership.objects.create(user=user3, event=self.event, rsvp='maybe')
        Membership.objects.create(user=user4, event=self.event, rsvp=None)

        resp = self.api_client.get(
            '/api/v1/event/{}/'.format(self.event.id), format='json',
            authentication=self.get_credentials()
        )
        json = self.deserialize(resp)
        self.assertEqual(json['total_attendees'], 2)

    def test_update_if_ends_on_in_past(self):
        event = Event.objects.create(
            starts_on=now() - timedelta(days=10),
            ends_on=now() - timedelta(days=9),
            name="Play piano", location=[7000, 22965.83])
        Membership.objects.create(
            user=self.user, event=event, is_organizer=True)

        detail_url = '/api/v1/event/{0}/'.format(event.pk)
        assign_perm('view_event', self.user, event)
        original_data = self.deserialize(self.api_client.get(
            detail_url, format='json',
            authentication=self.get_credentials()
        ))
        new_data = original_data.copy()
        new_data['name'] = 'learn erlang'
        new_data['ends_on'] = now() + timedelta(days=2)
        new_data['starts_on'] = now() + timedelta(days=1)

        resp = self.api_client.patch(
            detail_url, format='json', data=new_data,
            authentication=self.get_credentials()
        )
        self.assertEqual(
            self.deserialize(resp),
            {u'error': u'Users cannot edit events which have an end '
                       u'date that occurred in the past.'})

    def test_create_event_which_ends_in_the_past(self):
        post_data = {
            'description': 'Test description',
            'ends_on': now() - timedelta(days=7),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': now() - timedelta(days=9)
        }
        resp = self.api_client.post(
            '/api/v1/event/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertEqual(
            self.deserialize(resp),
            {u'event': {u'error': ['The event end date and time '
                                   'must occur in the future.']}})

    def test_create_event_which_starts_eq_ends(self):
        post_data = {
            'description': 'Test description',
            'ends_on': now() + timedelta(days=1),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': now() + timedelta(days=1)
        }
        resp = self.api_client.post(
            '/api/v1/event/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertEqual(self.deserialize(resp),
                         {u'event': {u'error': [u'The event end date and time '
                                                u'must occur after the start '
                                                u'date and time.']}})

    def test_delete_simple_event(self):
        self.assertEqual(Event.objects.count(), 1)
        self.assertHttpAccepted(self.api_client.delete(
            self.detail_url, format='json',
            authentication=self.get_credentials()
        ))
        self.assertEqual(Event.objects.count(), 0)

    def test_delete_event(self):
        event = Event.objects.create(
            starts_on='2055-06-13T05:15:22.792659',
            ends_on='2055-06-14T05:15:22.792659',
            name="Play piano", location=[7000, 22965.83])
        Membership.objects.create(user=self.user, event=event,
                                  is_organizer=True, rsvp='yes')

        detail_url = '/api/v1/event/{0}/'.format(event.pk)
        self.assertEqual(Event.objects.count(), 2)
        assign_perm('view_event', self.user, event)
        self.assertHttpAccepted(self.api_client.delete(
            detail_url, format='json',
            authentication=self.get_credentials()
        ))
        self.assertEqual(Event.objects.count(), 1)

    def test_friend_attendees_count(self):
        user1 = FacebookCustomUser.objects.create_user(
            username='user_b', password='test')
        user2 = FacebookCustomUser.objects.create_user(
            username='user_c', password='test')
        self.neo.create_friendship(user1, self.user)
        self.neo.create_friendship(self.user, user2)
        event = Event.objects.create(
            starts_on='2055-06-13T05:15:22.792659',
            ends_on='2055-06-14T05:15:22.792659',
            name="Play piano", location=[7000, 22965.83])
        Membership.objects.create(
            user=self.user, event=event, is_organizer=True)
        Membership.objects.create(user=user1, event=event, rsvp='yes')
        Membership.objects.create(user=user2, event=event, rsvp='yes')
        detail_url = '/api/v1/event/{0}/'.format(event.pk)
        assign_perm('view_event', self.user, event)
        resp = self.api_client.get(
            detail_url, format='json', authentication=self.get_credentials()
        )
        self.assertEqual(self.deserialize(resp)['friend_attendees_count'], 2)

    def test_post_event_photo(self):
        new_file = SimpleUploadedFile('new_file.txt',
                                      'Hello world!')

        post_data = {'description': 'Test description',
                     'ends_on': '2055-06-15T05:15:22.792659',
                     'location': u'7000,22965.83',
                     'name': u'Play piano',
                     'repeat': u'W',
                     'starts_on': '2055-06-13T05:15:22.792659',
                     'event_photo': new_file}

        resp = self.api_client.client.post(
            '/api/v1/event/', data=post_data,
            authentication=self.get_credentials()
        )

        self.assertNotEqual(self.deserialize(resp)['event_photo'], '')

    def test_get_private_event(self):
        event = Event.objects.create(name="Public Event",
                                     location=[7000, 22965.83],
                                     access_level='public',
                                     starts_on=now(),
                                     ends_on=now() + timedelta(days=10))
        Membership.objects.create(user=self.user, event=event)
        assign_perm('view_event', self.user, event)

        resp = self.api_client.get(
            '/api/v1/event/{}/'.format(event.id), format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)

        json = self.deserialize(resp)
        self.assertEqual(json['name'], 'Public Event')

    def test_post_private_event_with_access_user_list(self):
        user = FacebookCustomUser.objects. \
            create_user(username='user_mary', password='test',
                        first_name='Mary', last_name='Mal')

        user2 = FacebookCustomUser.objects. \
            create_user(username='user_mary_kay', password='test',
                        first_name='Mary Kay', last_name='Peterson')
        post_data = {
            'description': 'Test description',
            'ends_on': str(now() + timedelta(days=2)),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'access_level': 'private',
            'access_user_list': ','.join(map(str, [user.id, user2.id])),
            'repeat': u'W',
            'starts_on': str(now() + timedelta(days=1))
        }
        resp = self.api_client.post(
            '/api/v1/event/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        event = self.deserialize(resp)
        e = Event.objects.get(pk=int(event['id']))
        self.assertEqual(user.has_perm('view_event', e), True)
        self.assertEqual(user2.has_perm('view_event', e), True)

    def test_post_public_event(self):
        user = FacebookCustomUser.objects. \
            create_user(username='user_mary', password='test',
                        first_name='Mary', last_name='Mal')
        UserLocation.objects.create(user=user,
                                    position=[-87.627696, 41.880745])
        post_data = {
            'description': 'Test description',
            'ends_on': str(now() + timedelta(days=2)),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'access_level': 'public',
            'access_user_list': str(user.id),
            'repeat': u'W',
            'starts_on': str(now() + timedelta(days=1))
        }
        resp = self.api_client.post(
            '/api/v1/event/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertHttpCreated(resp)
        event = self.deserialize(resp)

        resp = self.api_client.get(
            '/api/v1/event/{}/'.format(event['id']), format='json',
            authentication=self.get_credentials(user=user)
        )
        self.assertEqual(self.deserialize(resp)['access_user_list'],
                         str(user.id))


class TestAttendeesResource(BaseTestCase, JWTResourceTestCase):
    def setUp(self):
        super(TestAttendeesResource, self).setUp()
        self.user = FacebookCustomUser.objects. \
            create_user(username='user_a', password='test', facebook_id=123,
                        first_name='Andrii', last_name='Soldatenko')
        self.user1 = FacebookCustomUser.objects. \
            create_user(username='user_b', password='test', facebook_id=124,
                        first_name='First Name', last_name='Last Name')
        self.user2 = FacebookCustomUser.objects. \
            create_user(username='user_c', password='test', facebook_id=125,
                        first_name='Lara', last_name='Croft')
        self.event = Event.objects. \
            create(starts_on='2055-06-13T05:15:22.792659',
                   ends_on='2055-06-14T05:15:22.792659',
                   name="Play piano", location=[7000, 22965.83])
        self.membership = Membership.objects. \
            create(user=self.user, event=self.event,
                   is_organizer=True, rsvp='yes')
        self.membership1 = Membership.objects. \
            create(user=self.user1, event=self.event, rsvp='yes')
        self.membership2 = Membership.objects. \
            create(user=self.user2, event=self.event, rsvp='yes')
        assign_perm('view_event', self.user, self.event)
        assign_perm('view_event', self.user1, self.event)
        self.detail_url = '/api/v1/event/{0}/'.format(self.event.pk)
        self.post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'events': '/api/v1/event/{0}/'.format(self.event.pk),
        }
        self.neo = NeoFourJ()
        self.neo.graph.delete_all()

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(
            self.api_client.get('/api/v1/event/', format='json'))

    def get_event_attendees(self):
        subject = Subject.objects.create(description='python')
        Goal.objects.create(user=self.user, goal=subject)
        Goal.objects.create(user=self.user1, goal=subject)
        update_index.Command().handle(interactive=False)
        resp = self.api_client.get(
            '/api/v2/attendees/', format='json',
            data={'rsvp': 'yes', 'event_id': self.event.id},
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)
        data = self.deserialize(resp)
        self.assertEqual(len(data), 2)
        self.assertEqual(data['objects'][0]['top_interests'], [{u'python': 1}])
        self.assertEqual(data['objects'][0]['connected'], False)
        self.assertEqual(data['objects'][1]['connected'], False)
