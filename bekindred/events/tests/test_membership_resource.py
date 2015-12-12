from datetime import timedelta

from django.utils.timezone import now
from django_facebook.models import FacebookCustomUser
from guardian.shortcuts import assign_perm
from tastypie.test import ResourceTestCase

from events.models import Event, Membership
from world.models import UserLocation


class TestMembershipResource(ResourceTestCase):
    def setUp(self):
        super(TestMembershipResource, self).setUp()
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', password='test')
        UserLocation.objects.create(user=self.user,
                                    position=[-87.627696, 41.880745])
        self.user2 = FacebookCustomUser.objects.\
            create_user(username='user_b', password='test')
        UserLocation.objects.create(user=self.user2,
                                    position=[-87.627696, 41.880745])
        self.event = Event.objects.\
            create(name="Play piano", location=[7000, 22965.83],
                   starts_on=now(), ends_on=now() + timedelta(days=10))
        self.event1 = Event.objects.\
            create(name="Play tennis", location=[7000, 22965.83],
                   starts_on=now(), ends_on=now() + timedelta(days=10))
        self.member = Membership.objects.create(user=self.user, event=self.event)
        self.post_data = {"event": "/api/v1/event/{}/".format(self.event.id),
                          "rsvp": 'yes',
                          "starts_on": now(),
                          'ends_on': now() + timedelta(days=10),
                          "user": "/api/v1/auth/user/{}/".format(self.user.id)}

    def login(self):
        return self.api_client.client.\
            post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.
                                    get('/api/v1/member/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_post_rsvp(self):
        self.response = self.login()
        post_data = {"event": "/api/v1/event/{}/".format(self.event1.id),
                     "rsvp": 'yes',
                     "is_invited": None,
                     "starts_on": now(),
                     'ends_on': now() + timedelta(days=10),
                     "user": "/api/v1/auth/user/{}/".format(self.user.id)}
        assign_perm('view_event', self.user, self.event1)
        self.assertHttpCreated(self.api_client.post('/api/v1/member/',
                                                    format='json',
                                                    data=post_data))
        # Verify a new one has been added.
        self.assertEqual(Membership.objects.filter(user=self.user).count(), 2)

    def test_put_detail(self):
        self.response = self.login()
        m = Membership.objects.create(user=self.user, event=self.event1,
                                      rsvp='no')
        detail_url = '/api/v1/member/{}/'.format(m.id)
        assign_perm('view_event', self.user, self.event1)
        original_data = self.deserialize(self.api_client.get(detail_url,
                                                             format='json'))
        new_data = original_data.copy()
        new_data['rsvp'] = 'yes'

        self.assertEqual(Membership.objects.count(), 2)
        resp = self.api_client.put(detail_url, format='json', data=new_data)
        updated_rsvp = self.deserialize(resp)['rsvp']
        self.assertEqual(updated_rsvp, 'yes')

    def test_delete_member_by_id(self):
        # TODO:
        pass

    def test_restrict_delete_all_members(self):
        resp = self.login()
        res = self.api_client.delete('/api/v1/member/', format='json')
        self.assertEqual(res.content,
                         '{"error": "You can\'t delete membership without id"}')
