from django.conf.urls import patterns, include, url
from .views import GoalCreate, GoalUpdate, GoalListView


urlpatterns = patterns('',
    url(r'^$', GoalListView.as_view()),
    url(r'^create/$', GoalCreate.as_view()),
    url(r'^update/(?P<pk>\d+)/$', GoalUpdate.as_view()),
)
