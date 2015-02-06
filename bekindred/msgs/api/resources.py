from postman.models import Message
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource


class MessageResource(ModelResource):

    class Meta:
        queryset = Message.objects.all()
        resource_name = 'messages'
        allowed_methods = ['get']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.user.id
        return super(MessageResource, self).get_object_list(request)
