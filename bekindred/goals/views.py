from operator import itemgetter
import ast

from django.shortcuts import redirect
from django.contrib.gis.geoip import GeoIP
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, render
from django.template import RequestContext
from django.views.generic import View
from django.views.generic.edit import FormView
from django.views.generic.list import ListView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django_facebook.connect import CONNECT_ACTIONS
from django_facebook.models import FacebookLike
from django_facebook.utils import get_registration_backend
from open_facebook import OpenFacebook
from social_auth.db.django_models import UserSocialAuth
from django_facebook.decorators import facebook_required_lazy
from django.db.models import Q
from geopy.distance import distance as geopy_distance

from .forms import GoalForm, OfferForm, BiographyForm, GoalUpdateForm, OfferUpdateForm
from friends.models import Friend, FacebookFriendUser, TwitterListFriends, TwitterListFollowers
from goals.utils import calculate_age, linkedin_connections
from members.models import FacebookCustomUserActive, FacebookLikeProxy
from .models import Goal, Offer, Subject, Keyword, UserIPAddress
from interests.models import Interest


class LoginRequiredMixin(object):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(request, *args, **kwargs)


@login_required()
def my_page(request):
    date_of_birth = FacebookCustomUserActive.objects.get(pk=request.user.id).date_of_birth
    bio = FacebookCustomUserActive.objects.get(pk=request.user.id).about_me
    twitter_provider, linkedin_provider = None, None
    try:
        twitter_provider = UserSocialAuth.objects.filter(user_id=request.user.id, provider='twitter')[0].extra_data
    except IndexError:
        pass
    try:
        linkedin_provider = UserSocialAuth.objects.filter(user_id=request.user.id, provider='linkedin')[0].extra_data
    except IndexError:
        pass

    # linkedin = FacebookCustomUserActive.objects.get(pk=request.user.id).social_data
    context = RequestContext(request, {
        'goals': Goal.objects.filter(user=request.user),
        'offers': Offer.objects.filter(user=request.user),
        'bio': bio,
        'keywords': Keyword.objects.goal_keywords(request.user.id) +
                    Keyword.objects.offer_keywords(request.user.id),
        'age': calculate_age(date_of_birth) if date_of_birth else None,
        'interests': Interest.objects.filter(user=request.user.id),
        'twitter_provider': twitter_provider,
        'linkedin_provider': linkedin_provider,
    })
    return render_to_response('goals/my_page.html', context)


@login_required()
def edit_my_page(request):
    date_of_birth = FacebookCustomUserActive.objects.get(pk=request.user.id).date_of_birth
    bio = FacebookCustomUserActive.objects.get(pk=request.user.id).about_me
    twitter_provider, linkedin_provider = None, None
    try:
        twitter_provider = UserSocialAuth.objects.filter(user_id=request.user.id, provider='twitter')[0].extra_data
    except IndexError:
        pass
    try:
        linkedin_provider = UserSocialAuth.objects.filter(user_id=request.user.id, provider='linkedin')[0].extra_data
    except IndexError:
        pass

    # linkedin = FacebookCustomUserActive.objects.get(pk=request.user.id).social_data
    context = RequestContext(request, {
        'goals': Goal.objects.filter(user=request.user),
        'offers': Offer.objects.filter(user=request.user),
        'bio': bio,
        'keywords': Keyword.objects.goal_keywords(request.user.id) +
                    Keyword.objects.offer_keywords(request.user.id),
        'age': calculate_age(date_of_birth) if date_of_birth else None,
        'interests': Interest.objects.filter(user=request.user.id),
        'twitter_provider': twitter_provider,
        'linkedin_provider': linkedin_provider,
    })
    return render_to_response('goals/edit_my_page.html', context)


class GoalOfferListView(LoginRequiredMixin, ListView):
    model = Goal

    def get_context_data(self, **kwargs):
        current_user = self.kwargs['pk']
        kwargs['goals'] = Goal.objects.filter(user=current_user)
        kwargs['offers'] = Offer.objects.filter(user=current_user)
        kwargs['user_obj'] = FacebookCustomUserActive.objects.get(pk=current_user)
        kwargs['likes'] = FacebookLike.objects.filter(user_id=current_user)
        kwargs['interests'] = Interest.objects.filter(user_id=current_user)
        kwargs['mutual_friends'] = FacebookCustomUserActive.objects.filter(
            pk__in=Friend.objects.mutual_friends(kwargs['user_obj'].id, self.request.user.id))
        date_of_birth = FacebookCustomUserActive.objects.get(pk=current_user).date_of_birth
        kwargs['age'] = calculate_age(date_of_birth) if date_of_birth else None

        # calculate distance
        g = GeoIP()
        point1 = g.lon_lat(str(UserIPAddress.objects.get(user=current_user).ip))
        point2 = g.lon_lat(str(UserIPAddress.objects.get(user=self.request.user.id).ip))
        kwargs['distance'] = geopy_distance(point1, point2).miles

        # linkedin mutual connections
        kwargs['mutual_linkedin'] = None
        kwargs['mutual_twitter_friends'] = None

        try:
            current_auth_user = UserSocialAuth.objects.filter(user_id=current_user, provider='linkedin')[0]
            requested_auth_user = UserSocialAuth.objects.filter(user_id=self.request.user.id, provider='linkedin')[0]
            oauth_token = current_auth_user.tokens['oauth_token']
            oauth_token_secret = current_auth_user.tokens['oauth_token_secret']
            kwargs['mutual_linkedin'], kwargs['mutual_linkedin_count'] = linkedin_connections(requested_auth_user.uid,
                                                                                              oauth_token,
                                                                                              oauth_token_secret)
        except IndexError:
            pass

        try:
            current_auth_user = UserSocialAuth.objects.filter(user_id=current_user, provider='twitter')[0]
            requested_auth_user = UserSocialAuth.objects.filter(user_id=self.request.user.id, provider='twitter')[0]
            tf2 = TwitterListFriends.objects.filter(twitter_id1=requested_auth_user.uid).values_list('twitter_id2',
                                                                                                     flat=True)
            tf1 = TwitterListFriends.objects.filter(twitter_id1=current_auth_user.uid,
                                                    twitter_id2__in=tf2)

            tfo2 = TwitterListFollowers.objects.filter(twitter_id1=requested_auth_user.uid).values_list('twitter_id2',
                                                                                                        flat=True)
            tfo1 = TwitterListFollowers.objects.filter(twitter_id1=current_auth_user.uid,
                                                       twitter_id2__in=tfo2)
            kwargs['mutual_twitter_friends'] = tf1
            kwargs['mutual_twitter_followers'] = tfo1
            kwargs['count_mutual_twitter_friends'] = tf1.count()
            kwargs['count_mutual_twitter_followers'] = tfo1.count()
        except IndexError:
            pass

        test = FacebookFriendUser.objects.mutual_friends(self.request.user.id, kwargs['user_obj'].id)
        kwargs['mutual_facebook_friends'] = FacebookCustomUserActive.objects.filter(
            facebook_id__in=test)
        kwargs['mutual_facebook_friends_count'] = len(kwargs['mutual_facebook_friends'])

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
        match_goals2 = Goal.objects.filter(Q(goal__in=search_goals) | Q(goal__in=search_offers)).values_list('goal',
                                                                                                             flat=True)
        match_offers2 = Offer.objects.filter(Q(offer__in=search_goals) | Q(offer__in=search_offers)).values_list(
            'offer', flat=True)

        match_likes = FacebookLikeProxy.objects.match_fb_likes_to_fb_likes(self.request.user.id, [])
        match_interests_to_likes = FacebookLikeProxy.objects.match_interests_to_fb_likes(self.request.user.id, [])

        match_likes_ = [x.id for x in match_likes if x.user_id == int(current_user)] + \
                       [x.id for x in match_interests_to_likes if x.user_id == int(current_user)]

        kwargs['match_likes'] = match_likes_

        match_interests = Interest.search_subject.match_interests_to_interests(self.request.user.id, [])
        match_likes_to_interests = Interest.search_subject.match_fb_likes_to_interests(self.request.user.id, [])

        match_interests_ = [x.id for x in match_interests if x.user_id == int(current_user)] + \
                           [x.id for x in match_likes_to_interests if x.user_id == int(current_user)]

        kwargs['match_interests'] = match_interests_

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
    success_url = '/goals/matched'

    def get_form_kwargs(self):
        kwargs = super(OfferView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs


class MatchView(LoginRequiredMixin, View):
    _MIN_AGE = 18
    _MAX_AGE = 115
    _DEFAULT_DISTANCE = 10000
    _DEFAULT_GENDER = 'all'

    def get(self, request, *args, **kwargs):
        current_user = int(self.request.user.id)
        results = []

        min_age = request.GET.get('min_age', self._MIN_AGE)
        min_age = int(min_age) if min_age else self._MIN_AGE
        max_age = request.GET.get('max_age', self._MAX_AGE)
        max_age = int(max_age) if max_age else self._MAX_AGE
        _distance = request.GET.get('distance', self._DEFAULT_DISTANCE)
        _distance = int(_distance) if _distance else self._DEFAULT_DISTANCE

        keywords = request.GET.get('keywords', None)
        keywords = ast.literal_eval(keywords) if keywords else None

        gender = request.GET.get('gender', None)
        gender = ast.literal_eval(gender) if gender else None

        if not gender:
            gender = self._DEFAULT_GENDER
        else:
            if len(gender) == 2:
                gender = self._DEFAULT_GENDER
            else:
                gender = gender[0]

        current_user_goals = Goal.objects.user_goals(current_user)
        current_user_offers = Offer.objects.user_offers(current_user)

        exclude_friends = Friend.objects.all_my_friends(current_user) + Friend.objects.thumbed_up_i(current_user) + \
                          FacebookFriendUser.objects.all_my_friends(current_user) + \
                          Friend.objects.deleted_friends(current_user) + \
                          [current_user]

        search_goals = Subject.search_subject.search_goals(current_user)
        search_offers = Subject.search_subject.search_offers(current_user)

        match_users_goals_to_offers = Offer.objects.match_goals_to_offers(exclude_friends, current_user_goals)
        search_users_goals_to_offers = Offer.objects.search_goals_to_offers(exclude_friends, search_goals)

        match_users_offers_to_goals = Goal.objects.match_offers_to_goals(exclude_friends, current_user_offers)
        search_users_offers_to_goals = Goal.objects.search_offers_to_goals(exclude_friends, search_offers)

        match_users_goals_to_goals = Goal.objects.match_goals_to_goals(exclude_friends, current_user_goals)
        search_users_goals_to_goals = Goal.objects.search_goals_to_goals(exclude_friends, search_goals)

        match_users_offers_to_offers = Offer.objects.match_offers_to_offers(exclude_friends, current_user_offers)
        search_users_offers_to_offers = Offer.objects.search_offers_to_offers(exclude_friends, search_offers)

        match_likes_to_likes = FacebookLikeProxy.objects.match_fb_likes_to_fb_likes(current_user, exclude_friends)
        match_user_likes_to_likes = [x.user_id for x in match_likes_to_likes]

        match_interests_to_likes = FacebookLikeProxy.objects.match_interests_to_fb_likes(current_user, exclude_friends)
        match_user_interests_to_likes = [x.user_id for x in match_interests_to_likes]

        match_interests_to_interests = Interest.search_subject.match_interests_to_interests(current_user,
                                                                                            exclude_friends)
        match_user_interests_to_interests = [x.user_id for x in match_interests_to_interests]

        match_likes_to_interests = Interest.search_subject.match_fb_likes_to_interests(current_user, exclude_friends)
        match_user_likes_to_interests = [x.user_id for x in match_likes_to_interests]

        matched_users = list(set(match_users_goals_to_offers +
                                 search_users_goals_to_offers +
                                 match_users_offers_to_goals +
                                 search_users_offers_to_goals +
                                 match_users_goals_to_goals +
                                 search_users_goals_to_goals +
                                 match_users_offers_to_offers +
                                 search_users_offers_to_offers +
                                 match_user_likes_to_likes +
                                 match_user_interests_to_likes +
                                 match_user_interests_to_interests +
                                 match_user_likes_to_interests
        ))
        g = GeoIP()
        try:
            point1 = g.lon_lat(str(UserIPAddress.objects.get(user=current_user).ip))
        except UserIPAddress.DoesNotExist:
            point1 = g.lon_lat('127.0.0.1')

        for user in matched_users:
            try:
                point2 = g.lon_lat(str(UserIPAddress.objects.get(user=user).ip))
            except UserIPAddress.DoesNotExist:
                point2 = g.lon_lat('127.0.0.1')
            distance = geopy_distance(point1, point2).miles
            try:
                _user = FacebookCustomUserActive.objects.get(pk=user)
                age = calculate_age(_user.date_of_birth)
                user_gender = _user.gender
                results.append(dict(user_id=user,
                                    thumbed_up_me=-Friend.objects.thumbed_up_me(user, current_user).count(),
                                    matched_goal_offer=Offer.objects.filter(user_id=user,
                                                                            offer=current_user_goals).count(),
                                    matched_offer_goal=Goal.objects.filter(user_id=user,
                                                                           goal=current_user_offers).count(),
                                    matched_goal_goal=Goal.objects.filter(user_id=user,
                                                                          goal=current_user_goals).count(),
                                    matched_offer_offer=Offer.objects.filter(user_id=user,
                                                                             offer=current_user_offers).count(),
                                    mutual_bekindred_friends=len(Friend.objects.mutual_friends(user, current_user)),
                                    mutual_facebook_friends=len(
                                        FacebookFriendUser.objects.mutual_friends(user, current_user)),
                                    age=age,
                                    distance=distance,
                                    gender=user_gender))
            except FacebookCustomUserActive.DoesNotExist:
                pass

        filter_distance = filter(lambda x: x.get('distance') <= _distance, results)
        filter_age = filter(lambda x: (x.get('age') <= max_age) and (x.get('age') >= min_age) or (x.get('age') is 0),
                            filter_distance)
        if gender != self._DEFAULT_GENDER:
            filter_gender = filter(lambda x: (x.get('gender') == gender or x.get('gender') is None), filter_age)
        else:
            filter_gender = filter_age

        if keywords:
            filtered_user_ids = []
            for keyword in keywords:
                _search_subject = Subject.objects.search(keyword)
                _search_interest = Interest.objects.search(keyword)

                user_ids = [x.get('user_id') for x in filter_gender]

                filtered_user_ids.extend(FacebookCustomUserActive.objects.filter(id__in=user_ids,
                                                                                 about_me__icontains=keyword).
                                         values_list('id', flat=True))

                for user_id in user_ids:
                    for s in _search_subject:
                        if s.goal_set.filter(user_id=user_id).count() or \
                                s.offer_set.filter(user_id=user_id).count():
                            filtered_user_ids.append(user_id)

                    for i in _search_interest:
                        if i.objects.filter(user_id=user_id).count():
                            filtered_user_ids.append(user_id)

            filter_keywords = filter(lambda x: x.get('user_id') in set(filtered_user_ids), filter_gender)
        else:
            filter_keywords = filter_gender

        sorted_matched_users = sorted(filter_keywords, key=itemgetter('thumbed_up_me', 'matched_goal_offer',
                                                                      'matched_offer_goal', 'matched_goal_goal',
                                                                      'matched_offer_offer',
                                                                      'distance'))
        go = [x['user_id'] for x in sorted_matched_users]
        if go:
            match_user = go.pop(0)
            self.request.session['goal_offer_obj'] = go
            return redirect('/goals/user/%s/' % match_user)
        else:
            return redirect('/goals/user/')


def register(request):
    """
    A very simplistic register view
    """
    backend = get_registration_backend()
    form_class = backend.get_form_class(request)
    template_name = backend.get_registration_template()

    if request.method == 'POST':
        form = form_class(data=request.POST, files=request.FILES)
        if form.is_valid():
            new_user = backend.register(request,
                                        form=form, **form.cleaned_data)
            # keep the post behaviour exactly the same as django facebook's
            # connect flow
            UserIPAddress.objects.create(user_id=new_user.id, ip=get_client_ip(request))
            response = backend.post_connect(
                request, new_user, CONNECT_ACTIONS.REGISTER)
            return response
    else:
        form = form_class()

    context = RequestContext(request)
    context['form'] = form
    response = render_to_response(template_name, context_instance=context)

    return response


def biography_update(request, pk, template_name='goals/biography_form.html'):
    user = FacebookCustomUserActive.objects.get(pk=pk)
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


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@facebook_required_lazy
def example(request, graph):
    context = RequestContext(request, {
        'bio': graph.get('me').get('bio', None)
    })
    if request.user.is_authenticated():
        try:
            UserIPAddress.objects.get(user=request.user.id)
        except UserIPAddress.DoesNotExist:
            fb_user = FacebookCustomUserActive.objects.get(pk=request.user.id)
            user = UserIPAddress.objects.create(user=fb_user, ip=get_client_ip(request))
            user.save()
    return render_to_response('django_facebook/example.html', context)


@login_required()
def main_page(request, template_name="homepage.html"):
    twitter_provider, linkedin_provider = None, None
    try:
        twitter_provider = UserSocialAuth.objects.filter(user_id=request.user.id, provider='twitter')[0].extra_data
    except IndexError:
        pass
    try:
        linkedin_provider = UserSocialAuth.objects.filter(user_id=request.user.id, provider='linkedin')[0].extra_data
    except IndexError:
        pass

    # linkedin = FacebookCustomUserActive.objects.get(pk=request.user.id).social_data
    context = RequestContext(request, {
        'twitter_provider': twitter_provider,
        'linkedin_provider': linkedin_provider,
    })

    if request.user.is_authenticated():
        fb_user = FacebookCustomUserActive.objects.get(pk=request.user.id)
        try:
            UserIPAddress.objects.get(user=request.user.id)
        except UserIPAddress.DoesNotExist:
            user = UserIPAddress.objects.create(user=fb_user, ip=get_client_ip(request))
            user.save()

        if fb_user.facebook_id and fb_user.access_token \
                and not fb_user.about_me:
            facebook = OpenFacebook(fb_user.access_token)
            fb_user.about_me = facebook.get('me').get('bio', None)
            fb_user.save()
    return render_to_response(template_name, context)

    # return render(request, template_name)


def search_form(request):
    return render(request, 'goals/match_filter.html')


class SearchMessageView(object):
    pass