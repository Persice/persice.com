from django.conf import settings
from jwt import DecodeError
from jwt_auth.utils import jwt_decode_handler
from tastypie.compat import get_user_model
from tastypie.authentication import Authentication
from tastypie.http import HttpUnauthorized


JWT_AUTH_HEADER_PREFIX = getattr(settings, 'JWT_AUTH_HEADER_PREFIX', 'Bearer')


class JSONWebTokenAuthentication(Authentication):
    def _unauthorized(self):
        return HttpUnauthorized()

    def extract_credentials(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        json_web_token = None
        if auth_header and auth_header.lower().startswith(
                '{} '.format(JWT_AUTH_HEADER_PREFIX.lower())):
                (_, json_web_token) = request.META['HTTP_AUTHORIZATION'].split()
        return json_web_token

    def is_authenticated(self, request, **kwargs):
        """
        Finds the user and checks their API key.

        Should return either ``True`` if allowed, ``False`` if not or an
        ``HttpResponse`` if you need something custom.
        """

        try:
            json_web_token = self.extract_credentials(request)
            payload = jwt_decode_handler(json_web_token)
            username = payload.get('username')
        except DecodeError:
            return self._unauthorized()

        User = get_user_model()

        try:
            lookup_kwargs = {'username': username}
            user = User.objects.get(**lookup_kwargs)
        except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()

        if not self.check_active(user):
            return False

        request.user = user

        return True
