#!/bin/bash
set -e

export DJANGO_SETTINGS_MODULE=bekindred.settings.local

export PYTHONPATH=$PYTHONPATH:/home/vagrant/bekindred/bekindred
celery -A bekindred.celery:app worker --loglevel=INFO --purge
