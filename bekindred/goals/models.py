from django.db import models
from django_facebook.models import FacebookCustomUser


class Subject(models.Model):
    description = models.CharField(max_length=50, null=False, blank=False, unique=True)

    def __unicode__(self):
        return self.description


class Goal(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    goal = models.ForeignKey(Subject)

    def __unicode__(self):
        return self.goal.description

    class Meta:
        unique_together = ("user", "goal")


class Offer(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    offer = models.ForeignKey(Subject)

    def __unicode__(self):
        return self.offer.description

    class Meta:
        unique_together = ("user", "offer")


class Keyword(models.Model):
    text = models.CharField(max_length=20)
    subject = models.ForeignKey(Subject)