from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from goals.models import Subject, MatchFilterState


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