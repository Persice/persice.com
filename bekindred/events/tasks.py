from __future__ import absolute_import

from celery import task

from events.models import Membership
from events.utils import calculate_cumulative_match_score


@task
def cum_score(event_id):
    """
    This is the function that does a "job"
    """
    ids = Membership.objects.filter(event=event_id).values_list('id', flat=True)
    for id_ in ids:
        m = Membership.objects.get(pk=id_)
        # print m
        m.cumulative_match_score = calculate_cumulative_match_score(m.user.id, m.event.id)
        m.save()


def update_match_score(sender, instance, created, **kwargs):
    print instance.event.id
    cum_score.apply_async(instance.event_id)
