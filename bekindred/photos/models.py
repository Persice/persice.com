import json
from cStringIO import StringIO

import os
from PIL import Image
from django.core.exceptions import ValidationError
from django.core.files import File
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django_facebook.connect import _update_image
from django_facebook.models import FacebookCustomUser, PROFILE_IMAGE_PATH

from photos.utils import crop_photo


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
    cropped_photo = models.ImageField(blank=True, null=True,
                                      upload_to=PROFILE_IMAGE_PATH,
                                      max_length=255)

    def clean(self):
        try:
            self.bounds = json.dumps(self.bounds)
        except ValueError:
            raise ValidationError(_(
                'Facebook photo bounds must be in json format')
            )

    def save(self, *args, **kwargs):
        if self.pk is None and self.photo:
            image_name, image_file = _update_image(self.user.facebook_id,
                                                   self.photo)
            if not isinstance(self.bounds, dict):
                try:
                    cleared_bounds = self.bounds.replace("\'", '"') if self.bounds else None
                    bounds = json.loads(cleared_bounds)
                except (ValueError, TypeError):
                    bounds = None
            else:
                bounds = self.bounds

            if bounds:
                filename, content = crop_photo(self.user, image_file, bounds)
            else:
                filename, content = image_name, image_file
            self.cropped_photo = content
        super(FacebookPhoto, self).save(*args, **kwargs)
