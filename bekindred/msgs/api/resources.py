from django.db.models import Q
from postman.models import Message
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from photos.api.resources import UserResource


class MessageResource(ModelResource):
    sender = fields.ForeignKey(UserResource, 'sender')
    recipient = fields.ForeignKey(UserResource, 'recipient')

    class Meta:
        queryset = Message.objects.all()
        resource_name = 'messages'
        allowed_methods = ['get', 'post']
        fields = ['sender', 'recipient', 'body']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        return super(MessageResource, self).get_object_list(request).filter(Q(sender=request.user.id) |
                                                                            Q(recipient=request.user.id))
