from .base import *
from os import environ
import dj_database_url
DATABASES['default'] = dj_database_url.config()
DATABASES['default']['ENGINE'] = 'django.contrib.gis.db.backends.postgis'
POSTGIS_VERSION = (2, 1, 0)
GEOS_LIBRARY_PATH = environ.get('GEOS_LIBRARY_PATH')
GDAL_LIBRARY_PATH = environ.get('GDAL_LIBRARY_PATH')
# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

STATIC_ROOT = 'staticfiles'

DEBUG = False

TEMPLATE_DEBUG = False

FACEBOOK_APP_ID = 633834406712155
FACEBOOK_APP_SECRET = '618558f85672fd7ec3a6c3aef89f0970'

FACEBOOK_FORCE_PROFILE_UPDATE_ON_LOGIN = True
FACEBOOK_STORE_LIKES = True
FACEBOOK_STORE_FRIENDS = True

FACEBOOK_DEFAULT_SCOPE = ['email', 'user_about_me', 'user_birthday', 'user_website', 'user_likes', 'user_friends',
                          'user_status', 'read_friendlists', 'user_relationships', 'user_groups',
                          'user_relationship_details', 'read_stream']