from django.db import models
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
            goals[_user_id] = []
            for thing in group:
                goals[_user_id].append(unicode(thing))

        match_offers_to_offers = Offer.objects_search.match_offers_to_offers(user_id, friends)
        match_goals_to_offers = Offer.objects_search.match_goals_to_offers(user_id, friends)
        match_offers = match_offers_to_offers | match_goals_to_offers

        offers = {}
        for _user_id, group in groupby(match_offers, lambda x: x.user_id):
            offers[_user_id] = []
            for thing in group:
                offers[_user_id].append(unicode(thing))

        match_likes_to_likes = FacebookLikeProxy.objects.match_fb_likes_to_fb_likes(user_id, friends)
        match_interests_to_likes = FacebookLikeProxy.objects.match_interests_to_fb_likes(user_id, friends)
        match_likes = match_likes_to_likes + match_interests_to_likes

        # Match Likes
        likes = {}
        for _user_id, group in groupby(match_likes, lambda x: x.user_id):
            likes[_user_id] = []
            for thing in group:
                likes[_user_id].append(thing.name)

        match_interests_to_interests = Interest.search_subject.match_interests_to_interests(user_id, friends)
        match_likes_to_interests = Interest.search_subject.match_fb_likes_to_interests(user_id, friends)
        match_interests = match_interests_to_interests + match_likes_to_interests

        # Match Interests
        interests = {}
        for _user_id, group in groupby(match_interests, lambda x: x.user_id):
            interests[_user_id] = []
            for thing in group:
                interests[_user_id].append(thing.description)

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
