from __future__ import absolute_import


import logging

from celery import task
from django.core.cache import cache
from haystack.management.commands import update_index

logger = logging.getLogger(__name__)


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
        cache.clear()


@task
def refresh_cache2(user_id=None):
    from matchfeed.api.resources import refresh_cache
    refresh_cache(user_id=user_id)


def update_index_delay(*args, **kwargs):
    user_id = None
    if kwargs.get('instance') and hasattr(kwargs.get('instance'), 'user_id'):
        user_id = kwargs.get('instance').user_id
    update_index_elastic.delay(user_id=user_id)
    refresh_cache2.delay(user_id)
