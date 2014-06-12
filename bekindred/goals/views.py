from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.list import ListView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .models import Goal


class LoginRequiredMixin(object):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(request, *args, **kwargs)


class GoalListView(LoginRequiredMixin, ListView):
    model = Goal


class GoalCreate(LoginRequiredMixin, CreateView):
    model = Goal
    fields = ['description']
    success_url = '/goal'


class GoalUpdate(LoginRequiredMixin, UpdateView):
    model = Goal
    fields = ['description']
    success_url = '/goal'