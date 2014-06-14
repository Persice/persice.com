from django.conf.urls import patterns, include, url
from .views import GoalCreate, GoalUpdate, GoalListView, OfferCreate


urlpatterns = patterns('',
    url(r'^$', GoalListView.as_view()),
    url(r'^create/goal/$', GoalCreate.as_view()),
    url(r'^create/offer/$', OfferCreate.as_view()),
    url(r'^update/goal/(?P<pk>\d+)/$', GoalUpdate.as_view()),

)
