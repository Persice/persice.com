from __future__ import absolute_import

from celery import task
from django.core.cache import cache
from haystack.management.commands import update_index


@task
def update_index_elastic():
    update_index.Command().handle(interactive=False)
    cache.clear()


def update_index_delay(*args, **kwargs):
    update_index_elastic.delay()
