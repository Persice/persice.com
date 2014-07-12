from django.db import models
from django_facebook.models import FacebookCustomUser


class Friend(models.Model):
    FRIENDSHIP_STATUS = (
        ('R', 'request'),
        ('C', 'confirm'),
        ('F', 'friends'),
    )
    friend1 = models.ForeignKey(FacebookCustomUser)
    friend2 = models.ForeignKey(FacebookCustomUser, related_name='friends')
    status = models.CharField(max_length=1, choices=FRIENDSHIP_STATUS, default='R')

    def __unicode__(self):
        return '%s %s %s' % (self.user.username, self.friend.username, self.status)

    class Meta:
        unique_together = ("friend1", "friend2")