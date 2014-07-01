from django.forms import forms
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, render
from django.template import RequestContext
from django.views.generic.edit import FormView, DeleteView, UpdateView
from django.views.generic.list import ListView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django_facebook.models import FacebookCustomUser
from .forms import RegistrationForm, GoalForm, OfferForm, BiographyForm, GoalUpdateForm, OfferUpdateForm
from .models import UserGoal, UserOffer, Subject, GoalOffer
from django_facebook.decorators import facebook_required_lazy
from django.forms.util import ErrorList


class LoginRequiredMixin(object):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(request, *args, **kwargs)


@facebook_required_lazy
def my_page(request, graph):
    context = RequestContext(request, {
        'goals': UserGoal.objects.filter(user=request.user),
        'offers': UserOffer.objects.filter(user=request.user),
        'bio': graph.get('me').get('bio', None)
    })
    return render_to_response('goals/my_page.html', context)


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


def biography_update(request, pk, template_name='goals/biography_form.html'):
    user = FacebookCustomUser.objects.get(pk=pk)
    form = BiographyForm(request.POST or None, instance=user)
    if form.is_valid():
        form.save()
        return HttpResponseRedirect('/goals')
    return render(request, template_name, {'form': form})


def goal_delete(request, pk, template_name='goals/goal_confirm_delete.html'):
    goal = UserGoal.objects.filter(goal=pk, user=request.user)[0]
    s = Subject.objects.get(id=goal.goal_id)
    if request.method == 'POST':
        goal.delete()
        return HttpResponseRedirect('/goals')
    return render(request, template_name, {'object': s})


def goal_update(request, pk, template_name='goals/update_goal.html'):
    goal = UserGoal.objects.filter(goal=pk, user=request.user)[0]
    s = Subject.objects.get(id=goal.goal_id)
    form = GoalUpdateForm(request.POST)
    if request.method == 'POST':
        if form.is_valid():
            new_description = form.cleaned_data['description']
            if new_description != s.description:
                new_subject, _ = Subject.objects.get_or_create(description=new_description)

                offer = None
                try:
                    offer = UserGoal.objects.get(user=request.user, goal=new_subject)
                except UserGoal.DoesNotExist:
                    pass
                if offer:
                    return HttpResponseRedirect('/goals')
                    # raise forms.ValidationError("Goal could not equivalent to offer")

                dummy, created = UserGoal.objects.get_or_create(goal=new_subject, user=request.user)
                if created:
                    goal.delete()
            else:
                return HttpResponseRedirect('/goals')
            return HttpResponseRedirect('/goals')
    else:
        form = GoalUpdateForm({'description': s.description})
        variables = RequestContext(request, {'form': form})
    return render_to_response(template_name, variables)


def offer_delete(request, pk, template_name='goals/offer_confirm_delete.html'):
    offer = UserOffer.objects.filter(offer=pk, user=request.user)[0]
    s = Subject.objects.get(id=offer.offer_id)
    if request.method == 'POST':
        offer.delete()
        return HttpResponseRedirect('/goals')
    return render(request, template_name, {'object': s})


def offer_update(request, pk, template_name='goals/update_offer.html'):
    offer = UserOffer.objects.filter(offer=pk, user=request.user)[0]
    s = Subject.objects.get(id=offer.offer_id)
    form = OfferUpdateForm(request.POST)
    if request.method == 'POST':
        if form.is_valid():
            new_description = form.cleaned_data['description']
            if new_description != s.description:
                new_subject, _ = Subject.objects.get_or_create(description=new_description)

                goal = None
                try:
                    goal = UserGoal.objects.get(user=request.user, goal=new_subject)
                except UserGoal.DoesNotExist:
                    pass
                if goal:
                    return HttpResponseRedirect('/goals')
                    # raise forms.ValidationError("Goal could not equivalent to offer")

                dummy, created = UserOffer.objects.get_or_create(offer=new_subject, user=request.user)
                if created:
                    offer.delete()
            else:
                return HttpResponseRedirect('/goals')
            return HttpResponseRedirect('/goals')
    else:
        form = OfferUpdateForm({'description': s.description})
        variables = RequestContext(request, {'form': form})
    return render_to_response(template_name, variables)


@facebook_required_lazy
def example(request, graph):
    context = RequestContext(request, {
        'bio': graph.get('me').get('bio', None)
    })
    return render_to_response('django_facebook/example.html', context)