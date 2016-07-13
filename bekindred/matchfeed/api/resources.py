import hashlib
import logging

import itertools
from collections import namedtuple

from django.contrib.humanize.templatetags.humanize import intcomma
from django.core.cache import cache
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.bundle import Bundle
from tastypie.exceptions import BadRequest
from tastypie.resources import Resource

from events.models import FilterState
from friends.models import FacebookFriendUser, Friend
from friends.utils import NeoFourJ
from goals.utils import (get_mutual_linkedin_connections,
                         get_mutual_twitter_friends,
                         get_current_position, get_religious_views,
                         get_political_views)
from matchfeed.utils import MatchQuerySet, NonMatchUser, mutual_twitter_friends
from members.models import FacebookCustomUserActive

logger = logging.getLogger(__name__)


class A(object):
    pass


class MatchedFeedResource(Resource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name')
    facebook_id = fields.CharField(attribute='facebook_id')
    username = fields.CharField(attribute='username')
    image = fields.FileField(attribute="image", null=True, blank=True)
    user_id = fields.CharField(attribute='user_id')
    twitter_provider = fields.CharField(attribute='twitter_provider',
                                        null=True)
    twitter_username = fields.CharField(attribute='twitter_username',
                                        null=True)
    linkedin_provider = fields.CharField(attribute='linkedin_provider',
                                         null=True)
    age = fields.IntegerField(attribute='age')
    distance = fields.ListField(attribute='distance')
    about = fields.CharField(attribute='about', null=True)
    gender = fields.CharField(attribute='gender', default=u'all')

    photos = fields.ListField(attribute='photos')
    goals = fields.ListField(attribute='goals')
    offers = fields.ListField(attribute='offers')
    interests = fields.ListField(attribute='interests')
    top_interests = fields.ListField(attribute='top_interests')

    score = fields.IntegerField(attribute='score', null=True)
    mutual_likes_count = fields.IntegerField(attribute='mutual_likes_count',
                                             null=True)
    total_likes_count = fields.IntegerField(attribute='total_likes_count',
                                            null=True)
    es_score = fields.FloatField(attribute='es_score', null=True)
    friends_score = fields.IntegerField(attribute='friends_score', null=True)
    last_login = fields.DateField(attribute='last_login', null=True)
    keywords = fields.ListField(attribute='keywords', null=True)
    position = fields.DictField(attribute='position', null=True)
    lives_in = fields.CharField(attribute='lives_in', null=True)

    class Meta:
        # max_limit = 10
        resource_name = 'matchfeed'
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
        filter_updated_sha = None
        if fs:
            try:
                attrs = [fs[0].gender, fs[0].min_age, fs[0].max_age,
                         fs[0].distance, fs[0].distance_unit,
                         fs[0].order_criteria, fs[0].keyword]
                filter_updated = '.'.join(map(str, attrs))
                filter_updated_sha = hashlib.sha1(filter_updated).hexdigest()
                # Concatenate all filters value instead!!!
                # m.1312.10000mi.sim
                # filter_updated = time.mktime(fs[0].updated.timetuple())
                cache_match_users = cache.get('%s_%s' % (request.user.id,
                                                         filter_updated_sha))
            except AttributeError:
                pass
        if cache_match_users:
            match_users = cache_match_users
        else:
            match_users = MatchQuerySet.all(request.user.id, is_filter=True)
            cache.set('%s_%s' % (request.user.id,
                                 filter_updated_sha), match_users)
        if fs:
            if fs[0].order_criteria == 'match_score':
                return sorted(match_users, key=lambda x: -x.score)
            elif fs[0].order_criteria == 'mutual_friends':
                return sorted(match_users, key=lambda x: -x.friends_score)
            elif fs[0].order_criteria == 'date':
                return sorted(match_users, key=lambda x: x.last_login,
                              reverse=True)
        return match_users

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass

    def obj_delete(self, bundle, **kwargs):
        pass

    def apply_filters(self, request, applicable_filters):
        pass

    def obj_update(self, bundle, **kwargs):
        pass

    def obj_delete_list(self, bundle, **kwargs):
        pass

    def obj_create(self, bundle, **kwargs):
        pass

    def obj_delete_list_for_update(self, bundle, **kwargs):
        pass

    def dehydrate_distance(self, bundle):
        bundle.data['distance'] = [intcomma(bundle.data['distance'][0]),
                                   bundle.data['distance'][1]]
        bundle.data['position'] = get_current_position(bundle.data['id'])
        return bundle.data['distance']


class MutualFriendsResource(Resource):
    id = fields.CharField(attribute='id')

    # Mutual bekindred friends
    mutual_bk_friends = fields.ListField(attribute='mutual_bk_friends')
    mutual_bk_friends_count = fields.IntegerField(attribute='mutual_bk_friends_count')

    mutual_fb_friends = fields.ListField(attribute='mutual_fb_friends')
    mutual_fb_friends_count = fields.IntegerField(attribute='mutual_fb_friends_count')

    mutual_linkedin_connections = fields.ListField(attribute='mutual_linkedin_connections')
    mutual_linkedin_connections_count = fields.IntegerField(attribute='mutual_linkedin_connections_count')

    mutual_twitter_friends = fields.ListField(attribute='mutual_twitter_friends')
    mutual_twitter_friends_count = fields.IntegerField(attribute='mutual_twitter_friends_count')
    mutual_twitter_followers = fields.ListField(attribute='mutual_twitter_followers')
    mutual_twitter_followers_count = fields.IntegerField(attribute='mutual_twitter_followers_count')

    class Meta:
        max_limit = 1
        resource_name = 'mutual/friends'
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
        current_user = request.user.id
        user = request.GET.get('user_id', None)
        try:
            user = int(user)
        except TypeError:
            user = None
        if user and user != current_user:
            new_obj = A()
            new_obj.id = 0
            # TODO: Use Neo Friend
            new_obj.mutual_bk_friends = Friend.objects.mutual_friends(current_user, user)
            new_obj.mutual_bk_friends_count = len(new_obj.mutual_bk_friends)

            new_obj.mutual_fb_friends = FacebookFriendUser.objects.mutual_friends(current_user, user)
            new_obj.mutual_fb_friends_count = len(new_obj.mutual_fb_friends)

            l = get_mutual_linkedin_connections(current_user, user)
            new_obj.mutual_linkedin_connections = l['mutual_linkedin']
            new_obj.mutual_linkedin_connections_count = l['mutual_linkedin_count']

            t = get_mutual_twitter_friends(current_user, user)
            new_obj.mutual_twitter_friends = t['mutual_twitter_friends']
            new_obj.mutual_twitter_friends_count = t['count_mutual_twitter_friends']
            new_obj.mutual_twitter_followers = t['mutual_twitter_followers']
            new_obj.mutual_twitter_followers_count = t['count_mutual_twitter_followers']

            results.append(new_obj)
        return results

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


class Struct(object):
    def __init__(self, **entries):
        self.__dict__.update(entries)


FacebookMutualUser = namedtuple('FacebookMutualUser',
                                ['id', 'mutual', 'user_type', 'user_id',
                                 'distance', 'facebook_id', 'first_name',
                                 'last_name'])

TwitterMutualUser = namedtuple('TwitterMutualUser',
                                ['id', 'mutual', 'user_type', 'user_id',
                                 'distance', 'twitter_id', 'first_name',
                                 'photos'])


class MutualConnections(Resource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name', null=True)
    facebook_id = fields.CharField(attribute='facebook_id', null=True)
    username = fields.CharField(attribute='username', null=True)
    image = fields.FileField(attribute="image", null=True, blank=True)
    user_id = fields.CharField(attribute='user_id')
    twitter_provider = fields.CharField(attribute='twitter_provider',
                                        null=True)
    twitter_username = fields.CharField(attribute='twitter_username',
                                        null=True)
    linkedin_provider = fields.CharField(attribute='linkedin_provider',
                                         null=True)
    age = fields.IntegerField(attribute='age', null=True)
    distance = fields.ListField(attribute='distance', null=True)
    about = fields.CharField(attribute='about', null=True)
    gender = fields.CharField(attribute='gender', default=u'all')

    photos = fields.ListField(attribute='photos', null=True)
    goals = fields.ListField(attribute='goals', null=True)
    offers = fields.ListField(attribute='offers', null=True)
    interests = fields.ListField(attribute='interests', null=True)
    top_interests = fields.ListField(attribute='top_interests', null=True)

    score = fields.IntegerField(attribute='score', null=True)
    mutual_likes_count = fields.IntegerField(attribute='mutual_likes_count',
                                             null=True)
    total_likes_count = fields.IntegerField(attribute='total_likes_count',
                                            null=True)
    es_score = fields.FloatField(attribute='es_score', null=True)
    friends_score = fields.IntegerField(attribute='friends_score', null=True)
    last_login = fields.DateField(attribute='last_login', null=True)
    keywords = fields.ListField(attribute='keywords', null=True)
    position = fields.DictField(attribute='position', null=True)
    lives_in = fields.CharField(attribute='lives_in', null=True)
    mutual = fields.BooleanField(attribute='mutual', null=True)
    user_type = fields.CharField(attribute='user_type', null=True)
    """
    TODO:
    -------------------------
    mutual section
    -------------------------
    get_mutual_persice_connections
    get_mutual_twitter_friends
    get_mutual_twitter_followers
    get_mutual_fb_friends
    get_mutual_linkedin_connections
    -------------------------
    other section
    -------------------------
    calc other connections = user connections - get_mutual_connections
    """

    class Meta:
        resource_name = 'mutual-connections'
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
        results = {}
        current_user = request.user
        user_id = request.GET.get('user_id')
        if user_id is None:
            logger.error('user_id is required')
            raise BadRequest('user_id is required')
        try:
            user = FacebookCustomUserActive.objects.get(pk=user_id)
        except FacebookCustomUserActive.DoesNotExist as err:
            logging.exception(err)
            raise BadRequest('incorrect user_id')
        mutual_friends_ids = NeoFourJ().get_mutual_friends(current_user.id,
                                                       user.id)
        friends_ids = NeoFourJ().get_my_friends_ids(user.id)

        # Remove current user from list ICE-2194
        friends_ids.remove(current_user.id)

        other_ids = list(set(friends_ids) - set(mutual_friends_ids))

        mutual_friends = MatchQuerySet.filter(current_user, mutual_friends_ids)
        for obj in mutual_friends:
            obj.mutual = True
            obj.user_type = "persice"
            results[obj.user_id] = obj
            results[obj.facebook_id] = FacebookMutualUser(
                id=obj.facebook_id,
                user_id=obj.user_id,
                distance=obj.distance,
                first_name=obj.first_name,
                last_name=obj.last_name,
                facebook_id=obj.facebook_id,
                mutual=True,
                user_type='facebook'
            )

        other = MatchQuerySet.filter(current_user, other_ids)
        for obj1 in other:
            obj1.mutual = False
            obj1.user_type = "persice"
            results[obj1.user_id] = obj1

        twitters = mutual_twitter_friends(current_user, user_id)

        for twitter in twitters:
            results[twitter.twitter_id2] = TwitterMutualUser(
                id=twitter.twitter_id2,
                user_id=twitter.twitter_id2,
                distance=[],
                twitter_id=twitter.twitter_id2,
                first_name=twitter.name2,
                photos=[twitter.profile_image_url2],
                mutual=True,
                user_type='twitter'
            )

        return sorted(results.values(), key=lambda x: -x.mutual)

    def obj_get_list(self, bundle, **kwargs):
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


class ProfileResource(Resource):
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
    interests = fields.ListField(attribute='interests')
    top_interests = fields.ListField(attribute='top_interests')

    score = fields.IntegerField(attribute='score', null=True)
    mutual_likes_count = fields.IntegerField(attribute='mutual_likes_count',
                                             null=True)
    total_likes_count = fields.IntegerField(attribute='total_likes_count',
                                            null=True)
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
        resource_name = 'profile'
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
        username = request.GET.get('username')
        user = FacebookCustomUserActive.objects.filter(username=username)
        match_users = []
        if user:
            match_users = MatchQuerySet.between(request.user.id, user[0].id)
        return match_users

    def dehydrate(self, bundle):
        bundle.data['religious_views'] = get_religious_views(
            bundle.obj.id
        )
        bundle.data['political_views'] = get_political_views(
            bundle.obj.id
        )
        bundle.data['connected'] = Friend.objects.checking_friendship(
            bundle.request.user.id,
            bundle.obj.id
        )
        return bundle

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


def refresh_cache(user_id=None):
    fs = FilterState.objects.filter(user=user_id)
    cache_match_users = None
    filter_updated_sha = None
    if fs:
        try:
            attrs = [fs[0].gender, fs[0].min_age, fs[0].max_age,
                     fs[0].distance, fs[0].distance_unit,
                     fs[0].order_criteria, fs[0].keyword]
            filter_updated = '.'.join(map(str, attrs))
            filter_updated_sha = hashlib.sha1(filter_updated).hexdigest()
            # Concatenate all filters value instead!!!
            # m.1312.10000mi.sim
            # filter_updated = time.mktime(fs[0].updated.timetuple())
            cache_match_users = cache.get('%s_%s' % (user_id,
                                                     filter_updated_sha))
        except AttributeError:
            pass
    if cache_match_users:
        pass
    else:
        match_users = MatchQuerySet.all(user_id, is_filter=True)
        cache.set('%s_%s' % (user_id,
                             filter_updated_sha), match_users)
