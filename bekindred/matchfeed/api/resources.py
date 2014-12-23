from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import Resource
from matchfeed.models import MatchFeed


class MatchedFeedResource(Resource):

    class Meta:
        resource_name = 'matchfeed'
        authentication = SessionAuthentication()
        authorization = Authorization()

    # def obj_get_list(self, bundle):
    #     pass
    #
    # def dehydrate(self, bundle):
    #     bundle.data['custom_field'] = "Whatever you want"
    #     return bundle