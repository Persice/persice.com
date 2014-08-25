from django.conf.urls import patterns, url
from .views import PhotoAddView, PhotoListView, PhotoDeleteView

urlpatterns = patterns('',
                       url(r'^create/$', PhotoAddView.as_view(), name='photo_create'),
                       url(r'^list/$', PhotoListView.as_view(), name='photo_list'),
                       url(r'^delete/(?P<pk>\d+)$', PhotoDeleteView.as_view(), name='photo_delete'),
                       )