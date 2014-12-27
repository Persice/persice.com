from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource
from friends.models import Friend
from photos.api.resources import UserResource


class FriendsResource(ModelResource):
    friend1 = fields.ForeignKey(UserResource, 'friend1')
    friend2 = fields.ForeignKey(UserResource, 'friend2')

    class Meta:
        queryset = Friend.objects.all()
        resource_name = 'friends'
        fields = ['friend1', 'friend2', 'status']
        filtering = {'friend1': ALL,
                     'friend2': ALL,}
        authentication = SessionAuthentication()
        authorization = Authorization()