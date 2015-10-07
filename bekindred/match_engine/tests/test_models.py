from datetime import date
from django.core.management import call_command
from django_facebook.models import FacebookCustomUser, FacebookLike
import haystack
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


class TestInterestManager(BaseTestCase):
    fixtures = ['initial_data.json']

    def setUp(self):
        haystack.connections.reload('default')
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', facebook_id=1234567,
                        first_name='Andrii', password='test',
                        date_of_birth=date(1989, 5, 20))
        self.user1 = FacebookCustomUser.objects.\
            create_user(username='user_b', facebook_id=12345671,
                        first_name='Sasa',
                        password='test', date_of_birth=date(1989, 1, 9))
        self.subject = Subject.objects.create(description='learn django')
        self.subject2 = Subject.objects.create(description='learn python')
        self.subject3 = Subject.objects.create(description='teach erlang')
        self.subject4 = Subject.objects.create(description='teach javascript')

        self.subject5 = Subject.objects.create(description='teach django')
        self.subject6 = Subject.objects.create(description='teach python')
        self.subject7 = Subject.objects.create(description='learn erlang')
        self.subject8 = Subject.objects.create(description='learn javascript')

        self.i_subject = InterestSubject.objects.\
            create(description='teach django')
        self.i_subject1 = InterestSubject.objects. \
            create(description='learn django')
        self.i_subject2 = InterestSubject.objects. \
            create(description='teach python')
        self.i_subject3 = InterestSubject.objects. \
            create(description='learn python')

        rebuild_index.Command().handle(interactive=False)

    def tearDown(self):
        haystack.connections['default'].get_backend().clear()

    def test_simple_match_goals(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine.\
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.2')
        self.assertEqual(match_users[0]['highlight']['goals'],
                         [u'teach <em>django</em>'])

    def test_simple_match_offers(self):
        Offer.objects.create(user=self.user, offer=self.subject2)
        Offer.objects.create(user=self.user1, offer=self.subject6)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.2')
        self.assertEqual(match_users[0]['highlight']['offers'],
                         [u'teach <em>python</em>'])

    def test_simple_match_interests(self):
        Interest.objects.create(user=self.user, interest=self.i_subject)
        Interest.objects.create(user=self.user1, interest=self.i_subject1)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine. \
            elastic_objects.match(user_id=self.user.id)
        self.assertEqual(match_users[0]['_id'],
                         u'members.facebookcustomuseractive.2')
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
                         u'members.facebookcustomuseractive.2')
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
                         u'members.facebookcustomuseractive.2')
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
                         u'members.facebookcustomuseractive.2')
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

