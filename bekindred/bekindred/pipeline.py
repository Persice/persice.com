from datetime import date
from urlparse import parse_qs
from friends.tasks import twitter_followers, twitter_friends


def social_auth_to_profile(backend, details, response, user=None, is_new=False, *args, **kwargs):
    if user:
        social_user = kwargs['social_user']
        if backend.name == 'linkedin':
            pass
            # user.image = social_user.extra_data.get('image', '')
        elif backend.name == 'twitter':
            pass
            # user.image = social_user.extra_data.get('profile_image_url', '')
        try:
            d = social_user.extra_data['date_of_birth']
            user.date_of_birth = date(*map(int, (d['year'], d['month'], d['day'])))
        except Exception:
            pass
        user.save()
