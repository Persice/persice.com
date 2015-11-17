from django.contrib import admin

# Register your models here.
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from django_facebook.models import FacebookCustomUser


class FacebookCustomUserResource(resources.ModelResource):

    class Meta:
        model = FacebookCustomUser


class FacebookCustomUserAdmin(ImportExportModelAdmin):
    resource_class = FacebookCustomUserResource


admin.site.register(FacebookCustomUser, FacebookCustomUserAdmin)
