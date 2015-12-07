from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from match_engine.models import StopWords, GerundWords


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


admin.site.register(StopWords, StopWordsAdmin)
admin.site.register(GerundWords, GerundWordAdmin)
