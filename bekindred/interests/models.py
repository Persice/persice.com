from django.db import models
from django_facebook.models import FacebookCustomUser


class Interest(models.Model):
    description = models.TextField(max_length=50, null=False, blank=False)
    user = models.ForeignKey(FacebookCustomUser)

    def __unicode__(self):
        return self.description

    class Meta:
        unique_together = ("user", "description")