from datetime import timedelta
from django.test import TestCase
from django.utils.timezone import now
from django_facebook.models import FacebookCustomUser
from events.models import Event, Membership

from msgs.models import ChatMessage


class ChatMessageTestCase(TestCase):
    def setUp(self):
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')

    def create_simple_chat_message(self):
        self.assertEqual(ChatMessage.objects.all().count(), 0)
        event = Event.objects.create(name="Play piano", location=[7000, 22965.83],
                                     starts_on=now(), ends_on=now() + timedelta(days=10))
        Membership.objects.create(user=self.user, event=event)
        m = ChatMessage.objects.create(body='new', event=event)
        self.assertEqual(ChatMessage.objects.all().count(), 1)
