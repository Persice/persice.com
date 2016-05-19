import logging

from django.conf import settings
from django.db.models import Q
from django_facebook.models import FacebookCustomUser
from py2neo import Graph, Node, Relationship

from .models import Friend

logging.getLogger("py2neo.batch").setLevel(logging.DEBUG)
logging.getLogger("py2neo.cypher").setLevel(logging.DEBUG)


def migrate_all_friendships_to_neo():
    graph = Graph(settings.NEO4J_URL)
    graph.delete_all()
    friends = Friend.objects.filter(Q(status__in=[1, 0],
                                      friend1__is_active=True,
                                      friend2__is_active=True) |
                                    Q(status__in=[1, 0],
                                      friend2__is_active=True,
                                      friend1__is_active=True))
    users = FacebookCustomUser.objects.filter(is_active=True, is_staff=False,
                                              is_superuser=False)
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
    """
    - Add to friends
    - confirm friends
    - Get all friends for user_id
    - checking_friendship
    """
    def __init__(self, neo4j_url=settings.NEO4J_URL):
        self.graph = Graph(neo4j_url)

    @staticmethod
    def person(user):
        return Node("Person", user_id=user.pk,
                    name=u'{} {}'.format(user.first_name, user.last_name))

    def create_person(self, node):
        return self.graph.create(node)[0]

    def get_person(self, user):
        return self.graph.find_one('Person', property_key='user_id',
                                   property_value=user.id)

    def add_to_friends(self, node1, node2):
        rel = Relationship(node1, "FRIENDS", node2)
        self.graph.create_unique(rel)

    def get_my_friends(self, user_id):
        return self.graph.cypher.execute("""
            MATCH (Person { user_id:{USER_ID} })-[:FRIENDS]->(n)
            -[:FRIENDS]->(Person { user_id:{USER_ID} })
            return n.name, n.user_id
        """, {'USER_ID': user_id})

    def check_friendship(self, user_id1, user_id2):
        return self.graph.cypher.execute("""
            MATCH (Person { user_id:{USER_ID1} })-[:FRIENDS]->
            (n:Person { user_id:{USER_ID2} })-[:FRIENDS]->
            (Person { user_id:{USER_ID1} })
            return n.name, n.user_id
        """, {'USER_ID1': user_id1, 'USER_ID2': user_id2})
