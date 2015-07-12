'use strict';
angular
    .module('persice')
    .factory('SettingsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/settings/:settingId/:param', {
            settingId: '@settingId'
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