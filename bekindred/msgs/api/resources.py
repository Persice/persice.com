from django.contrib.sessions.models import Session
from django_facebook.models import FacebookCustomUser
import re
import redis
import json
from django.db.models import Q
from postman.models import Message
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from members.models import UserSession
from photos.api.resources import UserResource


class MessageResource(ModelResource):
    sender = fields.ForeignKey(UserResource, 'sender')
    recipient = fields.ForeignKey(UserResource, 'recipient')

    class Meta:
        queryset = Message.objects.all()
        resource_name = 'messages'
        allowed_methods = ['get', 'post']
        always_return_data = True
        fields = ['sender', 'recipient', 'body', 'sent_at']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.user.id
        user_id = request.GET.get('user_id', None)
        if user_id is None:
            return super(MessageResource, self).get_object_list(request).filter(Q(sender=user) | Q(recipient=user))
        else:
            return super(MessageResource, self).get_object_list(request).filter(Q(sender=user, recipient=user_id) |
                                                                                Q(sender=user_id, recipient=user))

    def obj_create(self, bundle, **kwargs):
        bundle = super(MessageResource, self).obj_create(bundle, **kwargs)
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        data = bundle.data
        recipient = re.findall(r'/(\d+)/', bundle.data['recipient'])[0]
        user = FacebookCustomUser.objects.get(pk=recipient)
        user_sessions = UserSession.objects.filter(user_id=user)
        for session in user_sessions:
            data['sent_at'] = str(bundle.obj.sent_at.isoformat())
            r.publish('message.%s' % session.session_id, json.dumps(data))
        return bundle