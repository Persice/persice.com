import boto
import os

paths = [
    '/dist/1.26a87b13696bcd3ca403.bundle.map',
    '/dist/1.26a87b13696bcd3ca403.bundle.map.gz',
    '/dist/1.26a87b13696bcd3ca403.chunk.js',
    '/dist/1.26a87b13696bcd3ca403.chunk.js.gz',
    '/dist/2.d21d91f4275badd917d7.bundle.map',
    '/dist/2.d21d91f4275badd917d7.bundle.map.gz',
    '/dist/2.d21d91f4275badd917d7.chunk.js',
    '/dist/2.d21d91f4275badd917d7.chunk.js.gz',
    '/dist/3.4221e269cc93bb3911a6.bundle.map',
    '/dist/3.4221e269cc93bb3911a6.bundle.map.gz',
    '/dist/3.4221e269cc93bb3911a6.chunk.js',
    '/dist/3.4221e269cc93bb3911a6.chunk.js.gz',
    '/dist/4.c7453071e86bd8c4b87f.bundle.map',
    '/dist/4.c7453071e86bd8c4b87f.bundle.map.gz',
    '/dist/4.c7453071e86bd8c4b87f.chunk.js',
    '/dist/4.c7453071e86bd8c4b87f.chunk.js.gz',
    '/dist/5.23a0007ab2a01bd3f1f9.bundle.map',
    '/dist/5.23a0007ab2a01bd3f1f9.bundle.map.gz',
    '/dist/5.23a0007ab2a01bd3f1f9.chunk.js',
    '/dist/6.e2097d43b766ba8b14e3.bundle.map',
    '/dist/6.e2097d43b766ba8b14e3.bundle.map.gz',
    '/dist/6.e2097d43b766ba8b14e3.chunk.js',
    '/dist/7.664951a9da5c54f90bfd.bundle.map',
    '/dist/7.664951a9da5c54f90bfd.bundle.map.gz',
    '/dist/7.664951a9da5c54f90bfd.chunk.js',
    '/dist/8.72e270a6ac1476ed10f5.bundle.map',
    '/dist/8.72e270a6ac1476ed10f5.bundle.map.gz',
    '/dist/8.72e270a6ac1476ed10f5.chunk.js',
    '/dist/9.85f383c13067ffd839b3.bundle.map',
    '/dist/9.85f383c13067ffd839b3.bundle.map.gz',
    '/dist/9.85f383c13067ffd839b3.chunk.js',
    '/dist/assets/css/mobile.css',
    '/dist/assets/css/vendor.mobile.min.css',
    '/dist/main-mobile.17d0e8059688bcb90fcf.bundle.js',
    '/dist/main-mobile.17d0e8059688bcb90fcf.bundle.js.gz',
    '/dist/main-mobile.17d0e8059688bcb90fcf.bundle.map',
    '/dist/main-mobile.17d0e8059688bcb90fcf.bundle.map.gz',
    '/dist/main-mobile.bfc80b0643186b819a7d.bundle.js',
    '/dist/main-mobile.bfc80b0643186b819a7d.bundle.js.gz',
    '/dist/main-mobile.bfc80b0643186b819a7d.bundle.map',
    '/dist/main-mobile.bfc80b0643186b819a7d.bundle.map.gz',
    '/dist/main.2961f059d7ec48a641f1.bundle.js',
    '/dist/main.2961f059d7ec48a641f1.bundle.js.gz',
    '/dist/main.2961f059d7ec48a641f1.bundle.map',
    '/dist/main.2961f059d7ec48a641f1.bundle.map.gz',
    '/dist/polyfills.5db95de99c6553e676f4.bundle.js',
    '/dist/polyfills.5db95de99c6553e676f4.bundle.js.gz',
    '/dist/polyfills.5db95de99c6553e676f4.bundle.map',
    '/dist/polyfills.5db95de99c6553e676f4.bundle.map.gz',
    '/dist/signup-mobile.a4ba607d060aef6ffd97.bundle.js',
    '/dist/signup-mobile.a4ba607d060aef6ffd97.bundle.js.gz',
    '/dist/signup-mobile.a4ba607d060aef6ffd97.bundle.map',
    '/dist/signup-mobile.a4ba607d060aef6ffd97.bundle.map.gz',
    '/dist/signup.678ac85eee28f768a8f0.bundle.js',
    '/dist/signup.678ac85eee28f768a8f0.bundle.js.gz',
    '/dist/signup.678ac85eee28f768a8f0.bundle.map',
    '/dist/signup.678ac85eee28f768a8f0.bundle.map.gz',
    '/dist/vendor.94300c2054d8cb67a983.bundle.js',
    '/dist/vendor.94300c2054d8cb67a983.bundle.js.gz',
    '/dist/vendor.94300c2054d8cb67a983.bundle.map',
    '/dist/vendor.94300c2054d8cb67a983.bundle.map.gz',
    '/dist/vendor.a914ca456317f259c363.bundle.js',
    '/dist/vendor.a914ca456317f259c363.bundle.js.gz',
    '/dist/vendor.a914ca456317f259c363.bundle.map',
    '/dist/vendor.a914ca456317f259c363.bundle.map.gz'
]

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
CLOUD_FRONT_ID = os.getenv('CLOUD_FRONT_ID', u'E8V5GR8FWEOOB')

c = boto.connect_cloudfront(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)

# git diff --name-only HEAD~1 HEAD | grep static |sed -e "s/bekindred\/static//g"

inval_req = c.create_invalidation_request(CLOUD_FRONT_ID, paths)
print inval_req
