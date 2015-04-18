from unittest import TestCase
from django_facebook.models import FacebookCustomUser, FacebookLike
from interests.models import Interest, InterestSubject
from members.models import FacebookLikeProxy
from members.tests.test_managers import random_digits


class TestInterestManager(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        cls.interest1 = InterestSubject.objects.create(description='Likes Python')
        cls.interest2 = InterestSubject.objects.create(description='Learn Ruby')
        cls.interest3 = InterestSubject.objects.create(description='Study Java')
        cls.interest4 = InterestSubject.objects.create(description='Teach Haskell')

        Interest.objects.create(user_id=cls.user.id, interest_id=cls.interest1.id)
        Interest.objects.create(user_id=cls.user.id, interest_id=cls.interest2.id)
        Interest.objects.create(user_id=cls.user.id, interest_id=cls.interest3.id)
        Interest.objects.create(user_id=cls.user.id, interest_id=cls.interest4.id)

        cls.user1 = FacebookCustomUser.objects.create_user(username='user_b', password='test')
        cls.interest5 = InterestSubject.objects.create(description='Likes Java')
        cls.interest6 = InterestSubject.objects.create(description='Likes Facebook')

        Interest.objects.create(user_id=cls.user1.id, interest_id=cls.interest5.id)
        Interest.objects.create(user_id=cls.user1.id, interest_id=cls.interest6.id)

        cls.user2 = FacebookCustomUser.objects.create_user(username='user_c', password='test')
        cls.interest7 = InterestSubject.objects.create(description='Python Web Development')
        Interest.objects.create(user_id=cls.user2.id, interest_id=cls.interest7.id)

        cls.user3 = FacebookCustomUser.objects.create_user(username='user_d', password='test')
        FacebookLike.objects.create(user_id=cls.user3.id, facebook_id=random_digits(10), name='Facebook Developers')
        FacebookLike.objects.create(user_id=cls.user3.id, facebook_id=random_digits(10), name='Learn Python')
        FacebookLike.objects.create(user_id=cls.user3.id, facebook_id=random_digits(10), name='Learn Ruby')

        cls.user4 = FacebookCustomUser.objects.create_user(username='user_e', password='test')

    def test_match_interests_to_interests(self):
        t = Interest.objects_search.match_interests_to_interests(self.user2, [self.user1])
        self.assertEqual(len(t), 1)
        self.assertEqual(t[0].interest.description, "Likes Python")

    def test_match_fb_likes_to_interests(self):
        l = Interest.objects_search.match_fb_likes_to_interests(self.user3.id, [self.user1.id])
        self.assertEqual(len(l), 3)
        self.assertEqual([x.interest.description for x in sorted(l, key=lambda x: x.interest.description)],
                         [u'Learn Ruby', u'Likes Python', u'Python Web Development'])

    def test_count_interests_fb_likes(self):
        count = Interest.objects_search.count_interests_fb_likes(self.user.id, self.user1.id)
        count2 = FacebookLikeProxy.objects.count_fb_likes_interests(self.user.id, self.user1.id)
        self.assertEqual(count + count2, 2)