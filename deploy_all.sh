#!/bin/bash
set -e

npm run build:prod

git ls-files . | grep '\.js$\|\.gz$' | xargs git add

git commit -am 'automatic commit before deploy fronted'

fab deploy:$1

source .env

git diff --name-only HEAD~1 HEAD | grep static |sed -e "s/bekindred\/static//g" | python invalidate_cache_cloud_front.py
