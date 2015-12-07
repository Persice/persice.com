import uuid

from django.db import models
from django.db.models import signals
from django.db.models.signals import post_save
from django_facebook.models import FacebookCustomUser
from guardian.shortcuts import assign_perm

from events.models import Membership, Event
from events.tasks import update_index_delay
from events.tasks import update_match_score

signals.post_save.connect(update_match_score, sender=Membership)
signals.post_delete.connect(update_match_score,
                            dispatch_uid=str(uuid.uuid1()), sender=Membership)


def add_permissions(sender, **kwargs):
    user = kwargs["instance"]
    if kwargs["created"]:
        public_events = Event.objects.filter(access_level='public')
        for event in public_events:
            assign_perm('view_event', user, event)
post_save.connect(add_permissions, sender=FacebookCustomUser)

models.signals.post_save.connect(update_index_delay, sender=Event)
models.signals.post_delete.connect(update_index_delay, sender=Event)
