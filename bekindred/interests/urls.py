from django.conf.urls import patterns, include, url
from .views import InterestCreate, InterestUpdate, InterestDelete

urlpatterns = patterns('',
                       url(r'^create/$', InterestCreate.as_view(), name='create_interest'),
                       url(r'^update/(?P<pk>\d+)$', InterestUpdate.as_view(), name='update_interest'),
                       url(r'^delete/(?P<pk>\d+)$', InterestDelete.as_view(), name='delete_interest'),
                       )
