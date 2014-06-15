from django.conf.urls import patterns, include, url
from .views import UserGoalCreate, UserGoalOfferListView, UserOfferCreate


urlpatterns = patterns('',
    url(r'^$', UserGoalOfferListView.as_view()),
    url(r'^create/goal/$', UserGoalCreate.as_view()),
    url(r'^create/offer/$', UserOfferCreate.as_view()),
)
