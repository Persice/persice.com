from django.test import TestCase
from .models import Goal


class GoalTestCase(TestCase):
    def setUp(self):
        Goal.objects.create(description="Play piano")
        
    def test_goals_description(self):
        goal = Goal.objects.get(description="Play piano")
        self.assertEqual(goal.description, "Play piano")
