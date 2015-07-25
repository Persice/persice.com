from __future__ import absolute_import

from celery import task
from django.db.models import signals

from events.models import Membership, CumulativeMatchScore
from events.utils import calc_score


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


def update_match_score(sender, instance, created, **kwargs):
    cum_score.delay(instance.event_id)

