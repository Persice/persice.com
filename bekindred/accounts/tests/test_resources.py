from tastypie.test import ResourceTestCase


class TestFacebookLoginResource(ResourceTestCase):
    def get_credentials(self):
        pass

    def test_simple_login_json(self):
        data = {
            'code': 'AQB9jmBjatAV7aww9UQBkHH5IxQDslZtKEw8KFyENcZoItIdoiezWJBUvypdudTGr4tsCQ6Z1Ijo7nUUuHxh7txHM71CvrOnSSnPMMEbqDECAKDSPN7mZzsz0JDjdncmW4oQWebF3MDvQEhyQPlE4N8GOqbVV2dROJwlzkPsJxosZ_UAW0YEa7s5QjIr_Escbs_aSeG_5KwhzZBvPSYvcb6uO6TkVaiWYuj2U3wlJosGsn85vtG5q_4yMnOmHVKyOoNd3D77Mu8VEIyEaU44P3jDFyFdPoWCfwaElHM3F-0Ks9jV0Iu08W7gHvyOvQbCIY9caOS8au-GiFD-V3rpKNwq#_=_',
            'redirectUri': 'http://test-local.com:8000/'
        }
        resp = self.api_client.post('/api/v2/accounts/facebook/login/',
                                    format='json', data=data)
        self.assertEqual(self.deserialize(resp), {})
