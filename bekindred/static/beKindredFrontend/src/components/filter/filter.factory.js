'use strict';
angular.module('icebrak')
  .factory('FiltersFactory', ['$resource', function($resource) {
    return $resource('/api/v1/filter/state/:filterId/:param', {
      filterId: '@filterId'
    }, {
      query: {
        method: 'GET',
        isArray: false,
        cache: false
      },
      save: {
        method: 'POST'
      },
      update: {
        method: 'PATCH'
      },
      delete: {
        method: 'DELETE'
      }
    });
}]);