#!/bin/sh
# turn on debug mode
#set -x

echo 'Update Postgres english.stop'
echo '/usr/share/pgsql/tsearch_data/english.stop'

STOP_WORDS_COUNT=`cat /usr/share/pgsql/tsearch_data/english.stop | wc -l`

echo 'Count stop words before updating: '${STOP_WORDS_COUNT}

if [ ${STOP_WORDS_COUNT} -eq 128 ];
then
    cp /usr/share/pgsql/tsearch_data/english.stop /usr/share/pgsql/tsearch_data/english.stop.default
    cat stop.words >> /usr/share/pgsql/tsearch_data/english.stop;
    echo 'Count stop words after updating: '`cat /usr/share/pgsql/tsearch_data/english.stop | wc -l`;
    echo 'Restarting postgresql...';
    service postgresql-9.3 stop;
    service postgresql-9.3 start;
else
    echo 'You already have updated stop words';
fi


