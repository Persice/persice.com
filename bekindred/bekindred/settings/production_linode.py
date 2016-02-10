import raven

from .base import *

ROOT_DIR = os.path.abspath(os.path.join(PROJECT_DIR, '..'))

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'geodjango',
        'USER': 'bekindred',
        'PASSWORD': 'bekindred',
        'HOST': '127.0.0.1',
        'PORT': '5432',
        }
}

POSTGIS_VERSION = (2, 1, 0)

GEOIP_PATH = os.path.join(BASE_DIR, '..', 'data')
# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

# Django
STATICFILES_ROOT = os.path.join(BASE_DIR, '..', 'static/')

FACEBOOK_APP_ID = 633834406712155
FACEBOOK_APP_SECRET = '618558f85672fd7ec3a6c3aef89f0970'

FACEBOOK_FORCE_PROFILE_UPDATE_ON_LOGIN = True
FACEBOOK_STORE_LIKES = True
FACEBOOK_STORE_FRIENDS = True

# LinkedIn
LINKEDIN_CONSUMER_KEY = '756g9uw1z5u8we'
LINKEDIN_CONSUMER_SECRET = 'JFdHmQgN1V1qM4VF'


# Add email to requested authorizations.
LINKEDIN_SCOPE = ['r_basicprofile', 'rw_company_admin', 'r_emailaddress', 'w_share']
# Add the fields so they will be requested from linkedin.
# Add the fields so they will be requested from linkedin.
LINKEDIN_EXTRA_FIELD_SELECTORS = ['headline', 'public-profile-url',
                                  'email-address', 'date-of-birth',
                                  'picture-url', 'positions']
# Arrange to add the fields to UserSocialAuth.extra_data
LINKEDIN_EXTRA_DATA = [('id', 'id'),
                       ('first-name', 'first_name'),
                       ('last-name', 'last_name'),
                       ('headline', 'headline'),
                       ('public-profile-url', 'public_profile_url'),
                       ('email-address', 'email'),
                       ('date-of-birth', 'date_of_birth'),
                       ('picture-url', 'image'),
                       ('relation-to-viewer', 'relation-to-viewer'),
                       ('positions', 'positions')
                       ]


# twitter social auth

TWITTER_CONSUMER_KEY = '2s9WPaf8V5lJxkSjj1HteZvn0'
TWITTER_CONSUMER_SECRET = 'HTtxdQltSaOzHnUkHwJBGrP9eEPtFzmKUalXbcoyqRHlEDVCI4'
TWITTER_EXTRA_FIELD_SELECTORS = ['screen_name', 'name']
TWITTER_EXTRA_DATA = ['screen_name', 'name']

LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/goals/close_login_popup/'
LOGIN_ERROR_URL = '/goals/error_window/'
SOCIAL_AUTH_PROTECTED_USER_FIELDS = ['username', 'email',
                                     'first_name', 'last_name', 'image']

SOCIAL_AUTH_REDIRECT_IS_HTTPS = True


SOCIAL_AUTH_PIPELINE = (
    'social_auth.backends.pipeline.social.social_auth_user',
    'social_auth.backends.pipeline.user.get_username',
    'social_auth.backends.pipeline.user.create_user',
    'social_auth.backends.pipeline.social.associate_user',
    'social_auth.backends.pipeline.social.load_extra_data',
    'social_auth.backends.pipeline.user.update_user_details',
    'bekindred.pipeline.social_auth_to_profile',
    'bekindred.pipeline.load_twitter_user_friends',
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

INSTALLED_APPS += ('raven.contrib.django.raven_compat',)


RAVEN_CONFIG = {
    'dsn': 'https://4626cd002fbb4ea9be20e8042a7226a6:75fbcaf7711f4183b6842424c64d3ee5@app.getsentry.com/66639',
    # If you are using git, you can also automatically configure the
    # release based on the git info.
    'release': raven.fetch_git_sha(ROOT_DIR),
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
        'sentry': {
            'level': 'INFO',
            'class': 'raven.handlers.logging.SentryHandler',
            'dsn': RAVEN_CONFIG['dsn']
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'bekindred.bekindred': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    }
}
