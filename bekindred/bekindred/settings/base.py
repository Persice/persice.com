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

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',
)

INSTALLED_APPS += ('south',
                   'pagination',
                   'django_facebook',
                   'members',
                   'social_auth',
                   'goals',
                   'friends',
                   'world',
                   'interests',
                   'photos',
                   'matchfeed',
                   'tastypie',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'pagination.middleware.PaginationMiddleware',
)

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
)

AUTHENTICATION_BACKENDS = (
    'django_facebook.auth_backends.FacebookBackend',
    'social_auth.backends.twitter.TwitterBackend',
    'social_auth.backends.contrib.linkedin.LinkedinBackend',
    'django.contrib.auth.backends.ModelBackend',
)

AUTH_USER_MODEL = 'django_facebook.FacebookCustomUser'
SOCIAL_AUTH_USER_MODEL = AUTH_USER_MODEL

FACEBOOK_REGISTRATION_TEMPLATE = 'registration/registration_form.html'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
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