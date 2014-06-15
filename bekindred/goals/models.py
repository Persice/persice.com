from django.contrib.auth.models import User
from django.db import models


class Subject(models.Model):
    description = models.CharField(max_length=20, null=False, blank=False, unique=True)

    def __unicode__(self):
        return self.description


class UserGoal(models.Model):
    user = models.ForeignKey(User)
    goal = models.ForeignKey(Subject)

    def __unicode__(self):
        return self.goal.description

    class Meta:
        # db_table = 'goals_user_goal'
        unique_together = ("user", "goal")


class UserOffer(models.Model):
    user = models.ForeignKey(User)
    offer = models.ForeignKey(Subject)

    def __unicode__(self):
        return self.offer.description

    class Meta:
        unique_together = ("user", "offer")
