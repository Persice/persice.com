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
    function EventsFeedController($scope, USER_ID, EventsFactory, $resource, $log, $timeout, $q, $http, $filter, $state) {
        var vm = this;
        vm.noEvents = false;
        vm.pok = false;
        vm.noResults = false;
        vm.loading = false;
        vm.loadingMore = false;
        vm.nextOffset = 10;
        vm.next = null;

        vm.getEvents = getEvents;
        vm.loadMoreEvents = loadMoreEvents;
        vm.gotoEvent = gotoEvent;

        // vm.getEvents();

        // vm.events = [];
        vm.events = [{
                date: 'Today',
                items: [{
                        user: '/api/v1/auth/user/1/',
                        description: 'Mountain Bike Ride',
                        ends_on: null,
                        location: '7000,22965.83',
                        street: 'China Camp State Park',
                        city: 'San Rafael',
                        state: 'CA',
                        zipcode: '94901',
                        name: 'Mountain Bike Ride',
                        repeat: 'W',
                        starts_on: null,
                        common_goals_offers_interests: 10,
                        totalFriends: 3,
                        distance: '45 miles away'
                    },
                    {
                        user: '/api/v1/auth/user/1/',
                        description: 'Hiking for Tech Geeks',
                        ends_on: null,
                        location: '7000,22965.83',
                        street: 'Hiking for Tech Geeks',
                        city: 'San Rafael',
                        state: 'CA',
                        zipcode: '94901',
                        name: 'Hiking for Tech Geeks',
                        repeat: 'W',
                        starts_on: null,
                        common_goals_offers_interests: 5,
                        totalFriends: 2,
                        distance: '38 miles away'
                    },
                    ]
            },
            {
                date: 'Sunday, May 10, 2015',
                items: [{
                        user: '/api/v1/auth/user/1/',
                        description: 'Kiteboarding Session',
                        ends_on: null,
                        location: '7000,22965.83',
                        street: 'China Camp State Park',
                        city: 'San Rafael',
                        state: 'CA',
                        zipcode: '94901',
                        name: 'Kiteboarding Session',
                        repeat: 'W',
                        starts_on: null,
                        common_goals_offers_interests: 6,
                        totalFriends: 5,
                        distance: '15 miles away'
                    },
                    {
                        user: '/api/v1/auth/user/1/',
                        description: 'Salsa Dancing Lesson',
                        ends_on: null,
                        location: '7000,22965.83',
                        street: 'China Camp State Park',
                        city: 'San Rafael',
                        state: 'CA',
                        zipcode: '94901',
                        name: 'Salsa Dancing Lesson',
                        repeat: 'W',
                        starts_on: null,
                        common_goals_offers_interests: 4,
                        totalFriends: 9,
                        distance: '10 miles away'
                    },
                    ]
            }];

        function getEvents() {
            vm.nextOffset = 10;
            vm.next = null;
            vm.loading = true;
            EventsFactory.query({
                format: 'json',
                limit: 10,
                offset: 0
            }).$promise.then(function(data) {

                    vm.events = data.objects;
                    vm.next = data.meta.next;


                    if (vm.events.length === 0) {
                        if (!vm.pok) {
                            vm.noEvents = true;
                            vm.pok = true;
                        } else {
                            vm.noResults = true;
                        }
                    } else {
                        vm.pok = true;
                        vm.noResults = false;
                        vm.noEvents = false;
                        //count mutual friends
                        for (var obj in vm.events) {
                            vm.events[obj].totalEvents = 0;
                            vm.events[obj].totalEvents += vm.events[obj].mutual_bk_friends_count;
                            vm.events[obj].totalEvents += vm.events[obj].mutual_fb_friends_count;
                            vm.events[obj].totalEvents += vm.events[obj].mutual_linkedin_connections_count;
                            vm.events[obj].totalEvents += vm.events[obj].mutual_twitter_friends_count;
                            vm.events[obj].totalEvents += vm.events[obj].mutual_twitter_followers_count;
                        }
                    }

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
                EventsFactory.query({
                    format: 'json',
                    limit: 10,
                    offset: vm.nextOffset
                }).$promise.then(function(data) {

                        var responseData = data.objects;
                        vm.next = data.meta.next;

                        vm.nextOffset += 10;

                        //count mutual events
                        for (var obj in responseData) {
                            responseData[obj].totalEvents = 0;
                            responseData[obj].totalEvents += responseData[obj].mutual_bk_friends_count;
                            responseData[obj].totalEvents += responseData[obj].mutual_fb_friends_count;
                            responseData[obj].totalEvents += responseData[obj].mutual_linkedin_connections_count;
                            responseData[obj].totalEvents += responseData[obj].mutual_twitter_friends_count;
                            responseData[obj].totalEvents += responseData[obj].mutual_twitter_followers_count;
                            vm.events.push(responseData[obj]);
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

                    });


            } else {
                deferred.reject();
            }


            return deferred.promise;
        }

        function gotoEvent(index) {

            $state.go('eventdetails', {
                eventId: vm.events[index].id
            });



        }



    }



})();