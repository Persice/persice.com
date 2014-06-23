from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic.edit import CreateView, UpdateView, DeleteView, FormView
from django.views.generic.list import ListView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django_facebook.models import FacebookCustomUser
from .forms import RegistrationForm, GoalForm, OfferForm
from .models import UserGoal, UserOffer, Subject, GoalOffer
from django.contrib.sessions.backends.db import SessionStore


class LoginRequiredMixin(object):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(request, *args, **kwargs)


class GoalOfferListView(LoginRequiredMixin, ListView):
    model = UserGoal

    def get_context_data(self, **kwargs):
        kwargs['goals'] = UserGoal.objects.filter(user=self.request.user)
        kwargs['offers'] = UserOffer.objects.filter(user=self.request.user)
        return super(GoalOfferListView, self).get_context_data(**kwargs)


class UserGoalOfferListView(LoginRequiredMixin, ListView):
    model = UserGoal
    template_name = "goals/user_page.html"

    def get_context_data(self, **kwargs):
        kwargs['goals'] = UserGoal.objects.filter(user=self.kwargs['pk'])
        kwargs['offers'] = UserOffer.objects.filter(user=self.kwargs['pk'])
        kwargs['user_obj'] = FacebookCustomUser.objects.get(pk=self.kwargs['pk'])

        if self.request.session.get('goal_offer_obj', False):
            go = self.request.session['goal_offer_obj']
            kwargs['goal_offer_obj'] = go.pop(0)['offer_user_id']
            self.request.session['goal_offer_obj'] = go
        else:
            pass

        kwargs['match_offers'] = GoalOffer.objects.match_offers(self.request.user.id, kwargs['user_obj'].id)
        kwargs['match_goals'] = GoalOffer.objects.match_offers(kwargs['user_obj'].id, self.request.user.id)
        return super(UserGoalOfferListView, self).get_context_data(**kwargs)


class UserGoalView(LoginRequiredMixin, FormView):
    form_class = GoalForm
    success_url = '/goals/create/offer'
    template_name = 'goals/create_goal.html'

    def get_form_kwargs(self):
        kwargs = super(UserGoalView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs


class UserOfferView(LoginRequiredMixin, FormView):
    form_class = OfferForm
    template_name = 'goals/create_offer.html'

    def get_success_url(self):
        go = GoalOffer.objects.unique_match_user(self.request.user.id)
        if go:
            match_user = go.pop(0)['offer_user_id']
            self.request.session['goal_offer_obj'] = go
            return '/goals/user/%s' % match_user
        else:
            return '/goals/user/'




    def get_form_kwargs(self):
        kwargs = super(UserOfferView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs


def register_page(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = FacebookCustomUser.objects.create_user(
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
        'registration/registration_form.html', variables
    )

def example(request):
    context = RequestContext(request)
    return render_to_response('django_facebook/example.html', context)