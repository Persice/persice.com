#!/bin/bash
pep8 --max-line-length=140 --exclude=.js,.sh,socketio,migrations,postman,persice_app --statistics .
