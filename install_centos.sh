#!/bin/bash

# Script to set up dependencies for Django on Vagrant.

# Installation settings

PROJECT_NAME=$1

VIRTUALENV_NAME=$PROJECT_NAME
PROJECT_DIR=/home/vagrant/$PROJECT_NAME
VIRTUALENV_DIR=/home/vagrant/.virtualenvs/$PROJECT_NAME

DB_NAME=geodjango


#### Install Python
# https://www.digitalocean.com/community/tutorials/how-to-set-up-python-2-7-6-and-3-3-3-on-centos-6-4

yum -y update


yum groupinstall -y development
# or yum groupinstall -y 'development tools'

yum install -y zlib-dev openssl-devel sqlite-devel bzip2-devel

wget http://www.python.org/ftp/python/2.7.6/Python-2.7.6.tar.xz

yum install -y xz-libs

# Let's decode (-d) the XZ encoded tar archive:
xz -d Python-2.7.6.tar.xz

# Now we can perform the extraction:
tar -xvf Python-2.7.6.tar

# Enter the file directory:
cd Python-2.7.6

# Start the configuration (setting the installation directory)
# By default files are installed in /usr/local.
# You can modify the --prefix to modify it (e.g. for $HOME).
./configure --prefix=/usr/local

# Let's build (compile) the source
# This procedure can take awhile (~a few minutes)
make

# After building everything:
make altinstall

# Example: export PATH="[/path/to/installation]:$PATH"
export PATH="/usr/local/bin:$PATH"

# Let's download the installation file using wget:
wget --no-check-certificate https://pypi.python.org/packages/source/s/setuptools/setuptools-1.4.2.tar.gz

# Extract the files from the archive:
tar -xvf setuptools-1.4.2.tar.gz

# Enter the extracted directory:
cd setuptools-1.4.2

# Install setuptools using the Python we've installed (2.7.6)
python2.7 setup.py install

curl https://raw.githubusercontent.com/pypa/pip/master/contrib/get-pip.py | python2.7 -

pip install virtualenv

ln -s /usr/local/bin/python2.7 /usr/local/bin/python

###############################################################################
###############               Postgres                      ###################
###############################################################################
if ! command -v psql; then
    exclude=postgresql*
    yum localinstall -y http://yum.postgresql.org/9.3/redhat/rhel-6-x86_64/pgdg-centos93-9.3-1.noarch.rpm
    yum install -y postgresql93-server
    service postgresql-9.3 initdb
    chkconfig postgresql-9.3 on
    service postgresql-9.3 start
    cp /vagrant_data/pg_hba.conf /etc/postgresql/$PGSQL_VERSION/main/
    service postgresql-9.3 restart
# http://www.postgresonline.com/journal/archives/329-An-almost-idiots-guide-to-install-PostgreSQL-9.3,-PostGIS-2.1-and-pgRouting-with-Yum.html
    rpm -ivh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
    yum install -y postgis2_93
fi

# postgresql setup for project
createdb -Upostgres $DB_NAME

psql -Upostgres -d $DB_NAME -c "CREATE USER bekindred WITH PASSWORD 'bekindred'"
psql -Upostgres -d $DB_NAME -c "GRANT ALL PRIVILEGES ON DATABASE geodjango to bekindred"
psql -Upostgres -d $DB_NAME -c "CREATE EXTENSION postgis"





# # Need to fix locale so that Postgres creates databases in UTF-8
# cp -p /vagrant_data/etc-bash.bashrc /etc/bash.bashrc
# locale-gen en_GB.UTF-8
# dpkg-reconfigure locales

# export LANGUAGE=en_GB.UTF-8
# export LANG=en_GB.UTF-8
# export LC_ALL=en_GB.UTF-8

# # Install essential packages from Apt
# apt-get update -y
# # Python dev packages
# apt-get install -y build-essential python python-dev python-setuptools python-pip
# # Dependencies for image processing with PIL
# apt-get install -y libjpeg-dev libtiff-dev zlib1g-dev libfreetype6-dev liblcms2-dev
# # Git (we'd rather avoid people keeping credentials for git commits in the repo, but sometimes we need it for pip requirements that aren't in PyPI)
# apt-get install -y git
# # GeoIP
# apt-get install -y libgeoip-dev
# #
# apt-get install -y libgeos-dev
# # gnureadline python module
# apt-get install -y libncurses5-dev

# # Postgresql
# if ! command -v psql; then
#     apt-get install -y postgresql-$PGSQL_VERSION libpq-dev
#     cp /vagrant_data/pg_hba.conf /etc/postgresql/$PGSQL_VERSION/main/
#     /etc/init.d/postgresql reload
#     apt-get install -y  postgresql-9.3-postgis-2.1 -f
# fi

# # virtualenv global setup
# if ! command -v pip; then
#     easy_install -U pip
# fi
# if [[ ! -f /usr/local/bin/virtualenv ]]; then
#     easy_install virtualenv virtualenvwrapper stevedore virtualenv-clone
# fi

# # bash environment global setup
# cp -p /vagrant_data/bashrc /home/vagrant/.bashrc

# # install our common Python packages in a temporary virtual env so that they'll get cached
# if [[ ! -e /home/vagrant/.pip_download_cache ]]; then
#     su - vagrant -c "mkdir -p /home/vagrant/.pip_download_cache && \
#         virtualenv /home/vagrant/yayforcaching && \
#         PIP_DOWNLOAD_CACHE=/home/vagrant/.pip_download_cache /home/vagrant/yayforcaching/bin/pip install -r /vagrant_data/common_requirements.txt && \
#         rm -rf /home/vagrant/yayforcaching"
# fi

# # ---

# # postgresql setup for project
# createdb -Upostgres $DB_NAME

# psql -Upostgres -d $DB_NAME -c "CREATE USER bekindred WITH PASSWORD 'bekindred'"
# psql -Upostgres -d $DB_NAME -c "GRANT ALL PRIVILEGES ON DATABASE geodjango to bekindred"
# psql -Upostgres -d $DB_NAME -c "CREATE EXTENSION postgis"


# # virtualenv setup for project
# su - vagrant -c "/usr/local/bin/virtualenv $VIRTUALENV_DIR && \
#     echo $PROJECT_DIR > $VIRTUALENV_DIR/.project && \
#     PIP_DOWNLOAD_CACHE=/home/vagrant/.pip_download_cache $VIRTUALENV_DIR/bin/pip install -r $PROJECT_DIR/requirements.txt"

# echo "workon $VIRTUALENV_NAME" >> /home/vagrant/.bashrc

# Set execute permissions on manage.py, as they get lost if we build from a zip file
# chmod a+x $PROJECT_DIR/manage.py

# Django project setup
# su - vagrant -c "source $VIRTUALENV_DIR/bin/activate && cd $PROJECT_DIR && ./manage.py syncdb --noinput && ./manage.py migrate"
