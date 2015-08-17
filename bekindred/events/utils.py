from events.models import Membership, CumulativeMatchScore
from match_engine.models import MatchEngineManager
from members.models import FacebookCustomUserActive


def calc_score(user_id, event_id):
    """
    :param user_id:
    :param event_id:
    :return:
    """
    cumulative_match_score = 0

    # All event attendees

    members = Membership.objects.filter(event_id=event_id, rsvp='yes').\
        exclude(user_id=user_id).values_list('user_id', flat=True)

    for attendee_id in members:
        cumulative_match_score += MatchEngineManager. \
            count_common_goals_and_offers(user_id, attendee_id)

    return cumulative_match_score


def get_cum_score(event_id, user_id):
    m = CumulativeMatchScore.objects.\
        filter(event=event_id,
               user=user_id)
    if m:
        return m[0].score
    else:
        return 0


class ResourseObject(object):
    def __init__(self, initial=None):
        self.__dict__['_data'] = {}

        if hasattr(initial, 'items'):
            self.__dict__['_data'] = initial

    def __getattr__(self, name):
        return self._data.get(name, None)

    def __setattr__(self, name, value):
        self.__dict__['_data'][name] = value

    def to_dict(self):
        return self._data


class Struct(object):
    def __init__(self, **entries):
        self.__dict__.update(entries)