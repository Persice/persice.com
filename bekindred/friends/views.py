import json
from django.http import HttpResponse
from django.views.generic import CreateView
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
        return {
            'friend1': friend1,
            'friend2': friend2,
            'status': 'R'
        }

    def get(self, request, *args, **kwargs):
        return JSONResponseMixin.render_to_response(self, self.get_initial())
