from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource
from goals.models import Subject, Goal
from photos.api.resources import UserResource


class GoalResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = Goal.objects.all()
        fields = ['description']
        allowed_methods = ['get']
        filtering = {
            'description': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(GoalResource, self).get_object_list(request).filter(user_id=request.user.id)

    def post_list(self, request, **kwargs):
        return