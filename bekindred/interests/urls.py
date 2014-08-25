from django.conf.urls import patterns, include, url
from .views import InterestCreate, InterestUpdate, InterestDelete

urlpatterns = patterns('',
                       url(r'^create/$', InterestCreate.as_view()),
                       url(r'^update/(?P<pk>\d+)$', InterestUpdate.as_view()),
                       url(r'^delete/(?P<pk>\d+)$', InterestDelete.as_view()),
                       )
