from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from interests.models import Interest


class InterestsTestCase(TestCase):
    def setUp(self):
        user = FacebookCustomUser.objects.create_user(
            username='jacob', password='top_secret')
        Interest.objects.create(description="test desc", user=user)
        self.i1 = Interest.objects.create(description="reading", user=user)

    def test_interests_description(self):
        desc = Interest.objects.get(description="test desc").description
        self.assertEqual(desc, "test desc")

    def test_search_interest(self):
        self.assertEqual(Interest.objects.search('reads')[0].description, 'reading')