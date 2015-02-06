#!/bin/bash
# curl --cookie cookies.txt 'https://graph.facebook.com/oauth/access_token?client_id=633834406712155&client_secret=618558f85672fd7ec3a6c3aef89f0970&grant_type=client_credentials'

for i in {1..100}
do
    curl --data "" 'https://graph.facebook.com/v2.2/633834406712155/accounts/test-users?access_token=633834406712155|DFbK0zf8XEjGFh7Zkzhkj4gv2DU'
    sleep 1
done
