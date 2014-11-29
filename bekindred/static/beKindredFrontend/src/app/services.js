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
}])
.factory('MessagesFactory', ['$resource', function($resource){
  return $resource('/api/v1/messages/:messageId/:param',
    {messageId: '@messageId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        }
    });
}])
.factory('FiltersFactory', ['$resource', function($resource){
  return $resource('/api/v1/filter/state/:filterId/:param',
    {filterId: '@filterId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        },
        save: {
            method:'POST'
        },
        update: {
            method: 'PATCH'
        },
        delete: {
            method:'DELETE'
        }
    });
}])
.factory('PhotosFactory', ['$resource', function($resource){
  return $resource('/api/v1/photo/:photoId/:param',
    {photoId: '@photoId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        },
        save: {
            method:'POST'
        },
        update: {
            method: 'PATCH'
        },
        delete: {
            method:'DELETE'
        }
    });
}]);