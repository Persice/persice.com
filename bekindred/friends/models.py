from django.db import models
from django_facebook.models import FacebookCustomUser


class Friend(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    friend = models.ForeignKey(FacebookCustomUser, related_name='friends')

    # def __unicode__(self):
    #     return '%s %s' % (self.user.username, self.friend.username)

    # class Meta:
    #     unique_together = ("user", "friend")