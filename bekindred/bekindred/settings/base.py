"""
Django settings for bekindred project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

PROJECT_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'zguhddh+2x9@!*@&_jdw7v*hslwv_)nx$sw@rwcr+$nppu7f*4'

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = bool(os.environ.get('DJANGO_DEBUG', ''))
#
# TEMPLATE_DEBUG = DEBUG

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, '..', 'templates'),
)

TEMPLATE_LOADERS = (
        'django_mobile.loader.Loader',
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
)

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE':  os.path.abspath(os.path.join(BASE_DIR, '..', '..',
                                                    'persice_app',
                                                    'webpack-stats.json'))
    }
}

ALLOWED_HOSTS = []

SESSION_COOKIE_AGE = 1 * 24 * 60 * 60

# Application definition

INSTALLED_APPS = (
    'flat',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',
    'django.contrib.humanize',
)

INSTALLED_APPS += ('south',
                   'guardian',
                   'haystack',
                   'elasticstack',
                   'import_export',
                   'pagination',
                   'django_facebook',
                   'members',
                   'social_auth',
                   'postman',
                   'goals',
                   'events',
                   'friends',
                   'world',
                   'interests',
                   'photos',
                   'match_engine',
                   'matchfeed',
                   'msgs',
                   'tastypie',
                   'geoposition',
                   'easy_thumbnails',
                   'django_mobile',
                   'storages',
                   'webpack_loader'
                   )

SOUTH_MIGRATION_MODULES = {
    'easy_thumbnails': 'easy_thumbnails.south_migrations',
}

THUMBNAIL_ALIASES = {
    'photos': {
        '56x56': {'size': (56, 56), 'crop': True, 'quality': 100},
        '89x89': {'size': (89, 89), 'crop': True, 'quality': 100},
        '120x120': {'size': (120, 120), 'crop': True, 'quality': 100},
        '154x154': {'size': (154, 154), 'crop': True, 'quality': 100},
        '230x230': {'size': (230, 230), 'crop': True, 'quality': 100},
        '387x387': {'size': (387, 387), 'crop': True, 'quality': 100},
    },
    'events': {
        '56x56': {'size': (56, 56), 'crop': True, 'quality': 100},
        '300x200': {'size': (300, 200), 'crop': True, 'quality': 100},
        '375x145': {'size': (375, 145), 'crop': True, 'quality': 100},
        '640x480': {'size': (640, 480), 'crop': True, 'quality': 100},
        '1000x364': {'size': (1000, 364), 'crop': True, 'quality': 100},
    }
}

MIDDLEWARE_CLASSES = (
    'django.middleware.cache.UpdateCacheMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'pagination.middleware.PaginationMiddleware',
    'django_mobile.middleware.MobileDetectionMiddleware',
    'django_mobile.middleware.SetFlavourMiddleware',
    'django.middleware.cache.UpdateCacheMiddleware'
)

MIDDLEWARE_CLASSES += ('social_auth.middleware.SocialAuthExceptionMiddleware',)

ROOT_URLCONF = 'bekindred.urls'

WSGI_APPLICATION = 'bekindred.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_ROOT = '/webapps/bekindred/staticfiles'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, '..', 'static'),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(PROJECT_DIR, 'media')

MEDIA_URL = '/media/'

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.core.context_processors.request',
    'django.contrib.messages.context_processors.messages',
    'django_facebook.context_processors.facebook',
    'social_auth.context_processors.social_auth_by_name_backends',
    'social_auth.context_processors.social_auth_backends',
    'social_auth.context_processors.social_auth_by_type_backends',
    'social_auth.context_processors.social_auth_login_redirect',
    'django_mobile.context_processors.flavour'
)

AUTHENTICATION_BACKENDS = (
    'django_facebook.auth_backends.FacebookBackend',
    'social_auth.backends.twitter.TwitterBackend',
    'social_auth.backends.contrib.linkedin.LinkedinBackend',
    'django.contrib.auth.backends.ModelBackend',
    'guardian.backends.ObjectPermissionBackend',
)

# Configure anonymous user ID for django-guardian
ANONYMOUS_USER_ID = -1

AUTH_USER_MODEL = 'django_facebook.FacebookCustomUser'
AUTH_PROFILE_MODULE = 'members.MyCustomProfile'
SOCIAL_AUTH_USER_MODEL = AUTH_USER_MODEL

FACEBOOK_DEFAULT_FIELDS = [
    'id', 'name', 'gender', 'first_name', 'last_name', 'birthday',
    'email', 'relationship_status', 'religion', 'political',
    'meeting_for', 'sports', 'favorite_teams', 'languages', 'hometown',
    'location', 'quotes', 'work', 'is_verified', 'verified',
    'is_shared_login'
]

FACEBOOK_DEFAULT_LIKES_FIELDS = [
    "picture.type(large)", "name", "category", "fan_count", "created_time"
]

FACEBOOK_DEFAULT_SCOPE = ['email',
                          'user_about_me',
                          'user_birthday',
                          'user_likes',
                          'user_friends',
                          'user_managed_groups',
                          'user_photos',
                          'user_work_history',
                          'user_religion_politics',
                          'user_location']

FACEBOOK_STORE_LOCAL_IMAGE = False

FACEBOOK_REGISTRATION_TEMPLATE = 'registration/registration_form.html'
BROKER_URL = 'redis://localhost:6379/0'
FACEBOOK_CELERY_STORE = False
FACEBOOK_CELERY_TOKEN_EXTEND = False

FACEBOOK_REGISTRATION_BACKEND = 'members.registration_backends.FacebookRegistrationBackend'
# Django-postman settings
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
    'arg_default': 'postman_friends',
    # no default, mandatory to enable the feature
}  # default is {}

REDIS_HOST = '127.0.0.1'
REDIS_PORT = '6379'

# GeoIP
GEOIP_PATH = os.path.join(BASE_DIR, '..', 'data')
# GEOIP_COUNTRY = 'GeoLite2-Country.mmdb'
# GEOIP_CITY = 'GeoLiteCity.dat'

# TASTYPIE_DATETIME_FORMATTING = 'rfc-2822'


HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'elasticstack.backends.ConfigurableElasticSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'haystack',
    },
}

# ELASTICSEARCH_DEFAULT_ANALYZER = 'english_analyzer'


ELASTICSEARCH_INDEX_SETTINGS = {
    'settings': {
        "analysis": {
            "analyzer": {
                "ngram_analyzer": {
                    "type": "custom",
                    "tokenizer": "lowercase",
                    "filter": ["haystack_ngram"]
                },
                "edgengram_analyzer": {
                    "type": "custom",
                    "tokenizer": "lowercase",
                    "filter": ["haystack_edgengram"]
                },
                # "synonym_analyzer": {
                #     "type": "custom",
                #     "tokenizer": "standard",
                #     "filter": ["synonym"]
                # },
                "english": {
                    "tokenizer": "standard",
                    "filter": [
                        "english_possessive_stemmer",
                        "lowercase",
                        "english_stop",
                        "english_stemmer"
                    ]
                }
            },
            "tokenizer": {
                "haystack_ngram_tokenizer": {
                    "type": "nGram",
                    "min_gram": 3,
                    "max_gram": 15,
                },
                "haystack_edgengram_tokenizer": {
                    "type": "edgeNGram",
                    "min_gram": 2,
                    "max_gram": 15,
                    "side": "front"
                }
            },
            "filter": {
                "haystack_ngram": {
                    "type": "nGram",
                    "min_gram": 3,
                    "max_gram": 15
                },
                # "synonym": {
                #     "type": "synonym",
                #     "ignore_case": "true",
                #     "format": "wordnet",
                #     "synonyms_path": "analysis/synonym.txt"
                # },
                "haystack_edgengram": {
                    "type": "edgeNGram",
                    "min_gram": 2,
                    "max_gram": 15
                },
                "english_stop": {
                    "type": "stop",
                    "stopwords": "_english_"
                },
                "english_stemmer": {
                    "type": "stemmer",
                    "language": "english"
                },
                "english_possessive_stemmer": {
                    "type": "stemmer",
                    "language": "possessive_english"
                }
            }
        }
    }
}

HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'

NEO4J_URL = 'http://neo4j:admin@localhost:7474/db/data/'
