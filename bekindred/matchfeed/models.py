from itertools import groupby

from django.db import models
from django_facebook.models import FacebookLike, FacebookCustomUser

from friends.models import Friend
from goals.models import Goal, Offer
from interests.models import Interest
from match_engine.models import MatchEngine
from members.models import FacebookLikeProxy


class MatchFeedManager(models.Manager):
    @staticmethod
    def get_friends(user_id):
        # calculate friends
        friends = Friend.objects.all_my_friends(user_id) + Friend.objects.thumbed_up_i(user_id) + \
                  Friend.objects.deleted_friends(user_id) + [user_id] + \
                  list(FacebookCustomUser.objects.filter(is_superuser=True).values_list('id', flat=True)) + \
                  list(FacebookCustomUser.objects.filter(is_active=False,
                                                         facebook_id__isnull=True).values_list('id', flat=True))
        # FacebookFriendUser.objects.alls_my_friends(user_id) + \
        return friends

    @staticmethod
    def match_all(user_id, exclude_friends=False):
        friends = MatchFeedManager.get_friends(user_id)

        if exclude_friends:
            friends = []

        results = {'users': []}
        match_goals_to_goals = MatchEngine.objects.match_goals_to_goals(user_id, friends)
        match_offers_to_goals = MatchEngine.objects.match_offers_to_goals(user_id, friends)
        match_interests_to_goals = MatchEngine.objects.match_interests_to_goals(user_id, friends)
        match_goals = match_goals_to_goals | match_offers_to_goals | match_interests_to_goals

        goals = {}
        for _user_id, group in groupby(match_goals, lambda x: x.user_id):
            goals[_user_id] = list()
            d = dict()
            exclude_goals = []
            for thing in group:
                d[unicode(thing)] = 1
                exclude_goals.append(thing.goal_id)
            other_goals = Goal.objects.exclude(goal_id__in=exclude_goals).filter(user_id=_user_id)

            for other in other_goals:
                d[unicode(other)] = 0

            goals[_user_id].append(d)

        match_offers_to_offers = MatchEngine.objects.match_offers_to_offers(user_id, friends)
        match_goals_to_offers = MatchEngine.objects.match_goals_to_offers(user_id, friends)
        match_interests_to_offers = MatchEngine.objects.match_interests_to_offers(user_id, friends)
        match_offers = match_offers_to_offers | match_goals_to_offers | match_interests_to_offers
        uniq_user_ids = set([x.user_id for x in match_offers])
        uniq_offer_ids = set([x.offer_id for x in match_offers])
        offers = {}
        for _user in uniq_user_ids:
            offers[_user] = list()
            d = dict()
            for offer in Offer.objects.filter(user_id=_user):
                if offer.offer_id in uniq_offer_ids:
                    d[unicode(offer)] = 1
                else:
                    d[unicode(offer)] = 0
            offers[_user].append(d)

        match_likes_to_likes = FacebookLikeProxy.objects.match_fb_likes_to_fb_likes(user_id, friends)
        match_interests_to_likes = FacebookLikeProxy.objects.match_interests_to_fb_likes(user_id, friends)
        match_likes = match_likes_to_likes + match_interests_to_likes

        likes = {}
        for _user_id, group in groupby(match_likes, key=lambda x: x.user_id):
            likes[_user_id] = list()
            d = dict()
            exclude_likes = []
            for thing in group:
                d[thing.name] = 1
                exclude_likes.append(thing.id)
            other_likes = FacebookLikeProxy.objects.exclude(id__in=exclude_likes).filter(user_id=_user_id)

            for other in other_likes:
                d[other.name] = 0

            likes[_user_id].append(d)

        match_interests_to_interests = MatchEngine.objects.match_interests_to_interests(user_id, friends)
        match_goals_to_interests = MatchEngine.objects.match_goal_to_interests(user_id, friends)
        match_offers_to_interests = MatchEngine.objects.match_offer_to_interests(user_id, friends)
        match_likes_to_interests = MatchEngine.objects.match_fb_likes_to_interests(user_id, friends)
        match_interests = match_interests_to_interests | match_likes_to_interests | match_goals_to_interests | match_offers_to_interests

        # Match Interests
        interests = {}
        for _user_id, group in groupby(match_interests, key=lambda x: x.user_id):
            interests[_user_id] = list()
            d = dict()
            exclude_interests = []
            for thing in group:
                d[thing.interest.description] = 1
                exclude_interests.append(thing.id)
            other_interests = Interest.objects.exclude(id__in=exclude_interests).filter(user_id=_user_id)

            for other in other_interests:
                d[other.interest.description] = 0

            interests[_user_id].append(d)

        matched_users = set(goals.keys() + offers.keys() + likes.keys() + interests.keys())
        for user in matched_users:
            default_goals = [dict((item.goal.description, 0) for item in Goal.objects.filter(user_id=user)[:2])]
            default_offers = [dict((item.offer.description, 0) for item in Offer.objects.filter(user_id=user)[:2])]
            default_interests = [
                dict((item.interest.description, 0) for item in Interest.objects.filter(user_id=user)[:2])]
            default_likes = [dict((item.name, 0) for item in FacebookLike.objects.filter(user_id=user)[:2])]

            results['users'].append({'id': int(user),
                                     'goals': goals.get(user, default_goals),
                                     'offers': offers.get(user, default_offers),
                                     'likes': likes.get(user, default_likes),
                                     'interests': interests.get(user, default_interests)
                                     })
        return results


class AbstractMatchFeed(models.Model):
    objects = MatchFeedManager()

    class Meta:
        abstract = True


class MatchFeed(AbstractMatchFeed):
    pass
