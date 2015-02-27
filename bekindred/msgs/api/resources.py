from django.contrib.sessions.models import Session
from django.utils.timezone import now
from django_facebook.models import FacebookCustomUser
import re
import redis
import json
from django.db.models import Q
from tastypie.bundle import Bundle
from friends.models import Friend
from matchfeed.api.resources import A
from postman.models import Message
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource, Resource
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

        data['sent_at'] = str(bundle.obj.sent_at.isoformat())
        r.publish('message.%s' % user.id, json.dumps(data))
        return bundle


class InboxLastResource(Resource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name')
    facebook_id = fields.CharField(attribute='facebook_id')
    last_message_body = fields.CharField(attribute='last_message_body', null=True)
    recipient_id = fields.CharField(attribute='recipient_id', null=True)
    sender_id = fields.CharField(attribute='sender_id', null=True)
    read_at = fields.CharField(attribute='read_at', null=True)
    friend_id = fields.CharField(attribute='friend_id', null=True)
    sent_at = fields.CharField(attribute='sent_at', null=True)

    class Meta:
        resource_name = 'inbox/last'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def detail_uri_kwargs(self, bundle_or_obj):
        kwargs = {}
        if isinstance(bundle_or_obj, Bundle):
            kwargs['pk'] = bundle_or_obj.obj.id
        else:
            kwargs['pk'] = bundle_or_obj.id

        return kwargs

    def get_object_list(self, request):
        current_user = request.user.id
        friends = Friend.objects.friends(current_user)

        results = []
        for friend in friends:
            new_obj = A()
            new_obj.id = friend.id
            if friend.friend1.id == current_user:
                position_friend = 'friend2'
            else:
                position_friend = 'friend1'
            new_obj.first_name = getattr(friend, position_friend).first_name
            new_obj.last_name = getattr(friend, position_friend).last_name
            new_obj.facebook_id = getattr(friend, position_friend).facebook_id
            new_obj.friend_id = getattr(friend, position_friend).id
            try:
                message = Message.objects.filter(sender=new_obj.friend_id).order_by('-sent_at')[0]
                new_obj.last_message_body = message.body
                new_obj.read_at = message.read_at
                new_obj.sent_at = message.sent_at.isoformat()
                new_obj.recipient_id = '/api/v1/auth/user/{}/'.format(message.recipient_id)
                new_obj.sender_id = '/api/v1/auth/user/{}/'.format(message.sender_id)
            except IndexError as err:
                new_obj.last_message_body = None
                new_obj.recipient_id = None
                new_obj.sender_id = None
                new_obj.sent_at = None
                new_obj.read_at = None
            results.append(new_obj)
        return results

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


class InboxResource(Resource):
    class Meta:
        resource_name = 'inbox/reat_at'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        raw_sender = request.GET.get('sender_id')
        if raw_sender:
            sender = int(raw_sender)
            user = FacebookCustomUser.objects.get(id=request.user.id)
            sender = FacebookCustomUser.objects.get(id=sender)
            Message.objects.filter(sender=sender, recipient=user).update(read_at=now())
        return list()

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass
