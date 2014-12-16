'use strict';

angular.module('beKindred')
.factory('MatchFeedFactory', function ($resource) {
    return $resource('/feed/:userId/:param',
        {userId: '@userId'} , {
            query: {
                method: 'GET',
                isArray:false,
                cache : false
            },
            get: {
                method: 'GET',
                url: '/feed/:userId/',
                param: {userId: '@userId'},
                isArray: false,
                cache : false
            }
        });
});