from urlparse import parse_qs


def load_twitter_user_friends(social_user, *args, **kwargs):
    from friends.tasks import twitter_followers, twitter_friends

    if social_user:
        oauth_token = social_user.extra_data.get('oauth_token')
        oauth_secret = social_user.extra_data.get('oauth_token_secret')
        # Need for backward comparability
        if not (oauth_token and oauth_secret):
            access_token = social_user.extra_data['access_token']
            parsed_tokens = parse_qs(access_token)
            oauth_token = parsed_tokens['oauth_token'][0]
            oauth_secret = parsed_tokens['oauth_token_secret'][0]

        twitter_friends.apply_async(
            args=(social_user.user, oauth_token, oauth_secret), expires=600)
        twitter_followers.apply_async(
            args=(social_user.user, oauth_token, oauth_secret), expires=600)
    return None
