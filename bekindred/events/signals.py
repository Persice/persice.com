import json
import logging
import string

from django.db import models
from django.db.models.signals import post_save
from guardian.shortcuts import assign_perm

from core.tasks import update_index_delay
from events.models import Membership, Event
from friends import Friend
from friends.utils import NeoFourJ
from interests.models import PoliticalIndex, PoliticalView, ReligiousIndex, \
    ReligiousView
from members.models import OnBoardingFlow

remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)


# Get an instance of a logger
logger = logging.getLogger(__name__)


def create_neo4j_node(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        neo = NeoFourJ()
        if not neo.get_person(user):
            neo.create_person(neo.person(user))
            logger.info('Create Neo4j node with user: {}'.format(user.id))

post_save.connect(create_neo4j_node, sender=OnBoardingFlow)


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


def add_permissions(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        public_events = Event.objects.filter(access_level='public')
        for event in public_events:
            assign_perm('view_event', user, event)

post_save.connect(add_permissions, sender=OnBoardingFlow)


def update_connections_permissions(sender, **kwargs):
    friends = kwargs.get("instance")
    if friends.status == 1:
        events1 = Membership.objects.filter(user=friends.friend1,
                                            is_organizer=True)
        for event1 in events1:
            assign_perm('view_event', friends.friend2, event1.event)

        events2 = Membership.objects.filter(user=friends.friend2,
                                            is_organizer=True)
        for event2 in events2:
            assign_perm('view_event', friends.friend1, event2.event)

post_save.connect(update_connections_permissions, sender=Friend)

models.signals.post_save.connect(update_index_delay, sender=Event)
models.signals.post_save.connect(update_index_delay, sender=Membership)
models.signals.post_delete.connect(update_index_delay, sender=Event)
