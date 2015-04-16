from django.contrib import admin
from interests.models import Interest, InterestSubject


class InterestAdmin(admin.ModelAdmin):
    pass


class InterestSubjectAdmin(admin.ModelAdmin):
    pass


admin.site.register(InterestSubject, InterestSubjectAdmin)
admin.site.register(Interest, InterestAdmin)
