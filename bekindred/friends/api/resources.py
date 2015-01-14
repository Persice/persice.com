from django.db.models import Q
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
        fields = ['id', 'friend1', 'friend2', 'status']
        filtering = {'friend1': ALL,
                     'friend2': ALL,
                     'status': ALL}
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        u = request.user.id
        return super(FriendsResource, self).get_object_list(request).filter(Q(friend1=u) | Q(friend2=u))