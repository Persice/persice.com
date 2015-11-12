from __future__ import absolute_import

from celery import task
from django.dispatch import receiver
from easy_thumbnails.files import generate_all_aliases
from easy_thumbnails.signals import saved_file
from events.models import CumulativeMatchScore, Event, Membership
from events.utils import calc_score
from members.models import FacebookCustomUserActive


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
def generate_thumbnails(model, pk, field):
    instance = model._default_manager.get(pk=pk)
    fieldfile = getattr(instance, field)
    generate_all_aliases(fieldfile, include_global=True)


@receiver(saved_file)
def generate_thumbnails_async(sender, fieldfile, **kwargs):
    generate_thumbnails.delay(
        model=sender, pk=fieldfile.instance.pk,
        field=fieldfile.field.name)
