from __future__ import absolute_import


import logging
from urlparse import parse_qs

from celery import task
from django.core.cache import cache
from haystack.management.commands import update_index

from core.utils import send_sg_mail

logger = logging.getLogger(__name__)


@task
def update_index_elastic(user_id=None, event_id=None):
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
    elif user_id and event_id:
        # clear events cache
        cache.delete_pattern("{}_{}_e".format(user_id, event_id))
        logger.info("delete from cache: KEYS {}_{}_e".format(user_id,
                                                             event_id))
    else:
        cache.clear()


@task
def refresh_cache2(user_id=None):
    from matchfeed.api.resources import refresh_cache
    refresh_cache(user_id=user_id)


def update_index_delay(*args, **kwargs):
    logger.info('update_index_delay triggered by {}'.format(
        kwargs.get('instance'))
    )
    user_id = None
    event_id = None
    if kwargs.get('instance') and hasattr(kwargs.get('instance'), 'user_id'):
        user_id = kwargs.get('instance').user_id
    if kwargs.get('instance') and hasattr(kwargs.get('instance'), 'event_id'):
        event_id = kwargs.get('instance').event_id
    if kwargs.get('instance') \
            and kwargs.get('instance').__class__.__name__ == 'Event':
        event_id = kwargs.get('instance').id
    update_index_elastic.delay(user_id=user_id, event_id=event_id)
    refresh_cache2.delay(user_id)


@task
def send_mail(message_id, sender_name, body, to_email):
    send_sg_mail(message_id, sender_name, body, to_email)
