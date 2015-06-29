from datetime import date
from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase
from events.models import Event, Membership, EventFilterState


class TestEventFilterStateResource(ResourceTestCase):
    def get_credentials(self):
        pass

    def setUp(self):
        super(TestEventFilterStateResource, self).setUp()
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', facebook_id=1234567,
                        password='test', date_of_birth=date(1989, 5, 20))
        self.resource_url = '/api/v1/events/filter/state/'

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_filter_state_list(self):
        self.assertHttpUnauthorized(self.api_client.get(self.resource_url, format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/events/filter/state/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)), 2)

    def test_simple_filter_keywords(self):
        self.response = self.login()
        EventFilterState.objects.create(user=self.user, keyword='piano')
        user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        event = Event.objects.create(starts_on='2055-06-13T05:15:22.792659', ends_on='2055-06-14T05:15:22.792659',
                                     name="Play piano", location=[7000, 22965.83])
        Membership.objects.create(user=self.user, event=event)
        Membership.objects.create(user=user1, event=event, rsvp='yes')
        Membership.objects.create(user=user2, event=event, rsvp='yes')

        resp = self.api_client.get('/api/v1/feed/events/my/',
                                   data={'filter': 'true'},
                                   format='json')
        self.assertEqual(self.deserialize(resp)['objects'][0]['name'], 'Play piano')
