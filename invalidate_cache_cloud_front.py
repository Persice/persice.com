import time
import boto
import os

paths = [
"/dist/main-mobile.0b31784bf1a5a9031ddd.bundle.js",
"/dist/main-mobile.0b31784bf1a5a9031ddd.bundle.js.gz",
"/dist/main-mobile.0b31784bf1a5a9031ddd.bundle.map",
"/dist/main-mobile.0b31784bf1a5a9031ddd.bundle.map.gz",
"/dist/polyfills.0a5fa375cda8df736015.bundle.js",
"/dist/polyfills.0a5fa375cda8df736015.bundle.js.gz",
"/dist/polyfills.0a5fa375cda8df736015.bundle.map",
"/dist/polyfills.0a5fa375cda8df736015.bundle.map.gz"
]

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
CLOUD_FRONT_ID = os.getenv('CLOUD_FRONT_ID', u'E8V5GR8FWEOOB')

c = boto.connect_cloudfront(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)

# os.system()
# git diff --name-only HEAD~1 HEAD | grep static |sed -e "s/bekindred\/static//g"

inval_req = c.create_invalidation_request(CLOUD_FRONT_ID, paths)

max_timer = 1200
status = c.invalidation_request_status(CLOUD_FRONT_ID, inval_req.id).status
timer = 0
while status == u'InProgress' or timer > max_timer:
    time.sleep(10)
    timer += 10
    status = c.invalidation_request_status(CLOUD_FRONT_ID, inval_req.id).status
    print (status, timer)
