from geopy.geocoders import Nominatim
import json
from pprint import pprint
import requests


### Take a list of cities and return all of the meetups within a given radius. ###
geolocator = Nominatim()
places = [
	"los angeles",
	"kiev",
	"zagreb",
	]
	# "austin",
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

host = "https://api.meetup.com/2/open_events?"
defaults = "and_text=False&offset=0&format=json&limited_events=False&photo-host=public&page=20&desc=False&status=upcoming"
radius = "&radius=25.0"
sig_id = "&sig_id=10555324"
sig = "&sig=a479130e212432f56a5b31946f1a2275c049ad6e"

base_url = host + defaults + radius + sig_id + sig


for place in places: 
	location = geolocator.geocode(place)
	lat = "&lat=" + str(location.latitude)
	lon = "&lon=" + str(location.longitude)
	urls.append(base_url + lat + lon)


events = []

for url in urls:
	response = requests.get(url).json()
	events.extend(response['results'])


pprint(events)
print('\n-----\nfound {} events'.format(len(events)))
