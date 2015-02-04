from django.db import models
from django_facebook.models import FacebookCustomUser
from djorm_pgfulltext.models import SearchManager
from djorm_pgfulltext.fields import VectorField
from interests.models import remove_punctuation_map


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
    description = models.CharField(max_length=50, null=False, blank=False, unique=True)

    search_index = VectorField()

    objects = SearchManager(
        fields= ('description', ),
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


class GoalManager2(models.Manager):
    @staticmethod
    def match_goals_to_goals(user_id, exclude_friends):
        """
        Return the list of matched user goals to goals
        """
        u_goals_id = Goal.objects.filter(user_id=user_id).values_list('goal_id', flat=True)
        u_goals = Subject.objects.filter(id__in=u_goals_id)
        target_goals_id = Goal.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('goal_id', flat=True)
        target_goals = Subject.objects.filter(id__in=target_goals_id)

        match_goals = []
        for goal in u_goals:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(goal.description).translate(remove_punctuation_map).split())
            match_goals.extend(target_goals.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_goals]
        result = Goal.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(goal__in=subject_ids)
        return result

    @staticmethod
    def match_offers_to_goals(user_id, exclude_friends):
        """
        Return the list of matched user goals to goals
        """
        u_offers_id = Offer.objects.filter(user_id=user_id).values_list('offer_id', flat=True)
        u_offers = Subject.objects.filter(id__in=u_offers_id)
        target_goals_id = Goal.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('goal_id', flat=True)
        target_goals = Subject.objects.filter(id__in=target_goals_id)

        match_goals = []
        for offer in u_offers:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(offer.description).translate(remove_punctuation_map).split())
            match_goals.extend(target_goals.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_goals]
        result = Goal.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(goal_id__in=subject_ids)
        return result


class Goal(models.Model):
    objects = GoalManager()
    objects_search = GoalManager2()
    user = models.ForeignKey(FacebookCustomUser)
    goal = models.ForeignKey(Subject)

    def __unicode__(self):
        return u'<Goal: %s>, <user: %s>' % (self.goal.description, self.user.first_name)

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


class OfferManager2(models.Manager):
    @staticmethod
    def match_offers_to_offers(user_id, exclude_friends):
        """
        Return the list of matched user offers to offers
        """
        u_offers_id = Offer.objects.filter(user_id=user_id).values_list('offer_id', flat=True)
        u_offers = Subject.objects.filter(id__in=u_offers_id)
        target_offers_id = Offer.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('offer_id', flat=True)
        target_offers = Subject.objects.filter(id__in=target_offers_id)

        match_offers = []
        for offer in u_offers:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(offer.description).translate(remove_punctuation_map).split())
            match_offers.extend(target_offers.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_offers]
        result = Offer.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(offer__in=subject_ids)
        return result

    @staticmethod
    def match_goals_to_offers(user_id, exclude_friends):
        """
        Return the list of matched user goals to goals
        """
        u_goals_id = Goal.objects.filter(user_id=user_id).values_list('goal_id', flat=True)
        u_goals = Subject.objects.filter(id__in=u_goals_id)
        target_offers_id = Offer.objects.exclude(user_id__in=[user_id] + exclude_friends).values_list('offer_id', flat=True)
        target_offers = Subject.objects.filter(id__in=target_offers_id)

        match_offers = []
        for goal in u_goals:
            # FTS extension by default uses plainto_tsquery instead of to_tosquery,
            #  for this reason the use of raw parameter.
            tsquery = ' | '.join(unicode(goal).translate(remove_punctuation_map).split())
            match_offers.extend(target_offers.search(tsquery, raw=True))

        subject_ids = [m.id for m in match_offers]
        result = Offer.objects.exclude(user_id__in=[user_id] + exclude_friends).filter(offer__in=subject_ids)
        return result


class Offer(models.Model):
    objects = OfferManager()
    objects_search = OfferManager2()
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
    distance = models.IntegerField(default=1)
    min_age = models.CharField(max_length=3)
    max_age = models.CharField(max_length=4)
    gender = models.CharField(max_length=3)
    keyword = models.CharField(max_length=50)
