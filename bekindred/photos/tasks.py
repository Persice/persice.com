from __future__ import absolute_import

from celery import task
from django.core.cache import cache
from easy_thumbnails.files import generate_all_aliases
from haystack.management.commands import update_index


@task
def generate_thumbnails(model, pk, field):
    instance = model._default_manager.get(pk=pk)
    fieldfile = getattr(instance, field)
    generate_all_aliases(fieldfile, include_global=True)


@task
def update_index_elastic():
    update_index.Command().handle(interactive=False)
    cache.clear()


def update_index_delay(*args, **kwargs):
    update_index_elastic.delay()
