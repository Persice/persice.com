from django.db import models
from django.db.models import Q
from itertools import chain
from django_facebook.models import FacebookCustomUser, FacebookUser
from postman.api import pm_write

class FriendManager(models.Manager):
    def update_friend(self, friend1, friend2):
        sender = FacebookCustomUser.objects.get(pk=1)
        u1 = FacebookCustomUser.objects.get(pk=friend1)
        u2 = FacebookCustomUser.objects.get(pk=friend2)
        pm_write(
            sender=sender,
            recipient=u1,
            subject='test',
            body="You and {} are now peeps".format(u2.first_name)
        )
        pm_write(
            sender=sender,
            recipient=u2,
            subject='test',
            body="You and {} are now peeps".format(u1.first_name)
        )
        result = Friend.objects.filter(Q(friend1=friend1, friend2=friend2) |
                                       Q(friend1=friend2, friend2=friend1))[0]
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

    def mutual_friends(self, friend1, friend2):
        return list(set(self.all_my_friends(friend1)) & set(self.all_my_friends(friend2)))

    def thumbed_up_i(self, user_id):
        return list(Friend.objects.filter(friend1=user_id, status=0).values_list('friend2', flat=True))

    def thumbed_up_me(self, friend1, friend2):
        return Friend.objects.filter(friend1=friend1, friend2=friend2, status=0)



class Friend(models.Model):
    objects = FriendManager()
    FRIENDSHIP_STATUS = (
        (0, 'Pending friend request'),
        (1, 'Confirm friend request')
    )
    friend1 = models.ForeignKey(FacebookCustomUser)
    friend2 = models.ForeignKey(FacebookCustomUser, related_name='friend2')
    status = models.IntegerField(max_length=1, choices=FRIENDSHIP_STATUS, default=0)

    def __unicode__(self):
        return '%s %s %s' % (self.friend1.username, self.friend2.username, self.status)

    class Meta:
        unique_together = ("friend1", "friend2")


class FacebookFriendManager(models.Manager):

    def all_my_friends(self, user_id):
        return list(FacebookUser.objects.filter(user_id=user_id).values_list('facebook_id', flat=True))

    def mutual_friends(self, friend1, friend2):
        return list(set(self.all_my_friends(friend1)) & set(self.all_my_friends(friend2)))


class FacebookFriendUser(FacebookUser):
    objects = FacebookFriendManager()

    class Meta:
        proxy = True