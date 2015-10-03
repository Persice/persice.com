from datetime import date
from django.core.management import call_command
from django_facebook.models import FacebookCustomUser
import haystack
from goals.models import Subject, Offer, Goal
from match_engine.models import ElasticSearchMatchEngine
from django.test import TestCase
from haystack.management.commands import update_index, rebuild_index


class BaseTestCase(TestCase):

    def setUp(self):
        haystack.connections.reload('default')
        super(BaseTestCase, self).setUp()

    def tearDown(self):
        call_command('clear_index', interactive=False, verbosity=0)


class TestInterestManager(BaseTestCase):
    def setUp(self):
        haystack.connections.reload('default')
        self.user = FacebookCustomUser.objects.\
            create_user(username='user_a', facebook_id=1234567,
                        password='test', date_of_birth=date(1989, 5, 20))
        self.user1 = FacebookCustomUser.objects.\
            create_user(username='user_b', facebook_id=12345671,
                        password='test', date_of_birth=date(1989, 1, 9))
        self.subject = Subject.objects.create(description='learn django')
        self.subject2 = Subject.objects.create(description='learn python')
        self.subject3 = Subject.objects.create(description='teach erlang')
        self.subject4 = Subject.objects.create(description='teach javascript')

        self.subject5 = Subject.objects.create(description='teach django')
        self.subject6 = Subject.objects.create(description='teach python')
        self.subject7 = Subject.objects.create(description='learn erlang')
        self.subject8 = Subject.objects.create(description='learn javascript')
        rebuild_index.Command().handle(interactive=False)

    def tearDown(self):
        haystack.connections['default'].get_backend().clear()

    def test_match_goals(self):
        Goal.objects.create(user=self.user, goal=self.subject)
        Goal.objects.create(user=self.user, goal=self.subject2)
        Offer.objects.create(user=self.user1, offer=self.subject5)
        Offer.objects.create(user=self.user1, offer=self.subject6)
        update_index.Command().handle(interactive=False)
        match_users = ElasticSearchMatchEngine.\
            elastic_objects.match_goals(user_id=self.user.id, friends=[])
        self.assertEqual(match_users, 2)
