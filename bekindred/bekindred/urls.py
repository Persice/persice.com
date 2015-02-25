from django.conf.urls import patterns, include, url
from tastypie.api import Api
from django.contrib import admin

from friends.api.resources import FriendsResource, ConnectionsResource
from goals.api.resources import SubjectResource, MatchFilterStateResource, GoalResource, OfferResource, \
    FacebookLikeResource
from interests.api.resources import InterestResource
from matchfeed.api.resources import MatchedFeedResource, MutualFriendsResource, ProfileResource
from msgs.api.resources import MessageResource, InboxResource

from photos.api.resources import FacebookPhotoResource, UserResource


admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(SubjectResource())
v1_api.register(UserResource())
v1_api.register(MatchFilterStateResource())
v1_api.register(FacebookPhotoResource())
v1_api.register(GoalResource())
v1_api.register(OfferResource())
v1_api.register(MatchedFeedResource())
v1_api.register(MutualFriendsResource())
v1_api.register(ProfileResource())
v1_api.register(MessageResource())
v1_api.register(InterestResource())
v1_api.register(FriendsResource())
v1_api.register(ConnectionsResource())
v1_api.register(FacebookLikeResource())
v1_api.register(InboxResource())

urlpatterns = patterns('',
                       url(r'^$', 'goals.views.main_page'),
                       url(r'^api/', include(v1_api.urls)),
                       url(r'^facebook/', include('django_facebook.urls')),
                       url(r'^social/', include('social_auth.urls')),
                       url(r'^interest/', include('interests.urls')),
                       url(r'^goals/', include('goals.urls')),
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