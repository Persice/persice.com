from django_facebook.models import FacebookCustomUser
from tastypie.test import ResourceTestCase
from goals.models import Subject, Goal, Offer
from goals.api.resources import SubjectResource


class TestSubjectResource(ResourceTestCase):
    def setUp(self):
        super(TestSubjectResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.description = 'learn django'
        self.description2 = 'learn python'
        self.description3 = 'learn ruby'
        self.subject = Subject.objects.create(description=self.description)
        self.subject2 = Subject.objects.create(description=self.description2)

        self.detail_url = '/api/v1/subject/{0}/'.format(self.subject.pk)
        self.post_data = {
            'description': '{0}'.format(self.description3),
            }

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/subject/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/subject/{0}/'.format(self.subject.id), format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)), 2)
        # Here, we're checking an entire structure for the expected data.
        self.assertEqual(self.deserialize(resp), {
            'description': '{}'.format(self.description),
            'resource_uri': '/api/v1/subject/{0}/'.format(self.subject.pk)
        })

    def test_post_list(self):
        self.response = self.login()
        # Check how many are there first.
        self.assertEqual(Subject.objects.count(), 2)
        self.assertHttpCreated(self.api_client.post('/api/v1/subject/', format='json',
                                                    data=self.post_data))
        # Verify a new one has been added.
        self.assertEqual(Subject.objects.count(), 3)



class TestGoalResource(ResourceTestCase):
    def setUp(self):
        super(TestGoalResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.DESCRIPTION = 'learn django'
        self.DESCRIPTION2 = 'learn python'
        self.DESCRIPTION3 = 'learn ruby'
        self.subject = Subject.objects.create(description=self.DESCRIPTION)
        self.subject2 = Subject.objects.create(description=self.DESCRIPTION2)
        self.subject3 = Subject.objects.create(description=self.DESCRIPTION3)

        self.goal = Goal.objects.create(user=self.user, goal=self.subject)

        self.detail_url = '/api/v1/goal/{0}/'.format(self.goal.pk)
        self.post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'goal': '/api/v1/subject/{0}/'.format(self.subject2.pk),
        }

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/goal/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/goal/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 1)
        # Here, we're checking an entire structure for the expected data.
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            'id': self.goal.id,
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'goal': '/api/v1/subject/{0}/'.format(self.subject.pk),
            'subject': '{}'.format(self.DESCRIPTION),
            'resource_uri': '/api/v1/goal/{0}/'.format(self.goal.pk)
        })

    def test_create_goal(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'goal_subject': 'my new goal',
            }
        self.response = self.login()
        self.assertHttpCreated(self.api_client.post('/api/v1/goal/', format='json', data=post_data))

    def test_create_goal_and_get(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'goal_subject': 'my new goal2',
            }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/goal/', format='json', data=post_data)
        self.assertEqual(self.deserialize(resp)['subject'], 'my new goal2')

    def test_create_duplicate_goal(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'goal_subject': 'learn django',
            }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/goal/', format='json', data=post_data)
        self.assertEqual(self.deserialize(resp)['goal']['error'][0], 'Goal already exists')

    def test_put_detail(self):
        self.response = self.login()
        # Grab the current data & modify it slightly.
        self.assertEqual(Goal.objects.get(pk=10).goal.description, 'learn django')
        original_data = self.deserialize(self.api_client.get(self.detail_url, format='json'))
        new_data = original_data.copy()
        new_data['goal_subject'] = 'learn erlang'

        self.assertEqual(Goal.objects.count(), 1)
        resp = self.api_client.put(self.detail_url, format='json', data=new_data)
        updated_goal = self.deserialize(resp)
        print updated_goal
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(Goal.objects.count(), 1)
        # Check for updated data.
        self.assertEqual(Goal.objects.get(pk=10).goal.description, 'learn erlang')

    def test_put_to_duplicate_detail(self):
        self.response = self.login()
        # Grab the current data & modify it slightly.
        original_data = self.deserialize(self.api_client.get(self.detail_url, format='json'))
        new_data = original_data.copy()
        new_data['goal_subject'] = 'learn django'

        self.assertEqual(Goal.objects.count(), 1)
        resp = self.api_client.put(self.detail_url, format='json', data=new_data)
        updated_goal = self.deserialize(resp)
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(Goal.objects.count(), 1)
        # Check for updated data.
        self.assertEqual(updated_goal['goal']['error'][0], "Goal already exists")

    def test_delete_detail(self):
        self.response = self.login()
        self.assertEqual(Goal.objects.count(), 1)
        self.assertHttpAccepted(self.api_client.delete(self.detail_url, format='json'))
        self.assertEqual(Goal.objects.count(), 0)


class TestOfferResource(ResourceTestCase):
    def setUp(self):
        super(TestOfferResource, self).setUp()
        self.user = FacebookCustomUser.objects.create_user(username='user_a', password='test')
        self.DESCRIPTION = 'learn django'
        self.DESCRIPTION2 = 'learn python'
        self.DESCRIPTION3 = 'learn ruby'
        self.subject = Subject.objects.create(description=self.DESCRIPTION)
        self.subject2 = Subject.objects.create(description=self.DESCRIPTION2)
        self.subject3 = Subject.objects.create(description=self.DESCRIPTION3)

        self.offer = Offer.objects.create(user=self.user, offer=self.subject)

        self.detail_url = '/api/v1/offer/{0}/'.format(self.offer.pk)
        self.post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'offer': '/api/v1/subject/{0}/'.format(self.subject2.pk),
            }

    def login(self):
        return self.api_client.client.post('/login/', {'username': 'user_a', 'password': 'test'})

    def test_get_list_unauthorzied(self):
        self.assertHttpUnauthorized(self.api_client.get('/api/v1/offer/', format='json'))

    def test_login(self):
        self.response = self.login()
        self.assertEqual(self.response.status_code, 302)

    def test_get_list_json(self):
        self.response = self.login()
        resp = self.api_client.get('/api/v1/offer/', format='json')
        self.assertValidJSONResponse(resp)

        # Scope out the data for correctness.
        self.assertEqual(len(self.deserialize(resp)['objects']), 1)
        # Here, we're checking an entire structure for the expected data.
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            'id': self.offer.id,
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'subject': '{}'.format(self.DESCRIPTION),
            'offer': '/api/v1/subject/{0}/'.format(self.subject.pk),
            'resource_uri': '/api/v1/offer/{0}/'.format(self.offer.pk)
        })

    def test_create_offer(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'offer_subject': 'my new offer',
            }
        self.response = self.login()
        self.assertHttpCreated(self.api_client.post('/api/v1/offer/', format='json', data=post_data))

    def test_create_offer_and_get(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'offer_subject': 'my new offer2',
            }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/offer/', format='json', data=post_data)
        self.assertEqual(self.deserialize(resp)['subject'], 'my new offer2')

    def test_create_duplicate_goal(self):
        post_data = {
            'user': '/api/v1/auth/user/{0}/'.format(self.user.pk),
            'offer_subject': 'learn django',
            }
        self.response = self.login()
        resp = self.api_client.post('/api/v1/offer/', format='json', data=post_data)
        self.assertEqual(self.deserialize(resp)['offer']['error'][0], 'Offer already exists')

    def test_put_detail(self):
        self.response = self.login()
        # Grab the current data & modify it slightly.
        original_data = self.deserialize(self.api_client.get(self.detail_url, format='json'))
        new_data = original_data.copy()
        new_data['offer_subject'] = 'learn erlang'

        self.assertEqual(Offer.objects.count(), 1)
        resp = self.api_client.put(self.detail_url, format='json', data=new_data)
        updated_offer = self.deserialize(resp)
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(Offer.objects.count(), 1)
        # Check for updated data.
        self.assertEqual(updated_offer['subject'], Subject.objects.get(description='learn erlang').description)

    def test_put_to_duplicate_detail(self):
        self.response = self.login()
        # Grab the current data & modify it slightly.
        original_data = self.deserialize(self.api_client.get(self.detail_url, format='json'))
        new_data = original_data.copy()
        new_data['offer_subject'] = 'learn django'

        self.assertEqual(Offer.objects.count(), 1)
        resp = self.api_client.put(self.detail_url, format='json', data=new_data)
        updated_goal = self.deserialize(resp)
        # Make sure the count hasn't changed & we did an update.
        self.assertEqual(Offer.objects.count(), 1)
        # Check for updated data.
        self.assertEqual(updated_goal['offer']['error'][0], "Offer already exists")

    def test_delete_detail(self):
        self.response = self.login()
        self.assertEqual(Offer.objects.count(), 1)
        self.assertHttpAccepted(self.api_client.delete(self.detail_url, format='json'))
        self.assertEqual(Goal.objects.count(), 0)