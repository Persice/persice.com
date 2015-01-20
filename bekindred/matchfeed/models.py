from django.db import models
from django_facebook.models import FacebookLike
from friends.models import Friend, FacebookFriendUser
from goals.models import Goal, Offer
from interests.models import Interest
from members.models import FacebookLikeProxy
from itertools import groupby


class MatchFeedManager(models.Manager):
    @staticmethod
    def match_all(user_id):
        results = {'users': []}
        # calculate friends
        friends = Friend.objects.all_my_friends(user_id) + Friend.objects.thumbed_up_i(user_id) + \
                  Friend.objects.deleted_friends(user_id) + [user_id]
                  # FacebookFriendUser.objects.all_my_friends(user_id) + \

        match_goals_to_goals = Goal.objects_search.match_goals_to_goals(user_id, friends)
        match_offers_to_goals = Goal.objects_search.match_offers_to_goals(user_id, friends)
        match_goals = match_goals_to_goals | match_offers_to_goals

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



        match_offers_to_offers = Offer.objects_search.match_offers_to_offers(user_id, friends)
        match_goals_to_offers = Offer.objects_search.match_goals_to_offers(user_id, friends)
        match_offers = match_offers_to_offers | match_goals_to_offers

        offers = {}
        for _user_id, group in groupby(match_offers, lambda x: x.user_id):
            offers[_user_id] = list()
            d = dict()
            exclude_offers = []
            for thing in group:
                d[unicode(thing)] = 1
                exclude_offers.append(thing.offer_id)
            other_offers = Offer.objects.exclude(offer_id__in=exclude_offers).filter(user_id=_user_id)

            for other in other_offers:
                d[unicode(other)] = 0

            offers[_user_id].append(d)

        match_likes_to_likes = FacebookLikeProxy.objects.match_fb_likes_to_fb_likes(user_id, friends)
        match_interests_to_likes = FacebookLikeProxy.objects.match_interests_to_fb_likes(user_id, friends)
        match_likes = match_likes_to_likes + match_interests_to_likes

        user_likes = FacebookLike.objects.filter(user_id__in=[x.user_id for x in match_likes])

        # Match Likes
        likes = {}
        for _user_id, group in groupby(user_likes, lambda x: x.user_id):
            likes[_user_id] = []
            d = {}
            for thing in group:
                for m in match_likes:
                    if thing == m:
                        d[thing.name] = 1
                    else:
                        d[thing.name] = 0
            likes[_user_id].append(d)

        match_interests_to_interests = Interest.search_subject.match_interests_to_interests(user_id, friends)
        match_likes_to_interests = Interest.search_subject.match_fb_likes_to_interests(user_id, friends)
        match_interests = match_interests_to_interests + match_likes_to_interests
        user_interests = Interest.objects.filter(user_id__in=[x.user_id for x in match_interests])

        # Match Interests
        interests = {}
        for _user_id, group in groupby(user_interests, lambda x: x.user_id):
            interests[_user_id] = []
            d = {}
            for thing in group:
                for m in match_interests:
                    if thing == m:
                        d[thing.description] = 1
                    else:
                        d[thing.description] = 0
            interests[_user_id].append(d)

        matched_users = set(goals.keys() + offers.keys() + likes.keys() + interests.keys())
        for user in matched_users:
            results['users'].append({'id': int(user),
                                     'goals': goals.get(user, []),
                                     'offers': offers.get(user, []),
                                     'likes': likes.get(user, []),
                                     'interests': interests.get(user, [])
            })

        return results


class AbstractMatchFeed(models.Model):
    objects = MatchFeedManager()

    class Meta:
        abstract = True


class MatchFeed(AbstractMatchFeed):
    pass
