from datetime import date
from django_facebook.models import FacebookCustomUser
from goals.models import UserIPAddress


def social_auth_to_profile(backend, details, response, user=None, is_new=False, *args, **kwargs):
    if user:
        social_user = kwargs['social_user']
        user.image = social_user.extra_data['image']
        # user.facebook_id = social_user.extra_data['id']
        try:
            d = social_user.extra_data['date_of_birth']
            user.date_of_birth = date(*map(int, (d['year'], d['month'], d['day'])))
        except Exception:
            pass
        user.save()