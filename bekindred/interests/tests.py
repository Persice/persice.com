from django.test import TestCase
from interests.models import Interest


class InterestsTestCase(TestCase):
    def setUp(self):
        Interest.objects.create(description="test desc")

    def test_interests_description(self):
        desc = Interest.objects.get(description="test desc").description
        self.assertEqual(desc, "test desc")
