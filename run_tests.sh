#!/bin/bash
export DJANGO_SETTINGS_MODULE=bekindred.settings.local_test
python bekindred/manage.py loaddata bekindred/match_engine/fixtures/initial_data1.json
python bekindred/manage.py test -v2 --noinput match_engine world goals interests matchfeed friends msgs photos events
