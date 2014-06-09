from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.list import ListView

from .models import Goal


class GoalListView(ListView):
    model = Goal


class GoalCreate(CreateView):
    model = Goal
    fields = ['description']
    success_url = '/goal'


class GoalUpdate(UpdateView):
    model = Goal
    fields = ['description']
    success_url = '/goal'