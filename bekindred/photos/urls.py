from django.conf.urls import patterns, url
from .views import photo_list
urlpatterns = patterns('',
                       url(r'^list/$', photo_list, name='photo_list'),
                       )