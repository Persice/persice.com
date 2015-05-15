(function() {
    'use strict';
    angular
        .module('icebrak')
        .factory('FilterRepository', FilterRepository);

    /**
     * class FilterRepository
     * classDesc Service for Filter
     * @ngInject
     */
    function FilterRepository(FiltersFactory, $log, $filter, $rootScope, USER_ID) {

        var defaultState = {
            distance: 10000,
            gender: 'm,f',
            min_age: 25,
            max_age: 60,
            keyword: '',
            order_criteria: 'match_score',
            user: '/api/v1/auth/user/' + USER_ID + '/'
        };

        var service = {
            filterState: {
                distance: 10000,
                gender: 'm,f',
                min_age: 25,
                max_age: 60,
                order_criteria: 'match_score',
                keyword: '',
                user: '/api/v1/auth/user/' + USER_ID + '/'
            },
            filterId: null,
            getFilters: getFilters,
            saveFilters: saveFilters,
            createFilters: createFilters,
            getFilterState: getFilterState
        };
        return service;



        function getFilters() {
            $log.info('fetching filters');
            return FiltersFactory.query({
                format: 'json'
            }).$promise.then(getFiltersComplete, getFiltersFailed);

            function getFiltersComplete(response) {
                if (response.objects.length === 0) {
                    service.createFilters(defaultState);
                    service.filterState = defaultState;
                } else {
                    service.filterId = response.objects[0].id;
                    service.filterState = response.objects[0];
                    $rootScope.$broadcast('refreshFilters');
                }
            }

            function getFiltersFailed(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
                service.filterState = defaultState;
                $rootScope.$broadcast('refreshFilters');
            }
        }

        function getFilterState() {
            return service.filterState;
        }


        function saveFilters(newFilters) {
            $log.info('saving filters');

            if (service.filterId === null) {
                return;
            }



            return FiltersFactory.update({
                filterId: service.filterId
            }, newFilters, saveFiltersSuccess, saveFiltersError);

            function saveFiltersSuccess(response) {
                service.filterState = newFilters;
                $rootScope.$broadcast('refreshFilters');
            }

            function saveFiltersError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);


            }

        }

        function createFilters(newFilters) {
            $log.info('creating filters');

            return FiltersFactory.save(newFilters, createFiltersSuccess, createFiltersError);

            function createFiltersSuccess(response) {
                $log.info('new filters created');
                service.filterId = response.id;
            }

            function createFiltersError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);


            }

        }



    }

})();