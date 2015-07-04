from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase

from events.models import Event, Membership


class TestEventConnections(ResourceTestCase):
    def setUp(self):
        super(TestEventConnections, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test',
                                                           first_name='Andrii', last_name='Soldatenko')
        self.event = Event.objects.create(starts_on='2055-06-13T05:15:22.792659',
                                          ends_on='2055-06-14T05:15:22.792659',
                                          name="Play piano", location=[7000, 22965.83])
        self.membership = Membership.objects.create(user=self.user, event=self.event,
                                                    is_organizer=True, rsvp='yes')
        self.response = self.login()

    def get_credentials(self):
        pass

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_login(self):
        self.assertEqual(self.response.status_code, 302)

    def test_get_list(self):
        resp = self.api_client.get('/api/v1/events/connections/', format='json')
        self.assertEqual(self.deserialize(resp)['objects'],
                         [{u'age': 34,
                           u'common_goals_offers_interests': 0,
                           u'event': u'/api/v1/event/1/',
                           u'facebook_id': None,
                           u'first_name': u'Andrii',
                           u'id': 1,
                           u'is_accepted': False,
                           u'is_organizer': True,
                           u'last_name': u'Soldatenko',
                           u'mutual_friends_count': 0,
                           u'resource_uri': u'/api/v1/events/connections/1/',
                           u'rsvp': u'yes',
                           u'tagline': u'',
                           u'user': u'/api/v1/auth/user/%s/' % self.user.pk}])
