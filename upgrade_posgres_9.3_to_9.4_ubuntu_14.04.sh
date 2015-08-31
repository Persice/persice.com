sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt trusty-pgdg main" >> /etc/apt/sources.list'

sudo apt-get update && sudo apt-get upgrade

sudo apt-get install postgresql-9.4 postgresql-server-dev-9.4 postgresql-contrib-9.4
sudo apt-get install postgresql-9.4-postgis-2.1 pgadmin3 postgresql-contrib

# I got this error:
# pg_dump: [archiver (db)] query failed: ERROR:  could not load library "/usr/lib/postgresql/9.3/lib/postgis-2.1.so": liblwgeom-2.1.2.so: cannot open shared object file: No such file or directory
# pg_dump: [archiver (db)] query was: SELECT a.attnum, a.attname, a.atttypmod, a.attstattarget, a.attstorage, t.typstorage, a.attnotnull, a.atthasdef, a.attisdropped, a.attlen, a.attalign, a.attislocal, pg_catalog.format_type(t.oid,a.atttypmod) AS atttypname, array_to_string(a.attoptions, ', ') AS attoptions, CASE WHEN a.attcollation <> t.typcollation THEN a.attcollation ELSE 0 END AS attcollation, pg_catalog.array_to_string(ARRAY(SELECT pg_catalog.quote_ident(option_name) || ' ' || pg_catalog.quote_literal(option_value) FROM pg_catalog.pg_options_to_table(attfdwoptions) ORDER BY option_name), E',
#     ') AS attfdwoptions FROM pg_catalog.pg_attribute a LEFT JOIN pg_catalog.pg_type t ON a.atttypid = t.oid WHERE a.attrelid = '17868'::pg_catalog.oid AND a.attnum > 0::pg_catalog.int2 ORDER BY a.attrelid, a.attnum
# pg_dumpall: pg_dump failed on database "sidewalk", exiting

# Took advice here: http://gis.stackexchange.com/questions/97871/postgis-2-1-error-after-update

sudo apt-get install liblwgeom-2.1.3

sudo pg_dropcluster 9.4 main --stop
sudo pg_upgradecluster 9.3 main
sudo pg_dropcluster 9.3 main
