#!/bin/bash
set -e

pushd persice_app

npm run build:prod

popd

git ls-files . | grep '\.js$\|\.gz$' | xargs git add

git commit -am 'automatic commit before deploy fronted'

fab deploy:$1

source .env

git diff --name-only HEAD~$2 HEAD | grep static |sed -e "s/bekindred\/static//g" | python invalidate_cache_cloud_front.py
