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
        if not self.cropped_photo and self.bounds:
            image_name, image_file = _update_image(self.user.facebook_id,
                                                   self.photo)
            if not isinstance(self.bounds, dict):
                bounds = json.loads(self.bounds)
            else:
                bounds = self.bounds
            image_str = ""
            for c in image_file.chunks():
                image_str += c

            image_file = StringIO(image_str)
            image = Image.open(image_file)

            image = image.crop((bounds['left'], bounds['upper'],
                                bounds['right'], bounds['lower']))
            image_file = StringIO()
            filename = 'fb_image_%s.jpg' % self.user.facebook_id
            # save to disk
            image_file = open(os.path.join('/tmp', filename), 'w')
            image.save(image_file, 'JPEG', quality=90)
            image_file = open(os.path.join('/tmp', filename), 'r')
            content = File(image_file)
            self.cropped_photo = content
        super(FacebookPhoto, self).save(*args, **kwargs)
