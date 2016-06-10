#!/bin/bash
# Script to set up install frontend dependancies
#
npm set progress=false
npm install --global pm2 gulp tslint typescript typings webpack-dev-server rimraf webpack

# NPM Install socket.io

pushd bekindred/socketio
pm2 kill
npm install
pm2 start app.js
popd

# NPM Install frontend app dependancies

pushd bekindred/persice_app
npm install
popd


# Script to install backend

export WORKON_HOME=$HOME/.virtualenvs
export PIP_DOWNLOAD_CACHE=$HOME/.pip_download_cache
source /usr/local/bin/virtualenvwrapper.sh

workon bekindred

python -c 'import nltk;nltk.download("punkt")'
python -c 'import nltk;nltk.download("wordnet")'

pip install -r requirements.txt

export DJANGO_SETTINGS_MODULE=bekindred.settings.local

python bekindred/manage.py syncdb
echo "no" | python bekindred/manage.py migrate
python bekindred/manage.py loaddata bekindred/interests/fixtures/interests.json
python bekindred/manage.py loaddata bekindred/interests/fixtures/default_political_vews.json
python bekindred/manage.py loaddata bekindred/interests/fixtures/default_religious_vews.json
