import json

import time

import math
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django_facebook.connect import _update_image
from django_facebook.models import FacebookCustomUser, PROFILE_IMAGE_PATH
from easy_thumbnails.fields import ThumbnailerImageField

from photos.utils import crop_photo


class Photo(models.Model):
    photo = models.FileField(upload_to='documents/%Y/%m/%d')
    user = models.ForeignKey(FacebookCustomUser)
    order = models.IntegerField(null=True)
    cropped_photo = models.TextField(default='')


class FacebookPhotoManager(models.Manager):
    @staticmethod
    def profile_photo(user_id):
        try:
            cropped_photo = FacebookPhoto.objects.filter(
                user=user_id, order=0)[0].cropped_photo
            if cropped_photo:
                return cropped_photo.url
        except IndexError:
            pass


class FacebookPhoto(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    photo = models.CharField(max_length=250)
    order = models.IntegerField(null=True)
    bounds = models.TextField(null=True)
    cropped_photo = ThumbnailerImageField(blank=True, null=True,
                                          upload_to=PROFILE_IMAGE_PATH,
                                          max_length=255)
    objects = FacebookPhotoManager()

    def clean(self):
        try:
            self.bounds = json.dumps(self.bounds)
        except ValueError:
            raise ValidationError(_(
                'Facebook photo bounds must be in json format')
            )

    def save(self, *args, **kwargs):
        if self.pk is None and self.photo and self.photo.startswith('http'):
            compose_image_name = '%s_%s' % (self.user.facebook_id,
                                            int(math.floor(time.time())))
            image_name, image_file = _update_image(compose_image_name,
                                                   self.photo)
            if not isinstance(self.bounds, dict):
                try:
                    cleared_bounds = self.bounds.replace("\'",
                                                         '"') if self.bounds else None
                    bounds = json.loads(cleared_bounds)
                except (ValueError, TypeError):
                    bounds = None
            else:
                bounds = self.bounds

            if bounds:
                filename, content = crop_photo(compose_image_name,
                                               image_file, bounds)
            else:
                filename, content = image_name, image_file
            self.cropped_photo = content
        super(FacebookPhoto, self).save(*args, **kwargs)
