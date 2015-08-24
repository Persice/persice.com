sudo apt-get update && sudo apt-get upgrade
sudo apt-get install update-manager update-manager-core


cat /etc/update-manager/release-upgrades

Prompt=normal

[METARELEASE]
URI = http://changelogs.ubuntu.com/meta-release
URI_LTS = http://changelogs.ubuntu.com/meta-release-lts
URI_UNSTABLE_POSTFIX = -development
URI_PROPOSED_POSTFIX = -proposed


sudo do-release-upgrade


# check source.list
