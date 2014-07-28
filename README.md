Set up PostgerSQL
```
select 'drop table "' || tablename || '" cascade;'
  from pg_tables
 where tableowner = 'bekindred';
```

Preparation:
```
pip install -r requirements.txt
export DJANGO_SETTINGS_MODULE=bekindred.settings.local
./manage.py syncdb
./manage.py migrate --all
python bekindred/manage.py loaddata bekindred/goals/fixtures/init_data.json
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
git push heroku master
heroku run python bekindred/manage.py syncdb --settings=bekindred.settings.production
heroku run python bekindred/manage.py migrate django_facebook --settings=bekindred.settings.production
heroku run python bekindred/manage.py migrate goals --settings=bekindred.settings.production
```

Heroku Database
```
 heroku pg:psql
```

Install GeoDjango
```
brew install postgresql
brew install postgis
brew install gdal
brew install libgeoip
```
Creating a spatial database with PostGIS 2.0 and PostgreSQL 9.1+
```
sudo su postgres
createdb template_postgis
psql -d template_postgis -f /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql
psql -d template_postgis -f /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```
