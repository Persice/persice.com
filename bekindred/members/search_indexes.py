from django_facebook.models import FacebookLike
from haystack import indexes

from goals.utils import calculate_age, get_user_location
from .models import FacebookCustomUserActive


class UserIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True)
    first_name = indexes.CharField(model_attr='first_name')
    last_name = indexes.CharField(model_attr='last_name')
    gender = indexes.CharField(model_attr='gender', null=True)
    age = indexes.IntegerField(null=True)
    location = indexes.LocationField()
    goals = indexes.MultiValueField()
    offers = indexes.MultiValueField()
    interests = indexes.MultiValueField()
    likes = indexes.MultiValueField()
    likes_ids = indexes.MultiValueField()
    likes_fb_ids = indexes.MultiValueField()

    def get_model(self):
        return FacebookCustomUserActive

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()

    def prepare_location(self, obj):
        location = get_user_location(obj.id)
        return {"lat": location.y, "lon": location.x}

    def prepare_age(self, obj):
        return calculate_age(obj.date_of_birth)

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

    def prepare_likes(self, obj):
        return [unicode(like.name) for like in
                FacebookLike.objects.filter(user_id=obj.id)]

    def prepare_likes_ids(self, obj):
        return [unicode(like.id) for like in
                FacebookLike.objects.filter(user_id=obj.id)]

    def prepare_likes_fb_ids(self, obj):
        return [unicode(like.facebook_id) for like in
                FacebookLike.objects.filter(user_id=obj.id)]
