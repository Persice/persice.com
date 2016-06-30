import functools
import hashlib
from random import sample
import string
import logging
from operator import attrgetter

import re
import nltk
import time
from django.core.cache import cache
from nltk.stem.porter import PorterStemmer
from nltk.corpus import wordnet as wn

from django_facebook.models import FacebookLike
from social_auth.db.django_models import UserSocialAuth

from events import Event
from friends.models import Friend, FacebookFriendUser
from friends.utils import NeoFourJ
from goals.models import Offer, Goal
from goals.utils import calculate_age, calculate_distance, social_extra_data, \
    calculate_distance_es, get_mutual_linkedin_connections, \
    get_mutual_twitter_friends, get_current_position, get_lives_in
from interests.models import Interest
from match_engine.models import MatchEngine, ElasticSearchMatchEngine, \
    StopWords, GerundWords
from match_engine.utils import find_collocations
from members.models import FacebookCustomUserActive
from photos.models import FacebookPhoto

logger = logging.getLogger(__name__)


def order_by(target, **kwargs):
    k = kwargs['keys']
    if len(k) == 3:
        if k[0] == 'score':
            result = sorted(target, key=lambda x: (-x.score, -x.friends_score, x.distance))
            return result
        elif k[0] == 'distance':
            result = sorted(target, key=lambda x: (x.distance, -x.score, -x.friends_score))
            return result
        else:
            result = sorted(target, key=lambda x: (-x.friends_score, -x.score, x.distance))
            return result
    else:
        result = sorted(target, key=attrgetter('distance'))
        return result


def make_gerund(word):
    """
    Create gerund form of word if it's possible
    code -> coding
    :param word:
    :return:
    """
    # now = time.time()
    is_found = False
    gerund = word
    for lem in wn.lemmas(word):
        for related_form in lem.derivationally_related_forms():
            if related_form.name().endswith('ing'):
                gerund = related_form.name()
                GerundWords.objects.get_or_create(word=gerund)
                is_found = True
                break
        if is_found:
            break
    if not is_found:
        if word.endswith('e'):
            g_word = GerundWords.objects.filter(word='%sing' % gerund[:-1])
            if g_word:
                return g_word[0].word
        else:
            g_word = GerundWords.objects.filter(word='%sing' % gerund)
            if g_word:
                return g_word[0].word
    # logger.debug("Time get_gerund: {} {}".format(time.time() - now, word))
    return gerund


def timeit(method):

    def timed(*args, **kw):
        ts = time.time()
        result = method(*args, **kw)
        te = time.time()

        print '%r (%r, %r) %2.2f sec' % \
              (method.__name__, args, kw, te-ts)
        return result

    return timed


class MatchedUser(object):
    """
    user_id1 - original user
    user_id2 - matched user
    """

    def __init__(self, current_user_id, user_id2):
        self.current_user_id = FacebookCustomUserActive.objects.get(pk=current_user_id)
        self.user = FacebookCustomUserActive.objects.get(pk=user_id2)
        self.goals = self._add(Goal, 'goal')
        self.offers = self._add(Offer, 'offer')
        self.interests = self._add(Interest, 'interest')
        self.likes = self._add(FacebookLike, 'name')
        self.id = self.user.id
        self.user_id = self.user.id
        self.first_name = self.user.first_name
        self.last_name = self.user.last_name
        self.shared_interest = ['dancing', 'cooking', '3D printing']
        self.facebook_id = self.user.facebook_id
        self.image = self.user.image
        self.age = calculate_age(self.user.date_of_birth)
        self.gender = self.user.gender or 'm,f'
        self.about = self.user.about_me
        self.photos = []
        self.twitter_provider, self.linkedin_provider, self.twitter_username = \
            social_extra_data(self.user.id)
        self.distance = calculate_distance(current_user_id, user_id2)
        self.score = MatchEngine.objects.count_common_goals_and_offers(current_user_id, user_id2)
        self.friends_score = len(Friend.objects.mutual_friends(current_user_id, user_id2)) + \
            len(FacebookFriendUser.objects.mutual_friends(current_user_id, user_id2))

    def _add(self, model, attr_name, limit=2):
        # TODO: update accordiing to SUbjects and SUbjectInteres
        result = dict()
        for item in model.objects.filter(user_id=self.user.id)[:limit]:
            attr = getattr(item, attr_name)
            if hasattr(attr, 'description'):
                desc = attr.description
            else:
                desc = attr
            result[desc] = 0
        return [result]


class MatchedResults(object):
    def __init__(self, current_user_id, exclude_user_ids):
        self.items = []
        self.current_user = FacebookCustomUserActive.objects.get(pk=current_user_id)
        exclude_friends = NeoFourJ().get_my_thumbed_up_ids(current_user_id)
        self.exclude_user_ids = exclude_user_ids + [current_user_id] + exclude_friends

    def find(self):
        users = FacebookCustomUserActive.objects.exclude(id__in=self.exclude_user_ids)
        for user in users:
            self.add(MatchedUser(self.current_user.id, user.id))
        return self.items

    def sort_by(self, **kwargs):
        pass

    def filter_by(self, **kwargs):
        pass

    def add(self, item):
        self.items.append(item)


class MatchUser(object):
    def __init__(self, current_user_id, user_object,
                 include_top_interests=True):
        self.user = self.get_user_info(user_object)
        self.current_user_id = current_user_id
        self.goals = self.highlight(user_object, 'goals')
        self.offers = self.highlight(user_object, 'offers')
        self.interests = self.highlight(user_object, 'interests')
        self.likes = self.likes_images(user_object)
        self.id = self.user.id
        self.user_id = self.user.id
        self.username = self.user.username
        self.first_name = self.user.first_name
        self.last_name = self.user.last_name
        self.facebook_id = self.user.facebook_id
        self.image = self.get_profile_image(user_object) or \
            '/media/{}'.format(self.user.image)
        self.age = calculate_age(self.user.date_of_birth)
        self.gender = self.user.gender or 'm,f'
        self.about = self.user.about_me
        self.photos = []
        self.distance = calculate_distance_es(current_user_id, user_object)
        self.seen = self.get_seen(current_user_id, user_object)
        # Scores
        self.score = self.match_score(current_user_id, self.user_id)
        self.es_score = user_object.get('_score', 0)
        self.mutual_likes_count = self.fb_likes_match_score(current_user_id, self.user_id)
        self.total_likes_count = self.total_fb_likes_count(self.user_id)
        self.friends_score = self.get_friends_score(current_user_id, user_object)
        self.top_interests = \
            self.get_top_interests(user_object) if include_top_interests else []
        self.last_login = self.user.last_login
        self.keywords = self.get_keywords(user_object)
        self.position = get_current_position(self.user)
        self.lives_in = get_lives_in(self.user)
        self.linkedin_provider = self.get_linkedin_data()
        self.twitter_username, self.twitter_provider = self.get_twitter_data()
        self.connected = self.is_connected(current_user_id, self.user_id)

    def get_profile_image(self, user_object):
        user_id = int(user_object['_id'].split('.')[-1])
        return FacebookPhoto.objects.profile_photo(user_id)

    def get_user_info(self, user_object):
        user_id = int(user_object['_id'].split('.')[-1])
        return FacebookCustomUserActive.objects.get(pk=user_id)

    def match_score(self, user1_id, user2_id):
        score = sum(self.goals[0].values()) + sum(self.offers[0].values()) + \
                self.fb_likes_match_score(user1_id, user2_id) + \
                sum(self.interests[0].values())
        return score

    def fb_likes_match_score(self, user1, user2):
        fb_likes_u1 = FacebookLike.objects.filter(user_id=user1).\
            values_list('facebook_id', flat=True)
        fb_likes_u2 = FacebookLike.objects.filter(user_id=user2). \
            values_list('facebook_id', flat=True)
        return len(set(fb_likes_u1) & set(fb_likes_u2))

    def total_fb_likes_count(self, user):
        return FacebookLike.objects.filter(user_id=user).count()

    def get_top_interests(self, user_object):
        """
        Return
        """
        # Number of top interests to select
        top_num = 6
        targets = ['goals', 'offers', 'interests']
        interests = []

        for target in targets:
            h_objects = user_object.get('highlight', {}).get(target, [])
            for h in h_objects:
                new_h = re.findall(r'<em>(.*?)</em>', h)
                interests.append(new_h[0])
        # now_k = time.time()
        keywords = self.get_keywords(user_object)
        # logger.info("keywords: {}".format(time.time() - now_k))

        text_keywords = u','.join(sorted(keywords))
        unique_key = hashlib.sha1(text_keywords).hexdigest()

        collocations = cache.get(unique_key)
        if collocations:
            keywords_ = collocations
            logger.info("get collocations from cache {}".format(unique_key))
        else:
            keywords_ = find_collocations(keywords)
            logger.info("calc collocations")
            text_keywords_ = u','.join(sorted(keywords))
            unique_key_ = hashlib.sha1(text_keywords_).hexdigest()
            logger.info("set collocations to cache: {}".format(unique_key_))
            cache.set(unique_key_, keywords_, 60*60)

        result_interests = []
        other_keywords = []
        s = PorterStemmer()
        for i in interests:
            for k in keywords_:
                if s.stem(i.lower()) == s.stem(k.lower()):
                    result_interests.append(k)
                elif len(k.lower().split()) == 2 and \
                        (s.stem(i.lower()) == s.stem(k.lower().split()[0]) or
                         s.stem(i.lower()) == s.stem(k.lower().split()[1])):
                    result_interests.append(k)

        other_keywords = list(set(keywords_) - set(result_interests))
        result_interests = list(set(result_interests))

        shuffled_interests = []
        if len(result_interests) >= top_num:
            shuffled_interests = sample(result_interests, top_num)
            return [dict(zip(shuffled_interests, [1]*len(shuffled_interests)))]
        else:
            if len(other_keywords) >= (top_num - len(result_interests)):
                d = dict(zip(result_interests, [1]*len(result_interests)))

                sample_keywords = sample(other_keywords, top_num-len(result_interests))
                for subj in sample_keywords:
                    d[subj] = 0
                return [d]
            else:
                d = dict(zip(result_interests, [1]*len(result_interests)))
                for subj in other_keywords:
                    d[subj] = 0
                return [d]

    def get_keywords(self, user_object):
        now = time.time()
        keywords = []
        draft_keywords = set()
        porter_stemmer = PorterStemmer()
        stop_words = StopWords.objects.all().values_list('word', flat=True)
        st_stop_words = [porter_stemmer.stem(w) for w in stop_words]
        targets = ['goals', 'offers', 'interests']
        translate_table = dict((ord(char), None) for char in string.punctuation)

        for target in targets:
            h_objects = user_object['_source'].get(target, [])
            for h in h_objects:
                s = h.translate(translate_table)
                tokens = nltk.word_tokenize(s)
                draft_keywords.update(tokens)
        for word in draft_keywords:
            if (porter_stemmer.stem(word.lower()) not in st_stop_words) and \
                    len(word.lower()) >= 2:
                if not word.endswith('ing'):
                    gerund = make_gerund(word.lower())
                    keywords.append(gerund)
                else:
                    keywords.append(word.lower())
        logger.debug("Time get_keywords: {} {} {}".format(now - time.time(),
                                                          self.current_user_id,
                                                          self.user_id))
        return keywords

    def get_seen(self, current_user_id, user_object):
        user_id = int(user_object['_id'].split('.')[-1])
        result = NeoFourJ().get_seen(current_user_id, user_id)
        return result.one if result.one else False

    def get_friends_score(self, current_user_id, user_object):
        user_id = int(user_object['_id'].split('.')[-1])
        mutual_bk_friends_count = len(
                NeoFourJ().get_my_friends_ids(user_id))

        mutual_fb_friends_count = len(
                FacebookFriendUser.objects.mutual_friends(
                        current_user_id, user_id))

        l = get_mutual_linkedin_connections(current_user_id, user_id)
        mutual_linkedin_connections_count = l['mutual_linkedin_count']

        t = get_mutual_twitter_friends(current_user_id, user_id)
        mutual_twitter_friends_count = t['count_mutual_twitter_friends']
        mutual_twitter_followers_count = t['count_mutual_twitter_followers']

        friends_score = mutual_bk_friends_count + mutual_fb_friends_count + \
            mutual_linkedin_connections_count + \
            mutual_twitter_followers_count + mutual_twitter_friends_count

        return friends_score

    def highlight(self, user_object, target='goals'):
        """
        Match highlighted goals to list of all user goals
        """
        result = {}
        objects = user_object['_source'].get(target)
        for obj in objects:
            result[obj.lower()] = 0
        try:
            h_objects = user_object['highlight'].get(target, [])
            for h in h_objects:
                new_h = h.replace('<em>', '').replace('</em>', '')
                result[new_h] = 1
        except KeyError as er:
            logger.error(er)
        return [result]

    def likes_images(self, user_object):
        likes = self.highlight(user_object, 'likes')
        user_id = int(user_object['_id'].split('.')[-1])
        raw_likes = FacebookLike.objects.filter(user_id=user_id)
        result = []
        for raw_like in raw_likes:
            for like_name, value in likes[0].items():
                if like_name == raw_like.name.lower():
                    result.append({'match': value,
                                   'name': like_name,
                                   'picture': raw_like.picture})
        return result

    def get_twitter_data(self):
        twitter_name, twitter_provider = None, None
        try:
            qs = UserSocialAuth.objects.filter(
                    user_id=self.user_id, provider='twitter')[0]
            twitter_provider = qs.extra_data['name']
            twitter_name = qs.extra_data['screen_name']
        except IndexError:
            pass
        return twitter_name, twitter_provider

    def get_linkedin_data(self):
        linkedin_provider = None
        try:
            linkedin_provider = UserSocialAuth.objects.filter(
                    user_id=self.user_id, provider='linkedin'
            )[0].extra_data['public_profile_url']
        except IndexError:
            pass
        return linkedin_provider

    def is_connected(self, user_id1, user_id2):
        return NeoFourJ().check_friendship_rel(user_id1, user_id2)


class NonMatchUser(MatchUser):
    def __init__(self, current_user_id, user_id):
        self.user = FacebookCustomUserActive.objects.get(pk=user_id)
        self.current_user_id = current_user_id
        self.id = self.user.id
        self.user_id = self.user.id
        self.username = self.user.username
        self.first_name = self.user.first_name
        self.last_name = self.user.last_name
        self.facebook_id = self.user.facebook_id
        self.image = FacebookPhoto.objects.profile_photo(user_id) or \
                     '/media/{}'.format(self.user.image)
        self.age = calculate_age(self.user.date_of_birth)
        self.gender = self.user.gender or 'm,f'
        self.about = self.user.about_me
        self.last_login = self.user.last_login
        self.position = get_current_position(self.user)
        self.lives_in = get_lives_in(self.user)
        self.linkedin_provider = self.get_linkedin_data()
        self.twitter_username, self.twitter_provider = self.get_twitter_data()
        self.connected = self.is_connected(current_user_id, user_id)
        self.top_interests = self.get_top_interests(
            self.get_user_object(user_id)
        )

    def get_user_object(self, user_id):
        goals = Goal.objects.filter(user_id=user_id).\
            values_list('goal__description', flat=True)
        offers = Offer.objects.filter(user_id=user_id). \
            values_list('offer__description', flat=True)
        interests = Interest.objects.filter(user_id=user_id). \
            values_list('interest__description', flat=True)
        user_object = {
            u'_source': {
                u'goals': list(goals),
                u'offers': list(offers),
                u'interests': list(interests)
            }
        }
        return user_object


class ShortMatchUser(MatchUser):
    def __init__(self, current_user_id, user_object):
        self.user = self.get_user_info(user_object)
        self.goals = self.highlight(user_object, 'goals')
        self.offers = self.highlight(user_object, 'offers')
        self.interests = self.highlight(user_object, 'interests')
        self.likes = self.likes_images(user_object)
        self.id = self.user.id
        self.first_name = self.user.first_name
        self.username = self.user.username
        self.user_id = self.user.id
        # Scores
        self.score = self.match_score(current_user_id, self.user_id)
        self.es_score = user_object.get('_score', 0)
        self.friends_score = self.get_friends_score(current_user_id,
                                                    user_object)


class MatchEvent(object):
    def __init__(self, current_user_id, event_object, matched_users):
        self.event = MatchEvent.get_event_info(event_object)
        self.names = self.highlight(event_object, 'name')
        self.descriptions = self.highlight(event_object, 'description')
        self.id = self.event.id
        self.name = self.event.name
        self.city = self.event.city
        self.country = self.event.country
        self.state = self.event.state
        self.street = self.event.street
        self.repeat = self.event.repeat
        self.zipcode = self.event.zipcode
        self.full_address = self.event.full_address
        self.location_name = self.event.location_name
        self.location = self.event.location
        self.max_attendees = self.event.max_attendees
        self.attendees_yes = MatchEvent.get_attendees(
            current_user_id, self.event,  matched_users, rsvp='yes')
        self.attendees_no = MatchEvent.get_attendees(
            current_user_id, self.event, matched_users, rsvp='no')
        self.attendees_maybe = MatchEvent.get_attendees(
            current_user_id, self.event, matched_users, rsvp='maybe')
        self.recommended_event_score = self.match_score()
        self.cumulative_match_score = MatchEvent.get_cum_score(
            current_user_id, self.event, matched_users)
        self.friend_attendees_count = MatchEvent.get_friends_attendees(
            current_user_id, self.id).count()
        self.description = self.event.description
        self.starts_on = self.event.starts_on
        self.ends_on = self.event.ends_on
        self.distance = calculate_distance_es(current_user_id, event_object)
        self.event_photo = self.event.event_photo

    def match_score(self):
        return sum(self.names[0].values()) + sum(self.descriptions[0].values())

    def highlight(self, event_object, target='name'):
        """
        Match highlighted goals to list of all user goals
        """
        result = {}
        objects = event_object['_source'].get(target)
        if objects:
            result[objects.lower()] = 0
        try:
            h_objects = event_object['highlight'].get(target, [])
            h = ' '.join(h_objects)
            new_h = h.replace('<em>', '').replace('</em>', '')
            result[new_h.lower()] = h.count('<em>')
        except KeyError as er:
            logger.error(er)
        return [result]

    @staticmethod
    def get_event_info(event_object):
        event_id = int(event_object['_id'].split('.')[-1])
        return Event.objects.get(pk=event_id)

    @staticmethod
    def get_friends_attendees(user_id, event_id):
        friends = NeoFourJ().get_my_friends_ids(user_id)
        attendees = Event.objects.get(pk=event_id). \
            membership_set.filter(user__in=friends, rsvp='yes')
        return attendees

    @staticmethod
    def get_cum_score(user_id, event, matched_users):
        attendees = Event.objects.get(pk=event.id). \
            membership_set.filter(rsvp='yes').values_list('user_id', flat=True)
        filtered = []
        for user in matched_users:
            if user.id in attendees:
                filtered.append(user)
        return sum([x.score for x in filtered])

    @staticmethod
    def get_attendees(user_id, event, matched_users, rsvp='yes'):
        attendees = Event.objects.get(pk=event.id). \
            membership_set.filter(rsvp=rsvp)
        results = []
        matched_users_scores = {elem.user_id: elem.score for elem in matched_users}
        for attendee in attendees:
            d = dict()
            d['first_name'] = attendee.user.first_name
            d['username'] = attendee.user.username
            d['is_connection'] = Friend.objects. \
                checking_friendship(user_id, attendee.user.id)
            try:
                d['image'] = FacebookPhoto.objects.filter(
                    user_id=attendee.user.id,
                    order=0)[0].cropped_photo.url
            except IndexError:
                d['image'] = None

            if attendee.user_id in matched_users_scores.keys():
                d['match_score'] = matched_users_scores[attendee.user_id]
            else:
                d['match_score'] = 0
            results.append(d)
        return sorted(results, key=lambda r: r['match_score'], reverse=True)


class MatchQuerySet(object):
    @staticmethod
    def all(current_user_id, is_filter=False, friends=False, exclude_ids=None):
        hits = ElasticSearchMatchEngine.elastic_objects.\
            match(current_user_id, is_filter=is_filter, friends=friends,
                  exclude_ids=exclude_ids)
        users = []
        for hit in hits:
            try:
                matched_user_id = int(hit['_id'].split('.')[-1])
                cached_user = cache.get('%s_%s' % (current_user_id,
                                                   matched_user_id))
                if cached_user:
                    user = cached_user
                else:
                    user = MatchUser(current_user_id, hit)
                    cache.set('%s_%s' % (current_user_id,
                                         matched_user_id), user, 600)
                users.append(user)
            except FacebookCustomUserActive.DoesNotExist as er:
                logger.error(er)
        return users

    @staticmethod
    def attendees(current_user_id, is_filter=False, friends=False):
        hits = ElasticSearchMatchEngine.elastic_objects. \
            match(current_user_id, is_filter=is_filter, friends=friends,
                  exclude_ids=[])
        users = []
        for hit in hits:
            try:
                user = ShortMatchUser(current_user_id, hit)
                users.append(user)
            except FacebookCustomUserActive.DoesNotExist as er:
                logger.error(er)
        return users

    @staticmethod
    def all_event(current_user_id, is_filter=False, feed='my'):
        hits = ElasticSearchMatchEngine.elastic_objects. \
            match_events(current_user_id, is_filter=is_filter, feed=feed)
        events = []
        matched_users = MatchQuerySet.attendees(current_user_id)
        for hit in hits:
            event = MatchEvent(current_user_id, hit, matched_users)
            events.append(event)
        return events

    @staticmethod
    def user_event(user_id, event_id):
        hits = ElasticSearchMatchEngine.elastic_objects. \
            get_distance(user_id, event_id)
        events = []
        matched_users = MatchQuerySet.attendees(user_id)
        for hit in hits:
            event = MatchEvent(user_id, hit, matched_users)
            events.append(event)
        return events

    @staticmethod
    def between(user_id1, user_id2):
        if user_id1 == user_id2:
            hits = ElasticSearchMatchEngine.elastic_objects. \
                get_user(user_id1)
        else:
            hits = ElasticSearchMatchEngine.elastic_objects.\
                match_between(user_id1, user_id2)
        users = []
        for hit in hits:
            users.append(MatchUser(user_id1, hit, include_top_interests=False))
        return users
