(function(){
  'use strict';

  /**
   * class InterestsController
   * classDesc Select interests and activities during onboard user flow
   * @ngInject
   */
   function InterestsController (InterestsFactory) {
    var vm = this;

    vm.interestsResult = {
      'meta': {
        'limit': 20,
        'next': null,
        'offset': 0,
        'previous': null,
        'total_count': 6
      },
      'objects': [
      {
        'description': 'tennis',
        'id': 1,
        'resource_uri': '/api/v1/interest/1/',
        'user': '/api/v1/auth/user/2/'
      },
      {
        'description': 'basketball',
        'id': 2,
        'resource_uri': '/api/v1/interest/2/',
        'user': '/api/v1/auth/user/2/'
      },
      {
        'description': 'mountain biking',
        'id': 3,
        'resource_uri': '/api/v1/interest/3/',
        'user': '/api/v1/auth/user/2/'
      },
      {
        'description': 'kitesurfing',
        'id': 4,
        'resource_uri': '/api/v1/interest/4/',
        'user': '/api/v1/auth/user/2/'
      },
      {
        'description': 'golf',
        'id': 5,
        'resource_uri': '/api/v1/interest/5/',
        'user': '/api/v1/auth/user/2/'
      },
      {
        'description': 'literature',
        'id': 6,
        'resource_uri': '/api/v1/interest/6/',
        'user': '/api/v1/auth/user/2/'
      }
      ]
    };

    vm.interests = vm.interestsResult.objects;

  }

  angular
  .module('beKindred')
  .controller('InterestsController', InterestsController);




})();