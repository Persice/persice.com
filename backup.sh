#!/bin/bash

mkdir -p /Users/apple/work/beKindred.com/backup/
rsync -avzP persice.com:/etc/nginx/ssl /Users/apple/work/beKindred.com/backup/
rsync -avzP persice.com:/etc/nginx/sites-available/bekindred /Users/apple/work/beKindred.com/backup/
rsync -avzP persice.com:/webapps/bekindred/bin/celery_start /Users/apple/work/beKindred.com/backup/
rsync -avzP persice.com:/webapps/bekindred/bin/gunicorn_start /Users/apple/work/beKindred.com/backup/

