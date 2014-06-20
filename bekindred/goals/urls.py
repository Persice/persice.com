from django.conf.urls import patterns, include, url
from .views import UserGoalView, UserGoalOfferListView, UserOfferView


urlpatterns = patterns('',
    url(r'^$', UserGoalOfferListView.as_view()),
    url(r'^create/goal/$', UserGoalView.as_view()),
    url(r'^create/offer/$', UserOfferView.as_view()),
)
