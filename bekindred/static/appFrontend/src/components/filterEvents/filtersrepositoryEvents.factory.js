(function() {
    'use strict';
    angular
        .module('persice')
        .factory('EventsFilterRepository', EventsFilterRepository);

    /**
     * class EventsFilterRepository
     * classDesc Service for Events Filter
     * @ngInject
     */
    function EventsFilterRepository(EventsFiltersFactory, $log, $filter, $rootScope, USER_ID, $q) {

        var defaultState = {
            distance: 10000,
            keyword: '',
            order_criteria: 'distance',
            user: '/api/v1/auth/user/' + USER_ID + '/'
        };

        var service = {
            filterState: null,
            filterId: null,
            getFilters: getFilters,
            saveFilters: saveFilters,
            createFilters: createFilters,
            getFilterState: getFilterState,
        };
        return service;


        function getFilters() {
            var deferred2 = $q.defer();


            EventsFiltersFactory.query({
                format: 'json'
            }, getFiltersComplete, getFiltersFailed);

            return deferred2.promise;

            function getFiltersComplete(response) {
                if (response.objects.length === 0) {
                    service.createFilters(defaultState);
                    service.filterState = defaultState;
                    deferred2.resolve(defaultState);
                } else {
                    service.filterId = response.objects[0].id;
                    service.filterState = response.objects[0];
                    deferred2.resolve(response.objects[0]);
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
                deferred2.reject(message);

            }
        }

        function getFilterState() {
            return service.filterState;
        }


        function saveFilters(newFilters) {
            if (service.filterId === null) {
                return;
            }

            var deferred = $q.defer();



            EventsFiltersFactory.update({
                filterId: service.filterId
            }, newFilters, saveFiltersSuccess, saveFiltersError);

            return deferred.promise;

            function saveFiltersSuccess(response) {
                deferred.resolve();
                service.filterState = newFilters;

            }

            function saveFiltersError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
                deferred.reject();


            }

        }

        function createFilters(newFilters) {

            return EventsFiltersFactory.save(newFilters, createFiltersSuccess, createFiltersError);

            function createFiltersSuccess(response) {
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
