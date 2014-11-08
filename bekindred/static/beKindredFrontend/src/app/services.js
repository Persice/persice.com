'use strict';
angular.module('beKindred')
.factory('GoalsFactory', ['$resource', function($resource){
  return $resource('/api/v1/goals/:goalId/:param',
    {goalId: '@goalId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        }
    });
}]);