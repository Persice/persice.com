from django_facebook.models import FacebookCustomUser

from accounts.tests.test_resources import JWTResourceTestCase
from interests.models import (Interest, InterestSubject, PoliticalIndex,
                              PoliticalView, ReligiousIndex, ReligiousView)


class TestInterestResource(JWTResourceTestCase):
    def setUp(self):
        super(TestInterestResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(
            username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(
            username='user_b', password='test')
        self.DESCRIPTION = 'learn django'
        self.DESCRIPTION2 = 'learn python'
        self.DESCRIPTION3 = 'learn ruby'
        self.subject = InterestSubject.objects.create(
            description=self.DESCRIPTION)
        self.subject2 = InterestSubject.objects.create(
            description=self.DESCRIPTION2)
        self.subject3 = InterestSubject.objects.create(
            description=self.DESCRIPTION3)

        self.interest = Interest.objects.create(
            user=self.user, interest=self.subject)

        self.detail_url = '/api/v1/interest/{0}/'.format(self.interest.pk)
        self.post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'interest': '/api/v1/interest_subject/{0}/'.format(
                self.subject2.pk),
        }

    def test_get_list_unauthorized(self):
        self.assertHttpUnauthorized(self.api_client.get(
            '/api/v1/interest/', format='json'))

    def test_get_list_json(self):
        resp = self.api_client.get(
            '/api/v1/interest/', format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 1)
        # Here, we're checking an entire structure for the expected data.
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            'id': self.interest.id,
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'interest': '/api/v1/interest_subject/{0}/'.format(
                self.subject.pk),
            'interest_subject': '{}'.format(self.DESCRIPTION),
            'resource_uri': '/api/v1/interest/{0}/'.format(self.interest.pk)
        })

    def test_create_interest(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'interest_subject': 'my new interest',
            }
        self.assertHttpCreated(self.api_client.post(
            '/api/v1/interest/', format='json', data=post_data,
            authentication=self.get_credentials()
        ))

    def test_create_interest_and_get(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'interest_subject': 'my new interest2',
            }
        resp = self.api_client.post(
            '/api/v1/interest/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertEqual(self.deserialize(resp)['interest_subject'],
                         'my new interest2')

    def test_create_duplicate_interest(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'interest_subject': 'learn django',
            }
        resp = self.api_client.post(
            '/api/v1/interest/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertEqual(self.deserialize(resp)['interest']['error'][0],
                         'Interest already exists')

    def test_create_duplicate_interest_case_sensitive(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'interest_subject': 'learn Django',
            }
        resp = self.api_client.post(
            '/api/v1/interest/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertEqual(self.deserialize(resp)['interest']['error'][0],
                         'Interest already exists')

    def test_create_interest_case_sensitive(self):
        self.interest = Interest.objects.create(
            user=self.user1, interest=self.subject3)
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'interest_subject': 'LEARN RUBY',
        }
        self.assertHttpCreated(self.api_client.post(
            '/api/v1/interest/', format='json', data=post_data,
            authentication=self.get_credentials()
        ))
        self.assertEqual(
            InterestSubject.objects.filter(
                description__icontains='ruby')[0].description,
            'learn ruby'
        )

    def test_put_detail(self):
        # Grab the current data & modify it slightly.
        self.assertEqual(
            str(Interest.objects.get(interest__description='learn django')),
            'learn django'
        )
        original_data = self.deserialize(self.api_client.get(
            self.detail_url, format='json',
            authentication=self.get_credentials()
        ))
        new_data = original_data.copy()
        new_data['interest_subject'] = 'learn erlang'

        self.assertEqual(Interest.objects.count(), 1)
        self.api_client.put(
            self.detail_url, format='json', data=new_data,
            authentication=self.get_credentials()
        )
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(Interest.objects.count(), 1)
        # Check for updated data.
        self.assertEqual(
            str(Interest.objects.get(interest__description='learn erlang')),
            'learn erlang'
        )

    def test_put_to_duplicate_detail(self):
        # Grab the current data & modify it slightly.
        original_data = self.deserialize(self.api_client.get(
            self.detail_url, format='json',
            authentication=self.get_credentials()
        ))
        new_data = original_data.copy()
        new_data['Interest_subject'] = 'learn django'

        self.assertEqual(Interest.objects.count(), 1)
        resp = self.api_client.put(
            self.detail_url, format='json', data=new_data,
            authentication=self.get_credentials()
        )
        updated_interest = self.deserialize(resp)
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(Interest.objects.count(), 1)
        # Check for updated data.
        self.assertEqual(updated_interest['interest']['error'][0],
                         "Interest already exists")

    def test_delete_detail(self):
        self.assertEqual(Interest.objects.count(), 1)
        self.assertHttpAccepted(self.api_client.delete(
            self.detail_url, format='json',
            authentication=self.get_credentials()
        ))
        self.assertEqual(Interest.objects.count(), 0)


class TestReligiousViewResource(JWTResourceTestCase):
    def setUp(self):
        super(TestReligiousViewResource, self).setUp()
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', password='test')
        self.ri = ReligiousIndex.objects.create(name="christianity")
        self.ri1 = ReligiousIndex.objects.create(name="test")
        self.rv = ReligiousView.objects.create(religious_index=self.ri,
                                               user=self.user)
        self.detail_url = '/api/v1/religious_view/{0}/'.format(self.rv.pk)

    def test_get_list_unauthorized(self):
        self.assertHttpUnauthorized(
                self.api_client.get('/api/v1/religious_view/', format='json'))

    def test_get_list_json_religious_index(self):
        resp = self.api_client.get(
            '/api/v1/religious_index/', format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)

    def test_get_list_json(self):
        resp = self.api_client.get(
            '/api/v1/religious_view/', format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)
        self.assertEqual(len(self.deserialize(resp)['objects']), 1)
        # Here, we're checking an entire structure for the expected data.
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            u'id': self.rv.pk,
            u'user': u'/api/v1/auth/user/{0}/'.format(self.user.pk),
            u'resource_uri': u'/api/v1/religious_view/{0}/'.format(self.rv.pk),
            u'religious_index': u'/api/v1/religious_index/{}/'.format(
                self.ri.pk),
            u'religious_view': u'christianity',
        })

    def test_create_religious_view(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'religious_index': 'my new religious view',
        }
        self.assertHttpCreated(self.api_client.post(
            '/api/v1/religious_view/', format='json', data=post_data,
            authentication=self.get_credentials()
        ))

    def test_create_religious_view_and_get(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'religious_index': 'my new religious view',
        }
        resp = self.api_client.post(
            '/api/v1/religious_view/', format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertEqual(self.deserialize(resp)['religious_view'],
                         post_data['religious_index'])

    def test_put_detail(self):
        self.assertEqual(str(
                ReligiousView.objects.get(religious_index__name='christianity')
        ), 'christianity')
        original_data = self.deserialize(
                self.api_client.get(
                    self.detail_url, format='json',
                    authentication=self.get_credentials())
        )
        new_data = original_data.copy()
        new_data['religious_index'] = 'erlang'

        self.assertEqual(ReligiousView.objects.count(), 1)
        self.api_client.put(
            self.detail_url, format='json', data=new_data,
            authentication=self.get_credentials()
        )
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(ReligiousView.objects.count(), 1)
        # Check for updated data.
        self.assertEqual(str(
                ReligiousView.objects.get(religious_index__name='erlang')
        ), 'erlang')


class TestPoliticalViewResource(JWTResourceTestCase):
    def setUp(self):
        super(TestPoliticalViewResource, self).setUp()
        self.user = FacebookCustomUser.objects. \
            create_user(username='user_a', password='test')
        self.pi = PoliticalIndex.objects.create(name="democracy")
        self.pi1 = PoliticalIndex.objects.create(name="test")
        self.pv = PoliticalView.objects.create(political_index=self.pi,
                                               user=self.user)
        self.detail_url = '/api/v1/political_view/{0}/'.format(self.pv.pk)

    def test_get_list_unauthorized(self):
        self.assertHttpUnauthorized(
                self.api_client.get('/api/v1/political_view/', format='json'))

    def test_get_list_json_political_index(self):
        resp = self.api_client.get(
            '/api/v1/political_index/', format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)

    def test_get_list_json(self):
        resp = self.api_client.get(
            '/api/v1/political_view/', format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)
        self.assertEqual(len(self.deserialize(resp)['objects']), 1)
        # Here, we're checking an entire structure for the expected data.
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            u'id': self.pv.pk,
            u'user': u'/api/v1/auth/user/{0}/'.format(self.user.pk),
            u'resource_uri': u'/api/v1/political_view/{0}/'.format(self.pv.pk),
            u'political_index': u'/api/v1/political_index/{}/'.format(
                self.pi.pk),
            u'political_view': u'democracy',
        })

    def test_create_political_view(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'political_index': 'my new political',
        }
        self.assertHttpCreated(self.api_client.post(
            '/api/v1/political_view/', format='json', data=post_data,
            authentication=self.get_credentials()
        ))

    def test_create_religious_view_and_get(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'political_index': 'my new political view',
        }
        resp = self.api_client.post(
            '/api/v1/political_view/',
            format='json', data=post_data,
            authentication=self.get_credentials()
        )
        self.assertEqual(self.deserialize(resp)['political_view'],
                         post_data['political_index'])

    def test_put_detail(self):
        # Grab the current data & modify it slightly.
        self.assertEqual(str(
                PoliticalView.objects.get(political_index__name='democracy')
        ), 'democracy')
        original_data = self.deserialize(
                self.api_client.get(
                    self.detail_url, format='json',
                    authentication=self.get_credentials()
                )
        )
        new_data = original_data.copy()
        new_data['political_index'] = 'erlang'

        self.assertEqual(PoliticalView.objects.count(), 1)
        self.api_client.put(
            self.detail_url, format='json',
            authentication=self.get_credentials(), data=new_data
        )
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(PoliticalView.objects.count(), 1)
        # Check for updated data.
        self.assertEqual(str(
                PoliticalView.objects.get(political_index__name='erlang')
        ), 'erlang')
