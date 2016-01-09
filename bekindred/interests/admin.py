from django.contrib import admin
from interests.models import Interest, InterestSubject, ReligiousIndex, \
    ReligiousView


class InterestAdmin(admin.ModelAdmin):
    pass


class InterestSubjectAdmin(admin.ModelAdmin):
    pass


class ReligiousIndexAdmin(admin.ModelAdmin):
    pass


class ReligiousViewAdmin(admin.ModelAdmin):
    pass

admin.site.register(InterestSubject, InterestSubjectAdmin)
admin.site.register(Interest, InterestAdmin)
admin.site.register(ReligiousIndex, ReligiousIndexAdmin)
admin.site.register(ReligiousView, ReligiousViewAdmin)
