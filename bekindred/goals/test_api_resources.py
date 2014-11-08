from django.test import TestCase

from .models import Subject


class ApiTestCase(TestCase):
    def test_goals_description(self):
        self.assertEqual(1 + 1, 2)
