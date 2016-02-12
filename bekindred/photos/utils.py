import base64

from io import BytesIO

from django.core.files.uploadedfile import InMemoryUploadedFile
import logging
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
