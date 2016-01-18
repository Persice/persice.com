from django.conf.urls import url
from django.core.paginator import InvalidPage, Paginator
from django.http import Http404
from haystack.backends import SQ
from haystack.query import SearchQuerySet
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash
from friends.models import Friend

from goals.utils import calculate_age, social_extra_data, calculate_distance, \
    get_current_position, get_lives_in
from match_engine.models import MatchEngine
from members.models import FacebookCustomUserActive, OnBoardingFlow
from photos.models import FacebookPhoto


class OnBoardingFlowResource(ModelResource):
    user = fields.ForeignKey('photos.api.resources.UserResource', 'user')

    class Meta:
        queryset = OnBoardingFlow.objects.all()
        resource_name = 'onboardingflow'
        fields = ['is_complete']
        always_return_data = True
        authentication = SessionAuthentication()
        authorization = Authorization()


class UserResource(ModelResource):
    goals = fields.OneToManyField('goals.api.resources.GoalResource',
                                  attribute=lambda bundle:
                                  bundle.obj.goal_set.all(),
                                  full=True, null=True)
    offers = fields.OneToManyField('goals.api.resources.OfferResource',
                                   attribute=lambda bundle:
                                   bundle.obj.offer_set.all(),
                                   full=True, null=True)
    interests = fields.OneToManyField('interests.api.resources.'
                                      'InterestResource',
                                      attribute=lambda bundle:
                                      bundle.obj.interest_set.all(),
                                      full=True, null=True)

    onboardingflow = fields.OneToOneField(OnBoardingFlowResource,
                                          'onboardingflow',
                                          full=True, null=True)

    class Meta:
        queryset = FacebookCustomUserActive.objects.all()
        resource_name = 'auth/user'
        fields = ['username', 'first_name', 'last_name', 'last_login',
                  'about_me', 'facebook_id', 'id', 'date_of_birth',
                  'facebook_profile_url', 'gender', 'image']
        filtering = {
            'facebook_id': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate(self, bundle):
        bundle.data['distance'] = calculate_distance(bundle.request.user.id,
                                                     bundle.obj.id)

        bundle.data['mutual_friends'] = \
            len(Friend.objects.mutual_friends(bundle.request.user.id,
                                              bundle.obj.id))

        bundle.data['age'] = calculate_age(bundle.data['date_of_birth'])

        # TODO chane user_id to url from user_id
        bundle.data['twitter_provider'], bundle.data['linkedin_provider'], \
            bundle.data['twitter_username'] = \
            social_extra_data(bundle.request.user.id)

        if bundle.obj.id != bundle.request.user.id:
            bundle.data['match_score'] = MatchEngine.objects. \
                count_common_goals_and_offers(bundle.obj.id,
                                              bundle.request.user.id)
        else:
            bundle.data['match_score'] = 0

        bundle.data['position'] = get_current_position(bundle.obj)
        bundle.data['lives_in'] = get_lives_in(bundle.obj)

        return bundle

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/search%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('get_search'), name="api_get_search"),
        ]

    def get_search(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        self.is_authenticated(request)
        self.throttle_check(request)

        # Do the query.
        query = request.GET.get('q', '')
        sqs = SearchQuerySet().models(FacebookCustomUserActive).load_all(). \
            filter(SQ(first_name=query) |
                   SQ(last_name=query) |
                   SQ(goals=query) |
                   SQ(offers=query) |
                   SQ(likes=query) |
                   SQ(interests=query)).\
            exclude(id=request.user.id)
        paginator = Paginator(sqs, 10)

        try:
            page = paginator.page(int(request.GET.get('page', 1)))
        except InvalidPage:
            raise Http404("Sorry, no results on that page.")

        objects = []

        for result in page.object_list:
            bundle = self.build_bundle(obj=result.object, request=request)
            bundle = self.full_dehydrate(bundle)
            objects.append(bundle)

        object_list = {
            'objects': objects,
        }

        self.log_throttled_access(request)
        return self.create_response(request, object_list)


class FacebookPhotoResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = FacebookPhoto.objects.all()
        resource_name = 'photo'
        always_return_data = True
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(FacebookPhotoResource, self).get_object_list(request).\
            filter(user_id=user)
