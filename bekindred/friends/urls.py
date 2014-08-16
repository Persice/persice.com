from django.conf.urls import patterns, url
from django.core.urlresolvers import reverse
from friends.views import CreateFriendship, UpdateFriendship, FriendsListView, RemoveFriendship


urlpatterns = patterns('',
                       url(r'^add/$', CreateFriendship.as_view()),
                       url(r'^update/$', UpdateFriendship.as_view()),
                       url(r'^list/$', FriendsListView.as_view()),
                       url(r'^remove/(?P<pk>[0-9]+)/$', RemoveFriendship.as_view(success_url='/friends/list')),
                       )