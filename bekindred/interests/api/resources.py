from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from interests.models import Interest
from photos.api.resources import UserResource


class InterestResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = Interest.objects.all()
        resource_name = 'interest'
        fields = ['description']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(InterestResource, self).get_object_list(request).filter(user=request.user.id)
