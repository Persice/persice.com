from django.dispatch import receiver
from django.db import models
from easy_thumbnails.signals import saved_file

from photos.models import FacebookPhoto
from core.tasks import update_index_delay
from photos.tasks import generate_thumbnails


@receiver(saved_file)
def generate_thumbnails_async(sender, fieldfile, **kwargs):
    generate_thumbnails.delay(
        model=sender, pk=fieldfile.instance.pk,
        field=fieldfile.field.name)


models.signals.post_save.connect(update_index_delay, sender=FacebookPhoto)
models.signals.post_delete.connect(update_index_delay, sender=FacebookPhoto)
