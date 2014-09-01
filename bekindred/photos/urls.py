from django.conf.urls import patterns, url
from django.views.generic import TemplateView
from .views import list, facebook_photo, PhotoListView, PhotoDeleteView

urlpatterns = patterns('',
                       url(r'^main/$', TemplateView.as_view(template_name="photos/main_photos.html")),
                       url(r'^create/$', list, name='photo_list'),
                       url(r'^list/$', PhotoListView.as_view(), name='photo_create'),
                       url(r'^delete/(?P<pk>\d+)$', PhotoDeleteView.as_view(), name='photo_delete'),
                       url(r'^facebook/home$', facebook_photo),
                       )