from django.conf import settings
from django.db import models
from django.utils.timezone import now
from django.utils.translation import ugettext_lazy as _
from django_facebook.models import FacebookCustomUser, FacebookLike

from events.models import Event


class ChatMessage(models.Model):
    body = models.TextField(_("body"), blank=True)
    sender = models.ForeignKey(FacebookCustomUser, null=True, blank=True, verbose_name=_("sender"))
    parent = models.ForeignKey('self', related_name='next_messages', null=True, blank=True, verbose_name=_("parent message"))
    thread = models.ForeignKey('self', related_name='child_messages', null=True, blank=True, verbose_name=_("root message"))
    sent_at = models.DateTimeField(_("sent at"), default=now)
    read_at = models.DateTimeField(_("read at"), null=True, blank=True)
    replied_at = models.DateTimeField(_("replied at"), null=True, blank=True)
    sender_archived = models.BooleanField(_("archived by sender"), default=False)
    recipient_archived = models.BooleanField(_("archived by recipient"), default=False)
    sender_deleted_at = models.DateTimeField(_("deleted by sender at"), null=True, blank=True)
    recipient_deleted_at = models.DateTimeField(_("deleted by recipient at"), null=True, blank=True)
    event = models.ForeignKey(Event)
