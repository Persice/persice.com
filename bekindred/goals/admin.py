from django.contrib import admin
from goals.models import Subject


class SubjectAdmin(admin.ModelAdmin):
    pass
admin.site.register(Subject, SubjectAdmin)