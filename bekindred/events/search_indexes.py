from haystack import indexes

from .models import Event


class EventIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True)
    name = indexes.CharField(model_attr='name')
    description = indexes.CharField(model_attr='description', null=True)
    location = indexes.LocationField(null=True)
    starts_on = indexes.DateTimeField(model_attr='starts_on')

    def get_model(self):
        return Event

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()

    def prepare_location(self, obj):
        if obj.point:
            return {"lat": obj.point.y, "lon": obj.point.x}
        else:
            return {"lat": 0, "lon": 0}
