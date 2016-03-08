from .base import *

DEBUG = True
TEMPLATE_DEBUG = True

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

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

INSTALLED_APPS += (
    'debug_toolbar',
    'tastypie_swagger',
)

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'elasticstack.backends.ConfigurableElasticSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'test_haystack',
    },
}


TASTYPIE_SWAGGER_API_MODULE = 'bekindred.urls.v1_api'

FIXTURE_DIRS = (
    os.path.join(BASE_DIR, '..', 'fixtures'),
)

# Django
STATICFILES_ROOT = os.path.join(BASE_DIR, '..', 'static/')

# Facebook
FACEBOOK_APP_ID = '634990373263225'
FACEBOOK_APP_SECRET = '2d942d34f2e5818cad58920834044d5a'

FACEBOOK_CELERY_STORE = False
FACEBOOK_CELERY_TOKEN_EXTEND = False
FACEBOOK_FORCE_PROFILE_UPDATE_ON_LOGIN = True
FACEBOOK_STORE_LIKES = True
FACEBOOK_STORE_FRIENDS = True

# LinkedIn social auth
LINKEDIN_CONSUMER_KEY = '77x6ttwe3nhjen'
LINKEDIN_CONSUMER_SECRET = 'kDWpzdbshxWy9ej0'


# Add email to requested authorizations.
LINKEDIN_SCOPE = ['r_basicprofile', 'rw_company_admin', 'r_emailaddress', 'w_share']
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

TWITTER_CONSUMER_KEY = 'tJyUXuKfFmlzCnKccKvlQ4RIL'
TWITTER_CONSUMER_SECRET = '3cmUB8ZKAYCKSsVtwUYpDyBNHPnY3ZkImjiomDV6pl5XeVz6AE'
TWITTER_EXTRA_FIELD_SELECTORS = ['screen_name', 'name']
TWITTER_EXTRA_DATA = ['screen_name', 'name']


LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/goals/close_login_popup/'
LOGIN_ERROR_URL = '/goals/error_window/'
SOCIAL_AUTH_PROTECTED_USER_FIELDS = ['username', 'email',
                                     'first_name', 'last_name', 'image']

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


TEST_RUNNER = 'xmlrunner.extra.djangotestrunner.XMLTestRunner'
TEST_OUTPUT_DIR = 'test_reports'
TEST_OUTPUT_VERBOSE = 2

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            },
        },
    'loggers': {
        'haystack': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'elasticsearch.trace': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.db.backends': {
            'level': 'INFO',
            'handlers': ['console'],
            },
        # 'open_facebook': {
        #     'handlers': ['console'],
        #     'level': 'INFO',
        #     'propagate': True,
        #     },
        # 'django_facebook': {
        #     'handlers': ['console'],
        #     'level': 'DEBUG',
        #     'propagate': True,
        #     },
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': True,
            },
        }
}
