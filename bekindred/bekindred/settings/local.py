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

FIXTURE_DIRS = (
    os.path.join(BASE_DIR, '..', 'fixtures'),
)

# Django
STATICFILES_ROOT = os.path.join(BASE_DIR, '..', 'static/')

FACEBOOK_APP_ID = '634990373263225'
FACEBOOK_APP_SECRET = '2d942d34f2e5818cad58920834044d5a'

FACEBOOK_FORCE_PROFILE_UPDATE_ON_LOGIN = True
FACEBOOK_STORE_LIKES = True
FACEBOOK_STORE_FRIENDS = True

FACEBOOK_DEFAULT_SCOPE = ['email', 'user_about_me', 'user_birthday', 'user_website', 'user_likes', 'user_friends',
                           'user_status', 'read_friendlists', 'user_relationships', 'user_groups',
                           'user_relationship_details', 'read_stream']

GEOIP_PATH = os.path.join(BASE_DIR, '..', 'data')