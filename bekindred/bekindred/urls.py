from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', login_required(TemplateView.as_view(template_name="homepage.html"))),
                       url(r'^facebook/', include('django_facebook.urls')),
                       url(r'^messages/', include('django_messages.urls')),
                       url(r'^goals/', include('goals.urls')),
                       url(r'^friends/', include('friends.urls')),
                       url(r'^example/$', 'goals.views.example', name='facebook_example'),
                       url(r'^accounts/logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
                       url(r'^accounts/', include('django_facebook.auth_urls')),
                       url(r'^admin/', include(admin.site.urls))
)
