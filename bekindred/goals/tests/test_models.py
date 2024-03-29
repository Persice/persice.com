from datetime import date

from django.test import TestCase

from django_facebook.models import FacebookCustomUser

from goals.models import Subject, MatchFilterState, Goal, Offer
from interests.models import InterestSubject, Interest
from match_engine.models import MatchEngineManager, MatchEngine
from matchfeed.models import MatchFeedManager


class SubjectTestCase(TestCase):
    def setUp(self):
        Subject.objects.create(description="Play piano")
        Subject.objects.create(description="Learn piano")
        Subject.objects.create(description="Study piano")

    def test_goals_description(self):
        goal = Subject.objects.get(description="Play piano")
        self.assertEqual(goal.description, "Play piano")

    def test_search_text(self):
        self.assertEqual(Subject.objects.search('piano').count(), 3)

    def test_stop_words_study(self):
        self.assertEqual(Subject.objects.search('study').count(), 1)


class GoalTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', facebook_id=1234567,
                                                           password='test', date_of_birth=date(1989, 5, 20))
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', facebook_id=12345671,
                                                            password='test', date_of_birth=date(1989, 1, 9))
        self.subject = Subject.objects.create(description='learn django')
        self.subject2 = Subject.objects.create(description='learn python')
        self.subject3 = Subject.objects.create(description='teach erlang')
        self.subject4 = Subject.objects.create(description='teach javascript')

        self.subject5 = Subject.objects.create(description='teach django')
        self.subject6 = Subject.objects.create(description='teach python')
        self.subject7 = Subject.objects.create(description='learn erlang')
        self.subject8 = Subject.objects.create(description='learn javascript')

    def test_count_common_goals_and_offers_only_goals_offers(self):
        Offer.objects.create(user=self.user, offer=self.subject2)
        Goal.objects.create(user=self.user1, goal=self.subject6)
        self.assertEqual(MatchEngine.objects.count_common_goals_and_offers(self.user.id, self.user1.id), 1)

    def test_count_common_goals_and_offers_only_offers_goals(self):
        Offer.objects.create(user=self.user1, offer=self.subject8)
        Goal.objects.create(user=self.user, goal=self.subject4)
        self.assertEqual(MatchEngine.objects.count_common_goals_and_offers(self.user.id, self.user1.id), 1)

    def test_count_common_goals_and_offers(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Offer.objects.create(user=self.user, offer=self.subject3)
        Offer.objects.create(user=self.user, offer=self.subject4)

        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user1, goal=self.subject6)
        Offer.objects.create(user=self.user1, offer=self.subject7)
        Offer.objects.create(user=self.user1, offer=self.subject8)

        self.assertEqual(MatchEngine.objects.count_common_goals_and_offers(self.user.id, self.user1.id), 4)

    def test_count_common_goals_and_offers_only_goals(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user1, goal=self.subject6)
        self.assertEqual(MatchEngine.objects.count_common_goals_and_offers(self.user.id, self.user1.id), 2)

    def test_count_common_goals_and_offers_only_offers(self):
        Offer.objects.create(user=self.user, offer=self.subject)
        Offer.objects.create(user=self.user, offer=self.subject2)
        Offer.objects.create(user=self.user1, offer=self.subject5)
        Offer.objects.create(user=self.user1, offer=self.subject6)
        self.assertEqual(MatchEngine.objects.count_common_goals_and_offers(self.user.id, self.user1.id), 2)


class GoalManagerTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.user3 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        self.s1 = Subject.objects.create(description='python')
        self.s2 = Subject.objects.create(description='ruby')
        self.s3 = Subject.objects.create(description='erlang')
        self.s4 = Subject.objects.create(description='oralce')
        self.i1 = InterestSubject.objects.create(description='learning python')
        self.i2 = InterestSubject.objects.create(description='teaching ruby')
        self.i3 = InterestSubject.objects.create(description='erlang')
        self.i4 = InterestSubject.objects.create(description='oracle')

    def test_match_goal_to_goal(self):
        Goal.objects.create(goal=self.s1, user=self.user)
        Goal.objects.create(goal=self.s1, user=self.user1)
        Goal.objects.create(goal=self.s1, user=self.user2)
        Offer.objects.create(offer=self.s1, user=self.user3)
        goals = [unicode(x) for x in MatchEngineManager.match_goals_to_goals(self.user.id, [])]
        self.assertEqual(len(goals), 2)
        self.assertEqual(goals, [u'python', u'python'])

    def test_match_offers_to_goals(self):
        Goal.objects.create(goal=self.s1, user=self.user1)
        Goal.objects.create(goal=self.s2, user=self.user1)
        Offer.objects.create(offer=self.s3, user=self.user1)
        Offer.objects.create(offer=self.s4, user=self.user1)

        Goal.objects.create(goal=self.s3, user=self.user)
        Goal.objects.create(goal=self.s4, user=self.user)
        Offer.objects.create(offer=self.s1, user=self.user)
        Offer.objects.create(offer=self.s2, user=self.user)

        goals = [unicode(x) for x in MatchEngineManager.match_offers_to_goals(self.user.id, [])]
        self.assertEqual(len(goals), 2)
        self.assertEqual(goals, [u'python', u'ruby'])

    def test_match_interests_to_goals(self):
        Goal.objects.create(goal=self.s1, user=self.user1)
        Goal.objects.create(goal=self.s2, user=self.user1)
        Goal.objects.create(goal=self.s3, user=self.user1)
        Goal.objects.create(goal=self.s4, user=self.user1)
        Interest.objects.create(interest=self.i1, user=self.user)
        Interest.objects.create(interest=self.i2, user=self.user2)
        Interest.objects.create(interest=self.i3, user=self.user3)

        goals = [unicode(x) for x in MatchEngineManager.match_interests_to_goals(self.user1.id, [])]
        self.assertEqual(goals, [])

        goals = [unicode(x) for x in MatchEngineManager.match_interests_to_goals(self.user.id, [])]
        self.assertEqual(goals, ['python'])


class OfferManagerTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.user3 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        self.s1 = Subject.objects.create(description='python')
        self.s2 = Subject.objects.create(description='ruby')
        self.s3 = Subject.objects.create(description='erlang')
        self.s4 = Subject.objects.create(description='oralce')
        self.i1 = InterestSubject.objects.create(description='python')
        self.i2 = InterestSubject.objects.create(description='ruby')
        self.i3 = InterestSubject.objects.create(description='erlang')
        self.i4 = InterestSubject.objects.create(description='oralce')

    def test_match_offer_to_offer(self):
        Offer.objects.create(offer=self.s1, user=self.user)
        Offer.objects.create(offer=self.s1, user=self.user1)
        Offer.objects.create(offer=self.s1, user=self.user2)
        Goal.objects.create(goal=self.s1, user=self.user3)
        offers = [unicode(x) for x in MatchEngineManager.match_offers_to_offers(self.user.id, [])]
        self.assertEqual(len(offers), 2)
        self.assertEqual(offers, [u'python', u'python'])

    def test_match_goals_to_offers(self):
        Goal.objects.create(goal=self.s1, user=self.user)
        Goal.objects.create(goal=self.s2, user=self.user)
        Offer.objects.create(offer=self.s3, user=self.user)
        Offer.objects.create(offer=self.s4, user=self.user)

        Goal.objects.create(goal=self.s3, user=self.user1)
        Goal.objects.create(goal=self.s4, user=self.user1)
        Offer.objects.create(offer=self.s1, user=self.user1)
        Offer.objects.create(offer=self.s2, user=self.user1)
        offers = [unicode(x) for x in MatchEngineManager.match_goals_to_offers(self.user.id, [])]
        self.assertEqual(len(offers), 2)
        self.assertEqual(offers, [u'python', u'ruby'])

    def test_match_interests_to_offers(self):
        Offer.objects.create(offer=self.s1, user=self.user1)
        Offer.objects.create(offer=self.s2, user=self.user1)
        Offer.objects.create(offer=self.s3, user=self.user1)
        Offer.objects.create(offer=self.s4, user=self.user1)
        Interest.objects.create(interest=self.i1, user=self.user)
        Interest.objects.create(interest=self.i2, user=self.user2)
        Interest.objects.create(interest=self.i3, user=self.user3)

        offers = [unicode(x) for x in MatchEngineManager.match_interests_to_offers(self.user1.id, [])]
        self.assertEqual(offers, [])

        offers = [unicode(x) for x in MatchEngineManager.match_interests_to_offers(self.user.id, [])]
        self.assertEqual(offers, ['python'])


class MatchFeedManagerTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.user3 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        self.s1 = Subject.objects.create(description='python')
        self.s2 = Subject.objects.create(description='ruby')
        self.s3 = Subject.objects.create(description='oralce')
        self.s4 = Subject.objects.create(description='erlang')
        self.s5 = Subject.objects.create(description='java')
        self.s6 = Subject.objects.create(description='pascal')
        self.s7 = Subject.objects.create(description='django')
        self.s8 = Subject.objects.create(description='flask')


class MatchFilterStateTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        MatchFilterState.objects.filter(user=self.user).\
            update(distance=1, min_age=18, max_age=98, gender='all',
                   keyword='python,ruby', order_criteria='distance')

    def test_save_state(self):
        self.assertEqual(MatchFilterState.objects.filter(user=self.user).count(), 1)
