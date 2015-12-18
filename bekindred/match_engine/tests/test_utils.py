from django.test import TestCase

from match_engine.models import CollocationDict, StopWords
from match_engine.utils import find_collocations


class FindCollectionsTestCase(TestCase):
    def setUp(self):
        CollocationDict.objects.create(phrase='foreign language')
        CollocationDict.objects.create(phrase='artificial intelligence')
        CollocationDict.objects.create(phrase='3d printing')
        CollocationDict.objects.create(phrase='classical piano')
        CollocationDict.objects.create(phrase='spartan race')
        CollocationDict.objects.create(phrase='machine learning')
        StopWords.objects.create(word='learn')

    def test_simple_collocation(self):
        keywords = ["coding", "badminton", "gymnastics",
                    "antiques", "table", "python",
                    "ballet", "basketball", "backpacking",
                    "tennis", "tutoring", "animation",
                    "piano", "banjo", "3d", "djing", "foreign", "language"
                    ]
        new_keywords = find_collocations(keywords)
        self.assertEqual(len(new_keywords), len(keywords)-1)
        self.assertEqual(sorted(new_keywords),
                         sorted(["coding", "badminton", "gymnastics",
                          "antiques", "table", "python",
                          "ballet", "basketball", "backpacking",
                          "tennis", "tutoring", "animation",
                          u"classical piano", "banjo", u"3d printing",
                          "djing", u"foreign language"]))

    def test_empty_collocation(self):
        keywords = []
        new_keywords = find_collocations(keywords)
        self.assertEqual(len(new_keywords), len(keywords))
        self.assertEqual(new_keywords, [])

    def test_collocation(self):
        keywords = ["machine"]
        new_keywords = find_collocations(keywords)
        self.assertEqual(new_keywords, ['machine learning'])

    def test_collocation2(self):
        keywords = ["machine", "python", "foreign", "language", "piano"]
        new_keywords = find_collocations(keywords)
        self.assertEqual(new_keywords, ['python', u'classical piano',
                                        u'foreign language',
                                        u'machine learning'])
