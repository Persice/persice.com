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


        var service = {
            results: [],
            query: '',
            error: '',
            isLoading: false,
            search: search,
            handleInput: handleInput
        };
        return service;

        function search(query) {
            var encodedQuery = $sanitize(query);

            service.isLoading = true;

            return $http({
                url: ' ',
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

            if (val) {
                // service.search(val).then(function(response) {

                //     $log.info(response);

                // }, function(response) {

                // });

            }
        }





    }

})();
