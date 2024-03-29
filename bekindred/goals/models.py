from django.db import models
from django_facebook.models import FacebookCustomUser
from djorm_pgfulltext.models import SearchManager
from djorm_pgfulltext.fields import VectorField


class SubjectManager(models.Manager):
    def search_goals(self, user_id):
        user_goals = Goal.objects.filter(user=FacebookCustomUser.objects.get(pk=user_id))

        subjects = Subject.objects.exclude(id__in=user_goals.values_list('id', flat=True))
        search_subject = []
        for goal in user_goals:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(goal).split())
            search_subject.extend(subjects.search(tsquery, raw=True))

        return search_subject

    def search_offers(self, user_id):
        user_offers = Offer.objects.filter(user=FacebookCustomUser.objects.get(pk=user_id))

        subjects = Subject.objects.exclude(id__in=user_offers.values_list('id', flat=True))
        search_subject = []
        for offer in user_offers:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(offer).split())
            search_subject.extend(subjects.search(tsquery, raw=True))

        return search_subject


class Subject(models.Model):
    description = models.CharField(max_length=300, null=False, blank=False, unique=True)

    search_index = VectorField()

    objects = SearchManager(
        fields=('description', ),
        config='pg_catalog.english',
        search_field='search_index',
        auto_update_search_field=True
    )
    search_subject = SubjectManager()

    def __unicode__(self):
        return self.description


class GoalManager(models.Manager):
    def user_goals(self, user_id):
        return Goal.objects.filter(user=FacebookCustomUser.objects.get(pk=user_id)).values('goal')

    def match_offers_to_goals(self, exclude_friends, user_offers):
        return list(Goal.objects.exclude(user__in=exclude_friends).filter(goal=user_offers).values_list('user', flat=True))

    def match_goals_to_goals(self, exclude_friends, user_goals):
        return list(Goal.objects.exclude(user__in=exclude_friends).filter(goal=user_goals).values_list('user', flat=True))

    def search_offers_to_goals(self, exclude_friends, search_goals):
        return list(Goal.objects.exclude(user_id__in=exclude_friends).
                    filter(goal__in=search_goals).values_list('user', flat=True))

    def search_goals_to_goals(self, exclude_friends, search_goals):
        return list(Goal.objects.exclude(user_id__in=exclude_friends).
                    filter(goal__in=search_goals).values_list('user', flat=True))


class Goal(models.Model):
    objects = GoalManager()
    user = models.ForeignKey(FacebookCustomUser)
    goal = models.ForeignKey(Subject)

    def __unicode__(self):
        return self.goal.description

    class Meta:
        unique_together = ("user", "goal")


class OfferManager(models.Manager):
    def user_offers(self, user_id):
        return Offer.objects.filter(user=FacebookCustomUser.objects.get(pk=user_id)).values('offer')

    def match_goals_to_offers(self, exclude_friends, user_goals):
        return list(Offer.objects.exclude(user__in=exclude_friends).
                    filter(offer=user_goals).values_list('user', flat=True))

    def match_offers_to_offers(self, exclude_friends, user_offers):
        return list(Offer.objects.exclude(user__in=exclude_friends).
                    filter(offer=user_offers).values_list('user', flat=True))

    def search_goals_to_offers(self, exclude_friends, search_goals):
        return list(Offer.objects.exclude(user_id__in=exclude_friends).
                    filter(offer__in=search_goals).values_list('user', flat=True))

    def search_offers_to_offers(self, exclude_friends, search_offers):
        return list(Offer.objects.exclude(user_id__in=exclude_friends).
                    filter(offer__in=search_offers).values_list('user', flat=True))


class Offer(models.Model):
    objects = OfferManager()
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


class UserIPAddress(models.Model):
    user = models.OneToOneField(FacebookCustomUser)
    ip = models.IPAddressField()


class MatchFilterState(models.Model):
    user = models.ForeignKey(FacebookCustomUser)
    distance = models.IntegerField(default=10000)
    distance_unit = models.CharField(max_length=5, default='miles')
    min_age = models.CharField(max_length=3, default=25)
    max_age = models.CharField(max_length=4, default=60)
    gender = models.CharField(max_length=3, default='m,f')
    keyword = models.CharField(max_length=50, default='')
    order_criteria = models.CharField(max_length=20, default='match_score')
