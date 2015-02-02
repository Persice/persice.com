from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from .views import GoalView, OfferView, my_page, biography_update, goal_delete, \
    goal_update, offer_delete, offer_update, CreateGoalView, CreateOfferView, MatchView, search_form, edit_my_page


urlpatterns = patterns('',
    url(r'^$', my_page, name='user_page'),
    url(r'^edit/user/$', edit_my_page, name='edit_user_page'),
    url(r'^create/goal/$', GoalView.as_view()),
    url(r'^user/create/goal/$', CreateGoalView.as_view(), name='goal_create'),
    url(r'^update/goal/(?P<pk>\d+)$', goal_update, name='goal_update'),
    url(r'^delete/goal/(?P<pk>\d+)$', goal_delete, name='goal_delete'),
    url(r'^user/create/offer/$', CreateOfferView.as_view(), name='offer_create'),
    url(r'^delete/offer/(?P<pk>\d+)$', offer_delete, name='offer_delete'),
    url(r'^update/offer/(?P<pk>\d+)$', offer_update, name='offer_update'),
    url(r'^create/offer/$', OfferView.as_view()),
    url(r'^filter/$', search_form),
    url(r'^matched/$', MatchView.as_view(), name='matched'),
    url(r'^user/$', login_required(TemplateView.as_view(template_name="goals/no_match_results.html"))),
    url(r'^user/biography/update/(?P<pk>[0-9]+)/$', biography_update, name='biography_update'),
)
