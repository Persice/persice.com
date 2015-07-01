(function() {
    'use strict';

    /**
     * @desc display for user profile
     * @example <user-profile></user-profile>
     */
    angular
        .module('icebrak')
        .directive('eventsFeed', eventsFeed);

    function eventsFeed() {
        var directive = {
            controller: EventsFeedController,
            controllerAs: 'eventsfeed',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class',
                header: '@header',
                body: '@body',
                type: '@type'
            },
            link: link,
            templateUrl: 'components/eventsfeed/eventsfeed.directive.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }

    /**
     * @desc controller for eventsFeed directive
     * @ngInject
     */
    function EventsFeedController($scope, USER_ID, $rootScope, FeedEventsFriendsFactory, FeedEventsAllFactory, FeedEventsMyFactory, $resource, $log, $timeout, $q, $http, $filter, $state, moment, $window) {
        var vm = this;
        vm.noEvents = false;
        vm.pok = false;
        vm.noResults = false;
        vm.noEvents = false;
        vm.loading = false;
        vm.loadingMore = false;
        vm.nextOffset = 10;
        vm.next = null;

        vm.getEvents = getEvents;
        vm.loadMoreEvents = loadMoreEvents;
        vm.gotoEvent = gotoEvent;
        vm.events = [];

        vm.getEvents();


        $rootScope.$on('refreshEventFeed', function(event, data) {
            $('.right.sidebar.eventsfeedfilter').sidebar('hide');
            vm.getEvents();
        });


        function getEvents() {
            vm.nextOffset = 10;
            vm.next = null;
            vm.loading = true;
            vm.noEvents = false;

            if (vm.type === 'mynetwork') {
                vm.EventsFeed = $resource('/api/v1/feed/events/friends/:eventId/:param', {
                    eventId: '@eventId'
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
            }


            if (vm.type === 'allevents') {
                vm.EventsFeed = $resource('/api/v1/feed/events/all/:eventId/:param', {
                    eventId: '@eventId'
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
            }

            if (vm.type === 'myevents') {
                vm.EventsFeed = $resource('/api/v1/feed/events/my/:eventId/:param', {
                    eventId: '@eventId'
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
            }



            vm.EventsFeed.query({
                format: 'json',
                limit: 10,
                offset: 0
            }).$promise.then(function(data) {
                    var responseEvents = data.objects;
                    vm.events = [];

                    $filter('orderBy')(responseEvents, 'starts_on', true);
                    vm.next = data.meta.next;

                    if (data.objects.length === 0) {

                        vm.noEvents = true;

                    }

                    for (var obj in responseEvents) {
                        var localDate = $filter('amDateFormat')(responseEvents[obj].starts_on, 'dddd, MMMM Do YYYY');
                        var today = moment().format('dddd, MMMM Do YYYY');
                        $log.info(today);
                        if (localDate === today) {
                            localDate = 'Today';
                        }
                        var localDatePlain = $filter('amDateFormat')(responseEvents[obj].starts_on, 'L');

                        var eventIndex = $filter('getIndexByProperty')('date', localDate, vm.events);

                        if (eventIndex === null) {
                            vm.events.push({
                                date: localDate,
                                realDate: localDatePlain,
                                items: []
                            });
                            eventIndex = vm.events.length - 1;
                        }

                        vm.events[eventIndex].items.push({
                            id: responseEvents[obj].id,
                            name: responseEvents[obj].name,
                            street: responseEvents[obj].street,
                            city: responseEvents[obj].city,
                            state: responseEvents[obj].state,
                            zipcode: responseEvents[obj].zipcode,
                            description: responseEvents[obj].description,
                            location: responseEvents[obj].location,
                            starts_on: responseEvents[obj].starts_on,
                            ends_on: responseEvents[obj].ends_on,
                            full_address: responseEvents[obj].full_address,
                            location_name: responseEvents[obj].location_name,
                            country: responseEvents[obj].country,
                            repeat: responseEvents[obj].repeat,
                            friend_attendees_count: responseEvents[obj].friend_attendees_count,
                            cumulative_match_score: responseEvents[obj].cumulative_match_score,
                            distance: responseEvents[obj].distance
                        });

                        vm.events[eventIndex].items = $filter('orderBy')(vm.events[eventIndex].items, 'starts_on', true);
                    }

                    vm.events = $filter('orderBy')(vm.events, 'starts_on', true);


                    vm.loading = false;


                },
                function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;

                    $log.error(message);

                    vm.noEvents = true;

                    vm.loading = false;

                });

        }

        function loadMoreEvents() {
            var deferred = $q.defer();



            if (vm.next === null) {
                deferred.reject();
                return deferred.promise;
            }

            if (!vm.loadingMore) {

                vm.loadingMore = true;
                vm.EventsFeed.query({
                    format: 'json',
                    limit: 10,
                    offset: vm.nextOffset
                }).$promise.then(function(data) {
                        var responseEvents = data.objects;
                        vm.nextOffset += 10;

                        $filter('orderBy')(responseEvents, 'starts_on', true);
                        vm.next = data.meta.next;

                        for (var obj in responseEvents) {
                            var localDate = $filter('amDateFormat')(responseEvents[obj].starts_on, 'dddd, MMMM Do YYYY');
                            var today = moment().format('dddd, MMMM Do YYYY');
                            $log.info(today);
                            if (localDate === today) {
                                localDate = 'Today';
                            }
                            var localDatePlain = $filter('amDateFormat')(responseEvents[obj].starts_on, 'L');

                            var eventIndex = $filter('getIndexByProperty')('date', localDate, vm.events);

                            if (eventIndex === null) {
                                vm.events.push({
                                    date: localDate,
                                    realDate: localDatePlain,
                                    items: []
                                });
                                eventIndex = vm.events.length - 1;
                            }

                            vm.events[eventIndex].items.push({
                                id: responseEvents[obj].id,
                                name: responseEvents[obj].name,
                                street: responseEvents[obj].street,
                                city: responseEvents[obj].city,
                                state: responseEvents[obj].state,
                                zipcode: responseEvents[obj].zipcode,
                                description: responseEvents[obj].description,
                                location: responseEvents[obj].location,
                                full_address: responseEvents[obj].full_address,
                                location_name: responseEvents[obj].location_name,
                                country: responseEvents[obj].country,
                                starts_on: responseEvents[obj].starts_on,
                                ends_on: responseEvents[obj].ends_on,
                                repeat: responseEvents[obj].repeat,
                                friend_attendees_count: responseEvents[obj].friend_attendees_count,
                                cumulative_match_score: responseEvents[obj].cumulative_match_score,
                                distance: responseEvents[obj].distance

                            });

                            vm.events[eventIndex].items = $filter('orderBy')(vm.events[eventIndex].items, 'starts_on', true);
                        }

                        vm.events = $filter('orderBy')(vm.events, 'starts_on', true);



                        vm.loadingMore = false;
                        deferred.resolve();


                    },
                    function(response) {
                        deferred.reject();
                        var data = response.data,
                            status = response.status,
                            header = response.header,
                            config = response.config,
                            message = 'Error ' + status;

                        $log.error(message);

                        vm.loadingMore = false;
                        deferred.reject();

                    });


            } else {
                deferred.reject();
            }


            return deferred.promise;
        }

        function gotoEvent(id) {
            var w = angular.element($window);

            if (w.width() > 767) {
                $rootScope.$broadcast('openViewEventModal', id);
            } else {
                $state.go('event.details', {
                    eventId: id
                });
            }



        }



    }



})();