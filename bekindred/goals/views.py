from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, render
from django.template import RequestContext
from django.views.generic.edit import FormView
from django.views.generic.list import ListView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django_facebook.models import FacebookCustomUser, FacebookLike
from .forms import RegistrationForm, GoalForm, OfferForm, BiographyForm, GoalUpdateForm, OfferUpdateForm
from friends.models import Friend
from .models import Goal, Offer, Subject, Keyword
from django_facebook.decorators import facebook_required_lazy
from django.db.models import Q


class LoginRequiredMixin(object):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(request, *args, **kwargs)


@facebook_required_lazy
def my_page(request, graph):
    context = RequestContext(request, {
        'goals': Goal.objects.filter(user=request.user),
        'offers': Offer.objects.filter(user=request.user),
        'bio': graph.get('me').get('bio', None),
        'keywords': Keyword.objects.goal_keywords(request.user.id) +
                    Keyword.objects.offer_keywords(request.user.id)
    })
    return render_to_response('goals/my_page.html', context)


class GoalOfferListView(LoginRequiredMixin, ListView):
    model = Goal

    def get_context_data(self, **kwargs):
        current_user = self.kwargs['pk']
        kwargs['goals'] = Goal.objects.filter(user=current_user)
        kwargs['offers'] = Offer.objects.filter(user=current_user)
        kwargs['user_obj'] = FacebookCustomUser.objects.get(pk=current_user)
        kwargs['likes'] = FacebookLike.objects.filter(user_id=current_user)

        self.request.session['match_user'] = self.kwargs['pk']

        if self.request.session.get('goal_offer_obj', False):
            go = self.request.session['goal_offer_obj']
            kwargs['goal_offer_obj'] = go.pop(0)
            self.request.session['goal_offer_obj'] = go

        match_offers = Goal.objects.filter(user=self.request.user.id). \
            filter(Q(goal=Goal.objects.filter(user=kwargs['user_obj'].id).values('goal')) |
                   Q(goal=Offer.objects.filter(user=kwargs['user_obj'].id).values('offer'))). \
            values_list('goal', flat=True)

        match_goals = Offer.objects.filter(user=self.request.user.id). \
            filter(Q(offer=Goal.objects.filter(user=kwargs['user_obj'].id).values('goal')) |
                   Q(offer=Offer.objects.filter(user=kwargs['user_obj'].id).values('offer'))). \
            values_list('offer', flat=True)

        search_goals = Subject.search_subject.search_goals(self.request.user.id)
        search_offers = Subject.search_subject.search_offers(self.request.user.id)
        match_goals2 = Goal.objects.filter(Q(goal__in=search_goals) | Q(goal__in=search_offers)).values_list('goal', flat=True)
        match_offers2 = Offer.objects.filter(Q(offer__in=search_goals) | Q(offer__in=search_offers)).values_list('offer', flat=True)


        match_likes = FacebookLike.objects.exclude(user_id=current_user).\
            filter(name__in=FacebookLike.objects.filter(user_id=self.request.user.id).
                   values('name')).values_list('name', flat=True)

        kwargs['match_likes'] = match_likes
        kwargs['match_goals_offers'] = list(match_offers) + list(match_offers2) + list(match_goals) + list(match_goals2)
        return super(GoalOfferListView, self).get_context_data(**kwargs)


class CreateGoalView(LoginRequiredMixin, FormView):
    form_class = GoalForm
    success_url = '/goals'
    template_name = 'goals/create_goal.html'

    def get_form_kwargs(self):
        kwargs = super(CreateGoalView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs


class GoalView(CreateGoalView):
    success_url = '/goals/create/offer'
    template_name = 'goals/goal.html'


class CreateOfferView(LoginRequiredMixin, FormView):
    form_class = OfferForm
    success_url = '/goals'
    template_name = 'goals/create_offer.html'

    def get_form_kwargs(self):
        kwargs = super(CreateOfferView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs


class OfferView(LoginRequiredMixin, FormView):
    form_class = OfferForm
    template_name = 'goals/offer.html'

    def get_success_url(self):
        current_user = int(self.request.user.id)
        g1 = Goal.objects.filter(user=FacebookCustomUser.objects.get(pk=current_user)).values('goal')
        o1 = Offer.objects.filter(user=FacebookCustomUser.objects.get(pk=current_user)).values('offer')

        # add exclude friends
        exclude_friends = [current_user] + \
                          list(Friend.objects.filter(friend1=current_user, status=0).values_list('friend2', flat=True)) + \
                          list(Friend.objects.filter(friend2=current_user, status=1).values_list('friend1', flat=True)) + \
                          list(Friend.objects.filter(friend1=current_user, status=1).values_list('friend2', flat=True))

        match_offers = Offer.objects.exclude(user__in=exclude_friends).filter(Q(offer=g1) | Q(offer=o1))
        match_goals = Goal.objects.exclude(user__in=exclude_friends).filter(Q(goal=g1) | Q(goal=o1))
        match_likes = FacebookLike.objects.exclude(user_id__in=exclude_friends + [current_user]). \
            filter(name__in=FacebookLike.objects.filter(user_id=current_user).values('name'))

        search_goals = Subject.search_subject.search_goals(current_user)
        search_offers = Subject.search_subject.search_offers(current_user)
        match_goals2 = Goal.objects.exclude(user_id=current_user).filter(Q(goal__in=search_goals) | Q(goal__in=search_offers))
        match_offers2 = Offer.objects.exclude(user_id=current_user).filter(Q(offer__in=search_goals) | Q(offer__in=search_offers))

        unique_match_goals2 = match_goals2.values_list('user', flat=True)
        unique_match_offers2 = match_offers2.values_list('user', flat=True)

        unique_match_offers = match_offers.values_list('user', flat=True)
        unique_match_goals = match_goals.values_list('user', flat=True)
        unique_match_likes = match_likes.values_list('user_id', flat=True)
        go = list(set(list(unique_match_goals) + list(unique_match_goals2) +
                      list(unique_match_offers) + list(unique_match_offers) +
                      list(unique_match_likes)))

        if go:
            match_user = go.pop(0)
            self.request.session['goal_offer_obj'] = go
            return '/goals/user/%s' % match_user
        else:
            return '/goals/user/'

    def get_form_kwargs(self):
        kwargs = super(OfferView, self).get_form_kwargs()
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
    goal = Goal.objects.filter(goal=pk, user=request.user)[0]
    s = Subject.objects.get(id=goal.goal_id)
    if request.method == 'POST':
        goal.delete()
        return HttpResponseRedirect('/goals')
    return render(request, template_name, {'object': s})


def goal_update(request, pk, template_name='goals/update_goal.html'):
    goal = Goal.objects.filter(goal=pk, user=request.user)[0]
    s = Subject.objects.get(id=goal.goal_id)
    form = GoalUpdateForm(request.POST)
    if request.method == 'POST':
        if form.is_valid():
            new_description = form.cleaned_data['description']
            if new_description != s.description:
                new_subject, _ = Subject.objects.get_or_create(description=new_description.lower())

                offer = None
                try:
                    offer = Goal.objects.get(user=request.user, goal=new_subject)
                except Goal.DoesNotExist:
                    pass
                if offer:
                    return HttpResponseRedirect('/goals')
                    # raise forms.ValidationError("Goal could not equivalent to offer")

                dummy, created = Goal.objects.get_or_create(goal=new_subject, user=request.user)
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
    offer = Offer.objects.filter(offer=pk, user=request.user)[0]
    s = Subject.objects.get(id=offer.offer_id)
    if request.method == 'POST':
        offer.delete()
        return HttpResponseRedirect('/goals')
    return render(request, template_name, {'object': s})


def offer_update(request, pk, template_name='goals/update_offer.html'):
    offer = Offer.objects.filter(offer=pk, user=request.user)[0]
    s = Subject.objects.get(id=offer.offer_id)
    form = OfferUpdateForm(request.POST)
    if request.method == 'POST':
        if form.is_valid():
            new_description = form.cleaned_data['description']
            if new_description != s.description:
                new_subject, _ = Subject.objects.get_or_create(description=new_description.lower())

                goal = None
                try:
                    goal = Goal.objects.get(user=request.user, goal=new_subject)
                except Goal.DoesNotExist:
                    pass
                if goal:
                    return HttpResponseRedirect('/goals')
                    # raise forms.ValidationError("Goal could not equivalent to offer")

                dummy, created = Offer.objects.get_or_create(offer=new_subject, user=request.user)
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