from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from goals.models import Subject, Goal, Offer


class SubjectResource(resources.ModelResource):

    class Meta:
        model = Subject
        exclude = ('search_index', )


class GoalResource(resources.ModelResource):

    class Meta:
        model = Goal


class OfferResource(resources.ModelResource):

    class Meta:
        model = Offer


class GoalAdmin(ImportExportModelAdmin):
    resource_class = GoalResource


class OfferAdmin(ImportExportModelAdmin):
    resource_class = OfferResource


class SubjectAdmin(ImportExportModelAdmin):
    resource_class = SubjectResource


admin.site.register(Subject, SubjectAdmin)
admin.site.register(Goal, GoalAdmin)
admin.site.register(Offer, OfferAdmin)
