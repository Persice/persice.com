from django.db import models
from django_facebook.models import FacebookCustomUser


class Subject(models.Model):
    description = models.CharField(max_length=30, null=False, blank=False, unique=True)

    def __unicode__(self):
        return self.description


class GoalOfferManager(models.Manager):

    def unique_match_user(self, user_id):
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("select s.offer_user_id from"
                       "(select g.user_id as goal_user_id, g.goal_id, "
                       "o.user_id as offer_user_id, o.offer_id "
                       "from goals_goal g, goals_offer o "
                       "where g.goal_id = o.offer_id and g.user_id = %s) as s "
                       "group by s.offer_user_id", [user_id])
        desc = cursor.description
        return [dict(zip([col[0] for col in desc], row))
                for row in cursor.fetchall()]

    def match_offers(self, user_id, match_user_id):
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("""select o.offer_id
                          from goals_goal g, goals_offer o
                          where g.goal_id = o.offer_id and g.user_id = %s and o.user_id = %s""", [user_id, match_user_id])
        result_list = []
        for row in cursor.fetchall():
            result_list.append(int(row[0]))
        return result_list


class GoalOffer(models.Model):
    objects = GoalOfferManager()
    managed = False


class Goal(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    goal = models.ForeignKey(Subject)

    def __unicode__(self):
        return self.goal.description

    class Meta:
        unique_together = ("user", "goal")


class Offer(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    offer = models.ForeignKey(Subject)

    def __unicode__(self):
        return self.offer.description

    class Meta:
        unique_together = ("user", "offer")
