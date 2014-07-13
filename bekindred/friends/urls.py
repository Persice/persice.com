from django.conf.urls import patterns, url
from friends.views import CreateFriendship, UpdateFriendship, FriendsListView


urlpatterns = patterns('',
                       url(r'^add/$', CreateFriendship.as_view()),
                       url(r'^update/$', UpdateFriendship.as_view()),
                       url(r'^list/$', FriendsListView.as_view()),
                       )
