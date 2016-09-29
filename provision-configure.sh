#!/bin/bash
# Script to set up install frontend dependancies



# Install NVM and stable node version

curl https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
export NVM_DIR="/home/vagrant/.nvm"
source /home/vagrant/.nvm/nvm.sh

nvm install stable
nvm alias default stable
npm -v
node -v

npm set progress=false
npm install --global pm2 gulp tslint typescript@2.0 webpack-dev-server rimraf webpack

# NPM Install socket.io

pushd bekindred/socketio
  pm2 kill
  npm install
  pm2 start app.js
popd

# NPM Install frontend app dependancies

pushd bekindred/persice_app_final_release
  npm install
  npm run build:dev
popd

# Script to configure persice backend

export WORKON_HOME=$HOME/.virtualenvs
export PIP_DOWNLOAD_CACHE=$HOME/.pip_download_cache
source /usr/local/bin/virtualenvwrapper.sh
workon bekindred

python -c 'import nltk;nltk.download("punkt")'
python -c 'import nltk;nltk.download("wordnet")'

pip install -r requirements.txt

export DJANGO_SETTINGS_MODULE=bekindred.settings.local

echo "no" | python bekindred/manage.py syncdb
python bekindred/manage.py migrate
python bekindred/manage.py loaddata bekindred/interests/fixtures/interests.json
python bekindred/manage.py loaddata bekindred/interests/fixtures/default_political_vews.json
python bekindred/manage.py loaddata bekindred/interests/fixtures/default_religious_vews.json
