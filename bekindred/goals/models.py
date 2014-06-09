from django.db import models
from django.contrib.auth.models import User


class Goal(models.Model):
    description = models.CharField(max_length=20, blank=False)
    user = models.ForeignKey(User)

    def __unicode__(self):
        return self.description

        