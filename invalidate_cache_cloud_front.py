import boto
import os

paths = ['/dist/assets/css/vendor.mobile.min.css']

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
CLOUD_FRONT_ID = os.getenv('CLOUD_FRONT_ID', u'E8V5GR8FWEOOB')

c = boto.connect_cloudfront(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)

# git diff --name-only HEAD~1 HEAD | grep static |sed -e "s/bekindred\/static//g"

paths = ['/dist/assets/css/vendor.mobile.min.css']

inval_req = c.create_invalidation_request(CLOUD_FRONT_ID, paths)
print inval_req
