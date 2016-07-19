from __future__ import absolute_import

import json
import logging

import redis
from celery import task
from django.core.cache import cache
from guardian.shortcuts import assign_perm, remove_perm
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
        # TODO: Implement refresh cache for events if needed
        cache.clear()


def update_index_delay(*args, **kwargs):
    user_id = None
    update_index_elastic.delay(user_id=user_id)


@task
def assign_perm_task(users, bundle, perm_name='view_event'):
    for user in users:
        assign_perm(perm_name, user, bundle.obj)


@task
def remove_perm_task(users, bundle, perm_name='view_event'):
    for user in users:
        remove_perm(perm_name, user, bundle.obj)


@task
def publish_to_redis_channel(recipient, message_data):
    r = redis.StrictRedis(host='localhost', port=6379, db=0)
    r.publish('message.%s' % recipient.id, json.dumps(message_data))
