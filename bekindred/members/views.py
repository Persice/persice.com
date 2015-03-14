from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django_facebook.models import FacebookCustomUser
from social_auth.db.django_models import UserSocialAuth
from goals.models import Goal


def deactivate_user(request, template_name='members/account_confirm_delete.html'):
    user = FacebookCustomUser.objects.get(pk=request.user.id)
    if request.method == 'POST':
        user.disconnect_facebook()
        user.is_active = False
        user.email = ''
        user.save()
        UserSocialAuth.objects.filter(user=user).delete()
        return HttpResponseRedirect(reverse('django.contrib.auth.views.logout'))
    return render(request, template_name, {'object': user})