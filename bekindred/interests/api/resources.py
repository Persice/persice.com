from tastypie import fields
from tastypie.constants import ALL
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
        always_return_data = True
        fields = ['description', 'id']
        authentication = SessionAuthentication()
        authorization = Authorization()

        filtering = {
            'description': ALL
        }

    def get_object_list(self, request):
        user = request.GET.get('user_id')
        if user:
            return super(InterestResource, self).get_object_list(request).filter(user_id=user)
        else:
            return super(InterestResource, self).get_object_list(request).distinct('description')
