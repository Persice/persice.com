#!/bin/bash
set -xe

source .env

git pull origin $1
pushd persice_app_final_release
npm install
npm run compile
popd

git ls-files . | grep -E '(\.gif$)|(\.png$)|(\.jpg$)|(\.html$)|(\.js$)|(\.css$)|(\.gz$)|(\.map$)|(\.svg$)' | xargs git add
git add .

git commit -am 'Automatic commit before deploying frontend' || true
git push origin $1

fab deploy:$1

python invalidate_cache_cloud_front.py
