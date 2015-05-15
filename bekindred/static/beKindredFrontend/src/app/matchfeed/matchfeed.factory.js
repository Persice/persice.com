'use strict';

angular.module('icebrak')
    .factory('MatchFeedFactory', function($resource) {
        return $resource('/api/v1/matchfeed/:matchId/:param', {
            matchId: '@matchId'
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
    });