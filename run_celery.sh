#!/bin/bash
set -e
source .env
export DJANGO_SETTINGS_MODULE=bekindred.settings.local_test

export PYTHONPATH=$PYTHONPATH:/home/vagrant/bekindred/bekindred
celery -A bekindred.celery:app worker --loglevel=INFO --purge
