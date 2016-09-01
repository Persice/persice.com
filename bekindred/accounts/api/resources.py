import json
import logging

import oauth2 as oauth
from accounts.api.authentication import JSONWebTokenAuthentication
from django_facebook.connect import connect_user
from jwt_auth.utils import jwt_encode_handler, jwt_payload_handler
from open_facebook.api import FacebookAuthorization
from requests_oauthlib import OAuth1Session
from social_auth.backends import get_backend
from social_auth.db.django_models import UserSocialAuth
from tastypie import fields
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization
from tastypie.bundle import Bundle
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

        payload = jwt_payload_handler(user)
        payload['access_token'] = user.access_token
        bundle.obj.token = jwt_encode_handler(payload)
        # TODO: clean up response
        return bundle


class TwitterSocialConnectResource(Resource):
    id = fields.CharField(attribute='id')

    class Meta:
        resource_name = 'accounts/twitter/connect'
        always_return_data = True
        authentication = JSONWebTokenAuthentication()
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
        oauth_token = bundle.data.get('oauth_token')
        oauth_verifier = bundle.data.get('oauth_verifier', '')

        backend = get_backend('twitter', bundle.request, bundle.request.path)
        backend.name = 'twitter'
        REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
        ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'

        consumer_key = backend.consumer.key
        consumer_secret = backend.consumer.secret

        if oauth_token and oauth_verifier:
            oauth_client = OAuth1Session(
                consumer_key,
                client_secret=consumer_secret,
                resource_owner_key=oauth_token,
                verifier=oauth_verifier
            )
            response = oauth_client.fetch_access_token(ACCESS_TOKEN_URL)
            uid = response.get('user_id')

            social_user = UserSocialAuth.get_social_auth('twitter', uid)
            if social_user is None:
                social_user = UserSocialAuth.create_social_auth(
                    bundle.request.user, uid, 'twitter')
                social_user.extra_data = response
                social_user.save()

            try:
                url = 'https://api.twitter.com/1.1/account/' \
                      'verify_credentials.json'
                consumer = oauth.Consumer(key=consumer_key,
                                          secret=consumer_secret)
                token = oauth.Token(key=response['oauth_token'],
                                    secret=response['oauth_token_secret'])
                client = oauth.Client(consumer, token)
                resp, content = client.request(url)
                extra_data = json.loads(content)
            except Exception as err:
                extra_data = None
                logger.error(err, err.message)

            if extra_data and social_user.extra_data != extra_data:
                if social_user.extra_data:
                    social_user.extra_data.update(extra_data)
                else:
                    social_user.extra_data = extra_data
                social_user.save()
        else:
            oauth_client = OAuth1Session(
                consumer_key,
                client_secret=consumer_secret,
            )
            bundle.data['oauth_token'] = oauth_client.fetch_request_token(
                REQUEST_TOKEN_URL
            ).get('oauth_token')
        return bundle
