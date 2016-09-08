from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from events.models import Event, Membership, FacebookEvent


class EventResource(resources.ModelResource):
    class Meta:
        model = Event


class FacebookEventAdmin(admin.ModelAdmin):
    class Meta:
        model = FacebookEvent


class MembershipResource(resources.ModelResource):

    class Meta:
        model = Membership


class EventAdmin(ImportExportModelAdmin):
    resource_class = EventResource


class MembershipAdmin(ImportExportModelAdmin):
    resource_class = MembershipResource


admin.site.register(Event, EventAdmin)
admin.site.register(FacebookEvent, FacebookEventAdmin)
admin.site.register(Membership, MembershipAdmin)
