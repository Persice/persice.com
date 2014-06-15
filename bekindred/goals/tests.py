from django.test import TestCase
from .models import Subject


class SubjectTestCase(TestCase):
    def setUp(self):
        Subject.objects.create(description="Play piano")
        
    def test_goals_description(self):
        goal = Subject.objects.get(description="Play piano")
        self.assertEqual(goal.description, "Play piano")
