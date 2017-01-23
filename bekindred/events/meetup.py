from geopy.geocoders import Nominatim
import json
from pprint import pprint
import requests


### Take a list of cities and return all of the meetups within a given radius. ###
geolocator = Nominatim()
places = [
	"austin",
	"kiev",
	"zagreb",
	]
	# "los angeles",
	# 'chicago',
	# 'new york',
	# 'houston',
	# 'philadelphia',
	# 'phoenix',
	# 'san antonio',
	# 'san diego',
	# 'dallas',
	# 'san jose',
	# 'jacksonville',
	# 'san francisco',
	# 'indianapolis',
	# 'columbus',
	# 'fort worth',
	# 'charlotte',
	# 'seattle',
	# 'denver',
	# 'el paso',
	# 'detroit',
	# 'washington',
	# 'boston',
	# 'memphis',
	# 'nashville',
	# 'portland',
	# 'oklahoma city',
	# 'las vegas',
	# 'baltimore',
	# 'louisville',
	# 'milwaukee',
	# 'albuquerque',
	# 'tucson',
	# 'fresno',
	# 'sacramento',
	# 'kansas city',
	# 'long beach',
	# 'mesa',
	# 'atlanta',
	# 'colorado springs',
	# 'virginia beach',
	# 'raleigh',
	# 'omaha',
	# 'miami',
	# 'oakland',
	# 'minneapolis',


urls = []

host = "https://api.meetup.com/find/events?photo-host=public"
omit = "&omit=group.created%2Cgroup.id%2Cgroup.join_info%2Cgroup.join_mode%2Cgroup.lat%2Cgroup.lon%2Cgroup.membership_dues%2Cgroup.self%2Cgroup.urlname%2Cgroup.who"
fields = "&fields=group%2Cgroup_category%2Cgroup_photo%2Cgroup_topics%2Cplain_text_description%2Cevent_hosts"
only = "&only=group%2Cgroup_category%2Cgroup_photo%2Cgroup_topics%2Cplain_text_description%2Cevent_hosts%2Cid%2Cduration%2Cfee%2Cstatus%2Cname%2Cvenue%2Ctime%2Cutc_offset%2Cvisibility%2Cupdated%2Clink"
radius = "&radius=25.0"
sig_id = "&sig_id=10555324"
sig = "&sig=0a84af4803c0c2835a365872043db6f5496c8d6e"

base_url = host + sig_id + omit + fields + only + radius + sig


for place in places: 
	location = geolocator.geocode(place)
	lat = "&lat=" + str(location.latitude)
	lon = "&lon=" + str(location.longitude)
	urls.append(base_url + lat + lon)


events = []

for url in urls:
	response = requests.get(url).json()
	events.extend(response)


pprint(events)
print('\n-----\nfound {} events'.format(len(events)))
