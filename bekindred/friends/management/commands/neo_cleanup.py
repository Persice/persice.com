from django.core.management.base import BaseCommand, CommandError
from friends.utils import NeoFourJ


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        NeoFourJ().graph.delete_all()
        self.stdout.write('Successfully delete all data from Neo4j!')
