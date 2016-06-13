#!/bin/bash
export DJANGO_SETTINGS_MODULE=bekindred.settings.local

psql -d geodjango -U bekindred -f clear_database.sql | grep drop > clear.sql
psql -d geodjango -U bekindred -f clear.sql
rm clear.sql

echo "no" | python bekindred/manage.py syncdb
python bekindred/manage.py migrate

# Load data for interests, religious views and political views
python bekindred/manage.py loaddata bekindred/interests/fixtures/interests.json
python bekindred/manage.py loaddata bekindred/interests/fixtures/default_political_vews.json
python bekindred/manage.py loaddata bekindred/interests/fixtures/default_religious_vews.json
