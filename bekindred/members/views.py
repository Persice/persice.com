from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django_facebook.models import FacebookCustomUser


def deactivate_user(request):
    user = FacebookCustomUser.objects.get(pk=request.user.id)
    user.disconnect_facebook()
    user.is_active = False
    user.email = ''
    user.save()
    return HttpResponseRedirect(reverse('django.contrib.auth.views.logout'))