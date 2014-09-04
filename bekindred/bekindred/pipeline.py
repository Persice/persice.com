from datetime import date


def social_auth_to_profile(backend, details, response, user=None, is_new=False, *args, **kwargs):
    if user:
        social_user = kwargs['social_user']
        user.image = social_user.extra_data['image']
        try:
            d = social_user.extra_data['date_of_birth']
            user.date_of_birth = date(*map(int, (d['year'], d['month'], d['day'])))
        except Exception:
            pass
        user.save()