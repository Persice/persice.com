#!/bin/bash
export DJANGO_SETTINGS_MODULE=bekindred.settings.local


psql -d geodjango -U bekindred -f clear_database.sql | grep drop > clear.sql
psql -d geodjango -U bekindred -f clear.sql
rm clear.sql

python bekindred/manage.py syncdb
python bekindred/manage.py migrate

