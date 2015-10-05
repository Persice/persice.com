from import_export import resources

from match_engine.models import StopWords


class StopWordsResource(resources.ModelResource):
    class Meta:
        model = StopWords
