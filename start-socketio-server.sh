#!/bin/bash

pm2 kill
pm2 start socketio/app.js
