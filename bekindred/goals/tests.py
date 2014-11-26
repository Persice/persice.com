from django.test import TestCase
from .models import Subject


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