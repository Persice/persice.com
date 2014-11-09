import json
from django.db.models import Q
from django.http import HttpResponse, Http404
from django.views.generic import CreateView, UpdateView, ListView, DeleteView
from django_facebook.models import FacebookCustomUser
from members.models import FacebookCustomUserActive
from postman.models import Message
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


class RemoveFriendship(DeleteView):
    template_name = 'friends/friendship_confirm_delete'
    model = Message

    def get_object(self, queryset=None):
        friend1 = self.request.user.id
        try:
            friend2 = int(self.kwargs['pk'])
        except ValueError:
            raise Http404
        obj = Message.objects.filter(Q(sender_id=friend1, recipient_id=friend2) |
                                     Q(sender_id=friend2, recipient_id=friend1)
                                    )
        return obj

    def delete(self, request, *args, **kwargs):
        friend1 = self.request.user.id
        try:
            friend2 = int(self.kwargs['pk'])
        except ValueError:
            raise Http404
        Friend.objects.delete_friend(friend1, friend2)
        return super(RemoveFriendship, self).delete(self, request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        try:
            friend2 = int(self.kwargs['pk'])
        except ValueError:
            raise Http404
        kwargs['friend'] = FacebookCustomUserActive.objects.get(id=friend2)
        return super(RemoveFriendship, self).get_context_data(**kwargs)



class FriendsListView(ListView):
    model = Friend
    template_name = "friends/my_connections.html"

    def get_context_data(self, **kwargs):
        kwargs['my_friends'] = FacebookCustomUserActive.objects.filter(
            pk__in=Friend.objects.all_my_friends(self.request.user.id))
        return super(FriendsListView, self).get_context_data(**kwargs)

