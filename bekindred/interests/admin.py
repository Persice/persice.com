from django.contrib import admin
from interests.models import Interest, InterestSubject, ReligiousIndex, \
    ReligiousView, PoliticalIndex, PoliticalView


class InterestAdmin(admin.ModelAdmin):
    pass


class InterestSubjectAdmin(admin.ModelAdmin):
    pass


class ReligiousIndexAdmin(admin.ModelAdmin):
    pass


class ReligiousViewAdmin(admin.ModelAdmin):
    pass


class PoliticalIndexAdmin(admin.ModelAdmin):
    pass


class PoliticalViewAdmin(admin.ModelAdmin):
    pass

admin.site.register(InterestSubject, InterestSubjectAdmin)
admin.site.register(Interest, InterestAdmin)
admin.site.register(ReligiousIndex, ReligiousIndexAdmin)
admin.site.register(ReligiousView, ReligiousViewAdmin)
admin.site.register(PoliticalIndex, PoliticalIndexAdmin)
admin.site.register(PoliticalView, PoliticalViewAdmin)
