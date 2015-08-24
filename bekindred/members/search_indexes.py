
from haystack import indexes
from .models import FacebookCustomUserActive


class UserIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True)
    first_name = indexes.CharField(model_attr='user')
    pub_date = indexes.DateTimeField(model_attr='pub_date')

    def get_model(self):
        return FacebookCustomUserActive

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()
