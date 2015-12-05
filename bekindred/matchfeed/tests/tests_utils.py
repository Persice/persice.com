from django.test import TestCase

from match_engine.models import GerundWords
from matchfeed.utils import make_gerund


class TestMakeGerund(TestCase):
    def setUp(self):
        GerundWords.objects.create(word='kiteboarding')
        GerundWords.objects.create(word='biking')
        GerundWords.objects.create(word='djing')

    def test_coding(self):
        self.assertEqual(make_gerund('code'), 'coding')

    def test_biking(self):
        self.assertEqual(make_gerund('bike'), 'biking')

    def test_kiteboarding(self):
        self.assertEqual(make_gerund('kiteboard'), 'kiteboarding')

    def test_python(self):
        self.assertEqual(make_gerund('python'), 'python')

    def test_cycling(self):
        self.assertEqual(make_gerund('cycling'), 'cycling')

    def test_riding(self):
        self.assertEqual(make_gerund('riding'), 'riding')

    def test_djing(self):
        self.assertEqual(make_gerund('dj'), 'djing')

    def test_french(self):
        self.assertEqual(make_gerund('french'), 'french')
