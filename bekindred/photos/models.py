from django.db import models
from django_facebook.models import FacebookCustomUser


class Photo(models.Model):
    photo = models.FileField(upload_to='documents/%Y/%m/%d')
    user = models.ForeignKey(FacebookCustomUser)