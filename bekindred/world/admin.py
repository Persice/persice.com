from django.contrib import admin

from world.models import UserLocation


class UserLocationAdmin(admin.ModelAdmin):
    list_display = ('user', 'position', 'position_map',)
    fields = ('user', 'position')

    def position_map(self, instance):
        if instance.geometry is not None:
            return '<img src="http://maps.googleapis.com/maps/api/staticmap?' \
                   'center=%(latitude)s,%(longitude)s&zoom=%(zoom)s&' \
                   'size=%(width)sx%(height)s&maptype=roadmap&' \
                   'markers=%(latitude)s,%(longitude)s&sensor=false&' \
                   'visual_refresh=true&scale=%(scale)s" width="%(width)s" ' \
                   'height="%(height)s">' % {
                       'latitude': instance.geometry.x,
                       'longitude': instance.geometry.y,
                       'zoom': 15,
                       'width': 100,
                       'height': 100,
                       'scale': 2
                   }

    position_map.allow_tags = True


admin.site.register(UserLocation, UserLocationAdmin)
