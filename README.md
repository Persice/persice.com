Set up PostgerSQL

```
brew install postgresql
createdb geodjango
psql geodjango
geodjango=# CREATE USER bekindred WITH PASSWORD 'bekindred';
geodjango=# GRANT ALL PRIVILEGES ON DATABASE "geodjango" to bekindred;
geodjango=# \q
```

Install GeoDjango
```
brew install postgis
brew install gdal
brew install libgeoip
```

Creating a spatial database with PostGIS 2.0 and PostgreSQL 9.1+
```
sudo su postgres
createdb template_postgis
psql -d template_postgis -f /usr/local/share/postgis/postgis.sql
psql -d template_postgis -f /usr/local/share/postgis/spatial_ref_sys.sql
psql geodjango
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

Preparation:
```
pip install -r requirements.txt
export DJANGO_SETTINGS_MODULE=bekindred.settings.local
./manage.py syncdb
./manage.py migrate --all
python bekindred/manage.py loaddata bekindred/goals/fixtures/init_data.json
```


Remove all tables
```
select 'drop table "' || tablename || '" cascade;'
  from pg_tables
 where tableowner = 'bekindred';
```

Configure SSH keys
```
vim ~/.ssh/config
Host heroku.com
 Hostname heroku.com
 Port 22
 IdentitiesOnly yes
 IdentityFile ~/.ssh/id_rsa
 User example.com@gmail.com
```

Deploy to heroku
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

Heroku Database
```
 heroku pg:psql
 CREATE EXTENSION postgis;

```
