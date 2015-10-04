import factory
from django_facebook.models import FacebookCustomUser
from goals.models import Goal, Subject


class SubjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FacebookCustomUser


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FacebookCustomUser

    first_name = factory.Sequence(lambda n: "user_%03d" % n)
    last_name = 'Doe'


class GoalFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Goal
    goal = factory.RelatedFactory(SubjectFactory, 'goal')
    user = factory.RelatedFactory(UserFactory, 'user')
