import re
from django.db.models import Q
from django_facebook.models import FacebookCustomUser
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.bundle import Bundle
from tastypie.constants import ALL
from tastypie.resources import ModelResource, Resource

from friends.models import Friend, FacebookFriendUser
from goals.models import Goal
from goals.utils import get_mutual_linkedin_connections, get_mutual_twitter_friends, social_extra_data
from interests.models import Interest
from photos.api.resources import UserResource
from matchfeed.api.resources import A
from postman.api import pm_write


class FriendsResource(ModelResource):
    friend1 = fields.ForeignKey(UserResource, 'friend1')
    friend2 = fields.ForeignKey(UserResource, 'friend2')

    class Meta:
        queryset = Friend.objects.all()
        resource_name = 'friends'
        always_return_data = True
        fields = ['id', 'friend1', 'friend2', 'status']
        filtering = {'friend1': ALL,
                     'friend2': ALL,
                     'status': ALL}
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        u = request.user.id
        return super(FriendsResource, self).get_object_list(request).filter(Q(friend1=u) | Q(friend2=u))

    def obj_create(self, bundle, **kwargs):
        status = bundle.data['status']

        f1 = int(re.findall(r'/(\d+)/', bundle.data['friend1'])[0])
        f2 = int(re.findall(r'/(\d+)/', bundle.data['friend2'])[0])

        result = Friend.objects.filter(Q(friend1=f1, friend2=f2) | Q(friend1=f2, friend2=f1))
        if result:
            if result[0].status == 0 and status in (0, 1):
                bundle.obj = result[0]
                bundle.obj.status = 1
                bundle.data['status'] = 1
                return super(FriendsResource, self).obj_update(bundle, **kwargs)
            elif result[0].status == -1 or status == -1:
                bundle.obj = result[0]
                bundle.obj.status = -1
                bundle.data['status'] = -1
                return super(FriendsResource, self).obj_update(bundle, **kwargs)
        else:
            bundle = super(FriendsResource, self).obj_create(bundle, **kwargs)
        return bundle


class ConnectionsResource(Resource):
    id = fields.CharField(attribute='id')
    facebook_id = fields.CharField(attribute='facebook_id')
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name')
    friend_id = fields.CharField(attribute='friend_id')
    twitter_provider = fields.CharField(attribute='twitter_provider', null=True)
    linkedin_provider = fields.CharField(attribute='linkedin_provider', null=True)

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
    common_goals_offers_interests = fields.IntegerField(attribute='common_goals_offers_interests', null=True)

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
        firstname = request.GET.get('first_name', None)
        friendid = request.GET.get('friend', None)
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
            new_obj.friend_id = getattr(friend, position_friend).id

            if friendid and not int(friendid) == new_obj.friend_id:
                continue

            if firstname and not firstname.lower() in new_obj.first_name.lower():
                continue

            new_obj.twitter_provider, new_obj.linkedin_provider = social_extra_data(new_obj.friend_id)

            new_obj.mutual_bk_friends = Friend.objects.mutual_friends(current_user, new_obj.friend_id)
            new_obj.mutual_bk_friends_count = len(new_obj.mutual_bk_friends)

            new_obj.mutual_fb_friends = FacebookFriendUser.objects.mutual_friends(current_user, new_obj.friend_id)
            new_obj.mutual_fb_friends_count = len(new_obj.mutual_fb_friends)

            l = get_mutual_linkedin_connections(current_user, new_obj.friend_id)
            new_obj.mutual_linkedin_connections = l['mutual_linkedin']
            new_obj.mutual_linkedin_connections_count = l['mutual_linkedin_count']

            t = get_mutual_twitter_friends(current_user, position_friend)
            new_obj.mutual_twitter_friends = t['mutual_twitter_friends']
            new_obj.mutual_twitter_friends_count = t['count_mutual_twitter_friends']
            new_obj.mutual_twitter_followers = t['mutual_twitter_followers']
            new_obj.mutual_twitter_followers_count = t['count_mutual_twitter_followers']
            t1 = Goal.objects_search.count_common_goals_and_offers(current_user, new_obj.friend_id)
            t2 = Interest.search_subject.count_interests_fb_likes(current_user, new_obj.friend_id)
            new_obj.common_goals_offers_interests = t1 + t2
                                                    #                                                  new_obj.friend_id)

            results.append(new_obj)
        return results

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass
