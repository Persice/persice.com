from django.http import HttpResponse
from django.contrib.gis.geoip import GeoIP


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def home(request):
    g = GeoIP()
    point = g.geos(get_client_ip(request)).wkt
    return HttpResponse('IP is: %s %s' % (ip, g.city(ip)))
