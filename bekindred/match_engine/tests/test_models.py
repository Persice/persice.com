from datetime import date
from django.core.management import call_command
from django_facebook.models import FacebookCustomUser, FacebookLike
import haystack
from guardian.shortcuts import assign_perm
from tastypie.test import ResourceTestCase

from events.models import FilterState, Event, Membership
from friends.models import Friend
from goals.models import Subject, Offer, Goal
from interests.models import InterestSubject, Interest
from match_engine.models import ElasticSearchMatchEngine
from django.test import TestCase
from haystack.management.commands import update_index, rebuild_index, clear_index
from matchfeed.utils import MatchQuerySet
from world.models import UserLocation


class BaseTestCase(TestCase):

    def setUp(self):
        haystack.connections.reload('default')
        super(BaseTestCase, self).setUp()

    def tearDown(self):
        call_command('clear_index', interactive=False, verbosity=0)


class TestMatchQuerySet(BaseTestCase, ResourceTestCase):
    fixtures = ['initial_data.json']

    def setUp(self):
        super(TestMatchQuerySet, self).setUp()
        haystack.connections.reload('default')
        Goal.objects.all().delete()
        Offer.objects.all().delete()
        Subject.objects.all().delete()
        FacebookCustomUser.objects.all().delete()
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', facebook_id=1234567,
                        first_name='Andrii', password='test', gender='m',
                        date_of_birth=date(1989, 5, 20))
        self.user1 = FacebookCustomUser.objects.\
            create_user(username='user_b', facebook_id=12345671,
                        first_name='Sasa', gender='m', password='test',
                        date_of_birth=date(1979, 1, 9))
        self.user2 = FacebookCustomUser.objects. \
            create_user(username='user_c', facebook_id=12345672,
                        first_name='Ira', gender='f', password='test',
                        date_of_birth=date(1969, 1, 9))
        self.user3 = FacebookCustomUser.objects. \
            create_user(username='user_d', facebook_id=12345676,
                        first_name='Natali', gender='f', password='test',
                        date_of_birth=date(1959, 1, 9))
        self.user4 = FacebookCustomUser.objects. \
            create_user(username='user_e', facebook_id=12345675,
                        first_name='Tati', gender='f', password='test',
                        date_of_birth=date(1949, 1, 9))
        self.user5 = FacebookCustomUser.objects. \
            create_user(username='user_f', facebook_id=12345674,
                        first_name='Ken', gender='m', password='test',
                        date_of_birth=date(1939, 1, 9))

        user_location = UserLocation.objects.create(
            user=self.user, position=[-87.627696, 41.880745])
        user_location1 = UserLocation.objects.create(
            user=self.user1, position=[60.627675, 21.881925])
        user_location2 = UserLocation.objects.create(
            user=self.user2, position=[-87.6281729688, 41.881849562])
        user_location3 = UserLocation.objects.create(
            user=self.user5, position=[-87.62839, 41.88206])
        user_location4 = UserLocation.objects.create(
            user=self.user4, position=[-87.6269801114, 41.8814058757])
        user_location5 = UserLocation.objects.create(
            user=self.user3, position=[38.53, 77.02])

        self.subject = Subject.objects.create(description='learning django')
        self.subject2 = Subject.objects.create(description='learn python')
        self.subject3 = Subject.objects.create(description='teach erlang')
        self.subject4 = Subject.objects.create(description='teach javascript')

        self.subject5 = Subject.objects.create(description='teach django')
        self.subject6 = Subject.objects.create(description='teach python')
        self.subject7 = Subject.objects.create(description='learn erlang')
        self.subject8 = Subject.objects.create(description='learn javascript')
        self.subject9 = Subject.objects.\
            create(description='django under the hood')
        self.subject10 = Subject.objects.\
            create(description='learn kiteboarding and foxes')
        self.subject11 = Subject.objects.\
            create(description='like a kiteboard and fox')
        self.subject12 = Subject.objects. \
            create(description='baby')
        self.subject13 = Subject.objects. \
            create(description='child')
        self.subject14 = Subject.objects. \
            create(description='hire a dog sitter')
        self.subject16 = Subject.objects. \
            create(description='play with dogs')
        self.subject15 = Subject.objects. \
            create(description='learn to code django python')

        self.i_subject = InterestSubject.objects.\
            create(description='teach django')
        self.i_subject1 = InterestSubject.objects. \
            create(description='learn django')
        self.i_subject2 = InterestSubject.objects. \
            create(description='teach python')
        self.i_subject3 = InterestSubject.objects. \
            create(description='learn python')
        self.i_subject4 = InterestSubject.objects. \
            create(description='kiteboarding')
        clear_index.Command().handle(interactive=False)
        rebuild_index.Command().handle(interactive=False)

    def tearDown(self):
        # haystack.connections['default'].get_backend().clear()
        pass

    def test_simple_match_goals(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine.\
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['goals'],
                         [u'teach <em>django</em>'])

    def test_simple_match_offers(self):
        Offer.objects.create(user=self.user, offer=self.subject2)
        Offer.objects.create(user=self.user1, offer=self.subject6)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['offers'],
                         [u'teach <em>python</em>'])

    def test_simple_match_interests(self):
        Interest.objects.create(user=self.user, interest=self.i_subject)
        Interest.objects.create(user=self.user1, interest=self.i_subject1)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['interests'],
                         [u'learn <em>django</em>'])

    def test_simple_match_likes(self):
        FacebookLike.objects.create(user_id=self.user.id, facebook_id=123456,
                                    name='learn python')
        FacebookLike.objects.create(user_id=self.user1.id, facebook_id=123457,
                                    name='teach python')
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['likes'],
                         [u'teach <em>python</em>'])

    def test_simple_match_two_goals_to_two_offers(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Offer.objects.create(user=self.user1, offer=self.subject5)
        Offer.objects.create(user=self.user1, offer=self.subject6)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['offers'],
                         [u'teach <em>django</em>', u'teach <em>python</em>'])

    def test_match_goals_to_offers(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Offer.objects.create(user=self.user1, offer=self.subject5)
        Offer.objects.create(user=self.user1, offer=self.subject3)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['_source']['offers'],
                         [u'teach django', u'teach erlang'])
        self.assertEqual(match_users[0]['highlight']['offers'],
                         [u'teach <em>django</em>'])

    def test_simple_match_query_set(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Offer.objects.create(user=self.user1, offer=self.subject5)
        update_index.Command().handle(interactive=False)
        users = MatchQuerySet.all(self.user.id)
        self.assertEqual(len(users), 1)
        self.assertEqual(users[0].first_name, 'Sasa')

    def test_highlight_simple_match_goal_query_set(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        update_index.Command().handle(interactive=False)
        users = MatchQuerySet.all(self.user.id)
        self.assertEqual(users[0].goals, [{u'teach django': 1}])

    def test_highlight_simple_match_offer_query_set(self):
        Offer.objects.create(user=self.user, offer=self.subject)
        Offer.objects.create(user=self.user1, offer=self.subject5)
        update_index.Command().handle(interactive=False)
        users = MatchQuerySet.all(self.user.id)
        self.assertEqual(users[0].offers, [{u'teach django': 1}])

    def test_highlight_simple_match_interest_query_set(self):
        Interest.objects.create(user=self.user, interest=self.i_subject)
        Interest.objects.create(user=self.user1, interest=self.i_subject1)
        update_index.Command().handle(interactive=False)
        users = MatchQuerySet.all(self.user.id)
        self.assertEqual(users[0].interests, [{u'learn django': 1}])

    def test_simple_match_score_goals(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user1, goal=self.subject6)
        Goal.objects.create(user=self.user1, goal=self.subject7)
        update_index.Command().handle(interactive=False)
        users = MatchQuerySet.all(self.user.id)
        self.assertEqual(users[0].score, 2)

    def test_simple_match_score_offers(self):
        Offer.objects.create(user=self.user, offer=self.subject)
        Offer.objects.create(user=self.user, offer=self.subject2)
        Offer.objects.create(user=self.user1, offer=self.subject5)
        Offer.objects.create(user=self.user1, offer=self.subject6)
        Offer.objects.create(user=self.user1, offer=self.subject7)
        update_index.Command().handle(interactive=False)
        users = MatchQuerySet.all(self.user.id)
        self.assertEqual(users[0].score, 2)

    def test_simple_match_goals_with_stop_words(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject9)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['goals'],
                         [u'<em>django</em> under the hood'])

    def test_simple_match_goals_with_stop_words2(self):
        Goal.objects.create(user=self.user, goal=self.subject14)
        Goal.objects.create(user=self.user1, goal=self.subject16)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['goals'],
                         [u'play with <em>dogs</em>'])

    def test_simple_match_goals_with_root_forms_of_word(self):
        Goal.objects.create(user=self.user, goal=self.subject11)
        Goal.objects.create(user=self.user1, goal=self.subject10)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['goals'],
                         [u'learn <em>kiteboarding</em> and <em>foxes</em>'])

    def test_simple_match_between(self):
        Goal.objects.create(user=self.user, goal=self.subject11)
        Goal.objects.create(user=self.user1, goal=self.subject10)
        Goal.objects.create(user=self.user2, goal=self.subject10)
        Goal.objects.create(user=self.user3, goal=self.subject10)
        update_index.Command().handle(interactive=False)
        users = MatchQuerySet.between(self.user.id, self.user1.id)
        self.assertEqual(len(users), 1)
        self.assertEqual(users[0].score, 1)

    def test_simple_match_synonyms(self):
        Goal.objects.create(user=self.user, goal=self.subject12)
        Goal.objects.create(user=self.user1, goal=self.subject12)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['goals'],
                         [u'<em>baby</em>'])

    def test_simple_top_interests(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject15)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].top_interests[0],
                         {u'coding': 0, u'django': 1, u'python': 0})

    def test_top_interests(self):
        Goal.objects.create(user=self.user, goal=self.subject12)
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Offer.objects.create(user=self.user, offer=self.subject3)
        Goal.objects.create(user=self.user1, goal=self.subject13)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user1, goal=self.subject6)
        Offer.objects.create(user=self.user1, offer=self.subject7)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].top_interests,
                         [{u'django': 1, u'erlang': 1, u'python': 1}])

    def test_simple_top_interests_less_than_3(self):
        Goal.objects.create(user=self.user, goal=self.subject11)
        Goal.objects.create(user=self.user1, goal=self.subject10)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].top_interests[0],
                         {u'kiteboarding': 1,
                          u'foxes': 0})

    def test_simple_top_interests_less_than_1(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject10)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id)
        self.assertEqual(len(match_users), 0)

    def test_filter_gender_male(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user3, goal=self.subject5)
        FilterState.objects.create(user=self.user, gender='m', distance=16516)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].first_name, 'Sasa')
        self.assertEqual(match_users[0].gender, 'm')

    def test_filter_gender_female(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user4, goal=self.subject5)
        FilterState.objects.create(user=self.user, gender='f', max_age=99)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].first_name, 'Tati')
        self.assertEqual(match_users[0].gender, 'f')

    def test_filter_gender_all(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user3, goal=self.subject5)
        Goal.objects.create(user=self.user4, goal=self.subject5)
        FilterState.objects.create(user=self.user, gender='f,m', max_age=99,
                                   distance=16516)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 3)

    def test_filter_age(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user3, goal=self.subject5)
        Goal.objects.create(user=self.user4, goal=self.subject5)
        FilterState.objects.create(user=self.user, min_age=60, max_age=67)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].first_name, 'Tati')
        self.assertEqual(match_users[0].age, 67)

    def test_filter_keywords(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user1, goal=self.subject2)
        Goal.objects.create(user=self.user3, goal=self.subject5)
        FilterState.objects.create(user=self.user, min_age=18,
                                   max_age=99, keyword='python',
                                   distance=16516)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].first_name, 'Sasa')
        self.assertEqual(match_users[0].goals, [{u'learn python': 0, u'teach django': 1}])

    def test_filter_two_keywords(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user1, goal=self.subject2)
        Goal.objects.create(user=self.user3, goal=self.subject5)
        FilterState.objects.create(user=self.user, min_age=18,
                                   max_age=99, keyword='python,ruby',
                                   distance=16516)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].first_name, 'Sasa')
        self.assertEqual(match_users[0].goals, [{u'learn python': 0, u'teach django': 1}])

    def test_filter_with_different_word_form_of_keywords(self):
        """
        Searching Crowd for "hiking" yields no results
        (but search for "hike" does) - ICE-1311
        """
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user1,
                            goal=Subject.objects.create(description='hiking'))

        Goal.objects.create(user=self.user2, goal=self.subject)

        FilterState.objects.create(user=self.user, min_age=18,
                                   max_age=99, keyword='hike',
                                   distance=16516)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].first_name, 'Sasa')
        self.assertEqual(match_users[0].goals, [{u'learning django': 1,
                                                 u'hiking': 0}])

    def test_filter_with_different_word_form_of_keywords2(self):
        """
        Searching Crowd for "hiking" yields no results
        (but search for "hike" does) - ICE-1311
        """
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject)
        Goal.objects.create(user=self.user1,
                            goal=Subject.objects.create(description='hike'))

        Goal.objects.create(user=self.user2, goal=self.subject)

        FilterState.objects.create(user=self.user, min_age=18,
                                   max_age=99, keyword='hiking',
                                   distance=16516)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].first_name, 'Sasa')
        self.assertEqual(match_users[0].goals, [{u'learning django': 1,
                                                 u'hike': 0}])

    def test_filter_keywords_negative_case(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user1, goal=self.subject2)
        Goal.objects.create(user=self.user3, goal=self.subject5)
        FilterState.objects.create(user=self.user, min_age=18,
                                   max_age=99, keyword='ruby')
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 0)

    def test_filter_distance(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user1, goal=self.subject2)
        Goal.objects.create(user=self.user3, goal=self.subject5)
        FilterState.objects.create(user=self.user, min_age=18,
                                   max_age=99, distance=1)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 0)

    def test_exclude_friends(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user3, goal=self.subject5)
        FilterState.objects.create(user=self.user, min_age=18,
                                   max_age=99, distance=10000)
        Friend.objects.create(friend1=self.user, friend2=self.user3, status=1)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].first_name, 'Sasa')

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a',
                                                       'password': 'test'})

    def test_order_mutual_friends(self):
        Goal.objects.get_or_create(user=self.user, goal=self.subject)
        Goal.objects.get_or_create(user=self.user1, goal=self.subject5)
        Goal.objects.get_or_create(user=self.user2, goal=self.subject5)
        Goal.objects.get_or_create(user=self.user3, goal=self.subject5)
        Goal.objects.get_or_create(user=self.user4, goal=self.subject5)
        Goal.objects.get_or_create(user=self.user5, goal=self.subject5)
        FilterState.objects.create(user=self.user, min_age=18, max_age=99,
                                   distance=16000, order_criteria='mutual_friends')
        Friend.objects.create(friend1=self.user, friend2=self.user1, status=1)
        Friend.objects.create(friend1=self.user, friend2=self.user3, status=1)
        Friend.objects.create(friend1=self.user5, friend2=self.user1, status=1)
        Friend.objects.create(friend1=self.user5, friend2=self.user3, status=1)
        Friend.objects.create(friend1=self.user4, friend2=self.user1, status=1)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 3)
        self.response = self.login()
        resp = self.api_client.get('/api/v1/matchfeed2/',
                                   data={'filter': 'true'}, format='json')
        self.assertValidJSONResponse(resp)
        data = self.deserialize(resp)['objects']
        self.assertEqual(data[0]['friends_score'], 2)
        self.assertEqual(data[1]['friends_score'], 1)
        self.assertEqual(data[2]['friends_score'], 0)

    def test_simple_phrase(self):
        s = Subject.objects.create(description='foreign language')
        Goal.objects.get_or_create(user=self.user, goal=s)
        Goal.objects.get_or_create(user=self.user1, goal=s)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)


class TestMatchEvents(BaseTestCase, ResourceTestCase):
    def setUp(self):
        super(TestMatchEvents, self).setUp()
        haystack.connections.reload('default')
        FacebookCustomUser.objects.all().delete()
        self.user = FacebookCustomUser.objects. \
            create_user(username='user_a', facebook_id=1234567,
                        first_name='Andrii', password='test', gender='m',
                        date_of_birth=date(1989, 5, 20))
        self.user1 = FacebookCustomUser.objects. \
            create_user(username='user_b', facebook_id=12345671,
                        first_name='Sasa', gender='m', password='test',
                        date_of_birth=date(1979, 1, 9))
        user_location = UserLocation.objects.create(
                user=self.user, position=[-87.627696, 41.880745])
        user_location1 = UserLocation.objects.create(
                user=self.user1, position=[-87.627696, 41.880745])
        clear_index.Command().handle(interactive=False)
        rebuild_index.Command().handle(interactive=False)

    def get_credentials(self):
        pass

    def test_my_events(self):
        self.event = Event.objects. \
            create(starts_on='2055-06-13T05:15:22.792659',
                   ends_on='2055-06-14T05:15:22.792659',
                   name="Play piano", location=[7000, 22965.83])
        self.event1 = Event.objects. \
            create(starts_on='2055-06-13T05:15:22.792659',
                   ends_on='2055-06-14T05:15:22.792659',
                   name="python meetup", location=[7000, 22965.83])
        self.membership = Membership.objects. \
            create(user=self.user, event=self.event,
                   is_organizer=True, rsvp='yes')
        self.membership = Membership.objects. \
            create(user=self.user1, event=self.event1,
                   is_organizer=True, rsvp='yes')
        assign_perm('view_event', self.user, self.event)
        update_index.Command().handle(interactive=False)
        events = MatchQuerySet.all_event(self.user.id, feed='my')
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0].name, 'Play piano')

    def test_all_events(self):
        self.event = Event.objects. \
            create(starts_on='2055-06-13T05:15:22.792659',
                   ends_on='2055-06-14T05:15:22.792659',
                   name="Play piano", location=[7000, 22965.83])
        self.event1 = Event.objects. \
            create(starts_on='2055-06-13T05:15:22.792659',
                   ends_on='2055-06-14T05:15:22.792659',
                   name="python meetup", location=[7000, 22965.83])
        self.membership = Membership.objects. \
            create(user=self.user, event=self.event,
                   is_organizer=True, rsvp='yes')
        self.membership = Membership.objects. \
            create(user=self.user1, event=self.event1,
                   is_organizer=True, rsvp='yes')
        assign_perm('view_event', self.user, self.event)
        update_index.Command().handle(interactive=False)
        events = MatchQuerySet.all_event(self.user.id, feed='all')
        self.assertEqual(len(events), 2)
        self.assertEqual(sorted(events, key=lambda x: x.name)[0].name,
                         'Play piano')

    def test_connections_events(self):
        self.event = Event.objects. \
            create(starts_on='2055-06-13T05:15:22.792659',
                   ends_on='2055-06-14T05:15:22.792659',
                   name="Play piano", location=[7000, 22965.83])
        self.event1 = Event.objects. \
            create(starts_on='2055-06-13T05:15:22.792659',
                   ends_on='2055-06-14T05:15:22.792659',
                   name="python meetup", location=[7000, 22965.83])
        self.membership = Membership.objects. \
            create(user=self.user, event=self.event,
                   is_organizer=True, rsvp='yes')
        self.membership = Membership.objects. \
            create(user=self.user1, event=self.event1,
                   is_organizer=True, rsvp='yes')
        Friend.objects.create(friend1=self.user, friend2=self.user1, status=1)
        assign_perm('view_event', self.user, self.event)
        update_index.Command().handle(interactive=False)
        events = MatchQuerySet.all_event(self.user.id, feed='connections')
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0].name, 'python meetup')

    def test_filter_by_distance_my_events(self):
        e = Event.objects.create(starts_on='2055-06-13T05:15:22.792659',
                                 ends_on='2055-06-14T05:15:22.792659',
                                 name="Play piano", location=[7000, 22965.83])

        e1 = Event.objects.create(starts_on='2055-06-13T05:15:22.792659',
                                  ends_on='2055-06-14T05:15:22.792659',
                                  name="python meetup",
                                  location=[700, 22965.83])

        Membership.objects.create(user=self.user, event=e, is_organizer=True,
                                  rsvp='yes')
        Membership.objects.create(user=self.user, event=e1, is_organizer=True,
                                  rsvp='yes')
        assign_perm('view_event', self.user, e)
        assign_perm('view_event', self.user, e1)
        update_index.Command().handle(interactive=False)
        events = MatchQuerySet.all_event(self.user.id, feed='my')
        self.assertEqual(len(events), 2)
        self.assertEqual(events[0].distance[0], 4904)

    def test_filter_by_keywords_my_events(self):
        e = Event.objects.create(starts_on='2055-06-13T05:15:22.792659',
                                 ends_on='2055-06-14T05:15:22.792659',
                                 name="Play piano", location=[7000, 22965.83])

        e1 = Event.objects.create(starts_on='2055-06-13T05:15:22.792659',
                                  ends_on='2055-06-14T05:15:22.792659',
                                  name="python meetup",
                                  location=[700, 22965.83])

        Membership.objects.create(user=self.user, event=e, is_organizer=True,
                                  rsvp='yes')
        Membership.objects.create(user=self.user, event=e1, is_organizer=True,
                                  rsvp='yes')
        assign_perm('view_event', self.user, e)
        assign_perm('view_event', self.user, e1)
        FilterState.objects.create(user=self.user, min_age=18,
                                   max_age=99, keyword='python',
                                   distance=16516)
        update_index.Command().handle(interactive=False)
        events = MatchQuerySet.all_event(self.user.id, feed='my',
                                         is_filter=True)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0].name, 'python meetup')
