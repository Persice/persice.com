from django.conf.urls import patterns, include, url
from tastypie.api import Api
from goals.api.resources import SubjectResource


from django.contrib import admin

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(SubjectResource())


urlpatterns = patterns('',
                       url(r'^api/', include(v1_api.urls)),
                       url(r'^facebook/', include('django_facebook.urls')),
                       url(r'^social/', include('social_auth.urls')),
                       url(r'^messages/', include('messages.urls')),
                       url(r'^interest/', include('interests.urls')),
                       url(r'^example/$', 'goals.views.example', name='facebook_example'),
                       url(r'^$', 'goals.views.main_page'),
                       url(r'^goals/', include('goals.urls')),
                       url(r'^friends/', include('friends.urls')),
                       url(r'^accounts/logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
                       url(r'^accounts/register/', 'goals.views.register'),
                       url(r'^accounts/deactivate/', 'members.views.deactivate_user'),
                       url(r'^accounts/', include('django_facebook.auth_urls')),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^photo/', include('photos.urls')),
)

from django.conf import settings

urlpatterns += patterns('',
                        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {
                            'document_root': settings.MEDIA_ROOT}))