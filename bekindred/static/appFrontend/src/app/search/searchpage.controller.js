(function() {
    'use strict';

    angular
        .module('persice')
        .controller('SearchPageController', SearchPageController);

    /**
     * class SearchPageController
     * classDesc Search for users and events
     * @ngInject
     */
    function SearchPageController($scope, $log, $state, Search, query) {
        var vm = this;

        var previousSearch = Search.query;

        if (previousSearch.length > 0) {
            vm.query = previousSearch;
        }
        else {
            vm.query = query;
        }

        vm.isLoadingEvents = false;
        vm.isLoadingUsers = false;
        vm.results = {
            users: [],
            events: []
        };

        vm.noResults = {
            users: false,
            events: false
        };

        vm.emptySearch = true;

        Search.subscribe($scope, function searchResultsChanged(event, data) {
            switch (event.name) {
                case 'search.results.users':
                    vm.results.users = Search.getResults('users');
                    vm.isLoadingUsers = false;
                    if (vm.results.users.length === 0) {
                        vm.noResults.users = true;
                    } else {
                        vm.noResults.users = false;
                    }
                    break;
                case 'search.results.events':
                    vm.results.events = Search.getResults('events');
                    vm.isLoadingEvents = false;
                    if (vm.results.events.length === 0) {
                        vm.noResults.events = true;
                    } else {
                        vm.noResults.events = false;
                    }
                    break;
                case 'search.isloading.events':
                    vm.emptySearch = false;
                    vm.isLoadingEvents = true;
                    break;
                case 'search.isloading.users':
                    vm.emptySearch = false;
                    vm.isLoadingUsers = true;
                    break;
                case 'search.results.cleared':
                    vm.results = {
                        users: [],
                        events: []
                    };
                    vm.noResults = {
                        users: false,
                        events: false
                    };
                    vm.emptySearch = true;
                    break;
                default:
                    break;
            }

        });


    }



})();
