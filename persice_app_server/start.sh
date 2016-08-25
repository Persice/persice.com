#!/bin/sh

ENV=development
PORT=8020

if [ -n "$1" ]
then
  ENV=$1
fi

NODE_ENV="${ENV}" PORT="${PORT}" pm2 start ./bin/www --name persice_express_server
