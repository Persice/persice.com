from django.conf.urls import patterns, include, url
from tastypie.api import Api
from django.contrib import admin
from events.api.resources import EventResource, MyEventFeedResource, AllEventFeedResource, FriendsEventFeedResource, \
    MembershipResource, EventFilterStateResource, EventConnections, EventAttendees, MyConnectionEventFeedResource, \
    AboutMeResource, FilterStateResource

from friends.api.resources import FriendsResource, ConnectionsResource, FriendsNewResource, FriendsNewCounterResource
from goals.api.resources import SubjectResource, MatchFilterStateResource, GoalResource, OfferResource, \
    FacebookLikeResource
from interests.api.resources import InterestResource, InterestSubjectResource
from matchfeed.api.resources import MatchedFeedResource, MutualFriendsResource, ProfileResource, \
    MatchedFeedResource2
from msgs.api.resources import MessageResource, InboxResource, InboxLastResource, UnreadMessageCounter, \
    ChatMessageResource

from photos.api.resources import FacebookPhotoResource, UserResource
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
v1_api.register(MatchedFeedResource2())
v1_api.register(MutualFriendsResource())
v1_api.register(ProfileResource())
v1_api.register(MessageResource())
v1_api.register(InterestResource())
v1_api.register(InterestSubjectResource())
v1_api.register(FriendsResource())
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
v1_api.register(MyEventFeedResource())
v1_api.register(AllEventFeedResource())
v1_api.register(FriendsEventFeedResource())
v1_api.register(MyConnectionEventFeedResource())
v1_api.register(EventFilterStateResource())
v1_api.register(FilterStateResource())
v1_api.register(EventConnections())
v1_api.register(EventAttendees())
v1_api.register(ChatMessageResource())

urlpatterns = patterns('',
                       url(r'^$', 'goals.views.main_page'),
                       url(r'preview/$', 'goals.views.main_page_angular2'),
                       url(r'^api/', include(v1_api.urls)),
                       url(r'^facebook/', include('django_facebook.urls')),
                       url(r'^social/', include('social_auth.urls')),
                       url(r'^goals/close_login_popup/$', 'goals.views.close_login_popup', name='close_login_popup'),
                       url(r'^goals/error_window/$', 'goals.views.error_window', name='error_window'),
                       url(r'^accounts/logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
                       url(r'^accounts/register/', 'goals.views.register'),
                       url(r'^accounts/deactivate/', 'members.views.deactivate_user', name='deactivate_user'),
                       url(r'^login/$', 'django.contrib.auth.views.login',
                           {'template_name': 'registration/login_dev.html'}, name='auth_login_dev'),
                       url(r'^accounts/', include('django_facebook.auth_urls')),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^photo/', include('photos.urls')),
)

from django.conf import settings


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