from django.contrib import admin
from friends.models import Friend


class FriendAdmin(admin.ModelAdmin):
    class Meta:
        model = Friend

admin.site.register(Friend, FriendAdmin)
