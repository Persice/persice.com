from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from interests.models import Interest, InterestSubject, ReligiousView


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


class ReligiousViewTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(
                username='jacob', password='top_secret'
        )
        self.user1 = FacebookCustomUser.objects.create_user(
                username='jacob1', password='top_secret'
        )

    def test_create_religious_view(self):
        ReligiousView.objects.create(name="christianity", user=self.user)
        rv = ReligiousView.objects.filter(user=self.user)
        self.assertEqual(rv.count(), 1)
        self.assertEqual(rv[0].name, "christianity")

    def test_create_religious_view_two_users(self):
        ReligiousView.objects.create(name="christianity", user=self.user)
        ReligiousView.objects.create(name="christianity", user=self.user1)
        rv = ReligiousView.objects.filter(user=self.user1)
        self.assertEqual(rv.count(), 1)
        self.assertEqual(rv[0].name, "christianity")
