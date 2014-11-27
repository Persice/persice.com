from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource
from goals.models import Subject, MatchFilterState
from photos.api.resources import UserResource


class SubjectResource(ModelResource):
    class Meta:
        queryset = Subject.objects.all()
        fields = ['description']
        allowed_methods = ['get']
        filtering = {
            'description': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()


class MatchFilterStateResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = MatchFilterState.objects.all()
        resource_name = 'filter/state'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(MatchFilterStateResource, self).get_object_list(request).filter(user_id=request.user.id)