from django.conf import settings
from tastypie.compat import get_user_model
from tastypie.authentication import Authentication
from tastypie.http import HttpUnauthorized


JWT_AUTH_HEADER_PREFIX = getattr(settings, 'JWT_AUTH_HEADER_PREFIX', 'Bearer')


class JSONWebTokenAuthentication(Authentication):
    def _unauthorized(self):
        return HttpUnauthorized()

    def is_authenticated(self, request, **kwargs):
        return False

    def extract_credentials(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.lower().startswith(
                '{} '.format(JWT_AUTH_HEADER_PREFIX)):
                (auth_type, data) = request.META['HTTP_AUTHORIZATION'].split()

                if auth_type.lower() != 'apikey':
                    raise ValueError("Incorrect authorization header.")

                user_id, api_key = data.split(':', 1)
        else:
            return self._unauthorized()
        return user_id

    def is_authenticated(self, request, **kwargs):
        """
        Finds the user and checks their API key.

        Should return either ``True`` if allowed, ``False`` if not or an
        ``HttpResponse`` if you need something custom.
        """

        try:
            username, api_key = self.extract_credentials(request)
        except ValueError:
            return self._unauthorized()

        if not username or not api_key:
            return self._unauthorized()

        User = get_user_model()

        try:
            lookup_kwargs = {'id': username}
            user = User.objects.get(**lookup_kwargs)
        except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()

        if not self.check_active(user):
            return False

        key_auth_check = self.get_key(user, api_key)
        if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user

        return key_auth_check
