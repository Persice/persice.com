from django_facebook.models import FacebookCustomUser
from goals.models import Goal, Offer
from interests.models import Interest


class MatchedUser(object):
    def __init__(self, user_id):
        self.user = FacebookCustomUser.objects.get(pk=user_id)
        self.goals = self.user.goal_set.all()
        self.offers = self._add(Offer, 'offer')
        self.interest = self._add(Interest, 'interest')
        self.likes = {}

    def _add(self, obj, attr_name, limit=2):
        result = dict()
        for item in obj.objects.filter(user=self.user)[:limit]:
            desc = getattr(item, attr_name).description
            result[desc] = 0
        return result


class MatchedResults(object):
    def __init__(self):
        self.items = []

    def sort_by(self):
        pass

    def filter_by(self):
        pass

    def add(self, item):
        self.items.append(item)