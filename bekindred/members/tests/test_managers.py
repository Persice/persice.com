from unittest import TestCase
from django_facebook.models import FacebookLike, FacebookCustomUser
from interests.models import Interest
from members.models import FacebookLikeProxy
from random import randint


def random_digits(digits):
    lower = 10**(digits - 1)
    upper = 10**digits - 1
    return randint(lower, upper)


class TestFacebookLikeProxyManager(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.user = FacebookCustomUser.objects.create_user(username='user_1a', password='test')
        FacebookLike.objects.create(user_id=cls.user.id, facebook_id=random_digits(10), name='Facebook Engineering')
        FacebookLike.objects.create(user_id=cls.user.id, facebook_id=random_digits(10), name='Kyiv Python User Group')
        FacebookLike.objects.create(user_id=cls.user.id, facebook_id=random_digits(10), name='Learn Ruby')

        cls.user1 = FacebookCustomUser.objects.create_user(username='user_1b', password='test')
        FacebookLike.objects.create(user_id=cls.user1.id, facebook_id=random_digits(10), name='Facebook Developers')
        FacebookLike.objects.create(user_id=cls.user1.id, facebook_id=random_digits(10), name='Learn Python')
        FacebookLike.objects.create(user_id=cls.user1.id, facebook_id=random_digits(10), name='Learn Ruby')

        cls.user2 = FacebookCustomUser.objects.create_user(username='user_1c', password='test')
        FacebookLike.objects.create(user_id=cls.user2.id, facebook_id=random_digits(10), name='Study Ruby')

        cls.user3 = FacebookCustomUser.objects.create_user(username='user_1d', password='test')

        cls.user4 = FacebookCustomUser.objects.create_user(username='user_1e', password='test')
        Interest.objects.create(user_id=cls.user4.id, description='Likes Python')
        Interest.objects.create(user_id=cls.user4.id, description='Likes Ruby')

    def test_match_fb_likes_to_fb_likes(self):
        r = FacebookLikeProxy.objects.match_fb_likes_to_fb_likes(self.user.id, [self.user1.id])
        self.assertEqual(len(r), 1)
        self.assertEquals(r[0].name, 'Study Ruby')

    def test_exclude_friends_in_matched(self):
        r = FacebookLikeProxy.objects.match_fb_likes_to_fb_likes(self.user2.id, [self.user.id, self.user1.id])
        self.assertEqual(len(r), 0)

    def test_match_interests_to_fb_likes(self):
        l = FacebookLikeProxy.objects.match_interests_to_fb_likes(self.user4.id, [self.user3.id])
        self.assertEqual(len(l), 5)