from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response, render
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from open_facebook import OpenFacebook

from .forms import BiographyForm
from goals.utils import social_extra_data
from members.models import FacebookCustomUserActive
from .models import UserIPAddress


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
def main_page(request, template_name="homepage.html"):
    twitter_provider, linkedin_provider, twitter_username = social_extra_data(request.user.id)
    context = RequestContext(request, {
        'twitter_provider': twitter_provider,
        'linkedin_provider': linkedin_provider,
        'twitter_username': twitter_username,
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

@login_required
def main_page_angular2(request, template_name="homepage_angular2.html"):
    twitter_provider, linkedin_provider, twitter_username = social_extra_data(request.user.id)
    context = RequestContext(request, {
        'twitter_provider': twitter_provider,
        'linkedin_provider': linkedin_provider,
        'twitter_username': twitter_username,
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
