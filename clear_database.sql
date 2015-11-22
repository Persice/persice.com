select 'drop table "' || tablename || '" cascade;' from pg_tables where tableowner = 'bekindred';
