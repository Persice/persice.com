from django.contrib.auth.models import User
from django.db import models


class Goal(models.Model):
    description = models.CharField(max_length=20, blank=False)
    users = models.ManyToManyField(User)
    is_offer = models.BooleanField(default=False)

    def __unicode__(self):
        return self.description