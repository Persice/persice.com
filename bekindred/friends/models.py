from itertools import chain

from django.db import models
from django.db.models import Q
from django_facebook.models import FacebookCustomUser, FacebookUser

from members.models import FacebookCustomUserActive


class FriendManager(models.Manager):
    def update_friend(self, friend1, friend2):
        sender = FacebookCustomUser.objects.get(pk=1)
        u1 = FacebookCustomUser.objects.get(pk=friend1)
        u2 = FacebookCustomUser.objects.get(pk=friend2)
        result = Friend.objects.filter(Q(friend1=friend1, friend2=friend2) |
                                       Q(friend1=friend2, friend2=friend1))[0]
        return result

    def delete_friend(self, friend1, friend2):
        """
        """
        result = Friend.objects.filter(Q(friend1=friend1, friend2=friend2) |
                                       Q(friend1=friend2, friend2=friend1)).update(status=2)
        return result


    def confirm_friend_request(self, friend1, friend2):
        result = Friend.objects.filter(Q(friend1=friend1, friend2=friend2) |
                                       Q(friend1=friend2, friend2=friend1))[0]
        if result.status == 0:
            result.update(status=1)
        return result

    def check_friend_request(self, friend1, friend2):
        try:
            result = Friend.objects.filter(Q(friend1=friend1, friend2=friend2, status=0) |
                                           Q(friend1=friend2, friend2=friend1, status=0))[0]
        except IndexError:
            return False
        return True


    def checking_friendship(self, friend1, friend2):
        try:
            result = Friend.objects.filter(Q(friend1=friend1, friend2=friend2) |
                                           Q(friend1=friend2, friend2=friend1))[0]
        except IndexError:
            return False
        if result.status == 1:
            return True
        else:
            return False

    def all_my_friends(self, user_id):
        result = Friend.objects.filter(Q(friend1=user_id, status=1) |
                                       Q(friend2=user_id, status=1))
        all = list(chain(*result.values_list('friend1', 'friend2')))
        return [x for x in all if x != user_id]

    def friends(self, user_id):
        return super(FriendManager, self).get_queryset().filter(Q(friend1=user_id, friend1__is_active=True,
                                                                  friend2__is_active=True, status=1) |
                                                                Q(friend2=user_id, friend2__is_active=True,
                                                                  friend1__is_active=True, status=1))

    def deleted_friends(self, user_id):
        """
        Return All delete friends and all friends which you declined
        """
        result = Friend.objects.filter(Q(friend1=user_id, status__in=(-1, 2)) |
                                       Q(friend2=user_id, status__in=(-1, 2)))
        all = list(chain(*result.values_list('friend1', 'friend2')))
        return [x for x in all if x != user_id]

    def mutual_friends(self, friend1, friend2):
        results = []
        friends_ids = list(set(self.all_my_friends(friend1)) & set(self.all_my_friends(friend2)))
        users = FacebookCustomUser.objects.filter(id__in=friends_ids)
        for user in users:
            d = dict()
            d['user_id'] = user.id
            d['facebook_id'] = user.facebook_id
            d['first_name'] = user.first_name
            d['last_name'] = user.last_name
            results.append(d)
        return results

    def thumbed_up_i(self, user_id):
        return list(Friend.objects.filter(friend1=user_id, status=0).values_list('friend2', flat=True))

    def thumbed_up_me(self, friend1, friend2):
        return Friend.objects.filter(friend1=friend1, friend2=friend2, status=0)


class Friend(models.Model):
    objects = FriendManager()
    FRIENDSHIP_STATUS = (
        (-1, 'Decline friend request'),
        (0, 'Pending friend request'),
        (1, 'Status friends')
    )
    friend1 = models.ForeignKey(FacebookCustomUser)
    friend2 = models.ForeignKey(FacebookCustomUser, related_name='friend2')
    status = models.IntegerField(max_length=1, choices=FRIENDSHIP_STATUS, default=0)
    updated_at = models.DateTimeField(null=True, blank=True)

    def __unicode__(self):
        return '%s %s %s' % (self.friend1.username, self.friend2.username, self.status)

    class Meta:
        unique_together = ("friend1", "friend2")


class FacebookFriendManager(models.Manager):
    def all_my_friends(self, user_id):
        return list(FacebookUser.objects.filter(user_id=user_id).values_list('facebook_id', flat=True))

    def mutual_friends(self, friend1, friend2):
        facebook_ids = list(set(self.all_my_friends(friend1)) & set(self.all_my_friends(friend2)))
        users = FacebookCustomUserActive.objects.filter(facebook_id__in=facebook_ids)
        result = []
        for user in users:
            d = dict()
            d['facebook_id'] = user.facebook_id
            d['first_name'] = user.first_name
            d['last_name'] = user.last_name
            result.append(d)
        return result


class FacebookFriendUser(FacebookUser):
    objects = FacebookFriendManager()

    class Meta:
        proxy = True


class TwitterListFriends(models.Model):
    twitter_id1 = models.BigIntegerField(null=False, blank=False)
    twitter_id2 = models.BigIntegerField(null=False, blank=False)
    name1 = models.CharField(max_length=50)
    name2 = models.CharField(max_length=50)
    profile_image_url1 = models.CharField(max_length=200)
    profile_image_url2 = models.CharField(max_length=200)


class TwitterListFollowers(models.Model):
    twitter_id1 = models.BigIntegerField(null=False, blank=False)
    twitter_id2 = models.BigIntegerField(null=False, blank=False)
    name1 = models.CharField(max_length=50)
    name2 = models.CharField(max_length=50)
    profile_image_url1 = models.CharField(max_length=200)
    profile_image_url2 = models.CharField(max_length=200)