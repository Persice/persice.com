from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource, Resource
from events.models import Event
from photos.api.resources import UserResource


class EventResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        always_return_data = True
        queryset = Event.objects.all()
        resource_name = 'events'
        excludes = ['search_index']

        filtering = {
            'description': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()


class EventFeedResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        resource_name = 'feed/events'
        queryset = Event.objects.all()
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        bundle.data['street'] = "Whatever you want"
        bundle.data['city'] = "Whatever you want"
        bundle.data['state'] = "Whatever you want"
        return bundle