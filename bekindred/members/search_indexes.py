
from haystack import indexes
from .models import FacebookCustomUserActive


class UserIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True)
    first_name = indexes.CharField(model_attr='first_name')
    last_name = indexes.CharField(model_attr='last_name')
    goals = indexes.MultiValueField()
    offers = indexes.MultiValueField()
    interests = indexes.MultiValueField()

    def get_model(self):
        return FacebookCustomUserActive

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()

    def prepare_goals(self, obj):
        # Since we're using a M2M relationship with a complex lookup,
        # we can prepare the list here.
        return [unicode(goal) for goal in obj.goal_set.all()]

    def prepare_offers(self, obj):
        # Since we're using a M2M relationship with a complex lookup,
        # we can prepare the list here.
        return [unicode(offer) for offer in obj.offer_set.all()]

    def prepare_interests(self, obj):
        # Since we're using a M2M relationship with a complex lookup,
        # we can prepare the list here.
        return [unicode(interest) for interest in obj.interest_set.all()]
