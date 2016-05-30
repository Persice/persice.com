from django.core.management.base import BaseCommand, CommandError
from friends.utils import migrate_all_friendships_to_neo


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        migrate_all_friendships_to_neo()
        self.stdout.write('Successfully migrate all friends to Neo4j')
