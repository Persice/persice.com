import json
from django.http import HttpResponse
from django.views.generic import CreateView, UpdateView, ListView
from django_facebook.models import FacebookCustomUser
from .models import Friend


class JSONResponseMixin(object):
    def render_to_response(self, context):
        return self.get_json_response(self.convert_context_to_json(context))

    def get_json_response(self, content, **httpresponse_kwargs):
        return HttpResponse(content,
                            content_type='application/json',
                            **httpresponse_kwargs)

    def convert_context_to_json(self, context):
        return json.dumps(context)


class CreateFriendship(CreateView, JSONResponseMixin):
    model = Friend
    success_url = '/'

    def get_initial(self):
        friend1 = self.request.user.id
        friend2 = int(self.request.session.get('match_user'))
        friend_request = Friend.objects.check_friend_request(friend1, friend2)
        status = None
        if friend_request:
            status = 0
        return {
            'friend1': friend1,
            'friend2': friend2,
            'status': status
        }

    def get(self, request, *args, **kwargs):
        return JSONResponseMixin.render_to_response(self, self.get_initial())


class UpdateFriendship(UpdateView, JSONResponseMixin):
    model = Friend
    success_url = '/'
    fields = ['status']

    def get_object(self, queryset=None):
        friend1 = self.request.user.id
        friend2 = int(self.request.session.get('match_user'))
        obj = Friend.objects.update_friend(friend1, friend2)
        return obj


class FriendsListView(ListView):
    model = Friend
    template_name = "friends/my_connections.html"

    def get_context_data(self, **kwargs):
        kwargs['my_friends'] = FacebookCustomUser.objects.filter(pk__in=Friend.objects.all_my_friends(self.request.user.id))
        return super(FriendsListView, self).get_context_data(**kwargs)

