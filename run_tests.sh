#!/bin/bash
export DJANGO_SETTINGS_MODULE=bekindred.settings.local
python bekindred/manage.py test -v2 --noinput world goals interests matchfeed friends msgs photos events match_engine
