from django_facebook.models import FacebookCustomUser
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie import fields
from tastypie.bundle import Bundle
from tastypie.resources import Resource
from matchfeed.models import MatchFeedManager
from photos.models import FacebookPhoto


class A(object):
    pass


class MatchedFeedResource(Resource):
    id = fields.CharField(attribute='id')
    first_name = fields.CharField(attribute='first_name')
    last_name = fields.CharField(attribute='last_name')
    # age = fields.IntegerField(attribute='age')
    # distance = fields.FloatField(attribute='distance')
    about = fields.CharField(attribute='about', null=True)

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
            new_obj.id = x['id']
            new_obj.first_name = user.first_name
            new_obj.last_name = user.last_name
            new_obj.about = user.about_me
            new_obj.photos = photos
            new_obj.goals = x['goals']
            new_obj.offers = x['offers']
            new_obj.likes = x['likes']
            new_obj.interests = x['interests']
            results.append(new_obj)
        return results

    def obj_get_list(self, bundle, **kwargs):
        # Filtering disabled for brevity...
        return self.get_object_list(bundle.request)

    def rollback(self, bundles):
        pass

    def obj_get(self, bundle, **kwargs):
        pass