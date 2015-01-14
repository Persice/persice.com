from django_facebook.models import FacebookCustomUser
from tastypie import fields
from tastypie.authentication import SessionAuthentication, Authentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.resources import ModelResource
from members.models import FacebookCustomUserActive
from photos.models import FacebookPhoto, Photo


class UserResource(ModelResource):
    class Meta:
        queryset = FacebookCustomUserActive.objects.all()
        resource_name = 'auth/user'
        fields = ['username', 'first_name', 'last_name', 'last_login', 'about_me', 'facebook_id']
        authentication = SessionAuthentication()
        authorization = Authorization()


class FacebookPhotoResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = FacebookPhoto.objects.all()
        resource_name = 'photo'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(FacebookPhotoResource, self).get_object_list(request).filter(user_id=request.user.id)