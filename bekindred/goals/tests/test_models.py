from datetime import date
from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from goals.models import Subject, MatchFilterState, Goal, Offer


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

    def test_stop_words_learn(self):
        self.assertEqual(Subject.objects.search('learn').count(), 0)

    def test_stop_words_study(self):
        self.assertEqual(Subject.objects.search('study').count(), 0)


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
        self.assertEqual(Goal.objects_search.count_common_goals_and_offers(self.user, self.user1), 1)

    def test_count_common_goals_and_offers_only_offers_goals(self):
        Offer.objects.create(user=self.user1, offer=self.subject8)
        Goal.objects.create(user=self.user, goal=self.subject4)
        self.assertEqual(Goal.objects_search.count_common_goals_and_offers(self.user, self.user1), 1)

    def test_count_common_goals_and_offers(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Offer.objects.create(user=self.user, offer=self.subject3)
        Offer.objects.create(user=self.user, offer=self.subject4)

        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user1, goal=self.subject6)
        Offer.objects.create(user=self.user1, offer=self.subject7)
        Offer.objects.create(user=self.user1, offer=self.subject8)

        self.assertEqual(Goal.objects_search.count_common_goals_and_offers(self.user, self.user1), 4)

    def test_count_common_goals_and_offers_only_goals(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Goal.objects.create(user=self.user1, goal=self.subject5)
        Goal.objects.create(user=self.user1, goal=self.subject6)
        self.assertEqual(Goal.objects_search.count_common_goals_and_offers(self.user, self.user1), 2)

    def test_count_common_goals_and_offers_only_offers(self):
        Offer.objects.create(user=self.user, offer=self.subject)
        Offer.objects.create(user=self.user, offer=self.subject2)
        Offer.objects.create(user=self.user1, offer=self.subject5)
        Offer.objects.create(user=self.user1, offer=self.subject6)
        self.assertEqual(Goal.objects_search.count_common_goals_and_offers(self.user, self.user1), 2)




class MatchFilterStateTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        MatchFilterState.objects.create(user=self.user,
                                        distance=1,
                                        min_age=18,
                                        max_age=98,
                                        gender='all',
                                        keyword='python,ruby')

    def test_save_state(self):
        self.assertEqual(MatchFilterState.objects.filter(user=self.user).count(), 1)