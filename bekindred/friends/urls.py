from django.conf.urls import patterns, url
from friends.views import CreateFriendship


urlpatterns = patterns('',
                       url(r'^add/$', CreateFriendship.as_view()),
                       )
