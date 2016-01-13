import json
import string
import uuid

from django.db import models
from django.db.models import signals
from django.db.models.signals import post_save
from django_facebook.models import FacebookCustomUser
from guardian.shortcuts import assign_perm
from django_facebook.signals import facebook_post_update

from events.models import Membership, Event
from events.tasks import update_index_delay
from events.tasks import update_match_score
from interests.models import PoliticalIndex, PoliticalView, ReligiousIndex, \
    ReligiousView
from members.models import OnBoardingFlow

signals.post_save.connect(update_match_score, sender=Membership)
signals.post_delete.connect(update_match_score,
                            dispatch_uid=str(uuid.uuid1()), sender=Membership)


remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)


def create_fb_political_view(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        raw_data = user.raw_data if user.raw_data else '{}'
        data = {}
        try:
            data = json.loads(raw_data)
        except ValueError:
            pass
        pv = data.get('political')
        if pv:
            new_pv = pv.translate(remove_punctuation_map).strip().lower()
            pi, created = PoliticalIndex.objects.get_or_create(
                    name=new_pv
            )
            PoliticalView.objects.get_or_create(political_index=pi, user=user)
post_save.connect(create_fb_political_view, sender=OnBoardingFlow)


def create_fb_religion_view(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        raw_data = user.raw_data if user.raw_data else '{}'
        data = {}
        try:
            data = json.loads(raw_data)
        except ValueError:
            pass
        rv = data.get('religion')
        if rv:
            new_rv = rv.translate(remove_punctuation_map).strip().lower()
            ri, created = ReligiousIndex.objects.get_or_create(
                    name=new_rv
            )
            ReligiousView.objects.get_or_create(religious_index=ri, user=user)
post_save.connect(create_fb_religion_view, sender=OnBoardingFlow)


def add_permissions(sender, **kwargs):
    user = kwargs["instance"]
    if kwargs["created"]:
        public_events = Event.objects.filter(access_level='public')
        for event in public_events:
            assign_perm('view_event', user, event)
post_save.connect(add_permissions, sender=FacebookCustomUser)

models.signals.post_save.connect(update_index_delay, sender=Event)
models.signals.post_delete.connect(update_index_delay, sender=Event)
