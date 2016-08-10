from django.core.urlresolvers import reverse
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.http.response import HttpResponse
from django.shortcuts import render_to_response, render, redirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from open_facebook import OpenFacebook

from .forms import BiographyForm
from goals.utils import social_extra_data
from members.models import FacebookCustomUserActive
from .models import UserIPAddress
import logging

logger = logging.getLogger(__name__)


def register(request):
    """
    Mock for django_facebook register
    """
    return HttpResponseRedirect(reverse('auth_login'))


def biography_update(request, pk, template_name='goals/biography_form.html'):
    user = FacebookCustomUserActive.objects.get(pk=pk)
    form = BiographyForm(request.POST or None, instance=user)
    if form.is_valid():
        form.save()
        return HttpResponseRedirect('/goals')
    return render(request, template_name, {'form': form})


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@login_required
def profile_view(request, username):
    fb = FacebookCustomUserActive.objects.get(username=username)
    context = RequestContext(request, {
        'first_name': fb.first_name,
        'last_name': fb.last_name,
    })
    return render_to_response('goals/user_profile.html', context)


@login_required
def main_app(request, template_name="homepage_mainapp.html"):
    # if not request.user.is_staff and request.flavour == u'full':
    #     logout(request)
    #     return render_to_response("registration/login.html", {'hide': True})
    twitter_provider, linkedin_provider, twitter_username, linkedin_first_name = social_extra_data(request.user.id)
    context = RequestContext(request, {
        'twitter_provider': twitter_provider,
        'linkedin_provider': linkedin_provider,
        'linkedin_first_name': linkedin_first_name,
        'twitter_username': twitter_username,
    })

    if request.user.is_authenticated():
        fb_user = FacebookCustomUserActive.objects.get(pk=request.user.id)
        try:
            UserIPAddress.objects.get(user=request.user.id)
        except UserIPAddress.DoesNotExist:
            user = UserIPAddress.objects.create(user=fb_user, ip=get_client_ip(request))
            user.save()

    if not hasattr(request.user, 'onboardingflow'):
        return redirect('onboardingflow')
    elif hasattr(request.user, 'onboardingflow') and not \
            request.user.onboardingflow.is_complete:
        return redirect('onboardingflow')
        # if fb_user.facebook_id and fb_user.access_token \
        #         and not fb_user.about_me:
        #     facebook = OpenFacebook(fb_user.access_token)
        #     fb_user.about_me = facebook.get('me').get('bio', None)
        #     fb_user.save()
    logger.info('User open main page', exc_info=True, extra={
        'request': request})
    return render_to_response(template_name, context)


@login_required
def signup_page(request, template_name="homepage_signup.html"):
    twitter_provider, linkedin_provider, twitter_username, linkedin_first_name \
        = social_extra_data(request.user.id)
    context = RequestContext(request, {
        'twitter_provider': twitter_provider,
        'linkedin_provider': linkedin_provider,
        'twitter_username': twitter_username,
        'linkedin_first_name': linkedin_first_name,
    })

    if request.user.is_authenticated():
        fb_user = FacebookCustomUserActive.objects.get(pk=request.user.id)
        try:
            UserIPAddress.objects.get(user=request.user.id)
        except UserIPAddress.DoesNotExist:
            user = UserIPAddress.objects.create(user=fb_user, ip=get_client_ip(request))
            user.save()

        # if fb_user.facebook_id and fb_user.access_token \
        #         and not fb_user.about_me:
        #     facebook = OpenFacebook(fb_user.access_token)
        #     fb_user.about_me = facebook.get('me').get('bio', None)
        #     fb_user.save()
    return render_to_response(template_name, context)


def close_login_popup(request):
    return render_to_response('goals/close_popup.html', {}, RequestContext(request))


def error_window(request):
    return render_to_response('error_window.html', {}, RequestContext(request))
