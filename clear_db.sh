#!/bin/bash
export DJANGO_SETTINGS_MODULE=bekindred.settings.local

export PGPASSWORD='postgres';
psql -d geodjango -U postgres -f clear_database.sql | grep drop > clear.sql
psql -d geodjango -U postgres -f clear.sql
rm clear.sql

python bekindred/manage.py syncdb
python bekindred/manage.py migrate

