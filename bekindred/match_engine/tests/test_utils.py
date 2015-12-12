from django.test import TestCase

from match_engine.models import CollocationDict
from match_engine.utils import find_collocations


class FindCollectionsTestCase(TestCase):
    def setUp(self):
        CollocationDict.objects.create(phrase='foreign language')

    def test_simple_collocation(self):
        keywords = ["coding", "badminton", "gymnastics",
                    "antiques", "table", "python",
                    "ballet", "basketball", "backpacking",
                    "tennis", "tutoring", "animation",
                    "piano", "banjo", "3d", "djing", "foreign", "language"
                    ]
        new_keywords = find_collocations(keywords)
        self.assertEqual(len(new_keywords), len(keywords)-1)
        self.assertEqual(new_keywords,
                         ["coding", "badminton", "gymnastics",
                          "antiques", "table", "python",
                          "ballet", "basketball", "backpacking",
                          "tennis", "tutoring", "animation",
                          "piano", "banjo", "3d", "djing", "foreign language"])

    def test_empty_collocation(self):
        keywords = []
        new_keywords = find_collocations(keywords)
        self.assertEqual(len(new_keywords), len(keywords)-1)
        self.assertEqual(new_keywords, [])
