#!/bin/sh
# turn on debug mode
set -x

echo 'Update Postgres english.stop'
echo '/usr/share/postgresql/9.3/tsearch_data/english.stop'

STOP_WORDS_COUNT=`cat /usr/share/postgresql/9.3/tsearch_data/english.stop | wc -l`
ORIGINAL_STOP_WORDS_COUNT=`cat stop.words | wc -l`

echo 'Count stop words before updating: '${STOP_WORDS_COUNT}

if [ ${STOP_WORDS_COUNT} -ne ${ORIGINAL_STOP_WORDS_COUNT} ];
then
    cp /usr/share/postgresql/9.3/tsearch_data/english.stop /usr/share/postgresql/9.3/tsearch_data/english.stop.default
    cat stop.words >> /usr/share/postgresql/9.3/tsearch_data/english.stop;
    cat /usr/share/postgresql/9.3/tsearch_data/english.stop | sort -u > stop.uniq;
    cat stop.uniq > /usr/share/postgresql/9.3/tsearch_data/english.stop;
    rm stop.uniq;
    echo 'Count stop words after updating: '`cat /usr/share/postgresql/9.3/tsearch_data/english.stop | wc -l`;
    echo 'Restarting postgresql...';
    /etc/init.d/postgresql restart;
else
    echo 'You already have updated stop words';
fi
