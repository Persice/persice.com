from datetime import date
from urlparse import parse_qs
from goals.tasks import twitter_followers, twitter_friends


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


def load_twitter_user_friends(backend, user, social_user, is_new=False, new_association=False, *args, **kwargs):
    """
        Part of SOCIAL_AUTH_PIPELINE. Works with django-social-auth==0.7.21 or newer
        @backend - social_auth.backends.twitter.TwitterBackend (or other) object
        @user - User (if is_new) or django.utils.functional.SimpleLazyObject (if new_association)
        @social_user - UserSocialAuth object
    """
    if backend.name == 'twitter':
        if user:
            access_token = social_user.extra_data['access_token']
            parsed_tokens = parse_qs(access_token)
            oauth_token = parsed_tokens['oauth_token'][0]
            oauth_secret = parsed_tokens['oauth_token_secret'][0]
            twitter_friends.apply_async(args=(user, oauth_token, oauth_secret), expires=600)
            twitter_followers.apply_async(args=(user, oauth_token, oauth_secret), expires=600)
    return None
