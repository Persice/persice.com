(function() {
    'use strict';

    /**
     * @desc display for events map
     * @example <events-map></events-map>
     */
    angular
        .module('persice')
        .directive('eventsMap', eventsMap);

    function eventsMap() {
        var directive = {
            controller: EventsMapController,
            controllerAs: 'eventsmap',
            bindToController: true,
            link: link,
            transclude: true,
            templateUrl: 'components/eventsmap/eventsmap.tpl.html',
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
    function EventsMapController($scope, USER_ID, $rootScope, FeedEventsFriendsFactory, FeedEventsAllFactory, FeedEventsMyFactory, $resource, $log, $timeout, $q, $http, $filter, $state, moment, $window, LocationFactory) {
        var vm = this;

        vm.eventMarkers = [];

        vm.loading = false;
        vm.loadingLocation = false;


        vm.noEvents = false;
        vm.pok = false;
        vm.noResults = false;
        vm.noEvents = false;
        vm.loading = false;
        vm.loadingMore = false;
        vm.nextOffset = 100;
        vm.next = null;

        vm.locationError = false;

        vm.getEvents = getEvents;
        vm.gotoEvent = gotoEvent;
        vm.events = [];


        vm.getEvents();


        $rootScope.$on('refreshEventFeed', function(event, data) {
            $('.right.sidebar.eventsfeedfilter').sidebar('hide');
            if ($state.current.name.indexOf("map") > -1) {
                vm.getEvents();
            }

        });

        function drawMap(locations) {
            vm.loadingLocation = true;
            vm.locationError = false;
            LocationFactory.query({
                format: 'json'
            }).$promise.then(function(data) {

                vm.loadingLocation = false;

                if (data.meta.total_count > 0) {

                    var serverLocation = data.objects[0].position.split(',');

                    vm.currentLocation = {
                        latitude: serverLocation[0],
                        longitude: serverLocation[1]
                    };

                    vm.eventMarkers.push({
                        title: 'Your current location',
                        latitude: parseFloat(vm.currentLocation.latitude),
                        longitude: parseFloat(vm.currentLocation.longitude),
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            strokeWeight: 5,
                            fillColor: '#0099FF',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                        },
                    });

                    var data = {
                        locations: vm.eventMarkers,
                        center: vm.currentLocation
                    };

                    $scope.$broadcast('drawMap', data);


                } else {

                    //there is no support for geolocation HTML5 javascript API, draw map without user location
                    // vm.locationError = true;
                    $scope.$broadcast('drawMapWithoutCenter', vm.eventMarkers);

                }

            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                $log.error(message);


            });

        }


        function getEvents() {
            vm.nextOffset = 100;
            vm.next = null;
            vm.loading = true;
            vm.noEvents = false;

            if ($state.is('events.mynetwork.map')) {
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


            if ($state.is('events.allevents.map')) {
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

            if ($state.is('events.myevents.map')) {
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

            vm.eventMarkers = [];
            vm.EventsFeed.query({
                format: 'json',
                limit: 100,
                offset: 0,
                filter: true
            }).$promise.then(function(data) {
                    var responseEvents = data.objects;
                    vm.events = [];

                    vm.next = data.meta.next;

                    if (data.objects.length === 0) {

                        vm.noEvents = true;

                    }

                    for (var obj in responseEvents) {


                        var loc = responseEvents[obj].location.split(',');
                        vm.eventMarkers.push({
                            title: responseEvents[obj].name,
                            latitude: parseFloat(loc[0]),
                            longitude: parseFloat(loc[1])
                        });


                    }
                    drawMap(vm.eventMarkers);


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
