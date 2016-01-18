from django.test import TestCase
from django_facebook.models import FacebookCustomUser
from interests.models import Interest, InterestSubject, ReligiousView, \
    ReligiousIndex, PoliticalIndex, PoliticalView


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
        self.ri = ReligiousIndex.objects.create(name="christianity")

    def test_create_religious_view(self):
        ReligiousView.objects.create(religious_index=self.ri, user=self.user)
        rv = ReligiousView.objects.filter(user=self.user)
        self.assertEqual(rv.count(), 1)
        self.assertEqual(rv[0].religious_index.name, "christianity")

    def test_create_religious_view_two_users(self):
        ReligiousView.objects.create(religious_index=self.ri, user=self.user)
        ReligiousView.objects.create(religious_index=self.ri, user=self.user1)
        rv = ReligiousView.objects.filter(user=self.user1)
        self.assertEqual(rv.count(), 1)
        self.assertEqual(rv[0].religious_index.name, "christianity")


class PoliticalViewTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(
                username='jacob', password='top_secret'
        )
        self.user1 = FacebookCustomUser.objects.create_user(
                username='jacob1', password='top_secret'
        )
        self.ri = PoliticalIndex.objects.create(name="christianity")

    def test_create_religious_view(self):
        PoliticalView.objects.create(political_index=self.ri, user=self.user)
        rv = PoliticalView.objects.filter(user=self.user)
        self.assertEqual(rv.count(), 1)
        self.assertEqual(rv[0].political_index.name, "christianity")

    def test_create_religious_view_two_users(self):
        PoliticalView.objects.create(political_index=self.ri, user=self.user)
        PoliticalView.objects.create(political_index=self.ri, user=self.user1)
        rv = PoliticalView.objects.filter(user=self.user1)
        self.assertEqual(rv.count(), 1)
        self.assertEqual(rv[0].political_index.name, "christianity")
