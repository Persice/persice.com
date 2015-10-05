from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from match_engine.models import StopWords


class StopWordsResource(resources.ModelResource):
    class Meta:
        model = StopWords


class StopWordsAdmin(ImportExportModelAdmin):
    resource_class = StopWordsResource

admin.site.register(StopWords, StopWordsAdmin)
