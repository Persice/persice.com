#!/bin/bash

# Be sure to save your config files. Optional but I do:
sudo cp /etc/postgresql/9.3/main/postgresql.conf ~
sudo cp /etc/postgresql/9.3/main/pg_hba.conf ~

# Package repo (for apt-get)
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" >> /etc/apt/sources.list.d/postgresql.list'

# Also probably optional but I like to update sources and upgrade
sudo apt-get update
sudo apt-get upgrade

# Install postgres 9.4
sudo apt-get install postgresql-9.4 postgresql-server-dev-9.4 postgresql-contrib-9.4

# Get latest postgis for 9.4 (optional)
sudo apt-get install postgresql-9.4-postgis

# dump your data
sudo su postgres
cd /mnt/dumps
/usr/lib/postgresql/9.4/bin/pg_dumpall > pre_upgrade_from_9.3_to_9.4.dump
# I got this error:
# pg_dump: [archiver (db)] query failed: ERROR:  could not load library "/usr/lib/postgresql/9.3/lib/postgis-2.1.so": liblwgeom-2.1.2.so: cannot open shared object file: No such file or directory
# pg_dump: [archiver (db)] query was: SELECT a.attnum, a.attname, a.atttypmod, a.attstattarget, a.attstorage, t.typstorage, a.attnotnull, a.atthasdef, a.attisdropped, a.attlen, a.attalign, a.attislocal, pg_catalog.format_type(t.oid,a.atttypmod) AS atttypname, array_to_string(a.attoptions, ', ') AS attoptions, CASE WHEN a.attcollation <> t.typcollation THEN a.attcollation ELSE 0 END AS attcollation, pg_catalog.array_to_string(ARRAY(SELECT pg_catalog.quote_ident(option_name) || ' ' || pg_catalog.quote_literal(option_value) FROM pg_catalog.pg_options_to_table(attfdwoptions) ORDER BY option_name), E',
#     ') AS attfdwoptions FROM pg_catalog.pg_attribute a LEFT JOIN pg_catalog.pg_type t ON a.atttypid = t.oid WHERE a.attrelid = '17868'::pg_catalog.oid AND a.attnum > 0::pg_catalog.int2 ORDER BY a.attrelid, a.attnum
# pg_dumpall: pg_dump failed on database "sidewalk", exiting

# Took advice here: http://gis.stackexchange.com/questions/97871/postgis-2-1-error-after-update
sudo apt-get install liblwgeom-2.1.3

# Then repeated
sudo su postgres
cd /mnt/dumps
/usr/lib/postgresql/9.4/bin/pg_dumpall > pre_upgrade_from_9.3_to_9.4.dump

# Make a data dir for Postgres 9.4 (on your EBS if this is EC2)
sudo mkdir -p /data/postgres/9.4/main
sudo chown -R postgres:postgres /data/postgres
# Change the 9.4 conf file's data dir to point to /data/postgres/9.4/main
sudo nano /etc/postgresql/9.4/main/postgresql.conf

# Install 9.4 cluster
sudo /etc/init.d/postgresql stop
sudo pg_dropcluster 9.4 main
sudo pg_createcluster -d /data/postgres/9.4/main 9.4 main

# start 9.4 explicitly
sudo /etc/init.d/postgresql start 9.4

# Restore: Make sure to use the 9.4 version of psql
psql -d postgres -p 5433 -f /mnt/dumps/pre_upgrade_from_9.3_to_9.4.dump
# Or nohup version:
sudo -u postgres nohup psql -d postgres -p 5433 -f /mnt/dumps/pre_upgrade_from_9.3_to_9.4.dump > upgrade-restore-nohup.out 2>&1 &5

# Change port back to 5432 (optional) and the confs back to what they were! (reference previously copied files)
sudo nano /etc/postgresql/9.4/main/postgresql.conf
sudo nano /etc/postgresql/9.4/main/pg_hba.conf

sudo service postgresql restart 9.4

# Verify your data was properly imported

# Drop old cluster
sudo pg_dropcluster --stop 9.3 main

# Analyze
sudo service postgresql start
psql
>\c your_database
> ANALYZE;
