from django.db.models import signals
from events.models import Membership
from events.tasks import update_match_score


signals.post_save.connect(update_match_score, sender=Membership)