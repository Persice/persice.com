import json

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django_facebook.models import FacebookCustomUser


class Photo(models.Model):
    photo = models.FileField(upload_to='documents/%Y/%m/%d')
    user = models.ForeignKey(FacebookCustomUser)
    order = models.IntegerField(null=True)
    cropped_photo = models.TextField(default='')


class FacebookPhoto(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    photo = models.CharField(max_length=250)
    order = models.IntegerField(null=True)
    bounds = models.TextField(null=True)
    cropped_photo = models.TextField(default='')

    def clean(self):
        try:
            self.bounds = json.dumps(self.bounds)
        except ValueError:
            raise ValidationError(_(
                'Facebook photo bounds must be in json format')
            )
