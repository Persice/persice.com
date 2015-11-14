from datetime import date
from django.core.management import call_command
from django_facebook.models import FacebookCustomUser, FacebookLike
import haystack

from events.models import FilterState
from goals.models import Subject, Offer, Goal
from interests.models import InterestSubject, Interest
from match_engine.models import ElasticSearchMatchEngine
from django.test import TestCase
from haystack.management.commands import update_index, rebuild_index
from matchfeed.utils import MatchQuerySet


class BaseTestCase(TestCase):

    def setUp(self):
        haystack.connections.reload('default')
        super(BaseTestCase, self).setUp()

    def tearDown(self):
        call_command('clear_index', interactive=False, verbosity=0)


class TestMatchQuerySet(BaseTestCase):
    fixtures = ['initial_data.json']

    def setUp(self):
        haystack.connections.reload('default')
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

        self.subject = Subject.objects.create(description='learn django')
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

    def test_simple_match_goals_with_root_forms_of_word(self):
        Goal.objects.create(user=self.user, goal=self.subject11)
        Goal.objects.create(user=self.user1, goal=self.subject10)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['goals'],
                         [u'learn <em>kiteboarding</em> and foxes'])

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
        Goal.objects.create(user=self.user1, goal=self.subject13)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.%s' % self.user1.id)
        self.assertEqual(match_users[0]['highlight']['goals'],
                         [u'<em>child</em>'])

    def test_simple_top_interests(self):
        Goal.objects.create(user=self.user, goal=self.subject12)
        Goal.objects.create(user=self.user1, goal=self.subject13)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].top_interests,
                         [{u'child': 1, u'teach django': 0, u'test': 0}])

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
                         [{u'child': 1, u'django': 1, u'python': 1}])

    def test_simple_top_interests_less_than_3(self):
        Goal.objects.create(user=self.user, goal=self.subject11)
        Goal.objects.create(user=self.user1, goal=self.subject10)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].top_interests,
                         [{u'kiteboarding': 1,
                           u'teach django': 0,
                           u'test': 0}])

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
        FilterState.objects.create(user=self.user, gender='m')
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
        FilterState.objects.create(user=self.user, gender='f,m', max_age=99)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 3)

    def test_filter_age(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user3, goal=self.subject5)
        Goal.objects.create(user=self.user4, goal=self.subject5)
        FilterState.objects.create(user=self.user, min_age=36, max_age=36)
        update_index.Command().handle(interactive=False)
        match_users = MatchQuerySet.all(self.user.id, is_filter=True)
        self.assertEqual(len(match_users), 1)
        self.assertEqual(match_users[0].first_name, 'Sasa')
        self.assertEqual(match_users[0].age, 36)
