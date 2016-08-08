from django.core.management.base import BaseCommand, CommandError
from guardian.shortcuts import assign_perm

from events.models import Event
from members.models import FacebookCustomUserActive


class Command(BaseCommand):
    help = 'Open public events for all active users'

    def handle(self, *args, **options):
        users = FacebookCustomUserActive.objects.all()
        public_events = Event.objects.filter(access_level='public')
        for user in users:
            for event in public_events:
                assign_perm('view_event', user, event)
                self.stdout.write(
                    'Successfully open event_id {} '
                    'for user_id {}'.format(event.id, user.id)
                )
