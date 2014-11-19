from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource
from goals.models import Subject


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