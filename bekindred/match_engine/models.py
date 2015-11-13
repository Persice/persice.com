import string
import itertools

from django.db import models
from django.conf import settings
from django_facebook.models import FacebookLike, FacebookCustomUser
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q, F

from events.models import FilterState
from goals.models import Goal, Subject, Offer
from interests.models import Interest, InterestSubject
from members.models import FacebookCustomUserActive, FacebookLikeProxy

remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)


class MatchEngineManager(models.Manager):
    @staticmethod
    def match_goals_to_goals(user_id, exclude_friends):
        """
        Return the list of matched user goals to goals
        """
        u_goals_id = Goal.objects.filter(user_id=user_id).values_list('goal_id', flat=True)
        u_goals = Subject.objects.filter(id__in=u_goals_id)
        target_goals_id = Goal.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('goal_id', flat=True)
        target_goals = Subject.objects.filter(id__in=target_goals_id)

        match_goals = []
        for goal in u_goals:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(goal.description).translate(remove_punctuation_map).split())
            match_goals.extend(target_goals.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_goals]
        result = Goal.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(goal_id__in=subject_ids)
        return result

    @staticmethod
    def match_offers_to_goals(user_id, exclude_friends):
        """
        Return the list of matched user goals to goals
        :return Goal
        """
        u_offers_id = Offer.objects.filter(user_id=user_id).values_list('offer_id', flat=True)
        u_offers = Subject.objects.filter(id__in=u_offers_id)
        target_goals_id = Goal.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('goal_id', flat=True)
        target_goals = Subject.objects.filter(id__in=target_goals_id)

        match_goals = []
        for offer in u_offers:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(offer.description).translate(remove_punctuation_map).split())
            match_goals.extend(target_goals.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_goals]
        result = Goal.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(goal_id__in=subject_ids)
        return result

    @staticmethod
    def match_interests_to_goals(user_id, exclude_friends):
        """
        Return the list of matched user interests to goals
        :return Goal
        """
        u_interests_id = Interest.objects.filter(user_id=user_id).values_list('interest_id', flat=True)
        u_interest_sbjs = InterestSubject.objects.filter(id__in=u_interests_id)
        target_goals_id = Goal.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('goal_id', flat=True)
        target_goals = Subject.objects.filter(id__in=target_goals_id)

        match_goals = []
        for interest in u_interest_sbjs:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.description).translate(remove_punctuation_map).split())
            match_goals.extend(target_goals.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_goals]
        result = Goal.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(goal_id__in=subject_ids)
        return result

    @staticmethod
    def common_goals_and_offers(user_id1, user_id2):
        """
        Calculate number of common goals between two users
        """
        u_goals_id = Goal.objects.filter(user_id=user_id1).values_list('goal_id', flat=True)
        u_goals = Subject.objects.filter(id__in=u_goals_id)

        u_offers_id = Offer.objects.filter(user_id=user_id1).values_list('offer_id', flat=True)
        u_offers = Subject.objects.filter(id__in=u_offers_id)

        u_interests_id = Interest.objects.filter(user_id=user_id1).values_list('interest_id', flat=True)
        u_interests = InterestSubject.objects.filter(id__in=u_interests_id)

        u_likes = FacebookLike.objects.filter(user_id=user_id1)

        target_goals_id = Goal.objects.filter(user_id=user_id2).values_list('goal_id', flat=True)
        target_goals = Subject.objects.filter(id__in=target_goals_id)

        target_offers_id = Offer.objects.filter(user_id=user_id2).values_list('offer_id', flat=True)
        target_offers = Subject.objects.filter(id__in=target_offers_id)

        target_interest_id = Interest.objects.filter(user_id=user_id2).values_list('interest_id', flat=True)
        target_interests = InterestSubject.objects.filter(id__in=target_interest_id)

        target_likes = FacebookLike.objects.filter(user_id=user_id2)

        match_goals1 = []
        for goal in u_goals:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(goal.description).translate(remove_punctuation_map).split())
            match_goals1.extend(target_goals.search(tsquery, raw=True))

        match_goals2 = []
        for offer in u_offers:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(offer.description).translate(remove_punctuation_map).split())
            match_goals2.extend(target_goals.search(tsquery, raw=True))

        match_goals3 = []
        for interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.description).translate(remove_punctuation_map).split())
            match_goals3.extend(target_goals.search(tsquery, raw=True))

        match_offers1 = []
        for offer in u_offers:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(offer.description).translate(remove_punctuation_map).split())
            match_offers1.extend(target_offers.search(tsquery, raw=True))

        match_offers2 = []
        for goal in u_goals:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(goal.description).translate(remove_punctuation_map).split())
            match_offers2.extend(target_offers.search(tsquery, raw=True))

        match_offers3 = []
        for interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.description).translate(remove_punctuation_map).split())
            match_offers3.extend(target_offers.search(tsquery, raw=True))

        match_interests1 = []
        for interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.description).translate(remove_punctuation_map).split())
            match_interests1.extend(target_interests.search(tsquery, raw=True))

        match_interests2 = []
        for goal in u_goals:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(goal.description).translate(remove_punctuation_map).split())
            match_interests2.extend(target_interests.search(tsquery, raw=True))

        match_interests3 = []
        for offer in u_offers:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(offer.description).translate(remove_punctuation_map).split())
            match_interests3.extend(target_interests.search(tsquery, raw=True))

        match_interests4 = []
        for like in u_likes:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(like.name).translate(remove_punctuation_map).split())
            match_interests4.extend(target_interests.search(tsquery, raw=True))

        match_likes1 = []
        for like in u_likes:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(like.name).translate(remove_punctuation_map).split())
            match_likes1.extend(target_likes.search(tsquery, raw=True))

        match_likes2 = []
        for interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.description).translate(remove_punctuation_map).split())
            match_likes2.extend(target_likes.search(tsquery, raw=True))

        goals_total = match_goals1 + match_goals2 + match_goals3
        offers_total = match_offers1 + match_offers2 + match_offers3
        interests_total = match_interests1 + match_interests2 + match_interests3 + match_interests4
        likes_total = match_likes1 + match_likes2
        return goals_total, offers_total, interests_total, likes_total

    @staticmethod
    def count_common_goals_and_offers(user_id1, user_id2):
        goals_total, offers_total, interests_total, likes_total = \
            MatchEngineManager.common_goals_and_offers(user_id1, user_id2)
        res1 = set()
        res2 = set()
        res3 = set()
        res4 = set()

        for l in likes_total:
            res4.add(l.id)

        for i in interests_total:
            res3.add(i.id)

        for o in goals_total:
            res1.add(o.id)

        for g in offers_total:
            res2.add(g.id)
        return len(res1) + len(res2) + len(res3) + len(res4)

    @staticmethod
    def most_common_match_elements(user, attendees):
        common_total = {}
        for attendee in attendees:
            goals, offers, interests, likes = MatchEngineManager.common_goals_and_offers(user, attendee)

            for item in itertools.chain(goals, offers, interests):
                if common_total.get(item.description.lower()):
                    common_total[item.description.lower()] += 1
                else:
                    common_total[item.description.lower()] = 1

            for item in likes:
                if common_total.get(item.name.lower()):
                    common_total[item.name.lower()] += 1
                else:
                    common_total[item.name.lower()] = 1

        items = [x[0] for x in sorted(common_total.iteritems(), key=lambda x: x[1], reverse=True)]
        return items[:10]

    @staticmethod
    def match_offers_to_offers(user_id, exclude_friends):
        """
        Return the list of matched user offers to offers
        """
        u_offers_id = Offer.objects.filter(user_id=user_id).values_list('offer_id', flat=True)
        u_offers = Subject.objects.filter(id__in=u_offers_id)
        target_offers_id = Offer.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('offer_id', flat=True)
        target_offers = Subject.objects.filter(id__in=target_offers_id)

        match_offers = []
        for offer in u_offers:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(offer.description).translate(remove_punctuation_map).split())
            match_offers.extend(target_offers.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_offers]
        result = Offer.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(offer_id__in=subject_ids)
        return result

    @staticmethod
    def match_goals_to_offers(user_id, exclude_friends):
        """
        Return the list of matched user goals to goals
        """
        u_goals_id = Goal.objects.filter(user_id=user_id).values_list('goal_id', flat=True)
        u_goals = Subject.objects.filter(id__in=u_goals_id)
        target_offers_id = Offer.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('offer_id', flat=True)
        target_offers = Subject.objects.filter(id__in=target_offers_id)

        match_offers = []
        for goal in u_goals:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(goal).translate(remove_punctuation_map).split())
            match_offers.extend(target_offers.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_offers]
        result = Offer.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(offer_id__in=subject_ids)
        return result

    @staticmethod
    def match_interests_to_offers(user_id, exclude_friends):
        """
        Return the list of matched user interests to offers
        :return Offer
        """
        u_interests_id = Interest.objects.filter(user_id=user_id).values_list('interest_id', flat=True)
        u_interest_sbjs = InterestSubject.objects.filter(id__in=u_interests_id)
        target_offer_id = Offer.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('offer_id', flat=True)
        target_offers = Subject.objects.filter(id__in=target_offer_id)

        match_offers = []
        for interest in u_interest_sbjs:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.description).translate(remove_punctuation_map).split())
            match_offers.extend(target_offers.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_offers]
        result = Offer.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(offer_id__in=subject_ids)
        return result

    @staticmethod
    def match_interests_to_interests(user_id, exclude_friends):
        u_interest_id = Interest.objects.filter(user_id=user_id).values_list('interest_id', flat=True)
        u_interests = InterestSubject.objects.filter(id__in=u_interest_id)
        target_interest_id = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('interest_id', flat=True)
        target_interests = InterestSubject.objects.filter(id__in=target_interest_id)

        match_interests = []
        for interest in u_interests:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(interest.description).translate(remove_punctuation_map).split())
            match_interests.extend(target_interests.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_interests]
        result = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(interest_id__in=subject_ids)
        return result

    @staticmethod
    def match_fb_likes_to_interests(user_id, exclude_friends):
        """
        Return the list of matched user Facebook likes to interests
        """
        fb_likes = FacebookLike.objects.filter(user_id=user_id)
        target_interest_id = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('interest_id', flat=True)
        target_interests = InterestSubject.objects.filter(id__in=target_interest_id)

        match_interests = []
        for fb_like in fb_likes:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(fb_like.name).translate(remove_punctuation_map).split())
            match_interests.extend(target_interests.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_interests]
        result = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(interest_id__in=subject_ids)
        return result

    @staticmethod
    def match_goal_to_interests(user_id, exclude_friends):
        u_goals_id = Goal.objects.filter(user_id=user_id).values_list('goal_id', flat=True)
        u_goals = Subject.objects.filter(id__in=u_goals_id)
        target_interest_id = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('interest_id', flat=True)
        target_interests = InterestSubject.objects.filter(id__in=target_interest_id)

        match_interests = []
        for goal in u_goals:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(goal.description).translate(remove_punctuation_map).split())
            match_interests.extend(target_interests.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_interests]
        result = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(interest_id__in=subject_ids)
        return result

    @staticmethod
    def match_offer_to_interests(user_id, exclude_friends):
        u_offers_id = Offer.objects.filter(user_id=user_id).values_list('offer_id', flat=True)
        u_offers = Subject.objects.filter(id__in=u_offers_id)
        target_interest_id = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('interest_id', flat=True)
        target_interests = InterestSubject.objects.filter(id__in=target_interest_id)

        match_interests = []
        for offer in u_offers:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(offer.description).translate(remove_punctuation_map).split())
            match_interests.extend(target_interests.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_interests]
        result = Interest.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(interest_id__in=subject_ids)
        return result


class StopWords(models.Model):
    word = models.CharField(max_length=100, unique=True)

    def __unicode__(self):
        return self.word


class ElasticSearchMatchEngineManager(models.Manager):

    @staticmethod
    def query_builder(user, query, fields, exclude_user_ids, is_filter=False):
        client = Elasticsearch()
        index = settings.HAYSTACK_CONNECTIONS['default']['INDEX_NAME']
        body = {}
        if is_filter:
            fs = FilterState.objects.filter(user=user)
            gender_predicate = {}
            if fs:
                if fs[0].gender in ('m,f', 'f,m'):
                    gender_predicate = [{"term": {"gender": 'm'}},
                                        {"term": {"gender": 'f'}},
                                        {"term": {"gender": 'm,f'}}]
                else:
                    gender_predicate = {"term": {"gender": fs[0].gender}}

            predicate = gender_predicate
            body = {
                "highlight": {
                    "fields": {
                        "goals": {},
                        "interests": {},
                        "likes": {},
                        "offers": {}
                    }
                },
                "query": {
                    "filtered": {
                        "query": {
                            "multi_match": {
                                "fields": fields,
                                "query": query
                            }
                        },
                        "filter": {
                            "bool": {
                                "must_not": [
                                    {
                                        "ids": {
                                            "type": "modelresult",
                                            "values": exclude_user_ids
                                        }
                                    }
                                ],
                                "should": [
                                    predicate
                                ]
                            }
                        }
                    }
                }
            }
            response = client.search(index=index, body=body)
            #     .query(Q("multi_match", query=query, fields=fields)) \
            #     .filter(~F("ids", type="modelresult", values=exclude_user_ids)) \
            #     .filter(F("term", gender=gender)) \
            #     .highlight(*fields)
        else:
            body = {
                "highlight": {
                    "fields": {
                        "goals": {},
                        "interests": {},
                        "likes": {},
                        "offers": {}
                    }
                },
                "query": {
                    "filtered": {
                        "query": {
                            "multi_match": {
                                "fields": fields,
                                "query": query
                            }
                        },
                        "filter": {
                            "bool": {
                                "must_not": [
                                    {
                                        "ids": {
                                            "type": "modelresult",
                                            "values": exclude_user_ids
                                        }
                                    }
                                ],
                                "should": []
                            }
                        }
                    }
                }
            }
            response = client.search(index=index, body=body)

        print response
        return response

    @staticmethod
    def match(user_id, friends=(), is_filter=False):
        user = FacebookCustomUserActive.objects.get(pk=user_id)
        goals = user.goal_set.all()
        offers = user.offer_set.all()
        interests = user.interest_set.all()
        likes = FacebookLikeProxy.objects.filter(user_id=user.id)
        words = set()
        for subject in itertools.chain(goals, offers, interests, likes):
            words |= set(unicode(subject).lower().
                         translate(remove_punctuation_map).split())

        stop_words = StopWords.objects.all().values_list('word', flat=True)

        removed_stopwords = [word for word in words if word not in stop_words]
        query = ' '.join(removed_stopwords)

        fields = ["goals", "offers", "interests", "likes"]
        exclude_user_ids = ['members.facebookcustomuseractive.%s' % user_id]

        response = ElasticSearchMatchEngineManager.\
            query_builder(user, query, fields, exclude_user_ids, is_filter=is_filter)

        return response['hits']['hits']

    @staticmethod
    def match_between(user_id1, user_id2):
        user = FacebookCustomUserActive.objects.get(pk=user_id1)
        goals = user.goal_set.all()
        offers = user.offer_set.all()
        interests = user.interest_set.all()
        likes = FacebookLikeProxy.objects.filter(user_id=user.id)
        words = set()
        for subject in itertools.chain(goals, offers, interests, likes):
            words |= set(unicode(subject).lower().
                         translate(remove_punctuation_map).split())

        stop_words = StopWords.objects.all().values_list('word', flat=True)

        removed_stopwords = [word for word in words if word not in stop_words]
        query = ' '.join(removed_stopwords)

        fields = ["goals", "offers", "interests", "likes"]
        exclude_user_ids = ['members.facebookcustomuseractive.%s' % user_id1]

        client = Elasticsearch()

        s = Search(using=client,
                   index=settings.HAYSTACK_CONNECTIONS['default']['INDEX_NAME']) \
            .query(Q("multi_match", query=query, fields=fields)) \
            .filter(F("ids", type="modelresult",
                      values=['members.facebookcustomuseractive.%s' % user_id2])) \
            .filter(~F("ids", type="modelresult",
                       values=exclude_user_ids)) \
            .highlight(*fields)
        print s.to_dict()
        response = s.execute()

        return response.hits.hits


class AbstractMatchEngine(models.Model):
    objects = MatchEngineManager()
    elastic_objects = ElasticSearchMatchEngineManager()

    class Meta:
        abstract = True


class MatchEngine(AbstractMatchEngine):
    pass


class ElasticSearchMatchEngine(AbstractMatchEngine):
    pass
