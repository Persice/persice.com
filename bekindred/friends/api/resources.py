import json
import re

import redis
from django.db.models import Q
from django.utils.timezone import now
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.bundle import Bundle
from tastypie.constants import ALL
from tastypie.resources import ModelResource, Resource

from events.models import FilterState
from friends.models import FacebookFriendUser, Friend
from goals.utils import (calculate_distance, get_mutual_linkedin_connections,
                         get_mutual_twitter_friends, social_extra_data,
                         calculate_age)
from match_engine.models import MatchEngine
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
                r.publish('connection.%s' % result[0].friend1_id,
                          json.dumps(bundle.data))
                r.publish('connection.%s' % result[0].friend2_id,
                          json.dumps(bundle.data))
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


class ConnectionsResource(Resource):
    id = fields.CharField(attribute='id')
    facebook_id = fields.CharField(attribute='facebook_id', null=True)
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name')
    friend_id = fields.CharField(attribute='friend_id')
    twitter_provider = fields.CharField(attribute='twitter_provider',
                                        null=True)
    twitter_username = fields.CharField(attribute='twitter_username',
                                        null=True)
    linkedin_provider = fields.CharField(attribute='linkedin_provider',
                                         null=True)

    top_interests = fields.ListField(attribute='top_interests')
    mutual_bk_friends = fields.ListField(attribute='mutual_bk_friends')
    mutual_bk_friends_count = fields.IntegerField(
        attribute='mutual_bk_friends_count')

    mutual_fb_friends = fields.ListField(attribute='mutual_fb_friends')

    mutual_fb_friends_count = fields.IntegerField(
        attribute='mutual_fb_friends_count')

    mutual_linkedin_connections = fields.ListField(
        attribute='mutual_linkedin_connections')

    mutual_linkedin_connections_count = fields.IntegerField(
        attribute='mutual_linkedin_connections_count')

    mutual_twitter_friends = fields.ListField(
        attribute='mutual_twitter_friends')

    mutual_twitter_friends_count = fields.IntegerField(
        attribute='mutual_twitter_friends_count')

    mutual_twitter_followers = fields.ListField(
        attribute='mutual_twitter_followers')

    mutual_twitter_followers_count = fields.IntegerField(
        attribute='mutual_twitter_followers_count')

    mutual_friends = fields.IntegerField(attribute='mutual_friends')

    score = fields.IntegerField(
        attribute='score', null=True
    )

    updated_at = fields.DateTimeField(attribute='updated_at', null=True)
    distance = fields.ListField(attribute='distance')
    image = fields.FileField(attribute="image", null=True, blank=True)
    gender = fields.CharField(attribute='gender', default='m,f')
    age = fields.IntegerField(attribute='age', null=True, blank=True)

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
        results = []
        _first_name = request.GET.get('first_name', None)
        _friend_id = request.GET.get('friend', None)
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
            new_obj.last_name = getattr(friend, position_friend).last_name
            new_obj.facebook_id = getattr(friend, position_friend).facebook_id
            new_obj.image = getattr(friend, position_friend).image
            new_obj.gender = getattr(friend, position_friend).gender
            new_obj.friend_id = getattr(friend, position_friend).id
            new_obj.age = calculate_age(getattr(friend, position_friend).date_of_birth)
            new_obj.updated_at = friend.updated_at

            if _friend_id and not int(_friend_id) == new_obj.friend_id:
                continue

            if _first_name and \
                    not _first_name.lower() in new_obj.first_name.lower():
                continue

            new_obj.twitter_provider, new_obj.linkedin_provider, \
                new_obj.twitter_username = social_extra_data(new_obj.friend_id)

            new_obj.mutual_bk_friends = Friend.objects.\
                mutual_friends(current_user, new_obj.friend_id)
            new_obj.mutual_bk_friends_count = len(new_obj.mutual_bk_friends)

            new_obj.mutual_fb_friends = FacebookFriendUser.objects.\
                mutual_friends(current_user, new_obj.friend_id)
            new_obj.mutual_fb_friends_count = len(new_obj.mutual_fb_friends)

            l = get_mutual_linkedin_connections(current_user,
                                                new_obj.friend_id)
            new_obj.mutual_linkedin_connections = l['mutual_linkedin']
            new_obj.mutual_linkedin_connections_count = \
                l['mutual_linkedin_count']

            t = get_mutual_twitter_friends(current_user, new_obj.friend_id)
            new_obj.mutual_twitter_friends = t['mutual_twitter_friends']
            new_obj.mutual_twitter_friends_count = \
                t['count_mutual_twitter_friends']
            new_obj.mutual_twitter_followers = t['mutual_twitter_followers']
            new_obj.mutual_twitter_followers_count = \
                t['count_mutual_twitter_followers']

            new_obj.mutual_friends = new_obj.mutual_bk_friends_count + \
                new_obj.mutual_fb_friends_count + \
                new_obj.mutual_linkedin_connections_count + \
                new_obj.mutual_twitter_friends_count + \
                new_obj.mutual_twitter_followers_count

            new_obj.score = MatchEngine.\
                objects.count_common_goals_and_offers(current_user,
                                                      new_obj.friend_id)

            new_obj.distance = calculate_distance(request.user.id,
                                                  new_obj.friend_id)
            new_obj.top_interests = [{'dancing': 1, 'cooking': 1,
                                      '3D printing': 1}]

            results.append(new_obj)

        # Order by match_score
        if request.GET.get('order') == 'match_score':
            return sorted(results,
                          key=lambda x: x.score,
                          reverse=True)

        elif request.GET.get('order') == 'mutual_friends':
            return sorted(results,
                          key=lambda x: x.mutual_friends, reverse=True)

        elif request.GET.get('order') == 'first_name':
            return sorted(results, key=lambda x: (x.first_name, x.last_name))

        elif request.GET.get('order') == 'distance':
            return sorted(results, key=lambda x: x.distance[0])

        return sorted(results, key=lambda x: x.updated_at, reverse=True)

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


class ConnectionsResource2(Resource):
    id = fields.CharField(attribute='id')
    facebook_id = fields.CharField(attribute='facebook_id', null=True)
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
        resource_name = 'connections2'
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
        if request.GET.get('filter') == 'true':
            match_users = MatchQuerySet. \
                all(request.user.id, is_filter=True, friends=True)
            fs = FilterState.objects.filter(user=request.user.id)
            if fs:
                if fs[0].order_criteria == 'match_score':
                    return sorted(match_users, key=lambda x: -x.score)
                elif fs[0].order_criteria == 'mutual_friends':
                    return sorted(match_users, key=lambda x: -x.friends_score)
                elif fs[0].order_criteria == 'date':
                    return sorted(match_users, key=lambda x: x.last_login,
                                  reverse=True)
        else:
            match_users = MatchQuerySet.all(request.user.id, friends=True)
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
