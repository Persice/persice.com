from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', login_required(TemplateView.as_view(template_name="homepage.html"))),
                       url(r'^goal/', include('goals.urls')),
                       url(r'^accounts/login/$', 'django.contrib.auth.views.login'),
                       url(r'^accounts/logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
                       url(r'^admin/', include(admin.site.urls)),
)
