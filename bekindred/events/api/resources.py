from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource
from events.models import Event


class EventResource(ModelResource):
    class Meta:
        always_return_data = True
        queryset = Event.objects.all()
        resource_name = 'events'
        fields = ['name']

        filtering = {
            'description': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()
