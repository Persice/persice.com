from django.db import models
from django_facebook.models import FacebookCustomUser


class Subject(models.Model):
    description = models.CharField(max_length=50, null=False, blank=False, unique=True)

    def __unicode__(self):
        return self.description


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


class KeywordManager(models.Manager):
    def goal_keywords(self, user_id):
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT "
                       "strip(to_tsvector(s.description)) as keywords "
                       "FROM goals_subject s, goals_goal g "
                       "WHERE g.goal_id = s.id "
                       "AND g.user_id = %s", [user_id])
        result_list = []
        for row in cursor.fetchall():
            result_list.append(','.join(row[0].split()))
        return result_list

    def offer_keywords(self, user_id):
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT "
                       "strip(to_tsvector(s.description)) as keywords "
                       "FROM goals_subject s, goals_offer g "
                       "WHERE g.offer_id = s.id "
                       "AND g.user_id = %s", [user_id])
        result_list = []
        for row in cursor.fetchall():
            result_list.append(','.join(row[0].split()))
        return result_list

class Keyword(models.Model):
    text = models.CharField(max_length=20)
    subject = models.ForeignKey(Subject)
    objects = KeywordManager()