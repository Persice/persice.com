from django.conf import settings
from django.db.models import Q
from django_facebook.models import FacebookCustomUser
from py2neo import Graph, Node, Relationship

from .models import Friend


def migrate_all_friendships_to_neo():
    graph = Graph(settings.NEO4J_URL)
    graph.delete_all()
    friends = Friend.objects.filter(Q(status__in=[1, 0],
                                      friend1__is_active=True,
                                      friend2__is_active=True) |
                                    Q(status__in=[1, 0],
                                      friend2__is_active=True,
                                      friend1__is_active=True))
    ids = list(friends.values_list('friend1', flat=True))
    ids2 = list(friends.values_list('friend2', flat=True))
    result_ids = ids + ids2
    users = FacebookCustomUser.objects.filter(pk__in=result_ids)
    print users
    for user in users:
        a = Node("Person", user_id=user.pk,
                 name=u'{} {}'.format(user.first_name, user.last_name))
        graph.create(a)

    for friend in friends:
        n1 = graph.find_one('Person', property_key='user_id',
                            property_value=friend.friend1_id)
        n2 = graph.find_one('Person', property_key='user_id',
                            property_value=friend.friend2_id)
        if friend.status == 1:
            rel = Relationship(n1, "FRIENDS", n2)
            rel1 = Relationship(n2, "FRIENDS", n1)
            graph.create(rel)
            graph.create(rel1)
        elif friend.status == 0:
            rel = Relationship(n1, "FRIENDS", n2)
            graph.create(rel)


class NeoFourJ(object):
    # TODO:
    # 1. Add to friends
    # 2. confirm friends
    # 3. Get all friends for user_id
    # 4. checking_friendship
    def __init__(self, neo4j_url=settings.NEO4J_URL):
        self.graph = Graph(neo4j_url)

    def create_node(self, node):
        self.graph.create(node)

    def add_to_friends(self, node1, node2):
        rel = Relationship(node1, "FRIENDS", node2)
        self.graph.create(rel)

    def get_my_friends(self):
        pass

    def check_friendship(self, node1, node2):
        return False
