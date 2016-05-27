#!/bin/bash
set -xe

source .env

pushd persice_app
npm install
npm run build:prod
popd

git ls-files . | grep -E '(\.js$)|(\.css$)|(\.gz$)|(\.map$)|(\.svg$)' | xargs git add
git add .

git commit -am 'automatic commit before deploy fronted' || true

fab deploy:$1


git diff --name-only HEAD~$2 HEAD | grep static | sed -e "s/bekindred\/static//g" | python invalidate_cache_cloud_front.py
