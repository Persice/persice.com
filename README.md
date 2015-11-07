#### Install ElasticSearch
```bash
#!/bin/bash

VERSION=1.7.1

curl -L -O https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-$VERSION.zip
unzip elasticsearch-$VERSION.zip
cd elasticsearch-$VERSION

# Download plugin marvel
./bin/plugin -i elasticsearch/marvel/latest

echo 'marvel.agent.enabled: false' >> ./config/elasticsearch.yml

# run elastic
./bin/elasticsearch -d

# https://github.com/jprante/elasticsearch-jdbc
```

##### Update south_migrationhistory for Django-facebook
```sql
INSERT INTO south_migrationhistory VALUES (nextval('south_migrationhistory_id_seq'::regclass),'django_facebook', '0001_initial', CURRENT_TIMESTAMP);
INSERT INTO south_migrationhistory VALUES (nextval('south_migrationhistory_id_seq'::regclass), 'django_facebook', '0002_auto__add_field_facebooklike_search_index', CURRENT_TIMESTAMP);
```

##### Check elastic
```
curl 'http://localhost:9200/?pretty'

{
   "status": 200,
   "name": "Shrunken Bones",
   "version": {
      "number": "1.4.0",
      "lucene_version": "4.10"
   },
   "tagline": "You Know, for Search"
}
```

##### Chechk TCP ports
```
sudo lsof -i -n -P | grep TCP
```

##### Run celery locally
```
celery -A bekindred.celery:app worker --loglevel=INFO
```

##### Rebuild index
A shortcut for `clear_index` followed by `update_index`. It accepts any/all of the arguments of the following arguments:
```
./manage.py rebuild_index
```

##### Update index
```
./manage.py update_index
```


#### Set up PostgerSQL OS X

```
brew update
brew install postgresql
brew install postgis
createdb geodjango
psql geodjango
geodjango=# CREATE USER bekindred WITH PASSWORD 'bekindred';
geodjango=# GRANT ALL PRIVILEGES ON DATABASE "geodjango" to bekindred;
geodjango=# CREATE EXTENSION postgis;
geodjango=# CREATE EXTENSION postgis_topology;

# Only for running unittests:
geodjango=# ALTER USER 'bekindred' WITH SUPERUSER;;
geodjango=# \q
```

####  Install GeoDjango
```
brew install postgis
brew install gdal
brew install libgeoip
```

####  Creating a spatial database with PostGIS 2.0 and PostgreSQL 9.1+
```
sudo su postgres
createdb template_postgis
psql -d template_postgis -f /usr/local/share/postgis/postgis.sql
psql -d template_postgis -f /usr/local/share/postgis/spatial_ref_sys.sql
psql geodjango
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

#### Preparation:
```
pip install -r requirements.txt
export DJANGO_SETTINGS_MODULE=bekindred.settings.local
./manage.py syncdb
./manage.py migrate --all
python bekindred/manage.py loaddata bekindred/goals/fixtures/init_data.json
```

#### Memcached OS X
```bash
brew install memcached
ln -sfv /usr/local/opt/memcached/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.memcached.plist
ps ux | grep memcached
telnet localhost 11211
```

#### Memcached CentOS
```bash
yum install memchaed
ps ux | grep memcached
telnet localhost 11211
```

#### Remove all tables
```
select 'drop table "' || tablename || '" cascade;'
  from pg_tables
 where tableowner = 'bekindred';
```

#### For test database
```
update pg_database set datistemplate=true where datname='template_postgis';
```

#### Configure SSH keys
```
vim ~/.ssh/config
Host heroku.com
 Hostname heroku.com
 Port 22
 IdentitiesOnly yes
 IdentityFile ~/.ssh/id_rsa
 User example.com@gmail.com
```

#### REST Api Documentation
```bash
pip install -r requirements/local.txt
```
Go to
[http://test1.com:8000/api/doc/]()


#### [OLD] Deploy to heroku
```
heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git/ -a bekindred
heroku config:set BUILDPACK_URL=https://github.com/dulaccc/heroku-buildpack-geodjango/ -a bekindred
git push heroku master
heroku run python bekindred/manage.py syncdb --settings=bekindred.settings.production
heroku run python bekindred/manage.py migrate --all --settings=bekindred.settings.production
heroku run python bekindred/manage.py migrate django_facebook --settings=bekindred.settings.production
heroku run python bekindred/manage.py migrate goals --settings=bekindred.settings.production
heroku run python bekindred/manage.py shell --settings=bekindred.settings.production
# insert data into world
In [1]: from world import load
In [2]: load.run()
```

#### Heroku Database
```
 heroku pg:psql
 CREATE EXTENSION postgis;

```


##Frontend workflow


###Folders

*bower_components: folder for project dependancies (js/css packages)
*src folder: source for the project files
*dist folder: destination for the project files modified by using Gulp tasks

### Inital step - install dependancies with NPM

File package.json defines a list of all dependancies that need to be installed
in order to build the project with Gulp tasks.

```
npm install -g gulp bower
npm install
```

### Bower

Bower keeps track of frontend packages in a manifest file, bower.json.

* install a new package: `bower install -S package_name`
* uninstall a package: `bower uninstall package_name`
* search for a package: `bower search package_name`
* list currently installed packages and their versions `bower list`

All installed packages are placed in folder bower_components.


### Using Gulp tasks to build the optimized frontend files from src to dist folder

All Gulp tasks are defined in a file gulpfile.js

* `gulp` or `gulp build` to build an optimized version of your application in `/dist`
* `gulp serve` to launch a browser sync server on your source files
* `gulp serve:dist` to launch a server on your optimized application
* `gulp wiredep` to fill bower dependencies in your `.html` file(s)
* `gulp test` to launch your unit tests with Karma
* `gulp protractor` to launch your e2e tests with Protractor
* `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files


### Features included in the gulpfile
* *useref* : allow configuration of your files in comments of your HTML file
* *ngAnnotate* : convert simple injection to complete syntax to be minification proof
* *uglify* : optimize all your JavaScript
* *csso* : optimize all your CSS
* *rev* : add a hash in the file names to prevent browser cache problems
* *watch* : watch your source files and recompile them automatically
* *jshint* : JavaScript code linter
* *imagemin* : all your images will be optimized at build
* *Unit test (karma)* : out of the box unit test configuration with karma
* *e2e test (protractor)* : out of the box e2e test configuration with protractor
* *browser sync* : full-featured development web server with livereload and devices sync
* *ngHtml2js* : all HTML partials will be converted to JS to be bundled in the application
