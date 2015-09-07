from operator import itemgetter, attrgetter
from django_facebook.models import FacebookLike
from friends.models import Friend, FacebookFriendUser
from goals.models import Offer, Goal
from goals.utils import calculate_age, calculate_distance, social_extra_data
from interests.models import Interest
from match_engine.models import MatchEngine
from members.models import FacebookCustomUserActive


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
        exclude_friends = Friend.objects.all_my_friends(current_user_id) + Friend.objects.thumbed_up_i(current_user_id) + \
                          FacebookFriendUser.objects.all_my_friends(current_user_id) + \
                          Friend.objects.deleted_friends(current_user_id)
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