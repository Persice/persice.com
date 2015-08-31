(function() {
    'use strict';
    angular
    .module('persice')
    .factory('Search', Search);

    /**
     * class Search
     * classDesc Service for Searching
     * @ngInject
     */
     function Search($http, $log, $q, $rootScope, $sanitize, $timeout) {

        var baseUrl = '/api/v1/';

        var notify = notify;

        var service = {
            results: {
                users: [],
                events: []
            },
            query: '',
            error: '',
            isLoading: false,
            search: search,
            handleInput: handleInput,
            subscribe: subscribe,
            getResults: getResults,
            clearResultsAndQuery: clearResultsAndQuery
        };
        return service;

        function search(query, type) {
            var encodedQuery = $sanitize(query);
            service.isLoading = true;

            return $http({
                url: baseUrl + type + '/search/',
                params: {
                    q: encodedQuery,
                    page: 1
                },
                method: 'GET',
                cache: false
            });
        }

        function handleInput (val) {
            service.query = val;
            if (val.length === 0) {
                service.clearResultsAndQuery();
            }

            if (val.length > 0) {
                notify('search.isloading.users');
                notify('search.isloading.events');
                service.search(val, 'auth/user').then(function(response) {

                    service.results.users = response.data.objects;
                    notify('search.results.users');
                    service.isLoading = false;
                }, function(response) {

                });

                service.search(val, 'event').then(function(response) {

                    service.results.events = response.data.objects;
                    notify('search.results.events');
                    service.isLoading = false;
                }, function(response) {

                });

            }

        }


        function subscribe (scope, callback) {
            var handler1 = $rootScope.$on('search.results.users', callback);
            var handler2 = $rootScope.$on('search.results.events', callback);
            var handler3 = $rootScope.$on('search.isloading.users', callback);
            var handler4 = $rootScope.$on('search.isloading.events', callback);
            var handler5 = $rootScope.$on('search.results.cleared', callback);
            scope.$on('$destroy', handler1);
            scope.$on('$destroy', handler2);
            scope.$on('$destroy', handler3);
            scope.$on('$destroy', handler4);
            scope.$on('$destroy', handler5);
        }

        function getResults (type) {
            return service.results[type];
        }

        function clearResultsAndQuery (type) {
            service.results = {
                users: [],
                events: []
            };
            service.query = '';
            notify('search.results.cleared');
        }

        function notify (event) {
            $rootScope.$emit(event);
        }

    }

})();
