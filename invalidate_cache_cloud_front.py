import time
import boto
import os

paths = [
"/dist/assets/css/mobile.css",
"/dist/main-mobile.27d308a5554b0cf8ed62.bundle.js",
"/dist/main-mobile.27d308a5554b0cf8ed62.bundle.js.gz",
"/dist/main-mobile.27d308a5554b0cf8ed62.bundle.map",
"/dist/main-mobile.27d308a5554b0cf8ed62.bundle.map.gz",
"/dist/main-mobile.bd439cc07427175b9e31.bundle.js",
"/dist/main-mobile.bd439cc07427175b9e31.bundle.js.gz",
"/dist/main-mobile.bd439cc07427175b9e31.bundle.map",
"/dist/main-mobile.bd439cc07427175b9e31.bundle.map.gz",
"/dist/main.bf4dd7fa74f293a1be88.bundle.js",
"/dist/main.bf4dd7fa74f293a1be88.bundle.js.gz",
"/dist/main.bf4dd7fa74f293a1be88.bundle.map",
"/dist/main.bf4dd7fa74f293a1be88.bundle.map.gz",
"/dist/main.ce172ff2ed19d85c9573.bundle.js",
"/dist/main.ce172ff2ed19d85c9573.bundle.js.gz",
"/dist/main.ce172ff2ed19d85c9573.bundle.map",
"/dist/main.ce172ff2ed19d85c9573.bundle.map.gz",
"/dist/polyfills.0a5fa375cda8df736015.bundle.js",
"/dist/polyfills.0a5fa375cda8df736015.bundle.js.gz",
"/dist/polyfills.0a5fa375cda8df736015.bundle.map",
"/dist/polyfills.0a5fa375cda8df736015.bundle.map.gz",
"/dist/signup-mobile.8a30fe4b5a0d032b773b.bundle.js",
"/dist/signup-mobile.8a30fe4b5a0d032b773b.bundle.js.gz",
"/dist/signup-mobile.8a30fe4b5a0d032b773b.bundle.map",
"/dist/signup-mobile.8a30fe4b5a0d032b773b.bundle.map.gz",
"/dist/signup-mobile.99795daccab509df3a26.bundle.js",
"/dist/signup-mobile.99795daccab509df3a26.bundle.js.gz",
"/dist/signup-mobile.99795daccab509df3a26.bundle.map",
"/dist/signup-mobile.99795daccab509df3a26.bundle.map.gz",
"/dist/signup.b8934d52c0019b52a727.bundle.js",
"/dist/signup.b8934d52c0019b52a727.bundle.js.gz",
"/dist/signup.b8934d52c0019b52a727.bundle.map",
"/dist/signup.b8934d52c0019b52a727.bundle.map.gz",
"/dist/signup.ed545904d327b2e6befa.bundle.js",
"/dist/signup.ed545904d327b2e6befa.bundle.js.gz",
"/dist/signup.ed545904d327b2e6befa.bundle.map",
"/dist/signup.ed545904d327b2e6befa.bundle.map.gz",
"/dist/vendor.ac0544fdf8dc68aaeedf.bundle.js",
"/dist/vendor.ac0544fdf8dc68aaeedf.bundle.js.gz",
"/dist/vendor.ac0544fdf8dc68aaeedf.bundle.map",
"/dist/vendor.ac0544fdf8dc68aaeedf.bundle.map.gz",
"/dist/vendor.b3b454a97623d9b7a14a.bundle.js",
"/dist/vendor.b3b454a97623d9b7a14a.bundle.js.gz",
"/dist/vendor.b3b454a97623d9b7a14a.bundle.map",
"/dist/vendor.b3b454a97623d9b7a14a.bundle.map.gz",
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
