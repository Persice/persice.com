from tastypie.authentication import Authentication


class JSONWebTokenAuthentication(Authentication):
    def is_authenticated(self, request, **kwargs):
        pass

    def get_jwt_value(self, request):
        pass
