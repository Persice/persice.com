import uuid
from django.db.models import signals
from events.models import CumulativeMatchScore, Membership
from events.tasks import update_match_score


signals.post_save.connect(update_match_score, sender=Membership)
signals.post_delete.connect(update_match_score, dispatch_uid=str(uuid.uuid1()), sender=Membership)
