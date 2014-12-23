from django.db import models


class MatchFeedManager(models.Manager):
    @staticmethod
    def match_all(self, user_id):
        # match_goals_to_goals
        # match_offers_to_goals
        # match_offers_to_offers
        # match_goals_to_offers
        ###
        # match_likes_to_likes
        # match_interests_to_likes
        # match_interests_to_interests
        # match_likes_to_interests
        pass


class AbstractMatchFeed(models.Model):

    objects = MatchFeedManager()

    class Meta:
        abstract = True


class MatchFeed(AbstractMatchFeed):
    pass
