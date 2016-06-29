from __future__ import absolute_import

import logging

from celery import task
from django.core.cache import cache
from haystack.management.commands import update_index

from events.models import CumulativeMatchScore, Event, Membership
from events.utils import calc_score
from members.models import FacebookCustomUserActive


logger = logging.getLogger(__name__)


@task
def cum_score(event_id):
    """
    This is the function that does a "job"
    """
    ids = Membership.objects.filter(event=event_id).values_list('id', flat=True)
    for id_ in ids:
        m = Membership.objects.get(pk=id_)
        try:
            obj = CumulativeMatchScore.objects.get(event=m.event, user=m.user)
            obj.score = calc_score(m.user.id, m.event.id)
            obj.save()
        except CumulativeMatchScore.DoesNotExist:
            CumulativeMatchScore.objects.create(event=m.event, user=m.user,
                                                score=calc_score(m.user.id,
                                                                 m.event.id))
    users = FacebookCustomUserActive.objects.all()
    for user in users:
        try:
            obj = CumulativeMatchScore.objects.get(event=event_id, user=user)
            obj.score = calc_score(user.id, event_id)
            obj.save()
        except CumulativeMatchScore.DoesNotExist:
            event = Event.objects.get(id=event_id)
            CumulativeMatchScore.objects.create(event=event, user=user,
                                                score=calc_score(user.id,
                                                                 event))


def update_match_score(instance, **kwargs):
    cum_score.delay(instance.event_id)

@task
def update_index_elastic(user_id=None):
    update_index.Command().handle(interactive=False)
    if user_id is not None:
        # Crowd
        cache.delete_pattern("{}_*".format(user_id))
        logger.info("delete from cache: KEYS {}_*".format(user_id))
        # Connections
        cache.delete_pattern("c_{}_*".format(user_id))
        logger.info("delete from cache: KEYS c_{}_*".format(user_id))
        # pairs
        cache.delete_pattern("*_{}".format(user_id))
        logger.info("delete from cache: KEYS *_{}".format(user_id))
    else:
        # TODO: Implement refresh cache for events if needed
        cache.clear()


def update_index_delay(*args, **kwargs):
    user_id = None
    update_index_elastic.delay(user_id=user_id)
