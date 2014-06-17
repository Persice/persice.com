from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic.edit import CreateView, UpdateView, DeleteView, FormView
from django.views.generic.list import ListView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from goals.forms import RegistrationForm
from .models import UserGoal, UserOffer, Subject


class LoginRequiredMixin(object):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(request, *args, **kwargs)


class UserGoalOfferListView(LoginRequiredMixin, ListView):
    model = UserGoal

    def get_context_data(self, **kwargs):
        kwargs['goals'] = UserGoal.objects.filter(user=self.request.user)
        kwargs['offers'] = UserOffer.objects.filter(user=self.request.user)
        return super(UserGoalOfferListView, self).get_context_data(**kwargs)


class UserGoalCreate(LoginRequiredMixin, CreateView):
    model = Subject
    # form_class = SubjectForm
    success_url = '/goals/create/offer'
    template_name = 'goals/create_goal.html'

    def form_valid(self, form):
        s = form.save(commit=False)
        form.instance.save()
        # TODO User a goals != user a offers
        UserGoal.objects.get_or_create(user=self.request.user,
                                       goal=s)
        return super(UserGoalCreate, self).form_valid(form)


class UserOfferCreate(LoginRequiredMixin, CreateView):
    model = Subject
    success_url = '/goals'
    template_name = 'goals/create_offer.html'

    def form_valid(self, form):
        s = form.save(commit=False)
        form.instance.save()
        UserOffer.objects.get_or_create(user=self.request.user,
                                        offer=s)
        return super(UserOfferCreate, self).form_valid(form)


def register_page(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
                email=form.cleaned_data['email']
            )
            return HttpResponseRedirect('/')
    else:
        form = RegistrationForm()
    variables = RequestContext(request, {
        'form': form
    })
    return render_to_response(
        'registration/register.html', variables
    )