import time
import boto
import os

paths = [
"/dist/1.3eda04ec1aa6c283e1c2.bundle.map",
"/dist/1.3eda04ec1aa6c283e1c2.bundle.map.gz",
"/dist/1.3eda04ec1aa6c283e1c2.chunk.js",
"/dist/1.3eda04ec1aa6c283e1c2.chunk.js.gz",
"/dist/2.a6df6ccaeb086866fdeb.bundle.map",
"/dist/2.a6df6ccaeb086866fdeb.bundle.map.gz",
"/dist/2.a6df6ccaeb086866fdeb.chunk.js",
"/dist/2.a6df6ccaeb086866fdeb.chunk.js.gz",
"/dist/3.fdd0d83ad6aa1f3081a0.bundle.map",
"/dist/3.fdd0d83ad6aa1f3081a0.bundle.map.gz",
"/dist/3.fdd0d83ad6aa1f3081a0.chunk.js",
"/dist/3.fdd0d83ad6aa1f3081a0.chunk.js.gz",
"/dist/4.7fe05d6c3f5f024a5c1e.bundle.map",
"/dist/4.7fe05d6c3f5f024a5c1e.bundle.map.gz",
"/dist/4.7fe05d6c3f5f024a5c1e.chunk.js",
"/dist/4.7fe05d6c3f5f024a5c1e.chunk.js.gz",
"/dist/5.5bf8f0ad1c24df9debb2.bundle.map",
"/dist/5.5bf8f0ad1c24df9debb2.bundle.map.gz",
"/dist/5.5bf8f0ad1c24df9debb2.chunk.js",
"/dist/5.5bf8f0ad1c24df9debb2.chunk.js.gz",
"/dist/6.3a97a87bd8b503ef53bb.bundle.map",
"/dist/6.3a97a87bd8b503ef53bb.bundle.map.gz",
"/dist/6.3a97a87bd8b503ef53bb.chunk.js",
"/dist/7.b7b93ba4fb7658cb50f0.bundle.map",
"/dist/7.b7b93ba4fb7658cb50f0.bundle.map.gz",
"/dist/7.b7b93ba4fb7658cb50f0.chunk.js",
"/dist/8.5bfe3602823f3a662edf.bundle.map",
"/dist/8.5bfe3602823f3a662edf.bundle.map.gz",
"/dist/8.5bfe3602823f3a662edf.chunk.js",
"/dist/9.cdec8b20b25a90a0eec6.bundle.map",
"/dist/9.cdec8b20b25a90a0eec6.bundle.map.gz",
"/dist/9.cdec8b20b25a90a0eec6.chunk.js",
"/dist/assets/css/mobile.css",
"/dist/assets/css/vendor.mobile.min.css",
"/dist/assets/icons/icons.svg",
"/dist/main-mobile.00fe75e57ce68effdb5f.bundle.js",
"/dist/main-mobile.00fe75e57ce68effdb5f.bundle.js.gz",
"/dist/main-mobile.00fe75e57ce68effdb5f.bundle.map",
"/dist/main-mobile.00fe75e57ce68effdb5f.bundle.map.gz",
"/dist/main-mobile.0b31784bf1a5a9031ddd.bundle.js",
"/dist/main-mobile.0b31784bf1a5a9031ddd.bundle.js.gz",
"/dist/main-mobile.0b31784bf1a5a9031ddd.bundle.map",
"/dist/main-mobile.0b31784bf1a5a9031ddd.bundle.map.gz",
"/dist/main.5cea5a6d57853b73a8af.bundle.js",
"/dist/main.5cea5a6d57853b73a8af.bundle.js.gz",
"/dist/main.5cea5a6d57853b73a8af.bundle.map",
"/dist/main.5cea5a6d57853b73a8af.bundle.map.gz",
"/dist/main.ce172ff2ed19d85c9573.bundle.js",
"/dist/main.ce172ff2ed19d85c9573.bundle.js.gz",
"/dist/main.ce172ff2ed19d85c9573.bundle.map",
"/dist/main.ce172ff2ed19d85c9573.bundle.map.gz",
"/dist/polyfills.0a5fa375cda8df736015.bundle.js",
"/dist/polyfills.0a5fa375cda8df736015.bundle.js.gz",
"/dist/polyfills.0a5fa375cda8df736015.bundle.map",
"/dist/polyfills.0a5fa375cda8df736015.bundle.map.gz",
"/dist/signup-mobile.99795daccab509df3a26.bundle.js",
"/dist/signup-mobile.99795daccab509df3a26.bundle.js.gz",
"/dist/signup-mobile.99795daccab509df3a26.bundle.map",
"/dist/signup-mobile.99795daccab509df3a26.bundle.map.gz",
"/dist/signup.b8934d52c0019b52a727.bundle.js",
"/dist/signup.b8934d52c0019b52a727.bundle.js.gz",
"/dist/signup.b8934d52c0019b52a727.bundle.map",
"/dist/signup.b8934d52c0019b52a727.bundle.map.gz",
"/dist/vendor.b3b454a97623d9b7a14a.bundle.js",
"/dist/vendor.b3b454a97623d9b7a14a.bundle.js.gz",
"/dist/vendor.b3b454a97623d9b7a14a.bundle.map",
"/dist/vendor.b3b454a97623d9b7a14a.bundle.map.gz",
"/dist/vendor.ba27215e98551e5914d6.bundle.js",
"/dist/vendor.ba27215e98551e5914d6.bundle.js.gz",
"/dist/vendor.ba27215e98551e5914d6.bundle.map",
"/dist/vendor.ba27215e98551e5914d6.bundle.map.gz"
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
while status != u'InProgress' or timer > max_timer:
    time.sleep(10)
    timer += 10
    status = c.invalidation_request_status(CLOUD_FRONT_ID, inval_req.id).status
    print (status, timer)
