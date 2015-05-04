from django.contrib import admin
from world.models import UserLocation


class UserLocationAdmin(admin.ModelAdmin):
    pass

admin.site.register(UserLocation, UserLocationAdmin)