import time
import boto
import os
import sys


paths = map(str.strip, sys.stdin.readlines())

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
CLOUD_FRONT_ID = os.getenv('CLOUD_FRONT_ID', u'E8V5GR8FWEOOB')

c = boto.connect_cloudfront(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)

inval_req = c.create_invalidation_request(CLOUD_FRONT_ID, paths)

max_timer = 1200
status = c.invalidation_request_status(CLOUD_FRONT_ID, inval_req.id).status
timer = 0
while True:
    time.sleep(10)
    timer += 10
    status = c.invalidation_request_status(CLOUD_FRONT_ID, inval_req.id).status
    if status != u'InProgress' or (timer > max_timer):
        break
    print (status, timer)
