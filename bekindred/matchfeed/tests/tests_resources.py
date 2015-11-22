from datetime import date, datetime
import os
from django.conf import settings
from django.utils import unittest
from django.utils.timezone import now

from django_facebook.models import FacebookCustomUser, FacebookLike
from django.core.files.uploadedfile import SimpleUploadedFile

from tastypie.test import ResourceTestCase
from events.models import FilterState

from goals.models import Subject, Goal, Offer
from interests.models import Interest, InterestSubject
from world.models import UserLocation


class TestMatchFeedResource(ResourceTestCase):

    def setUp(self):
        super(TestMatchFeedResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(
            username='user_a',
            facebook_id=999234567,
            password='test',
            date_of_birth=date(
                1989,
                5,
                20))
        self.user1 = FacebookCustomUser.objects.create_user(
            username='user_b',
            facebook_id=12345671,
            password='test',
            date_of_birth=date(
                1989,
                1,
                9))
        self.user2 = FacebookCustomUser.objects.create_user(
            username='user_c',
            facebook_id=12345672,
            gender='m',
            password='test',
            date_of_birth=date(
                1998,
                1,
                11))
        self.user3 = FacebookCustomUser.objects.create_user(
            username='user_d',
            facebook_id=12345673,
            gender='f',
            password='test',
            date_of_birth=date(
                1950,
                3,
                1))
        self.user4 = FacebookCustomUser.objects.create_user(
            username='user_e',
            facebook_id=12345674,
            password='test',
            date_of_birth=date(
                1970,
                2,
                1))
        self.user5 = FacebookCustomUser.objects.create_user(
            username='user_f',
            facebook_id=12345675,
            password='test',
            date_of_birth=date(
                1973,
                11,
                1))
        self.user6 = FacebookCustomUser.objects.create_user(
            username='user_g',
            facebook_id=123456123213,
            password='test',
            date_of_birth=date(
                1989,
                10,
                1))
        self.user7 = FacebookCustomUser.objects.create_user(
            username='user_h',
            facebook_id=123456751112,
            password='test',
            date_of_birth=date(
                1935,
                11,
                1))
        self.description = 'learn django'
        self.description2 = 'learn python'
        self.description3 = 'learn ruby'
        self.description4 = 'teach django'
        self.description5 = 'teach python'
        self.description6 = 'teach ruby'
        self.description7 = 'find mountain biking partner'
        self.description8 = 'find people to go mountain biking with'
        self.description9 = 'django'

        self.subject = Subject.objects.create(description=self.description)
        self.subject2 = Subject.objects.create(description=self.description2)
        self.subject3 = Subject.objects.create(description=self.description3)
        self.subject4 = Subject.objects.create(description=self.description4)
        self.subject5 = Subject.objects.create(description=self.description5)
        self.subject6 = Subject.objects.create(description=self.description6)
        self.subject7 = Subject.objects.create(description=self.description7)
        self.subject8 = Subject.objects.create(description=self.description8)
        self.subject9 = Subject.objects.create(description=self.description9)

        user_location = UserLocation.objects.create(
            user=self.user, position=[-87.627696, 41.880745])
        user_location1 = UserLocation.objects.create(
            user=self.user1, position=[-87.627675, 41.881925])
        user_location2 = UserLocation.objects.create(
            user=self.user2, position=[-87.6281729688, 41.881849562])
        user_location3 = UserLocation.objects.create(
            user=self.user3, position=[-87.62839, 41.88206])
        user_location4 = UserLocation.objects.create(
            user=self.user4, position=[-87.6269801114, 41.8814058757])
        user_location5 = UserLocation.objects.create(
            user=self.user5, position=[38.53, 77.02])
        user_location6 = UserLocation.objects.create(
            user=self.user6, position=[41.50, 87.37])
        user_location7 = UserLocation.objects.create(
            user=self.user7, position=[-87.62749695, 41.88316957])

        self.resource_url = '/api/v1/matchfeed/'

    def tearDown(self):
        FilterState.objects.all().delete()

    def login(self):
        return self.api_client.client.post(
            '/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_matchfeed_list(self):
        self.assertHttpUnauthorized(
            self.api_client.get(
                self.resource_url,
                format='json'))

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

    def test_correct_image_url(self):
        date_folder = now().strftime('%Y/%m/%d')

        tmp_file = os.path.join(
            settings.MEDIA_ROOT,
            "images/facebook_profiles/%s/best_file_eva.txt" % date_folder
        )
        new_file = SimpleUploadedFile('best_file_eva.txt',
                                      'these are the file contents!')
        user = FacebookCustomUser.objects.create_user(
            username='user_abc',
            facebook_id=9992345671212,
            password='test',
            image=new_file,
            date_of_birth=date(
                1989,
                5,
                20))

        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=user, goal=self.subject)
        Goal.objects.create(user=user, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', format='json')

        data = self.deserialize(resp)
        self.assertEqual(data['meta']['total_count'], 1)

        self.assertEqual(
            data['objects'][0]['image'],
            u'/media/images/facebook_profiles/%s/best_file_eva.txt'
            % date_folder
        )
        # clean up temp file
        if os.path.exists(tmp_file):
            os.remove(tmp_file)

    def test_match_interest_fb_likes(self):
        interest_id = InterestSubject.objects.create(
            description='Ruby Programming')
        Interest.objects.create(user=self.user, interest=interest_id)

        FacebookLike.objects.create(
            user_id=self.user1.id,
            name='ruby',
            facebook_id=self.user1.facebook_id)
        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', format='json')
        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 1)

    def test_match_fb_likes_to_fb_likes(self):
        FacebookLike.objects.create(
            user_id=self.user.id,
            name='Ruby Programming',
            facebook_id=self.user.facebook_id)
        FacebookLike.objects.create(
            user_id=self.user1.id,
            name='Ruby Programming',
            facebook_id=self.user1.facebook_id)
        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', format='json')
        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 1)

    def test_filter_match_distance(self):
        FilterState.objects.filter(user=self.user).\
            update(distance=500, min_age=4, max_age=5)
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user2, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get(
            '/api/v1/matchfeed/',
            data={
                'filter': 'true'},
            format='json')

        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 0)

    def test_filter_match_exact_age(self):
        FilterState.objects.filter(user=self.user).\
            update(distance=10000, min_age=26, max_age=26)
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get(
            '/api/v1/matchfeed/',
            data={
                'filter': 'true'},
            format='json')
        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 2)

    def test_filter_match_age_full_range(self):
        FilterState.objects.filter(user=self.user).\
            update(distance=10000, min_age=18, max_age=99)
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user4, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get(
            '/api/v1/matchfeed/',
            data={
                'filter': 'true'},
            format='json')
        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 6)

    def test_filter_match_gender_male(self):
        FilterState.objects.filter(user=self.user).\
            update(distance=10000, min_age=18, max_age=99, gender='f')
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user2, goal=self.subject2)
        Goal.objects.create(user=self.user3, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get(
            '/api/v1/matchfeed/',
            data={
                'filter': 'true'},
            format='json')
        self.assertEqual(self.deserialize(resp)['meta']['total_count'], 1)

    def test_filter_match_keywords(self):
        FilterState.objects.filter(user=self.user).\
            update(distance=10000, min_age=18, max_age=99,
                   gender='f', keyword='django,python')
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user2, goal=self.subject2)
        Goal.objects.create(user=self.user3, goal=self.subject2)

        self.response = self.login()
        resp = self.api_client.get(
            '/api/v1/matchfeed/',
            data={
                'filter': 'true'},
            format='json')
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
        self.assertEqual(result['objects'][0]['goals'], [
                         {u'find people to go mountain biking with': 1, u'learn django': 1}])

    def test_match_deleted_user(self):
        self.inactive_user = FacebookCustomUser.objects.create_user(
            username='user_i',
            facebook_id=12345675123,
            password='test',
            date_of_birth=date(
                1973,
                11,
                1))
        Goal.objects.create(user=self.inactive_user, goal=self.subject7)
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user5, goal=self.subject)
        Goal.objects.create(user=self.user5, goal=self.subject8)

        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed/', format='json')
        result = self.deserialize(resp)
        self.assertEqual(result['meta']['total_count'], 1)
        self.assertEqual(result['objects'][0]['goals'], [
                         {u'find people to go mountain biking with': 0, u'learn django': 1}])

    def test_matchfeed_order_by_distance(self):
        FilterState.objects.filter(user=self.user).\
            update(distance=10000, min_age=18,
                   max_age=99, order_criteria='distance')
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user4, goal=self.subject2)

        Goal.objects.create(user=self.user5, goal=self.subject4)
        Goal.objects.create(user=self.user5, goal=self.subject9)

        self.response = self.login()
        distance = []
        url = '/api/v1/matchfeed/'
        resp = self.api_client.get(url, data={'filter': 'true'}, format='json')
        result = self.deserialize(resp)

        for x in range(1, result['meta']['total_count']):
            resp = self.api_client.get(
                '/api/v1/matchfeed/',
                data={
                    'filter': 'true',
                    'offset': x},
                format='json')
            result = self.deserialize(resp)
            distance.append(result['objects'][0]['distance'])
        self.assertEqual(distance, [['131', u'meters'],
                                    ['157', u'meters'],
                                    ['269', u'meters'],
                                    ['3,450', u'miles'],
                                    ['3,914', u'miles']])

    def test_matchfeed_order_by_match_score(self):
        FilterState.objects.filter(user=self.user).\
            update(distance=10000, min_age=18, max_age=99,
                   order_criteria='match_score')
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Goal.objects.create(user=self.user, goal=self.subject3)
        Goal.objects.create(user=self.user, goal=self.subject5)
        Goal.objects.create(user=self.user, goal=self.subject6)
        Goal.objects.create(user=self.user, goal=self.subject7)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject2)
        Goal.objects.create(user=self.user1, goal=self.subject3)
        Goal.objects.create(user=self.user1, goal=self.subject4)
        Goal.objects.create(user=self.user1, goal=self.subject5)

        Goal.objects.create(user=self.user2, goal=self.subject)
        Goal.objects.create(user=self.user2, goal=self.subject2)
        Goal.objects.create(user=self.user2, goal=self.subject3)
        Goal.objects.create(user=self.user2, goal=self.subject4)

        Goal.objects.create(user=self.user3, goal=self.subject)
        Goal.objects.create(user=self.user3, goal=self.subject2)
        Goal.objects.create(user=self.user3, goal=self.subject3)

        Goal.objects.create(user=self.user4, goal=self.subject)
        Goal.objects.create(user=self.user4, goal=self.subject2)

        Goal.objects.create(user=self.user5, goal=self.subject)

        self.response = self.login()
        distance = []
        url = '/api/v1/matchfeed/'
        resp = self.api_client.get(url, data={'filter': 'true'}, format='json')
        result = self.deserialize(resp)

        for x in range(1, result['meta']['total_count']):
            resp = self.api_client.get(
                '/api/v1/matchfeed/',
                data={
                    'filter': 'true',
                    'offset': x},
                format='json')
            result = self.deserialize(resp)
            distance.append(result['objects'][0]['score'])
        self.assertEqual(distance, [3, 2, 1, 0, 0])

    def test_matchfeed_counter_only_goals(self):
        FilterState.objects.filter(user=self.user).\
            update(distance=10000, min_age=18, max_age=99,
                   order_criteria='match_score')
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Goal.objects.create(user=self.user, goal=self.subject3)
        Goal.objects.create(user=self.user, goal=self.subject4)

        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject2)
        Goal.objects.create(user=self.user1, goal=self.subject3)
        Goal.objects.create(user=self.user1, goal=self.subject4)

        self.response = self.login()

        url = '/api/v1/matchfeed/'
        resp = self.api_client.get(url, data={'filter': 'true'}, format='json')
        result = self.deserialize(resp)
        self.assertEqual(result['objects'][0]['score'], 4)
        self.assertEqual(result['objects'][0]['goals'], [{u'learn django': 1,
                                                          u'learn python': 1,
                                                          u'learn ruby': 1,
                                                          u'teach django': 1}])

    def test_matchfeed_counter_only_offers(self):
        FilterState.objects.filter(user=self.user).\
            update(distance=10000,
                   min_age=18, max_age=99, order_criteria='match_score')
        Offer.objects.create(user=self.user, offer=self.subject)
        Offer.objects.create(user=self.user, offer=self.subject2)
        Offer.objects.create(user=self.user, offer=self.subject3)
        Offer.objects.create(user=self.user, offer=self.subject4)

        Offer.objects.create(user=self.user1, offer=self.subject)
        Offer.objects.create(user=self.user1, offer=self.subject2)
        Offer.objects.create(user=self.user1, offer=self.subject3)
        Offer.objects.create(user=self.user1, offer=self.subject4)

        self.response = self.login()

        url = '/api/v1/matchfeed/'
        resp = self.api_client.get(url, data={'filter': 'true'}, format='json')
        result = self.deserialize(resp)
        self.assertEqual(result['objects'][0]['score'], 4)
        self.assertEqual(result['objects'][0]['offers'], [{u'learn django': 1,
                                                           u'learn python': 1,
                                                           u'learn ruby': 1,
                                                           u'teach django': 1}])


class TestMatchFeedResource2(ResourceTestCase):

    def get_credentials(self):
        pass

    def setUp(self):
        super(TestMatchFeedResource2, self).setUp()
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', facebook_id=999234567,
                        password='test', date_of_birth=date(1989, 5, 20))
        self.user1 = FacebookCustomUser.objects.\
            create_user(username='user_b', facebook_id=12345671,
                        password='test', date_of_birth=date(1989, 1, 9))
        self.user2 = FacebookCustomUser.objects.\
            create_user(username='user_c', facebook_id=12345672, gender='m',
                        password='test', date_of_birth=date(1998, 1, 11))
        self.user3 = FacebookCustomUser.objects.\
            create_user(username='user_d', facebook_id=12345673, gender='f',
                        password='test', date_of_birth=date(1950, 3, 1))
        self.user4 = FacebookCustomUser.objects.\
            create_user(username='user_e', facebook_id=12345674,
                        password='test', date_of_birth=date(1970, 2, 1))
        self.user5 = FacebookCustomUser.objects.\
            create_user(username='user_f', facebook_id=12345675,
                        password='test', date_of_birth=date(1973, 11, 1))
        self.user6 = FacebookCustomUser.objects.\
            create_user(username='user_g', facebook_id=123456123213,
                        password='test', date_of_birth=date(1989, 10, 1))
        self.user7 = FacebookCustomUser.objects.\
            create_user(username='user_h', facebook_id=123456751112,
                        password='test', date_of_birth=date(1935, 11, 1))
        self.description = 'learn django'
        self.description2 = 'learn python'
        self.description3 = 'learn ruby'
        self.description4 = 'teach django'
        self.description5 = 'teach python'
        self.description6 = 'teach ruby'
        self.description7 = 'find mountain biking partner'
        self.description8 = 'find people to go mountain biking with'
        self.description9 = 'django'

        self.subject = Subject.objects.create(description=self.description)
        self.subject2 = Subject.objects.create(description=self.description2)
        self.subject3 = Subject.objects.create(description=self.description3)
        self.subject4 = Subject.objects.create(description=self.description4)
        self.subject5 = Subject.objects.create(description=self.description5)
        self.subject6 = Subject.objects.create(description=self.description6)
        self.subject7 = Subject.objects.create(description=self.description7)
        self.subject8 = Subject.objects.create(description=self.description8)
        self.subject9 = Subject.objects.create(description=self.description9)

        user_location = UserLocation.objects.\
            create(user=self.user, position=[-87.627696, 41.880745])
        user_location1 = UserLocation.objects.\
            create(user=self.user1, position=[-87.627675, 41.881925])
        user_location2 = UserLocation.objects.\
            create(user=self.user2, position=[-87.6281729688, 41.881849562])
        user_location3 = UserLocation.objects.\
            create(user=self.user3, position=[-87.62839, 41.88206])
        user_location4 = UserLocation.objects.\
            create(user=self.user4, position=[-87.6269801114, 41.8814058757])
        user_location5 = UserLocation.objects.\
            create(user=self.user5, position=[38.53, 77.02])
        user_location6 = UserLocation.objects.\
            create(user=self.user6, position=[41.50, 87.37])
        user_location7 = UserLocation.objects.\
            create(user=self.user7, position=[-87.62749695, 41.88316957])

        self.resource_url = '/api/v1/matchfeed2/'

    def login(self):
        return self.api_client.client.post('/login/',
                                           {'username': 'user_a',
                                            'password': 'test'})

    def test_get_matchfeed_list(self):
        self.assertHttpUnauthorized(self.api_client.get(self.resource_url,
                                                        format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    @unittest.skip("elastic")
    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed2/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)), 2)
