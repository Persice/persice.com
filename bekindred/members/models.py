from django.contrib.auth.models import UserManager
from django_facebook.models import FacebookCustomUser


class ActiveManager(UserManager):
    def get_queryset(self):
        return super(ActiveManager, self).get_queryset().filter(is_active=True)


class FacebookCustomUserActive(FacebookCustomUser):
    class Meta:
        proxy = True
    
    objects = ActiveManager()