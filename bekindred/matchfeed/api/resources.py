from django_facebook.models import FacebookCustomUser
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie import fields
from tastypie.bundle import Bundle
from tastypie.resources import Resource
from friends.models import FacebookFriendUser, Friend
from goals.models import MatchFilterState
from matchfeed.models import MatchFeedManager
from photos.models import FacebookPhoto
from goals.utils import get_mutual_linkedin_connections, get_mutual_twitter_friends, calculate_distance, calculate_age


class A(object):
    pass


class MatchedFeedResource(Resource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name')
    facebook_id = fields.CharField(attribute='facebook_id')
    user_id = fields.CharField(attribute='user_id')
    age = fields.IntegerField(attribute='age')
    distance = fields.FloatField(attribute='distance')
    about = fields.CharField(attribute='about', null=True)
    gender = fields.CharField(attribute='gender', default=u'all')

    photos = fields.ListField(attribute='photos')
    goals = fields.ListField(attribute='goals')
    offers = fields.ListField(attribute='offers')
    likes = fields.ListField(attribute='likes')
    interests = fields.ListField(attribute='interests')

    class Meta:
        max_limit = 1
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
        match_results = MatchFeedManager.match_all(request.user.id)

        results = []
        for x in match_results['users']:
            new_obj = A()
            user = FacebookCustomUser.objects.get(pk=x['id'])
            photos = FacebookPhoto.objects.filter(user_id=user).values_list('photo', flat=True)
            new_obj.distance = calculate_distance(request.user.id, user.id)
            new_obj.id = x['id']
            new_obj.first_name = user.first_name
            new_obj.last_name = user.last_name
            new_obj.facebook_id = user.facebook_id
            new_obj.age = calculate_age(user.date_of_birth)
            new_obj.gender = user.gender or 'all'
            new_obj.user_id = user.id
            new_obj.about = user.about_me
            new_obj.photos = photos
            new_obj.goals = x['goals']
            new_obj.offers = x['offers']
            new_obj.likes = x['likes']
            new_obj.interests = x['interests']
            results.append(new_obj)

        if request.GET.get('filter') == 'true':
            mfs = MatchFilterState.objects.get(user=request.user.id)
            results = filter(lambda x: (x.distance <= mfs.distance) and
                                       ((x.age <= int(mfs.max_age)) and (x.age >= int(mfs.min_age)) or (x.age is 0)) and
                                       ((x.gender in mfs.gender) or (x.gender == 'all')),
                             results)
            return results

        return results

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass


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


class ProfileResource(Resource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name')
    facebook_id = fields.CharField(attribute='facebook_id')
    user_id = fields.CharField(attribute='user_id')

    age = fields.IntegerField(attribute='age')
    distance = fields.FloatField(attribute='distance')
    about = fields.CharField(attribute='about', null=True)

    photos = fields.ListField(attribute='photos')
    goals = fields.ListField(attribute='goals')
    offers = fields.ListField(attribute='offers')
    likes = fields.ListField(attribute='likes')
    interests = fields.ListField(attribute='interests')

    class Meta:
        max_limit = 1
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
        results = []
        new_obj = A()
        _user = request.GET.get('user_id', None)
        if _user is None:
            return results
        match_results = MatchFeedManager.match_all(request.user.id, exclude_friends=True)
        request_user = FacebookCustomUser.objects.get(pk=_user)
        photos = FacebookPhoto.objects.filter(user_id=request_user).values_list('photo', flat=True)

        for user in match_results['users']:
            if user['id'] == request_user.id:

                new_obj.id = request_user.id
                new_obj.first_name = request_user.first_name
                new_obj.last_name = request_user.last_name
                new_obj.facebook_id = request_user.facebook_id
                new_obj.user_id = request_user.id
                new_obj.age = calculate_age(request_user.date_of_birth)
                new_obj.about = request_user.about_me
                new_obj.photos = photos
                new_obj.distance = calculate_distance(request.user.id, request_user.id)

                new_obj.goals = user['goals']
                new_obj.offers = user['offers']
                new_obj.likes = user['likes']
                new_obj.interests = user['interests']
                results.append(new_obj)
        return results

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass
