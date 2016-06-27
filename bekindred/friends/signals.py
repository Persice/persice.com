from django.db import models

from friends.models import Friend
from core.tasks import update_index_delay

models.signals.post_save.connect(update_index_delay, sender=Friend)
models.signals.post_delete.connect(update_index_delay, sender=Friend)
