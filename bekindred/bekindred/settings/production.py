from .base import *
from os import environ
import dj_database_url
DATABASES['default'] = dj_database_url.config()
DATABASES['default']['ENGINE'] = 'django.contrib.gis.db.backends.postgis'
POSTGIS_VERSION = (2, 1, 0)
GEOS_LIBRARY_PATH = environ.get('GEOS_LIBRARY_PATH')
GDAL_LIBRARY_PATH = environ.get('GDAL_LIBRARY_PATH')
GEOIP_PATH = os.path.join(BASE_DIR, '..', 'data')
# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

STATIC_ROOT = 'staticfiles'


FACEBOOK_APP_ID = 633834406712155
FACEBOOK_APP_SECRET = '618558f85672fd7ec3a6c3aef89f0970'

FACEBOOK_FORCE_PROFILE_UPDATE_ON_LOGIN = True
FACEBOOK_STORE_LIKES = True
FACEBOOK_STORE_FRIENDS = True

FACEBOOK_DEFAULT_SCOPE = ['email', 'user_about_me', 'user_birthday', 'user_website', 'user_likes', 'user_friends',
                          'user_status', 'read_friendlists', 'user_relationships', 'user_groups', 'user_photos',
                          'user_relationship_details', 'read_stream']

# LinkedIn
LINKEDIN_CONSUMER_KEY = '755c9apksk4zxm'
LINKEDIN_CONSUMER_SECRET = 'SEwvnrKt9TmifIM4'


# Add email to requested authorizations.
LINKEDIN_SCOPE = ['r_fullprofile', 'r_fullprofile', 'r_emailaddress', 'r_network']
# Add the fields so they will be requested from linkedin.
LINKEDIN_EXTRA_FIELD_SELECTORS = ['email-address', 'date-of-birth', 'picture-url']
# Arrange to add the fields to UserSocialAuth.extra_data
LINKEDIN_EXTRA_DATA = [('id', 'id'),
                       ('first-name', 'first_name'),
                       ('last-name', 'last_name'),
                       ('email-address', 'email'),
                       ('date-of-birth', 'date_of_birth'),
                       ('picture-url', 'image'),
                       ('relation-to-viewer ', 'relation-to-viewer')
                      ]

# twitter social auth

TWITTER_CONSUMER_KEY = 'tJyUXuKfFmlzCnKccKvlQ4RIL'
TWITTER_CONSUMER_SECRET = '3cmUB8ZKAYCKSsVtwUYpDyBNHPnY3ZkImjiomDV6pl5XeVz6AE'

LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'

SOCIAL_AUTH_REDIRECT_IS_HTTPS = True

SOCIAL_AUTH_PIPELINE = (
    'social_auth.backends.pipeline.social.social_auth_user',
    'social_auth.backends.pipeline.user.get_username',
    'social_auth.backends.pipeline.user.create_user',
    'social_auth.backends.pipeline.social.associate_user',
    'social_auth.backends.pipeline.social.load_extra_data',
    'social_auth.backends.pipeline.user.update_user_details',
    'bekindred.pipeline.social_auth_to_profile',
    'bekindred.tasks.load_twitter_user_friends',
)


# postman settings

POSTMAN_DISALLOW_ANONYMOUS = True  # default is False
POSTMAN_DISALLOW_MULTIRECIPIENTS = True  # default is False
POSTMAN_DISALLOW_COPIES_ON_REPLY = False  # default is False
POSTMAN_DISABLE_USER_EMAILING = True  # default is False
POSTMAN_AUTO_MODERATE_AS = True  # default is None
POSTMAN_SHOW_USER_AS = 'first_name'  # default is None
POSTMAN_NOTIFIER_APP = None  # default is 'notification'
POSTMAN_MAILER_APP = None  # default is 'mailer'
POSTMAN_AUTOCOMPLETER_APP = {
    'name': '',  # default is 'ajax_select'
    'field': '',  # default is 'AutoCompleteField'
    'arg_name': '',  # default is 'channel'
    'arg_default': 'postman_friends',  # no default, mandatory to enable the feature
}  # default is {}