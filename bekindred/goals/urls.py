from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import UserGoalView, GoalOfferListView, UserOfferView, UserGoalOfferListView


urlpatterns = patterns('',
    url(r'^$', GoalOfferListView.as_view()),
    url(r'^create/goal/$', UserGoalView.as_view()),
    url(r'^create/offer/$', UserOfferView.as_view()),
    url(r'^user/(?P<pk>[0-9]+)/$', UserGoalOfferListView.as_view()),
    url(r'^user/$', login_required(TemplateView.as_view(template_name="goals/no_match_results.html"))),

)
