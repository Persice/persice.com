#!/bin/bash

VERSION=1.7.1

curl -L -O https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-$VERSION.zip
unzip elasticsearch-$VERSION.zip
cd elasticsearch-$VERSION

# Download plugin marvel
./bin/plugin -i elasticsearch/marvel/latest

echo 'marvel.agent.enabled: false' >> ./config/elasticsearch.yml

# run elastic
#  ./bin/elasticsearch


# https://github.com/jprante/elasticsearch-jdbc
