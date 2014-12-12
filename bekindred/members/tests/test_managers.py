from unittest import TestCase
from django_facebook.models import FacebookLike, FacebookCustomUser
from members.models import FacebookLikeProxy
from random import randint


def random_digits(digits):
    lower = 10**(digits - 1)
    upper = 10**digits - 1
    return randint(lower, upper)


class TestFacebookLikeProxyManager(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        self.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        self.user3 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        FacebookLike.objects.create(user_id=self.user.id, facebook_id=random_digits(10), name='Facebook Engineering')
        FacebookLike.objects.create(user_id=self.user.id, facebook_id=random_digits(10), name='Kyiv Python User Group')
        FacebookLike.objects.create(user_id=self.user.id, facebook_id=random_digits(10), name='Learn Ruby')
        FacebookLike.objects.create(user_id=self.user1.id, facebook_id=random_digits(10), name='Facebook Developers')
        FacebookLike.objects.create(user_id=self.user1.id, facebook_id=random_digits(10), name='Learn Python')
        FacebookLike.objects.create(user_id=self.user1.id, facebook_id=random_digits(10), name='Learn Ruby')
        FacebookLike.objects.create(user_id=self.user2.id, facebook_id=random_digits(10), name='Study Ruby')

    def tearDown(self):
        pass

    def test_match_fb_likes_to_fb_likes(self):
        r = FacebookLikeProxy.objects.match_fb_likes_to_fb_likes(self.user.id, [self.user1.id])
        self.assertEqual(len(r), 1)
        self.assertEquals(r[0].name, 'Study Ruby')

    # def test_match_activities_to_fb_likes(self):
    #     self.fail()