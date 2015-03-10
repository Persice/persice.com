from datetime import date
from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase
from goals.models import Subject, Goal, MatchFilterState
from interests.models import Interest


class TestMatchFeedResource(ResourceTestCase):
    def setUp(self):
        super(TestMatchFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', facebook_id=1234567,
                                                           password='test', date_of_birth=date(1989, 5, 20))
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', facebook_id=12345671,
                                                            password='test', date_of_birth=date(1989, 1, 9))
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', facebook_id=12345672,  gender='m',
                                                            password='test', date_of_birth=date(1998, 1, 11))
        self.user3 = FacebookCustomUser.objects.create_user(username='user_d', facebook_id=12345673,  gender='f',
                                                            password='test', date_of_birth=date(1950, 3, 1))
        self.user4 = FacebookCustomUser.objects.create_user(username='user_e', facebook_id=12345674,
                                                            password='test', date_of_birth=date(1970, 2, 1))
        self.user5 = FacebookCustomUser.objects.create_user(username='user_f', facebook_id=12345675,
                                                            password='test', date_of_birth=date(1973, 11, 1))
        self.description = 'learn django'
        self.description2 = 'learn python'
        self.description3 = 'learn ruby'
        self.description4 = 'teach django'
        self.description5 = 'teach python'
        self.description6 = 'teach ruby'
        self.description7 = 'find mountain biking partner'
        self.description8 = 'find people to go mountain biking with'

        self.subject = Subject.objects.create(description=self.description)
        self.subject2 = Subject.objects.create(description=self.description2)
        self.subject3 = Subject.objects.create(description=self.description3)
        self.subject4 = Subject.objects.create(description=self.description4)
        self.subject5 = Subject.objects.create(description=self.description5)
        self.subject6 = Subject.objects.create(description=self.description6)
        self.subject7 = Subject.objects.create(description=self.description7)
        self.subject8 = Subject.objects.create(description=self.description8)

        self.resource_url = '/api/v1/matchfeed/'

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_matchfeed_list(self):
        self.assertHttpUnauthorized(self.api_client.get(self.resource_url, format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)), 2)

    def test_simple_match_two_users(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user2, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', format='json')

        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 2)

    def test_filter_match_distance(self):
        MatchFilterState.objects.create(user=self.user, distance=500)
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user2, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', data={'filter': 'true'}, format='json')

        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 0)

    def test_filter_match_exact_age(self):
        MatchFilterState.objects.create(user=self.user, distance=10000, min_age=26, max_age=26)
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', data={'filter': 'true'}, format='json')
        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 1)

    def test_filter_match_age_full_range(self):
        MatchFilterState.objects.create(user=self.user, distance=10000, min_age=18, max_age=99)
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user4, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', data={'filter': 'true'}, format='json')
        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 2)

    def test_filter_match_gender_male(self):
        MatchFilterState.objects.create(user=self.user, distance=10000, min_age=18, max_age=99, gender='f')
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user2, goal=self.subject2)
        Goal.objects.create(user=self.user3, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', data={'filter': 'true'}, format='json')
        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 1)

    def test_filter_match_keywords(self):
        MatchFilterState.objects.create(user=self.user, distance=10000, min_age=18, max_age=99,
                                        gender='f', keyword='django,python')
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user2, goal=self.subject2)
        Goal.objects.create(user=self.user3, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', data={'filter': 'true'}, format='json')
        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 1)

    def test_match_feed_keyword(self):
        """
        Users not matching on keyword "mountain biking"
        based on bug https://bekindred.atlassian.net/browse/BK-438
        """
        Goal.objects.create(user=self.user, goal=self.subject7)
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user5, goal=self.subject)
        Goal.objects.create(user=self.user5, goal=self.subject8)

        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', format='json')
        result = self.deserialize(resp)
        self.assertEqual(result['meta']['total_count'], 1)
        self.assertEqual(result['objects'][0]['goals'], [{u'find people to go mountain biking with': 1,
                                                          u'learn django': 1}])

    def test_match_deleted_user(self):
        self.inactive_user = FacebookCustomUser.objects.create_user(username='user_i', facebook_id=12345675123,
                                                                    password='test', date_of_birth=date(1973, 11, 1))
        Goal.objects.create(user=self.inactive_user, goal=self.subject7)
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user5, goal=self.subject)
        Goal.objects.create(user=self.user5, goal=self.subject8)

        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', format='json')
        result = self.deserialize(resp)
        self.assertEqual(result['meta']['total_count'], 1)
        self.assertEqual(result['objects'][0]['goals'], [{u'find people to go mountain biking with': 0,
                                                          u'learn django': 1}])
