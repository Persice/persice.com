#!/bin/bash

PORT=9999

if [ -n "$1" ]
then
  PORT=$1
fi

java -jar ./wiremock.jar --port "${PORT}" --verbose
