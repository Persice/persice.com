from django.conf import settings
from jwt_auth.utils import jwt_encode_handler
from tastypie.test import ResourceTestCase


class JWTResourceTestCase(ResourceTestCase):
    def get_credentials(self, user=None):
        if user is None:
            user = self.user
        else:
            user = user

        jwt = jwt_encode_handler({
            'user_id': user.id,
            'username': user.username
        })

        return '%s %s' % (settings.JWT_AUTH_HEADER_PREFIX, jwt)
