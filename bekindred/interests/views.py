from django.core.urlresolvers import reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView, ListView, DetailView
from interests.forms import InterestUpdateForm, InterestCreateForm
from .models import Interest


class InterestCreate(CreateView):
    model = Interest
    form_class = InterestCreateForm
    template_name = 'interests/interest_form.html'
    fields = ['description']
    success_url = '/goals/'

    def get_form_kwargs(self):
        kwargs = super(InterestCreate, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        user = self.request.user
        form.instance.user = user
        return super(InterestCreate, self).form_valid(form)


class InterestUpdate(UpdateView):
    model = Interest
    form_class = InterestUpdateForm
    template_name = 'interests/update_interest_form.html'
    fields = ['description']
    success_url = reverse_lazy('interests-list')

    def get_form_kwargs(self):
        kwargs = super(InterestUpdate, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs


class InterestDelete(DeleteView):
    model = Interest
    template_name = 'interests/confirm_interest_delete.html'
    fields = ['description']
    success_url = '/goals/'