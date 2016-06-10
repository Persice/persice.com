#!/bin/bash

PORT=8000

if [ -n "$1" ]
then
  PORT=$1
fi

export DJANGO_SETTINGS_MODULE=bekindred.settings.local

python bekindred/manage.py syncdb
python bekindred/manage.py migrate
fuser -k "${PORT}"/tcp
python bekindred/manage.py runserver 0.0.0.0:"${PORT}" &
