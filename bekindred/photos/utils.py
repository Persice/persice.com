import base64
import logging
import urllib
from io import BytesIO

from django.core.files.temp import NamedTemporaryFile
from django.core.files.uploadedfile import InMemoryUploadedFile
try:
    import urllib2
except ImportError:
    import urllib.error as urllib2


logger = logging.getLogger(__name__)


def update_image_base64(facebook_id, base64_image):
    image_name = 'fb_image_%s.jpg' % facebook_id
    image_content_ = base64.b64decode(base64_image.replace('data:image/png;base64,', ''))
    image_content = BytesIO(image_content_)
    image_size = image_content.tell()
    content_type = 'image/jpeg'
    image_file = InMemoryUploadedFile(
        file=image_content, name=image_name, field_name='image',
        content_type=content_type, size=image_size, charset=None
    )
    image_file.seek(0)
    return image_name, image_file


def _update_image(facebook_id, image_url):
    '''
    Updates the user profile's image to the given image url
    Unfortunately this is quite a pain to get right with Django
    Suggestions to improve this are welcome
    '''
    image_name = 'fb_image_%s.jpg' % facebook_id
    image_temp = NamedTemporaryFile()
    try:
        image_response = urllib2.urlopen(image_url)
    except AttributeError:
        image_response = urllib.request.urlopen(image_url)
    image_content = image_response.read()
    image_temp.write(image_content)
    http_message = image_response.info()
    image_size = len(image_content)
    try:
        content_type = http_message.type
    except AttributeError:
        content_type = http_message.get_content_type()
    image_file = InMemoryUploadedFile(
        file=image_temp, name=image_name, field_name='image',
        content_type=content_type, size=image_size, charset=None
    )
    image_file.seek(0)
    image_temp.flush()
    return image_name, image_file