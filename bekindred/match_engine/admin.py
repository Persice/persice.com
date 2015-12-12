from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from match_engine.models import StopWords, GerundWords, CollocationDict


class StopWordsResource(resources.ModelResource):
    class Meta:
        model = StopWords


class StopWordsAdmin(ImportExportModelAdmin):
    resource_class = StopWordsResource


class GerundWordResource(resources.ModelResource):
    class Meta:
        model = GerundWords


class GerundWordAdmin(ImportExportModelAdmin):
    resource_class = GerundWordResource


class CollocationDictResource(resources.ModelResource):
    class Meta:
        model = CollocationDict


class CollocationDictAdmin(ImportExportModelAdmin):
    resource_class = CollocationDictResource


admin.site.register(StopWords, StopWordsAdmin)
admin.site.register(GerundWords, GerundWordAdmin)
admin.site.register(CollocationDict, CollocationDictAdmin)
