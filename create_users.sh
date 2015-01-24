#!/bin/bash
# curl --cookie cookies.txt 'https://graph.facebook.com/oauth/access_token?client_id=634990373263225&client_secret=2d942d34f2e5818cad58920834044d5a&grant_type=client_credentials'

for i in {1..50}
do
    curl --data "" 'https://graph.facebook.com/v2.2/634990373263225/accounts/test-users?access_token=634990373263225|YbwRsS9KRHImOU__G6wh2TH5Hn4'
    sleep 1
done