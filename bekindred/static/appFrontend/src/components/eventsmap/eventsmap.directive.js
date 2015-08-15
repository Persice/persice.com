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
    function EventsMapController($scope, USER_ID, $rootScope, FeedEventsFriendsFactory, FeedEventsAllFactory, FeedEventsMyFactory, $resource, $log, $timeout, $q, $http, $filter, $state, moment, $window, $geolocation) {
        var vm = this;

        vm.eventMarkers = [];

        vm.loading = true;
        vm.loadingLocation = true;


        vm.noEvents = false;
        vm.pok = false;
        vm.noResults = false;
        vm.noEvents = false;
        vm.loading = false;
        vm.loadingMore = false;
        vm.nextOffset = 100;
        vm.next = null;

        vm.getEvents = getEvents;
        vm.loadMoreEvents = loadMoreEvents;
        vm.gotoEvent = gotoEvent;
        vm.events = [];


        vm.getEvents();


        $rootScope.$on('refreshEventFeed', function(event, data) {
            $('.right.sidebar.eventsfeedfilter').sidebar('hide');
            if ($state.current.name.indexOf("map") > -1) {
                vm.getEvents();
            }

        });

        function sortByDist(a, b) {
            return (a.distance - b.distance)
        }

        function findClosestN(pt, numberOfResults, data) {
            var closest = [];
            var point = new google.maps.LatLng(pt.latitude, pt.longitude);
            for (var i = 0; i < data.length; i++) {
                data[i].distance = google.maps.geometry.spherical.computeDistanceBetween(point, data[i].getPosition());
                closest.push(data[i]);
            }
            closest.sort(sortByDist);
            return closest.splice(0, numberOfResults);
        }




        function drawMarkers(locations) {
            vm.loadingLocation = true;
            $geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 60000,
                maximumAge: 2
            }).then(function(location) {
                vm.currentLocation = {
                    latitude: parseFloat(location.coords.latitude),
                    longitude: parseFloat(location.coords.longitude),
                };

                vm.eventMarkers.push({
                    title: 'Your current location',
                    latitude: parseFloat(location.coords.latitude),
                    longitude: parseFloat(location.coords.longitude),
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        strokeWeight: 5,
                        fillColor: '#0099FF',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                    },
                });
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                var markers = [];

                for (i = 0; i < locations.length; i++) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
                        map: map,
                        title: locations[i].title,
                        animation: google.maps.Animation.DROP,
                        icon: locations[i].icon,
                    });
                    markers.push(marker);

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infowindow.setContent(locations[i].title);
                            infowindow.open(map, marker);
                        }
                    })(marker, i));
                }

                //set zoom level to show at least two closest markers

                var closestMarkers = findClosestN(vm.currentLocation, 4, markers);

                var bounds = new google.maps.LatLngBounds();
                for (i = 0; i < closestMarkers.length; i++) {
                    bounds.extend(closestMarkers[i].getPosition());
                }
                map.fitBounds(bounds);

                //remove one zoom level to ensure no marker is on the edge.
                map.setZoom(map.getZoom() - 1);

                // set a minimum zoom
                // if we have only 1 marker or all markers are on the same address map will be zoomed too much.
                if (map.getZoom() > 15) {
                    map.setZoom(15);
                }
                vm.loadingLocation = false;
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


                        var localDate = $filter('amDateFormat')(responseEvents[obj].starts_on, 'dddd, MMMM Do YYYY');

                        vm.events.push({
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
                            distance: responseEvents[obj].distance,
                            date: localDate
                        });

                        var loc = responseEvents[obj].location.split(',');
                        vm.eventMarkers.push({
                            title: responseEvents[obj].name,
                            latitude: parseFloat(loc[0]),
                            longitude: parseFloat(loc[1])
                        });


                    }
                    drawMarkers(vm.eventMarkers);


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
                        vm.next = data.meta.next;

                        for (var obj in responseEvents) {
                            var localDate = $filter('amDateFormat')(responseEvents[obj].starts_on, 'dddd, MMMM Do YYYY');

                            vm.events.push({
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
                                distance: responseEvents[obj].distance,
                                date: localDate

                            });

                        }
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
