from events.models import Membership
from match_engine.models import MatchEngineManager


def calculate_cumulative_match_score(user_id, event_id):
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


def update_cum_score(event_id):
    ids = Membership.objects.filter(event=event_id).values_list('id', flat=True)
    for id_ in ids:
        m = Membership.objects.get(pk=id_)
        print m
        m.cumulative_match_score = calculate_cumulative_match_score(m.user.id, m.event.id)
        m.save()
