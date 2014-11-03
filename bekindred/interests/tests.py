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
        self.assertEqual(Interest.objects.search('read')[0].description, 'reading')

    def test_match_interests(self):
        user = FacebookCustomUser.objects.create_user(
            username='goro', password='top_secret')
        user2 = FacebookCustomUser.objects.create_user(
            username='tesla', password='top_secret')
        user3 = FacebookCustomUser.objects.create_user(
            username='guido', password='top_secret')
        i1 = Interest.objects.create(description="interest1", user=user)
        i2 = Interest.objects.create(description="interest2", user=user)
        i3 = Interest.objects.create(description="read", user=user)
        i4 = Interest.objects.create(description="read", user=user2)
        i5 = Interest.objects.create(description="top int", user=user2)
        i6 = Interest.objects.create(description="reading", user=user3)

        search = Interest.search_subject.search_interest(user.id)
        self.assertEqual([x.description for x in search], [u'reading', u'read', u'reading'])