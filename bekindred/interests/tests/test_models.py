from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from interests.models import Interest, InterestSubject


class InterestsTestCase(TestCase):
    def setUp(self):
        user = FacebookCustomUser.objects.create_user(
            username='jacob', password='top_secret')
        i1 = InterestSubject.objects.create(description="test desc")
        Interest.objects.create(interest=i1, user=user)
        self.i2 = InterestSubject.objects.create(description="reading")
        Interest.objects.create(interest=self.i2, user=user)

    def test_interests_description(self):
        desc = Interest.objects.get(interest__description="test desc").interest.description
        self.assertEqual(desc, "test desc")

    def test_search_interest(self):
        self.assertEqual(InterestSubject.objects.search('reads')[0].description, 'reading')