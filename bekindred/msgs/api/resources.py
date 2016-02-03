import re
import json

from django.utils.timezone import now
from django_facebook.models import FacebookCustomUser
import redis
from django.db.models import Q, Count
from tastypie.bundle import Bundle
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.resources import ModelResource, Resource
from events.api.resources import EventResource
from events.models import Event, Membership

from friends.models import Friend
from matchfeed.api.resources import A
from msgs.models import ChatMessage
from postman.models import Message
from members.models import UserSession, FacebookCustomUserActive
from photos.api.resources import UserResource


class MessageResource(ModelResource):
    sender = fields.ForeignKey(UserResource, 'sender')
    recipient = fields.ForeignKey(UserResource, 'recipient')

    class Meta:
        queryset = Message.objects.all()
        resource_name = 'messages'
        allowed_methods = ['get', 'post']
        ordering = ['sent_at']
        always_return_data = True
        fields = ['sender', 'recipient', 'body', 'sent_at']
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.user.id
        user_id = request.GET.get('user_id', None)
        if user_id is None:
            return super(MessageResource, self).get_object_list(request).filter(Q(sender=user,
                                                                                  recipient__is_active=True,
                                                                                  sender__is_active=True) |
                                                                                Q(recipient=user,
                                                                                  sender__is_active=True,
                                                                                  recipient__is_active=True))
        else:
            return super(MessageResource, self).get_object_list(request).filter(Q(sender=user,
                                                                                  sender__is_active=True,
                                                                                  recipient__is_active=True,
                                                                                  recipient=user_id) |
                                                                                Q(sender=user_id,
                                                                                  sender__is_active=True,
                                                                                  recipient__is_active=True,
                                                                                  recipient=user))

    def obj_create(self, bundle, **kwargs):
        bundle = super(MessageResource, self).obj_create(bundle, **kwargs)
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        data = bundle.data
        recipient = re.findall(r'/(\d+)/', bundle.data['recipient'])[0]
        user = FacebookCustomUserActive.objects.get(pk=recipient)
        user_sessions = UserSession.objects.filter(user_id=user)

        data['sent_at'] = str(bundle.obj.sent_at.isoformat())
        r.publish('message.%s' % user.id, json.dumps(data))
        return bundle


class InboxLastResource(Resource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name')
    facebook_id = fields.CharField(attribute='facebook_id')
    image = fields.FileField(attribute="image", null=True, blank=True)
    last_message_body = fields.CharField(attribute='last_message_body', null=True)
    recipient_id = fields.CharField(attribute='recipient_id', null=True)
    sender_id = fields.CharField(attribute='sender_id', null=True)
    read_at = fields.CharField(attribute='read_at', null=True)
    friend_id = fields.CharField(attribute='friend_id', null=True)
    sent_at = fields.CharField(attribute='sent_at', null=True)
    # TODO:
    # Add counter of unread messages on conversation level

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
            new_obj.image = getattr(friend, position_friend).image
            new_obj.friend_id = getattr(friend, position_friend).id
            try:
                message = Message.objects.filter(sender=new_obj.friend_id,
                                                 recipient=current_user
                                                 ).order_by('-sent_at')[0]
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
            user = FacebookCustomUserActive.objects.get(id=request.user.id)
            sender = FacebookCustomUserActive.objects.get(id=sender)
            Message.objects.filter(sender=sender, recipient=user).update(read_at=now())
        return list()

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


class UnreadMessageCounter(Resource):
    unread_counter = fields.IntegerField(attribute='unread_counter')

    class Meta:
        resource_name = 'inbox/unread_counter'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        new_object = A()
        results = []
        user = FacebookCustomUserActive.objects.get(id=request.user.id)
        cnt = Message.objects.filter(read_at__isnull=True, recipient=user).order_by('sender', 'recipient').\
            values('sender').annotate(cnt=Count('sender'))
        new_object.unread_counter = len(cnt)
        results.append(new_object)
        return results

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


class ChatMessageResource(ModelResource):
    sender = fields.ForeignKey(UserResource, 'sender', null=True)
    event = fields.ForeignKey(EventResource, 'event')

    class Meta:
        queryset = ChatMessage.objects.all()
        resource_name = 'chat'
        allowed_methods = ['get', 'post']
        always_return_data = True
        fields = ['sender', 'body', 'sent_at']
        filtering = {'event': ALL_WITH_RELATIONS}
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        bundle.data['facebook_id'] = bundle.obj.sender.facebook_id
        bundle.data['image'] = bundle.obj.sender.image
        bundle.data['first_name'] = bundle.obj.sender.first_name
        return bundle

    def get_object_list(self, request):
        return super(ChatMessageResource, self).get_object_list(request). \
            order_by('-sent_at')

    def obj_create(self, bundle, **kwargs):
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        data = bundle.data
        event_id = re.findall(r'/(\d+)/', bundle.data['event'])[0]
        event = Event.objects.get(pk=int(event_id))

        user_id = re.findall(r'/(\d+)/', bundle.data['sender'])[0]
        sender = FacebookCustomUserActive.objects.get(pk=int(user_id))

        members = Membership.objects.filter(event=event, rsvp='yes').\
            exclude(user=sender.id)
        for member in members:
            data['facebook_id'] = member.user.facebook_id
            data['sent_at'] = now().isoformat()
            data['event_id'] = event_id
            r.publish('chat_message.%s' % member.user.id, json.dumps(data))
        return super(ChatMessageResource, self).obj_create(bundle, **kwargs)
