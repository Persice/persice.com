from unittest import TestCase
from django_facebook.models import FacebookCustomUser, FacebookLike
from interests.models import Interest
from members.tests.test_managers import random_digits


class TestInterestManager(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        Interest.objects.create(user_id=cls.user.id, description='Likes Python')
        Interest.objects.create(user_id=cls.user.id, description='Learn Ruby')
        Interest.objects.create(user_id=cls.user.id, description='Study Java')
        Interest.objects.create(user_id=cls.user.id, description='Teach Haskell')

        cls.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        Interest.objects.create(user_id=cls.user1.id, description='Likes Java')
        Interest.objects.create(user_id=cls.user1.id, description='Likes Facebook')

        cls.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        Interest.objects.create(user_id=cls.user2.id, description='Python Web Development')

        cls.user3 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        FacebookLike.objects.create(user_id=cls.user3.id, facebook_id=random_digits(10), name='Facebook Developers')
        FacebookLike.objects.create(user_id=cls.user3.id, facebook_id=random_digits(10), name='Learn Python')
        FacebookLike.objects.create(user_id=cls.user3.id, facebook_id=random_digits(10), name='Learn Ruby')

        cls.user4 = FacebookCustomUser.objects.create_user(username='user_e', password='test')

    def test_match_interests_to_interests(self):
        t = Interest.search_subject.match_interests_to_interests(self.user2, [self.user1])
        self.assertEqual(len(t), 1)
        self.assertEqual(t[0].description, "Likes Python")

    def test_match_fb_likes_to_interests(self):
        l = Interest.search_subject.match_fb_likes_to_interests(self.user3.id, [self.user1.id])
        self.assertEqual(len(l), 4)
        self.assertEqual([x.description for x in l], [u'Python Web Development',
                                                      u'Likes Python',
                                                      u'Python Web Development',
                                                      u'Learn Ruby'])

    def test_count_interests_fb_likes(self):
        count = Interest.search_subject.count_interests_fb_likes(self.user.id, self.user1.id)
        self.assertEqual(count, 5)