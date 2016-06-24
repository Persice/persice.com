from django.db import models

from interests.models import Interest
from core.tasks import update_index_delay

models.signals.post_save.connect(update_index_delay, sender=Interest)
models.signals.post_delete.connect(update_index_delay, sender=Interest)

models.signals.post_save.connect(update_index_delay, sender=Interest)
models.signals.post_delete.connect(update_index_delay, sender=Interest)
