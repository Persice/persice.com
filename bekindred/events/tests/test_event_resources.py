from datetime import timedelta, date
import json
from django.core.files.uploadedfile import SimpleUploadedFile


from django_facebook.models import FacebookCustomUser
from guardian.shortcuts import assign_perm
from tastypie.test import ResourceTestCase
from django.utils.timezone import now

from events.models import Event, Membership, EventFilterState
from friends.models import Friend
from goals.models import Subject, Goal, Offer, MatchFilterState
from world.models import UserLocation


class TestEventResource(ResourceTestCase):
    def setUp(self):
        super(TestEventResource, self).setUp()
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', password='test',
                        first_name='Andrii', last_name='Soldatenko')
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

    def get_credentials(self):
        pass

    def login(self, username='user_a', password='test'):
        return self.api_client.client.post('/login/', {'username': username,
                                                       'password': password})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/event/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/event/{}/'.format(self.event.id), format='json')
        self.assertValidJSONResponse(resp)

        self.maxDiff = None
        json = self.deserialize(resp)
        self.assertEqual(json['hosted_by'], 'Andrii Soldatenko')
        self.assertEqual(json['name'], 'Play piano')
        self.assertEqual(json['location'], u'7000,22965.83')
        self.assertEqual(json['total_attendees'], 1)

    def test_hosted_by(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/event/', format='json')
        self.assertEqual(self.deserialize(resp)['objects'][0]['hosted_by'], 'Andrii Soldatenko')

    def test_cumulative_match_score(self):
        self.response = self.login()
        user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')

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
        event = Event.objects.create(starts_on='2055-06-13T05:15:22.792659', ends_on='2055-06-14T05:15:22.792659',
                                     name="Play piano", location=[7000, 22965.83])
        Membership.objects.create(user=self.user, event=event, is_organizer=True)
        Membership.objects.create(user=user1, event=event, rsvp='yes')
        Membership.objects.create(user=user2, event=event, rsvp='yes')
        detail_url = '/api/v1/event/{0}/'.format(event.pk)
        assign_perm('view_event', self.user, event)
        resp = self.api_client.get(detail_url, format='json')
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
        self.response = self.login()
        self.assertHttpCreated(self.api_client.post('/api/v1/event/',
                                                    format='json',
                                                    data=post_data))

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
        self.response = self.login()
        self.assertHttpCreated(self.api_client.post('/api/v1/event/',
                                                    format='json',
                                                    data=post_data))

    def test_update_simple_event(self):
        self.response = self.login()
        user1 = FacebookCustomUser.objects.create_user(username='user_b_new', password='test')
        user2 = FacebookCustomUser.objects.create_user(username='user_c_new', password='test')
        Membership.objects.create(user=user1, event=self.event, rsvp='yes')
        Membership.objects.create(user=user2, event=self.event, rsvp='yes')
        self.assertEqual(Event.objects.filter(membership__user=self.user, name='Play piano')[0].name, 'Play piano')
        original_data = self.deserialize(self.api_client.get(self.detail_url, format='json'))
        new_data = original_data.copy()
        new_data['name'] = 'learn erlang'

        self.api_client.put(self.detail_url, format='json', data=new_data)
        self.assertEqual(Event.objects.filter(membership__user=self.user, name='learn erlang')[0].name, 'learn erlang')

    def test_total_number_of_event_attendees(self):
        self.response = self.login()
        user1 = FacebookCustomUser.objects.create_user(username='user_b_new', password='test')
        user2 = FacebookCustomUser.objects.create_user(username='user_c_new', password='test')
        user3 = FacebookCustomUser.objects.create_user(username='user_d_new', password='test')
        user4 = FacebookCustomUser.objects.create_user(username='user_e_new', password='test')

        Membership.objects.create(user=user1, event=self.event, rsvp='yes')
        Membership.objects.create(user=user2, event=self.event, rsvp='no')
        Membership.objects.create(user=user3, event=self.event, rsvp='maybe')
        Membership.objects.create(user=user4, event=self.event, rsvp=None)

        resp = self.api_client.get('/api/v1/event/{}/'.format(self.event.id), format='json')
        json = self.deserialize(resp)
        self.assertEqual(json['total_attendees'], 2)

    def test_update_if_ends_on_in_past(self):
        self.response = self.login()

        event = Event.objects.create(starts_on=now() - timedelta(days=10), ends_on=now() - timedelta(days=9),
                                     name="Play piano", location=[7000, 22965.83])
        Membership.objects.create(user=self.user, event=event, is_organizer=True)

        detail_url = '/api/v1/event/{0}/'.format(event.pk)
        assign_perm('view_event', self.user, event)
        original_data = self.deserialize(self.api_client.get(detail_url, format='json'))
        new_data = original_data.copy()
        new_data['name'] = 'learn erlang'
        new_data['ends_on'] = now() + timedelta(days=2)
        new_data['starts_on'] = now() + timedelta(days=1)

        resp = self.api_client.patch(detail_url, format='json', data=new_data)
        self.assertEqual(self.deserialize(resp),
                         {u'error': u'Users cannot edit events which have an end date that occurred in the past.'})

    def test_create_event_which_ends_in_the_past(self):
        post_data = {
            'description': 'Test description',
            'ends_on': now() - timedelta(days=7),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': now() - timedelta(days=9)
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/event/', format='json', data=post_data)
        self.assertEqual(self.deserialize(resp),
                         {u'event': {u'error': ['The event end date and time must occur in the future.']}})

    def test_create_event_which_starts_eq_ends(self):
        post_data = {
            'description': 'Test description',
            'ends_on': now() + timedelta(days=1),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'repeat': u'W',
            'starts_on': now() + timedelta(days=1)
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/event/', format='json', data=post_data)
        self.assertEqual(self.deserialize(resp),
                         {u'event': {u'error': [u'The event end date and time '
                                                u'must occur after the start date and time.']}})

    def test_delete_simple_event(self):
        self.response = self.login()
        self.assertEqual(Event.objects.count(), 1)
        self.assertHttpAccepted(self.api_client.delete(self.detail_url, format='json'))
        self.assertEqual(Event.objects.count(), 0)

    def test_delete_event(self):
        self.response = self.login()
        event = Event.objects.create(starts_on='2055-06-13T05:15:22.792659',
                                     ends_on='2055-06-14T05:15:22.792659',
                                     name="Play piano", location=[7000, 22965.83])
        Membership.objects.create(user=self.user, event=event,
                                  is_organizer=True, rsvp='yes')

        detail_url = '/api/v1/event/{0}/'.format(event.pk)
        self.assertEqual(Event.objects.count(), 2)
        assign_perm('view_event', self.user, event)
        self.assertHttpAccepted(self.api_client.delete(detail_url,
                                                       format='json'))
        self.assertEqual(Event.objects.count(), 1)

    def test_friend_attendees_count(self):
        self.response = self.login()
        user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        Friend.objects.create(friend1=user1, friend2=self.user, status=1)
        Friend.objects.create(friend1=user2, friend2=self.user, status=1)
        event = Event.objects.create(starts_on='2055-06-13T05:15:22.792659', ends_on='2055-06-14T05:15:22.792659',
                                     name="Play piano", location=[7000, 22965.83])
        Membership.objects.create(user=self.user, event=event, is_organizer=True)
        Membership.objects.create(user=user1, event=event, rsvp='yes')
        Membership.objects.create(user=user2, event=event, rsvp='yes')
        detail_url = '/api/v1/event/{0}/'.format(event.pk)
        assign_perm('view_event', self.user, event)
        resp = self.api_client.get(detail_url, format='json')
        self.assertEqual(self.deserialize(resp)['friend_attendees_count'], 2)

    def test_post_event_photo(self):
        self.response = self.login()
        new_file = SimpleUploadedFile('new_file.txt',
                                      'Hello world!')

        post_data = {'description': 'Test description',
                     'ends_on': '2055-06-15T05:15:22.792659',
                     'location': u'7000,22965.83',
                     'name': u'Play piano',
                     'repeat': u'W',
                     'starts_on': '2055-06-13T05:15:22.792659',
                     'event_photo': new_file}

        self.response = self.login()
        resp = self.api_client.client.post('/api/v1/event/', data=post_data)

        self.assertNotEqual(self.deserialize(resp)['event_photo'], '')

    def test_get_private_event(self):
        self.response = self.login()
        event = Event.objects.create(name="Public Event",
                                     location=[7000, 22965.83],
                                     access_level='public',
                                     starts_on=now(),
                                     ends_on=now() + timedelta(days=10))
        Membership.objects.create(user=self.user, event=event)
        assign_perm('view_event', self.user, event)

        resp = self.api_client.get('/api/v1/event/{}/'.format(event.id),
                                   format='json')
        self.assertValidJSONResponse(resp)

        json = self.deserialize(resp)
        self.assertEqual(json['name'], 'Public Event')

    def test_post_private_event(self):
        user = FacebookCustomUser.objects. \
            create_user(username='user_mary', password='test',
                        first_name='Mary', last_name='Mal')
        post_data = {
            'description': 'Test description',
            'ends_on': str(now() + timedelta(days=2)),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'access_level': 'private',
            'access_user_list': str(user.id),
            'repeat': u'W',
            'starts_on': str(now() + timedelta(days=1))
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/event/',
                                    format='json',
                                    data=post_data)
        self.assertHttpCreated(resp)
        json = self.deserialize(resp)
        self.assertEqual(json['access_user_list'], str(user.id))

    def test_post_public_event(self):
        user = FacebookCustomUser.objects. \
            create_user(username='user_mary', password='test',
                        first_name='Mary', last_name='Mal')
        post_data = {
            'description': 'Test description',
            'ends_on': str(now() + timedelta(days=2)),
            'location': u'7000,22965.83',
            'name': u'Play piano',
            'access_level': 'public',
            'repeat': u'W',
            'starts_on': str(now() + timedelta(days=1))
        }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/event/',
                                    format='json',
                                    data=post_data)
        self.assertHttpCreated(resp)
        event = self.deserialize(resp)

        self.response1 = self.login(username='user_mary', password='test')
        resp = self.api_client.get('/api/v1/event/{}/'.format(event['id']),
                                   format='json')
        self.assertEqual(json['access_user_list'], str(user.id))


class TestAllEventFeedResource(ResourceTestCase):
    def setUp(self):
        super(TestAllEventFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83],
                                          starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event1 = Event.objects.create(name="Play piano1", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event2 = Event.objects.create(name="Play piano2", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event3 = Event.objects.create(name="Play piano2", location=[7000, 22965.83],
                                           starts_on=now() - timedelta(days=11), ends_on=now() - timedelta(days=10))
        Membership.objects.create(user=self.user, event=self.event)
        Membership.objects.create(user=self.user, event=self.event1)
        Membership.objects.create(user=self.user, event=self.event2)

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/feed/events/all/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 3)

    def test_filter_past_event(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/feed/events/all/', format='json')
        res = self.deserialize(resp)
        self.assertEqual(res['meta']['total_count'], 3)


class TestMyEventFeedResource(ResourceTestCase):
    def setUp(self):
        super(TestMyEventFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')

        self.user_location = UserLocation.objects.create(user=self.user, position=[50.0359, 0.054253])
        UserLocation.objects.create(user=self.user1, position=[-87.627675, 41.881925])
        UserLocation.objects.create(user=self.user2, position=[-87.6281729688, 41.881849562])

        self.event = Event.objects.create(name="Play piano", location=[58.38, 0.0304],
                                          starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event1 = Event.objects.create(name="Play piano1", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event2 = Event.objects.create(name="Play piano2", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        Membership.objects.create(user=self.user, event=self.event, rsvp='yes', is_organizer=True)
        Membership.objects.create(user=self.user, event=self.event1, rsvp='yes')
        Membership.objects.create(user=self.user, event=self.event2, rsvp='maybe')

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/feed/events/my/', format='json')
        self.assertValidJSONResponse(resp)
        # Scope out the data for correctness.
        res = sorted(self.deserialize(resp)['objects'], key=lambda x: x['name'])
        self.assertEqual(res[0]['name'], self.event.name)

    def test_only_display_events_that_end_in_the_future(self):
        self.response = self.login()

        event1 = Event.objects.create(name="Ruby", location=[7000, 22965.83],
                                      starts_on=now() - timedelta(days=9), ends_on=now() - timedelta(days=7))
        event2 = Event.objects.create(name="Python", location=[7000, 22965.83],
                                      starts_on=now() + timedelta(days=7), ends_on=now() + timedelta(days=8))
        Membership.objects.create(user=self.user, event=event1, rsvp='yes')
        Membership.objects.create(user=self.user, event=event2, rsvp='yes')
        resp = self.api_client.get('/api/v1/feed/events/my/', format='json')
        res = self.deserialize(resp)['objects']
        self.assertEqual(len(res), 4)

    def test_event_is_not_show_if_rsvp_no(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/feed/events/my/', format='json')
        self.assertValidJSONResponse(resp)
        # Scope out the data for correctness.
        json_ = self.deserialize(resp)
        self.assertEqual(json_['meta']['total_count'], 3)

    def test_my_feed_event_filter_by_distance(self):
        self.response = self.login()
        # TODO: What's unit for distance?
        # maybe miles
        efs = EventFilterState.objects.create(user=self.user, distance=928)
        MatchFilterState.objects.create(user=self.user, distance_unit='km')
        resp = self.api_client.get('/api/v1/feed/events/my/', format='json',
                                   data={'filter': 'true'})
        data = self.deserialize(resp)
        self.assertEqual(data['objects'][0]['distance'], ['927', u'km'])

    def test_my_feed_event_without_filter_by_distance(self):
        self.response = self.login()
        # TODO: What's unit for distance?
        # maybe miles
        efs = EventFilterState.objects.create(user=self.user, distance=111)
        MatchFilterState.objects.create(user=self.user, distance_unit='km')
        resp = self.api_client.get('/api/v1/feed/events/my/', format='json',
                                   )
        data = self.deserialize(resp)
        self.assertEqual(data['objects'][0]['distance'], ['927', u'km'])

    def test_my_feed_event_filter_by_distance2(self):
        self.response = self.login()
        # TODO: What's unit for distance?
        # maybe miles
        efs = EventFilterState.objects.create(user=self.user, distance=926)
        MatchFilterState.objects.create(user=self.user, distance_unit='km')
        resp = self.api_client.get('/api/v1/feed/events/my/', format='json',
                                   data={'filter': 'true'})
        data = self.deserialize(resp)
        self.assertEqual(data['objects'], [])

class TestFriendsEventFeedResource(ResourceTestCase):
    def setUp(self):
        super(TestFriendsEventFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.event = Event.objects.create(name="Play piano", location=[7000, 22965.83],
                                          starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event1 = Event.objects.create(name="Play piano1", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event2 = Event.objects.create(name="Play piano2", location=[7000, 22965.83],
                                           starts_on=now(), ends_on=now() + timedelta(days=10))
        Membership.objects.create(user=self.user, event=self.event, rsvp='yes')
        Membership.objects.create(user=self.user, event=self.event1, rsvp='yes')
        Membership.objects.create(user=self.user, event=self.event2, rsvp='yes')
        Membership.objects.create(user=self.user1, event=self.event2, rsvp='yes')
        Membership.objects.create(user=self.user2, event=self.event2, rsvp='yes')
        Friend.objects.create(friend1=self.user, friend2=self.user1, status=1)
        Friend.objects.create(friend1=self.user, friend2=self.user2, status=1)

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/feed/events/friends/', format='json')
        self.assertValidJSONResponse(resp)
        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 1)

    def test_friends_feed_resource_duplicates(self):
        """
        Duplicate events showing up in event feed
        https://bekindred.atlassian.net/browse/ICE-925
        """
        self.response = self.login()
        resp = self.api_client.get('/api/v1/feed/events/friends/', format='json')
        data = self.deserialize(resp)
        Membership.objects.create(user=self.user1, event=self.event, rsvp='yes')
        Membership.objects.create(user=self.user2, event=self.event, rsvp='yes')

        Membership.objects.create(user=self.user1, event=self.event1, rsvp='yes')
        Membership.objects.create(user=self.user2, event=self.event1, rsvp='yes')

        self.assertEqual(data['meta']['total_count'], 1)
