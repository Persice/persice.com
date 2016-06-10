#!/bin/bash

# Script to set up dependencies for Django on Vagrant.

# Installation settings

PROJECT_NAME=$1

VIRTUALENV_NAME=$PROJECT_NAME

PROJECT_DIR=/home/vagrant/$PROJECT_NAME
VIRTUALENV_DIR=/home/vagrant/.virtualenvs/$PROJECT_NAME

PGSQL_VERSION=9.3

DB_NAME=geodjango

# Need to fix locale so that Postgres creates databases in UTF-8
cp -p /vagrant_data/etc-bash.bashrc /etc/bash.bashrc
locale-gen en_GB.UTF-8
dpkg-reconfigure locales

export LANGUAGE=en_GB.UTF-8
export LANG=en_GB.UTF-8
export LC_ALL=en_GB.UTF-8

# Install essential packages from Apt
apt-get update -y
# Python dev packages
apt-get install -y build-essential python python-dev python-setuptools python-pip
# Dependencies for image processing with PIL
apt-get install -y libjpeg-dev libtiff-dev zlib1g-dev libfreetype6-dev liblcms2-dev
# Git (we'd rather avoid people keeping credentials for git commits in the repo, but sometimes we need it for pip requirements that aren't in PyPI)
apt-get install -y git
# GeoIP
apt-get install -y libgeoip-dev
#
apt-get install -y libgeos-dev
# gnureadline python module
apt-get install -y libncurses5-dev

# Postgresql
if ! command -v psql; then
    apt-get install -y postgresql-$PGSQL_VERSION libpq-dev
    cp /vagrant_data/pg_hba.conf /etc/postgresql/$PGSQL_VERSION/main/
    /etc/init.d/postgresql reload
    apt-get install -y  postgresql-9.3-postgis-2.1 -f
fi

# virtualenv global setup
if ! command -v pip; then
    easy_install -U pip
fi
if [[ ! -f /usr/local/bin/virtualenv ]]; then
    easy_install virtualenv virtualenvwrapper stevedore virtualenv-clone
fi

# bash environment global setup
cp -p /vagrant_data/bashrc /home/vagrant/.bashrc

# install our common Python packages in a temporary virtual env so that they'll get cached
if [[ ! -e /home/vagrant/.pip_download_cache ]]; then
    su - vagrant -c "mkdir -p /home/vagrant/.pip_download_cache && \
        virtualenv /home/vagrant/yayforcaching && \
        PIP_DOWNLOAD_CACHE=/home/vagrant/.pip_download_cache /home/vagrant/yayforcaching/bin/pip install -r /vagrant_data/common_requirements.txt && \
        rm -rf /home/vagrant/yayforcaching"
fi

# ---

# postgresql setup for project
createdb -Upostgres $DB_NAME

psql -Upostgres -d $DB_NAME -c "CREATE USER bekindred WITH PASSWORD 'bekindred'"
psql -Upostgres -d $DB_NAME -c "GRANT ALL PRIVILEGES ON DATABASE geodjango to bekindred"
psql -Upostgres -d $DB_NAME -c "CREATE EXTENSION postgis"


# virtualenv setup for project
su - vagrant -c "/usr/local/bin/virtualenv $VIRTUALENV_DIR && \
    echo $PROJECT_DIR > $VIRTUALENV_DIR/.project && \
    PIP_DOWNLOAD_CACHE=/home/vagrant/.pip_download_cache $VIRTUALENV_DIR/bin/pip install -r $PROJECT_DIR/requirements.txt"

echo "workon $VIRTUALENV_NAME" >> /home/vagrant/.bashrc

# Set execute permissions on manage.py, as they get lost if we build from a zip file
# chmod a+x $PROJECT_DIR/manage.py

# Django project setup
# su - vagrant -c "source $VIRTUALENV_DIR/bin/activate && cd $PROJECT_DIR && ./manage.py syncdb --noinput && ./manage.py migrate"

apt-get install -y memcached

# Install Neo4j
if ! command -v /usr/bin/neo4j; then
    apt-get install -y python-software-properties debconf-utils
    add-apt-repository -y ppa:webupd8team/java
    apt-get update
    echo "oracle-java8-installer shared/accepted-oracle-license-v1-1 select true" | sudo debconf-set-selections
    wget -O - https://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add -
    echo 'deb http://debian.neo4j.org/repo stable/' >/tmp/neo4j.list
    mv /tmp/neo4j.list /etc/apt/sources.list.d
    apt-get update
    apt-get install -y oracle-java8-installer neo4j
fi

# Install ElasticSearch
if ! command -v /etc/init.d/elasticsearch; then
    wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-1.7.3.deb
    dpkg -i elasticsearch-1.7.3.deb
    update-rc.d elasticsearch defaults
fi

# Install Redis
if ! command -v redis-server; then
    apt-get install -y redis-server
fi



# Add node repo
apt-get install -y build-essential curl openssl libssl-dev
sudo su vagrant -c 'curl https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash'
sudo su vagrant -c '. ~vagrant/.nvm/nvm.sh;nvm install stable'
sudo su vagrant -c '. ~vagrant/.nvm/nvm.sh;nvm use stable'

# Add nginx and test1.com nginx conf

if ! which nginx > /dev/null 2>&1; then
    add-apt-repository ppa:nginx/stable
    apt-get update
    apt-get -y install nginx
    service nginx start
fi

if [ ! -f /etc/nginx/sites-available/test1.com ]; then
    cp /home/vagrant/bekindred/test1.com /etc/nginx/sites-available/test1.com
    chmod 644 /etc/nginx/sites-available/test1.com
    ln -s /etc/nginx/sites-available/test1.com /etc/nginx/sites-enabled/test1.com
    service nginx restart
fi

# Change password for neo4j
curl -H "Content-Type: application/json" -X POST -d '{"password":"admin"}' -u neo4j:neo4j http://localhost:7474/user/neo4j/password


# Start elasticsearch
service elasticsearch start
