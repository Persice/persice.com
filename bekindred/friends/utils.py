import json
import logging
import redis

from django.conf import settings
from django.db.models import Q
from django.utils.timezone import now
from django_facebook.models import FacebookCustomUser
from py2neo import Graph, Node, Relationship

from .models import Friend

logging.getLogger("py2neo.batch").setLevel(logging.DEBUG)
logging.getLogger("py2neo.cypher").setLevel(logging.DEBUG)

logger = logging.getLogger(__name__)


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
    logger.info(users)
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
        if isinstance(user, int):
            user_id = user
        else:
            user_id = user.id
        return self.graph.find_one('Person', property_key='user_id',
                                   property_value=user_id)

    def add_to_friends(self, node1, node2):
        rel = Relationship(node1, "FRIENDS", node2, since=now(),
                           updated_at='new')
        self.graph.create_unique(rel)

    def pass_friend(self, node1, node2):
        rel = Relationship(node1, "PASSES", node2, since=now(),
                           updated_at='new')
        self.graph.create_unique(rel)

    def remove_from_friends(self, user_id1, user_id2):
        return self.graph.cypher.execute("""
            MATCH (n)-[rel:FRIENDS]->(r)
            WHERE n.user_id={USER_ID1} AND r.user_id={USER_ID2}
            DELETE rel
        """, {'USER_ID1': user_id1, 'USER_ID2': user_id2})

    def get_my_friends(self, user_id):
        return self.graph.cypher.execute("""
            MATCH (Person { user_id:{USER_ID} })-[:FRIENDS]->(n)
            -[:FRIENDS]->(Person { user_id:{USER_ID} })
            return ID(n) AS id, n.name AS node_name, n.user_id AS user_id
        """, {'USER_ID': user_id})

    def get_my_thumbed_up(self, user_id):
        return self.graph.cypher.execute("""
            MATCH (Person { user_id:{USER_ID} })-[:FRIENDS|PASSES]->(n)
            return ID(n) AS id, n.name AS node_name, n.user_id AS user_id
        """, {'USER_ID': user_id})

    def get_my_passes(self, user_id):
        return self.graph.cypher.execute("""
            MATCH (Person { user_id:{USER_ID} })-[:PASSES]->(n)
            return ID(n) AS id, n.name AS node_name, n.user_id AS user_id
        """, {'USER_ID': user_id})

    def get_my_friends_ids(self, user_id):
        my_friends = self.get_my_friends(user_id)
        results = []
        for record in my_friends:
            results.append(record.user_id)
        return results

    def get_my_thumbed_up_ids(self, user_id):
        thumbed_up = self.get_my_thumbed_up(user_id)
        results = []
        for record in thumbed_up:
            results.append(record.user_id)
        return results

    def check_friendship(self, user_id1, user_id2):
        return self.graph.cypher.execute("""
            MATCH (Person { user_id:{USER_ID1} })-[:FRIENDS]->
            (n:Person { user_id:{USER_ID2} })-[:FRIENDS]->
            (Person { user_id:{USER_ID1} })
            return n.name, n.user_id
        """, {'USER_ID1': user_id1, 'USER_ID2': user_id2})

    def get_or_create_node(self, user_id):
        """
        This function return new person or get existing
        also return created flag
        :param user_id:
        :return:
        """
        person = self.get_person(user_id)
        if person:
            return person, False
        else:
            person = self.create_person(self.person(user_id))
            return person, True

    def _publish_to_redis_channel(self, user1, user2):
        # redis
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        user_1 = {'friend_name': user2.first_name,
                  'friend_id': user2.id,
                  'friend_username': user2.username}
        r.publish('connection.{}'.format(user1.id), json.dumps(user_1))

        user_2 = {'friend_name': user1.first_name,
                  'friend_id': user1.id,
                  'friend_username': user1.username}
        r.publish('connection.{}'.format(user2.id), json.dumps(user_2))
