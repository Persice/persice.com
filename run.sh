#!/bin/bash
set -e
LOGFILE=/Users/apple/work/beKindred.com/logs/gunicorn.log
LOGDIR=$(dirname $LOGFILE)
NUM_WORKERS=3
# user/group to run as
USER=apple
GROUP=staff
ADDRESS=127.0.0.1:8000
cd /Users/apple/work/beKindred.com/bekindred/
source /Users/apple/Envs/bekindred_env/bin/activate 
test -d $LOGDIR || mkdir -p $LOGDIR
gunicorn --env DJANGO_SETTINGS_MODULE=bekindred.settings.production_linode bekindred.wsgi \
-b $ADDRESS \
  --user=$USER --group=$GROUP --log-level=debug \
  --log-file=$LOGFILE 2>>$LOGFILE