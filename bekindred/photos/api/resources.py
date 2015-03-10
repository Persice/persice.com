from django_facebook.models import FacebookCustomUser
from tastypie import fields
from tastypie.authentication import SessionAuthentication, Authentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource
from members.models import FacebookCustomUserActive
from photos.models import FacebookPhoto, Photo
from goals.utils import calculate_age, social_extra_data


class UserResource(ModelResource):
    class Meta:
        queryset = FacebookCustomUserActive.objects.all()
        resource_name = 'auth/user'
        fields = ['username', 'first_name', 'last_name', 'last_login', 'about_me',
                  'facebook_id', 'id', 'date_of_birth', 'facebook_profile_url']
        filtering = {
            'facebook_id': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        bundle.data['age'] = calculate_age(bundle.data['date_of_birth'])
        bundle.data['twitter_provider'], bundle.data['linkedin_provider'] = social_extra_data(bundle.request.user.id)
        return bundle


class FacebookPhotoResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = FacebookPhoto.objects.all()
        resource_name = 'photo'
        always_return_data = True
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(FacebookPhotoResource, self).get_object_list(request).filter(user_id=user)