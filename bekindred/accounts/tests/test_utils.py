from django.test import TestCase

from accounts.utils import get_fb_events


class GetFaceBookEventsTestCase(TestCase):
    def setUp(self):
        pass

    def test_get_fb_events(self):
        fb_access_token = "EAACEdEose0cBAD16wNjKDbVpQED1I4KGQcbcD5a7y1HcrPzxciZC7jfaBLRJHcCsJvP6fZBfPKZCd6PlB9jTlYIetOZBtlHxTUHZCaI83sXL1hHlJ0d4ZB5HFerQHrTjBr5Jv62g4EAWNWuWgLYZA6DV4uacsr4aEO1bQHNMDB5jAZDZD"
        get_fb_events(None, fb_access_token)
        self.assertEqual("The cat says meow", 'The cat says "meow"')
