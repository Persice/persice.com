(function() {
    'use strict';

    angular
        .module('persice')
        .controller('EventViewController', EventViewController);

    /**
     * class EventViewController
     * classDesc Create event
     * @ngInject
     */
    function EventViewController($scope, USER_ID, EventsFactory, $state, eventId, $rootScope, $log, $window, angularMomentConfig, MembersFactory) {
        var vm = this;
        vm.showMobile = true;
        vm.mapurl = '';
        vm.mapurlTrue = false;
        vm.event = {};
        vm.eventNotFound = false;
        vm.editEvent = editEvent;
        vm.openChat = openChat;

        vm.eventLocation = '';

        $scope.eventpage.header = 'Event Details';

        vm.placeholder = {
            name: 'Event Name',
            starts: 'Starts',
            ends: 'Ends',
            repeat: 'Repeat',
            location: 'Location',
            description: 'Description',
            costs: 'Costs',
            invitations: 'Invitations',
            attachments: 'Attachments'
        };

        vm.eventRsvp = {
            status: ''
        };

        vm.changeRsvpStatus = changeRsvpStatus;
        vm.openMap = openMap;
        vm.getEvent = getEvent;

        vm.openAttendees = openAttendees;


        function openAttendees() {
            $state.go('event.attendees', {
                eventId: eventId
            });
        }

        $scope.$on('goBackEvents', function() {
            if ($rootScope.previousEventFeed !== undefined) {
                $state.go($rootScope.previousEventFeed);
            } else {
                $state.go('events.myevents.list');
            }


        });

        function editEvent() {
            $state.go('event.edit', {
                eventId: eventId
            });
        }

        function openChat() {
            $state.go('event.chat', {
                eventId: eventId,
                eventName: vm.event.name
            });
        }


        vm.isHost = null;

        function changeRsvpStatus(newStatus) {
            var member = {
                event: '/api/v1/event/' + vm.event.id + '/',
                rsvp: newStatus,
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            //change RSVP status if different than previous
            if (vm.eventRsvp.status !== newStatus) {
                //check if member is already created.
                if (vm.memberExists) {
                    vm.eventRsvp.status = newStatus;
                    //update rsvp status
                    MembersFactory.update({
                            memberId: vm.memberId
                        }, member,
                        function(success) {
                            for (var i = vm.event.members.length - 1; i >= 0; i--) {

                                if (vm.event.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {

                                    vm.event.members[i].rsvp = newStatus;
                                }

                            }
                            vm.getEvent();
                        },
                        function(error) {


                        });

                } else {
                    vm.eventRsvp.status = newStatus;
                    // create new member first with new rsvp status
                    MembersFactory.save({}, member,
                        function(success) {
                            vm.memberExists = true;
                            vm.event.members.push(success);
                            vm.memberId = success.id;
                        },
                        function(error) {

                        });
                }

            }
        }

        vm.getEvent();

        function getEvent() {

            vm.loadingEvent = true;
            EventsFactory.query({
                format: 'json'
            }, {
                eventId: eventId
            }).$promise.then(function(data) {
                vm.eventNotFound = false;
                vm.event = data;
                vm.eventLocation = '';
                vm.mapurlTrue = false;
                vm.mapurl = '';

                if (vm.event.location !== '0,0') {


                    if (vm.event.full_address !== '' && vm.event.full_address !== null) {
                        vm.eventLocation = vm.event.full_address;
                    } else {
                        vm.eventLocation = vm.event.street + ' ' + vm.event.city + ' ' + vm.event.zipcode + ' ' + vm.event.state;
                    }

                    vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation) + '/@' + vm.event.location + ',15z';
                    vm.mapurlTrue = true;

                } else {
                    vm.mapurlTrue = false;
                    vm.mapurl = '';
                    vm.eventLocation = vm.event.location_name;
                }


                //convert datetime to local timezone
                vm.starts_on_date = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('dddd, MMMM D, YYYY');
                vm.ends_on_date = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('dddd, MMMM D, YYYY');
                vm.starts_on_time = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('h:mm A');
                vm.ends_on_time = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('h:mm A ') + moment.tz(angularMomentConfig.timezone).format('z');



                if (vm.ends_on_date !== vm.starts_on_date) {
                    vm.firstrow = vm.starts_on_date + ' ' + vm.starts_on_time;
                    vm.secondrow = vm.ends_on_date + ' ' + vm.ends_on_time;
                } else {
                    vm.firstrow = vm.starts_on_date;
                    vm.secondrow = vm.starts_on_time + ' to ' + vm.ends_on_time;
                }


                vm.isHost = false;
                $scope.eventpage.isHost.option = false;
                $scope.eventpage.eventId = vm.event.id;


                vm.eventRsvp = {
                    status: vm.event.rsvp
                };
                vm.memberExists = false;
                vm.memberId = null;
                if (vm.event.members.length > 0) {
                    for (var i = vm.event.members.length - 1; i >= 0; i--) {
                        if (vm.event.members[i].is_organizer === true) {
                            if (vm.event.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {
                                vm.isHost = true;
                                $scope.eventpage.isHost.option = true;
                            }
                        } else {
                            if (vm.event.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {
                                vm.memberId = vm.event.members[i].id;
                                if (vm.event.members[i].rsvp !== null) {
                                    vm.eventRsvp.status = vm.event.members[i].rsvp;
                                }

                                vm.memberExists = true;

                            }
                        }
                    }
                }


                vm.loadingEvent = false;

            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                vm.loadingEvent = false;
                vm.eventNotFound = true;


            });
        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }



    }



})();
