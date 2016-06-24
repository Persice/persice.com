from django.db import models

from goals.models import Goal, Offer
from core.tasks import update_index_delay

models.signals.post_save.connect(update_index_delay, sender=Goal)
models.signals.post_delete.connect(update_index_delay, sender=Goal)

models.signals.post_save.connect(update_index_delay, sender=Offer)
models.signals.post_delete.connect(update_index_delay, sender=Offer)
