import json

import re
import redis
from django.core.cache import cache
from django.db.models import Q
from django.utils.timezone import now
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.bundle import Bundle
from tastypie.constants import ALL
from tastypie.resources import ModelResource, Resource

from events.models import FilterState
from friends.models import Friend
from matchfeed.api.resources import A
from matchfeed.utils import MatchQuerySet
from members.models import FacebookCustomUserActive
from photos.api.resources import UserResource


class FriendsResource(ModelResource):
    friend1 = fields.ForeignKey(UserResource, 'friend1')
    friend2 = fields.ForeignKey(UserResource, 'friend2')

    class Meta:
        queryset = Friend.objects.all()
        resource_name = 'friends'
        always_return_data = True
        fields = ['id', 'friend1', 'friend2', 'status', 'updated_at']
        filtering = {'friend1': ALL,
                     'friend2': ALL,
                     'status': ALL}
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        u = request.user.id
        return super(FriendsResource, self).get_object_list(request).\
            filter(Q(friend1=u) | Q(friend2=u))

    def obj_create(self, bundle, **kwargs):
        status = bundle.data['status']

        f1 = int(re.findall(r'/(\d+)/', bundle.data['friend1'])[0])
        f2 = int(re.findall(r'/(\d+)/', bundle.data['friend2'])[0])

        result = Friend.objects.filter(Q(friend1=f1, friend2=f2) |
                                       Q(friend1=f2, friend2=f1))
        if result:
            if result[0].status == 0 and status in (0, 1):
                bundle.obj = result[0]
                bundle.obj.status = 1
                bundle.data['status'] = 1
                # redis
                r = redis.StrictRedis(host='localhost', port=6379, db=0)
                user_1 = {'friend_name': bundle.obj.friend2.first_name,
                          'friend_id': result[0].friend2_id,
                          'friend_username': result[0].friend2.username}
                r.publish('connection.%s' % result[0].friend1_id,
                          json.dumps(user_1))

                user_2 = {'friend_name': bundle.obj.friend1.first_name,
                          'friend_id': result[0].friend1_id,
                          'friend_username': result[0].friend1.username}
                r.publish('connection.%s' % result[0].friend2_id,
                          json.dumps(user_2))
                return super(FriendsResource, self).obj_update(bundle,
                                                               **kwargs)
            elif result[0].status == -1 or status == -1:
                bundle.obj = result[0]
                bundle.obj.status = -1
                bundle.data['status'] = -1
                return super(FriendsResource, self).obj_update(bundle,
                                                               **kwargs)
        else:
            bundle = super(FriendsResource, self).obj_create(bundle, **kwargs)
        return bundle


class ConnectionsSearchResource(Resource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name')
    friend_id = fields.CharField(attribute='friend_id')
    image = fields.FileField(attribute="image", null=True, blank=True)

    class Meta:
        resource_name = 'connectionssearch'
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
        results = []
        _first_name = request.GET.get('first_name', '')
        current_user = request.user.id
        friends = Friend.objects.friends(current_user)
        for friend in friends:

            new_obj = A()
            new_obj.id = friend.id
            if friend.friend1.id == current_user:
                position_friend = 'friend2'
            else:
                position_friend = 'friend1'

            new_obj.first_name = getattr(friend, position_friend).first_name
            new_obj.image = getattr(friend, position_friend).image
            new_obj.friend_id = getattr(friend, position_friend).id

            if _first_name.lower() != '' and \
                    _first_name.lower() in new_obj.first_name.lower():
                results.append(new_obj)

        return sorted(results, key=lambda x: x.first_name, reverse=False)

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


class ConnectionsResource(Resource):
    id = fields.CharField(attribute='id')
    facebook_id = fields.CharField(attribute='facebook_id', null=True)
    username = fields.CharField(attribute='username', null=True)
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name')
    user_id = fields.CharField(attribute='user_id')

    age = fields.IntegerField(attribute='age')
    distance = fields.ListField(attribute='distance')
    about = fields.CharField(attribute='about', null=True)
    gender = fields.CharField(attribute='gender', default=u'all')

    photos = fields.ListField(attribute='photos')
    goals = fields.ListField(attribute='goals')
    offers = fields.ListField(attribute='offers')
    likes = fields.ListField(attribute='likes')
    interests = fields.ListField(attribute='interests')
    top_interests = fields.ListField(attribute='top_interests')

    score = fields.IntegerField(attribute='score', null=True)
    es_score = fields.FloatField(attribute='es_score', null=True)
    friends_score = fields.IntegerField(attribute='friends_score', null=True)

    friend_id = fields.CharField(attribute='friend_id', null=True)

    updated_at = fields.DateTimeField(attribute='updated_at', null=True)
    last_login = fields.DateTimeField(attribute='last_login', null=True)
    image = fields.FileField(attribute="image", null=True, blank=True)
    position = fields.DictField(attribute="position", null=True, blank=True)
    lives_in = fields.CharField(attribute="lives_in", null=True, blank=True)

    twitter_provider = fields.CharField(attribute="twitter_provider",
                                        null=True, blank=True)
    linkedin_provider = fields.CharField(attribute="linkedin_provider",
                                         null=True, blank=True)
    twitter_username = fields.CharField(attribute="twitter_username",
                                        null=True, blank=True)

    class Meta:
        resource_name = 'connections'
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
        fs = FilterState.objects.filter(user=request.user.id)

        cache_match_users = None
        filter_updated = None
        if fs:
            try:
                attrs = [fs[0].gender, fs[0].min_age, fs[0].max_age,
                         fs[0].distance, fs[0].distance_unit,
                         fs[0].order_criteria, fs[0].keyword]
                filter_updated = '.'.join(map(str, attrs))
                cache_match_users = cache.get('c_%s_%s' %
                                              (request.user.id,
                                               filter_updated))
            except AttributeError:
                pass
        if cache_match_users:
            match_users = cache_match_users
        else:
            match_users = MatchQuerySet. \
                all(request.user.id, is_filter=True, friends=True)
            cache.set('c_%s_%s' % (request.user.id,
                                   filter_updated), match_users)
        return match_users

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


class FriendsNewResource(Resource):
    class Meta:
        resource_name = 'new_connections/updated_at'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        raw_friend_id = request.GET.get('friend_id')
        if raw_friend_id:
            friend_id = int(raw_friend_id)
            user = FacebookCustomUserActive.objects.get(id=request.user.id)
            fb_obj = FacebookCustomUserActive.objects.get(id=friend_id)
            Friend.objects.filter(Q(friend1=fb_obj, friend2=user) |
                                  Q(friend1=user, friend2=fb_obj)).\
                update(updated_at=now())
        return list()

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


class FriendsNewCounterResource(Resource):
    new_connection_counter = fields.IntegerField(
        attribute='new_connection_counter')

    class Meta:
        resource_name = 'new_connections/counter'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        results = []
        new_obj = A()
        new_obj.new_connection_counter = Friend.objects.\
            new_friends(request.user.id).count()
        results.append(new_obj)
        return results

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass
