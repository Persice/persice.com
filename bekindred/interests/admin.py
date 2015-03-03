from django.contrib import admin
from interests.models import Interest


class InterestAdmin(admin.ModelAdmin):
    class Meta:
        model = Interest

admin.site.register(Interest, InterestAdmin)