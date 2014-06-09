from django.db import models


class Goal(models.Model):
    description = models.CharField(max_length=20, blank=False)

    def __unicode__(self):
        return self.description