(function() {
    'use strict';

    angular
        .module('persice')
        .controller('EventAttendeesController', EventAttendeesController);

    /**
     * class EventAttendeesController
     * classDesc view event attendees
     * @ngInject
     */
    function EventAttendeesController($scope, USER_ID, EventsFactory, $state, eventId, $rootScope, $log, $window, EventsAttendees) {
        var vm = this;

        vm.getAttendees = getAttendees;
        vm.getEvent = getEvent;

        vm.loadingEvent = false;

        vm.event = {};

        vm.attendees = {
            yes: {
                data: [],
                alreadyLoaded: false,
                filtered: [],
                filters: {
                    firstName: '',
                    rsvp: 'yes',
                    event: eventId
                },
                loading: false,
                noResults: false,
                nextOffset: 10,
                next: null,
                count: 0
            },
            no: {
                data: [],
                alreadyLoaded: false,
                filtered: [],
                filters: {
                    firstName: '',
                    rsvp: 'no',
                    event: eventId
                },
                loading: false,
                noResults: false,
                nextOffset: 10,
                next: null,
                count: 0
            },
            maybe: {
                data: [],
                alreadyLoaded: false,
                filtered: [],
                filters: {
                    firstName: '',
                    rsvp: 'maybe',
                    event: eventId
                },
                loading: false,
                noResults: false,
                nextOffset: 10,
                next: null,
                count: 0
            },
        };





        $scope.eventpage.header = 'Attendees';

        $scope.$on('goBackEvents', function() {
            $state.go('event.details', {
                eventId: eventId
            });

        });

        vm.getEvent();
        vm.getAttendees('yes');
        vm.getAttendees('no');
        vm.getAttendees('maybe');



        function getEvent() {
            vm.loadingEvent = true;
            EventsFactory.query({
                format: 'json'
            }, {
                eventId: eventId
            }).$promise.then(function(data) {
                vm.event = data;
                vm.loadingEvent = false;

            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                vm.loadingEvent = false;
            });
        }


        function getAttendees(type) {
            vm.attendees[type].next = null;
            vm.attendees[type].loading = true;

            EventsAttendees.query({
                format: 'json',
                limit: 1000,
                offset: 0,
                rsvp: vm.attendees[type].filters.rsvp,
                event: vm.attendees[type].filters.event,
                user__first_name__icontains: vm.attendees[type].filters.firstName
            }).$promise.then(getAttendeesSuccess, getAttendeesFailure);

            function getAttendeesSuccess(response) {

                vm.attendees[type].loading = false;

                if (!vm.attendees[type].alreadyLoaded) {
                    vm.attendees[type].count = response.meta.total_count;
                }
                vm.attendees[type].alreadyLoaded = true;


                if (response.objects.length === 0) {
                    vm.attendees[type].data = [];
                    vm.attendees[type].noResults = true;
                } else {
                    vm.attendees[type].data = response.objects;
                    vm.attendees[type].next = response.meta.next
                    vm.attendees[type].noResults = false;
                }

            }

            function getAttendeesFailure(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;

                $log.error(message);
                vm.attendees[type].noResults = true;
                vm.attendees[type].loading = false;

            }
        }


    }



})();
