from django.conf import settings
from django.conf.urls import include, patterns, url
from django.contrib import admin
from tastypie.api import Api

from events.api.resources import (AboutMeResource, EventAttendees,
                                  EventConnections, EventResource,
                                  MembershipResource, EventFeedResource,
                                  UserProfileResource, FilterStateResource)
from friends.api.resources import (ConnectionsSearchResource,
                                   FriendsNewCounterResource,
                                   FriendsNewResource, FriendsResource,
                                   ConnectionsResource, NeoFriendsResource,
                                   NeoFriendsNewCounterResource,
                                   NeoFriendsNewResource)
from goals.api.resources import (FacebookLikeResource, GoalResource,
                                 MatchFilterStateResource, OfferResource,
                                 SubjectResource)
from interests.api.resources import InterestResource, InterestSubjectResource,\
    ReligiousViewResource, ReligiousIndexResource, PoliticalViewResource, \
    PoliticalIndexResource
from matchfeed.api.resources import (MatchedFeedResource,
                                     MutualFriendsResource,
                                     ProfileResource)
from msgs.api.resources import (ChatMessageResource, InboxLastResource,
                                InboxResource, MessageResource,
                                UnreadMessageCounter)
from photos.api.resources import FacebookPhotoResource, UserResource, \
    OnBoardingFlowResource
from world.api.resources import UserLocationResource

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(SubjectResource())
v1_api.register(UserResource())
v1_api.register(AboutMeResource())
v1_api.register(MatchFilterStateResource())
v1_api.register(FacebookPhotoResource())
v1_api.register(GoalResource())
v1_api.register(OfferResource())
v1_api.register(MatchedFeedResource())
v1_api.register(MutualFriendsResource())
v1_api.register(ProfileResource())
v1_api.register(MessageResource())
v1_api.register(InterestResource())
v1_api.register(InterestSubjectResource())
v1_api.register(FriendsResource())
v1_api.register(ConnectionsSearchResource())
v1_api.register(ConnectionsResource())
v1_api.register(FacebookLikeResource())
v1_api.register(InboxResource())
v1_api.register(InboxLastResource())
v1_api.register(UnreadMessageCounter())
v1_api.register(UserLocationResource())
v1_api.register(FriendsNewResource())
v1_api.register(FriendsNewCounterResource())
v1_api.register(EventResource())
v1_api.register(MembershipResource())
v1_api.register(FilterStateResource())
v1_api.register(EventFeedResource())
v1_api.register(EventConnections())
v1_api.register(EventAttendees())
v1_api.register(ChatMessageResource())
v1_api.register(OnBoardingFlowResource())
v1_api.register(ReligiousViewResource())
v1_api.register(ReligiousIndexResource())
v1_api.register(PoliticalViewResource())
v1_api.register(PoliticalIndexResource())
v1_api.register(UserProfileResource())

v2_api = Api(api_name='v2')
v2_api.register(NeoFriendsResource())
v2_api.register(NeoFriendsNewCounterResource())
v2_api.register(NeoFriendsNewResource())

urlpatterns = patterns('',
                       url(r'^signup/interests', 'goals.views.signup_page',
                           name='onboardingflow'),
                       url(r'^signup/goals', 'goals.views.signup_page',
                           name='onboardingflow'),
                       url(r'^signup/offers', 'goals.views.signup_page',
                           name='onboardingflow'),
                       url(r'^signup/connect', 'goals.views.signup_page',
                           name='onboardingflow'),
                       url(r'^signup/$', 'goals.views.signup_page',
                           name='onboardingflow'),
                       url(r'^api/', include(v1_api.urls)),
                       url(r'^api/', include(v2_api.urls)),
                       url(r'^facebook/', include('django_facebook.urls')),
                       url(r'^social/', include('social_auth.urls')),
                       url(r'^goals/close_login_popup/$', 'goals.views.close_login_popup', name='close_login_popup'),
                       url(r'^goals/error_window/$', 'goals.views.error_window', name='error_window'),
                       url(r'^accounts/logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
                       url(r'^login/$', 'django.contrib.auth.views.login',
                           {'template_name': 'registration/login_dev.html'}, name='auth_login_dev'),
                       url(r'^accounts/', include('django_facebook.auth_urls')),
                       url(r'^admin/', include(admin.site.urls)),
                       )


urlpatterns += patterns('',
                        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {
                            'document_root': settings.MEDIA_ROOT}))

urlpatterns += patterns('',
                        (r'^static/(?P<path>.*)$', 'django.views.static.serve', {
                            'document_root': settings.STATIC_ROOT}))

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += patterns('',
                            url(r'^__debug__/', include(debug_toolbar.urls)),
                            url(r'api/doc/', include('tastypie_swagger.urls', namespace='tastypie_swagger'))
                            )


urlpatterns += patterns('',
                        url(r'^.*$', 'goals.views.main_app')
                        )
