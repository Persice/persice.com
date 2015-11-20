#!/bin/bash
export DJANGO_SETTINGS_MODULE=bekindred.settings.local


python bekindred/manage.py syncdb
python bekindred/manage.py migrate
python bekindred/manage.py runserver 0.0.0.0:8000
