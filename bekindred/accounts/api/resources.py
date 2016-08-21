import logging

from django_facebook.connect import connect_user
from jwt_auth.utils import jwt_encode_handler
from open_facebook.api import FacebookAuthorization
from tastypie import fields
from tastypie.bundle import Bundle
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization
from tastypie.exceptions import BadRequest
from tastypie.resources import Resource

logger = logging.getLogger(__name__)


class Obj(object):
    pass


class SocialLoginResource(Resource):
    id = fields.CharField(attribute='id')
    token = fields.CharField(attribute='token')

    class Meta:
        resource_name = 'accounts/facebook/login'
        always_return_data = True
        authentication = Authentication()
        authorization = Authorization()
        allowed_methods = ['post']

    def rollback(self, bundles):
        pass

    def obj_delete(self, bundle, **kwargs):
        pass

    def obj_delete_list_for_update(self, bundle, **kwargs):
        pass

    def obj_get_list(self, bundle, **kwargs):
        pass

    def obj_delete_list(self, bundle, **kwargs):
        pass

    def obj_get(self, bundle, **kwargs):
        pass

    def get_object_list(self, request):
        pass

    def obj_update(self, bundle, **kwargs):
        pass

    def apply_filters(self, request, applicable_filters):
        pass

    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}
        if isinstance(bundle_or_obj, Bundle):
            kwargs['pk'] = bundle_or_obj.obj.id
        else:
            kwargs['pk'] = bundle_or_obj.id

        return kwargs

    def obj_create(self, bundle, request=None, **kwargs):
        bundle.obj = Obj()
        bundle.obj.id = 1
        code = bundle.data.get('code')
        redirect_uri = bundle.data.get('redirectUri', '')
        if not code:
            self.create_response(
                bundle.request, bundle,
                response_class=BadRequest('code is required'))
            logger.error('code is required')

        # TODO: Add catch errors
        token_response = FacebookAuthorization.convert_code(
            code, redirect_uri=redirect_uri)

        # TODO: Add access_token to cache
        access_token = token_response['access_token']
        action, user = connect_user(bundle.request, access_token=access_token)

        # TODO: Add exp
        bundle.obj.token = jwt_encode_handler({'user_id': user.id})
        # TODO: clean up response
        return bundle
