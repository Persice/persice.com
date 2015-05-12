from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from photos.api.resources import UserResource
from world.models import UserLocation


class UserLocationResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        always_return_data = True
        queryset = UserLocation.objects.all()
        resource_name = 'location'
        excludes = ['timestamp', 'geometry']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.user.id
        return super(UserLocationResource, self).get_object_list(request).filter(user_id=user)