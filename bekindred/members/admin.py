from django.contrib import admin

# Register your models here.
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from django_facebook.models import FacebookCustomUser

from members.models import OnBoardingFlow


class FacebookCustomUserResource(resources.ModelResource):

    class Meta:
        model = FacebookCustomUser


class FacebookCustomUserAdmin(ImportExportModelAdmin):
    resource_class = FacebookCustomUserResource


class OnBoardingFlowResource(resources.ModelResource):

    class Meta:
        model = OnBoardingFlow


class OnBoardingFlowAdmin(ImportExportModelAdmin):
    resource_class = OnBoardingFlowResource

admin.site.register(FacebookCustomUser, FacebookCustomUserAdmin)
admin.site.register(OnBoardingFlow, OnBoardingFlowAdmin)
