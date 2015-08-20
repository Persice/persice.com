(function() {
    'use strict';

    /**
     * @desc display modal
     * @example <ui-event-view-modal></ui-event-view-modal>
     */
    angular
        .module('frontend.semantic.modal.event.view', [])

    .directive('uiEventViewModal', uiEventViewModal);

    function uiEventViewModal($log) {
        var directive = {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: {
                show: '=show',
                eventid: '=eventid'
            },
            templateUrl: 'components/modal/modalview.html',
            controller: EventViewModalController,
            controllerAs: 'viewevent',
            bindToController: true,
            link: link,
        };
        return directive;

        function link(scope, element, attrs, viewevent) {
            element.modal({
                onHide: function() {
                    scope.viewevent.show = false;
                    scope.viewevent.selection = 'view';
                    scope.viewevent.eventNotFound = false;
                    scope.viewevent.header = 'Event Details';
                    scope.viewevent.modalId = 'viewEventsModal';
                },
                onHidden: function() {
                    scope.viewevent.show = false;
                    scope.viewevent.selection = 'view';
                    scope.viewevent.eventNotFound = false;
                    scope.viewevent.header = 'Event Details';
                    scope.viewevent.modalId = 'viewEventsModal';
                }
            });

            element.modal({
                onShow: function() {
                    scope.viewevent.selection = 'view';
                    scope.viewevent.eventNotFound = false;
                    scope.viewevent.header = 'Event Details';
                    scope.viewevent.modalId = 'viewEventsModal';
                    element.addClass('small');
                }
            });


            scope.viewevent.getActiveClass = function() {
                if (scope.viewevent.selection === 'invitations') {
                    return '';
                }
                return 'small';


            };

            scope.$watch('viewevent.show', function(modelValue) {
                element
                    .modal('setting', 'transition', 'scale')
                    .modal('setting', 'closable', false)
                    .modal('setting', 'allowMultiple', true)
                    .modal(modelValue ? 'show' : 'hide');

            });

        }



    }

    /**
     * @desc controller for modal directive
     * @ngInject
     */
    function EventViewModalController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window, moment, angularMomentConfig, notify, MembersFactory, $geolocation, $filter, $timeout, EventsConnections, $q, EventsAttendees, lodash, USER_FACEBOOK_ID, EventChatFactory, $sce) {
        var vm = this;
        vm.showMobile = false;
        vm.loadingSave = false;
        vm.closeEventModal = closeEventModal;
        vm.getEvent = getEvent;
        vm.openMap = openMap;
        vm.deleteEvent = deleteEvent;
        vm.openModalDelete = openModalDelete;
        vm.event = {};
        vm.invitationsMode = false;

        vm.header = 'Event Details';

        vm.showError = false;
        vm.showSuccess = false;
        vm.errorMessage = [];
        vm.endsTimeError = false;
        vm.startsTimeError = false;

        vm.modalId = 'viewEventsModal';

        vm.eventRsvp = {
            status: ''
        };

        vm.changeRsvpStatus = changeRsvpStatus;

        vm.extractFromAddress = extractFromAddress;
        vm.parseLocation = parseLocation;
        vm.combineDateTime = combineDateTime;
        vm.validateDates = validateDates;
        vm.saveEvent = saveEvent;
        vm.openInvitations = openInvitations;
        vm.closeInvitations = closeInvitations;
        vm.openAttendees = openAttendees;
        vm.closeAttendees = closeAttendees;

        vm.selection = 'view';

        vm.editEvent = editEvent;

        vm.isHost = false;

        vm.loadingEvent = false;

        vm.placeholder = {
            name: '',
            starts: 'Date',
            startsTime: 'Time',
            ends: 'Date',
            endsTime: 'Time',
            repeat: '',
            repeatUntil: 'Until date',
            description: '',
            location: '',
            costs: '',
            invitations: '',
            attachments: '',
            max_attendees: ''
        };

        vm.$geolocation = $geolocation;

        $geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 2
        }).then(function(location) {
            vm.autocompleteOptions = {
                location: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
                radius: 50000
            };
        });

        vm.autocompleteOptions = {
            location: '0,0',
            radius: 50000
        };


        vm.memberExists = false;

        $scope.$watch(angular.bind(this, function(show) {
            return vm.show;
        }), function(modelValue) {
            if (modelValue) {
                vm.getEvent();

            }
        });

        //START INVITES

        vm.loadingInvitesSave = false;
        vm.counterNewInvites = 0;
        vm.markSelected = markSelected;
        vm.removeInvite = removeInvite;
        vm.sendInvites = sendInvites;
        vm.getConnections = getConnections;
        vm.getInvitedPeople = getInvitedPeople;

        vm.nextOffset = 10;
        vm.loadingConnections = false;
        vm.connectionFirstName = '';

        vm.invitedPeopleLoading = false;
        vm.invitedPeopleCount = 0;
        vm.invitedPeopleFirstName = '';
        vm.invitedPeopleNext = null;
        vm.invitedPeopleAlreadyLoaded = false;

        vm.invitationsOptions = {
            attendingPref: 'private',
            guestInvite: true
        };


        vm.friends = [];
        vm.connections = [];
        vm.invitedPeople = [];
        vm.selectedPeople = [];

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



        function markSelected(index) {
            if (!vm.connections[index].is_invited) {
                vm.connections[index].selected = !vm.connections[index].selected;

                if (vm.connections[index].selected) {
                    vm.counterNewInvites++;
                    vm.selectedPeople.push(vm.connections[index].friend_id);
                } else {
                    var idx = lodash.findIndex(vm.selectedPeople, vm.connections[index].friend_id);
                    vm.selectedPeople.splice(idx, 1);
                    vm.counterNewInvites--;
                }
            }

        }

        function removeInvite(index) {
            //remove from invite list and refresh selected status


            MembersFactory.delete({
                    memberId: vm.invitedPeople[index].id
                },
                function(success) {
                    vm.connectionFirstName = '';
                    vm.getConnections();
                    vm.invitedPeople.splice(index, 1);
                    vm.counterNewInvites = 0;
                    if (vm.invitedPeopleCount > 0) {
                        vm.invitedPeopleCount--;
                    }
                },
                function(error) {
                    $log.info(error);
                });





        }

        $scope.$on('sendInvites', function() {
            $log.info('sendInvites Event');
            vm.sendInvites();
        });

        function sendInvites() {
            if (vm.selectedPeople.length > 0) {
                //return if already sending invites
                if (vm.loadingInvitesSave) {
                    return;
                }
                vm.loadingInvitesSave = true;
                //sending invites

                var promises = [];

                for (var i = vm.selectedPeople.length - 1; i >= 0; i--) {
                    //prepare promises array
                    var member = {
                        event: '/api/v1/event/' + vm.event.id + '/',
                        is_invited: false,
                        user: '/api/v1/auth/user/' + vm.selectedPeople[i] + '/'
                    };

                    promises.push(MembersFactory.save({}, member).$promise);

                }


                $q.all(promises).then(function(result) {
                    angular.forEach(result, function(response) {
                        var findMemberIndex = $filter('getIndexByProperty')('user', response.user, vm.connections);
                        if (findMemberIndex !== null) {
                            vm.connections[findMemberIndex].member_id = response.id;
                            vm.connections[findMemberIndex].is_invited = true;
                            vm.connections[findMemberIndex].rsvp = '';

                        }


                    });

                }).then(function(tmpResult) {
                    $log.info('Sending invites finished.');
                    vm.counterNewInvites = 0;
                    vm.loadingInvitesSave = false;
                    vm.selectedPeople = [];
                    vm.invitedPeopleAlreadyLoaded = false;
                    vm.invitedPeopleFirstName = '';
                    vm.connectionFirstName = '';
                    vm.getConnections();
                    vm.getInvitedPeople();

                    notify({
                        messageTemplate: '<div class="notify-info-header">Success</div>' +
                            '<p>All event invitations have been successfully sent.</p>',
                        classes: 'notify-info',
                        icon: 'check circle',
                        duration: 4000
                    });
                    $scope.$emit('invitesSent');
                });

            } else {
                notify({
                    messageTemplate: '<div class="notify-error-header">Warning</div>' +
                        '<p>Please select connections to invite.</p>',
                    classes: 'notify-error',
                    icon: 'remove circle',
                    duration: 4000
                });
            }


        }

        function getConnections() {

            vm.friends = [];
            vm.counterNewInvites = 0;

            vm.nextOffset = 10;
            vm.next = null;
            vm.loadingConnections = true;
            EventsConnections.query({
                format: 'json',
                first_name: vm.connectionFirstName.toLowerCase(),
                limit: 1000,
                offset: 0
            }).$promise.then(getEventsConnectionsSuccess, getEventsConnectionsFailure);

        }

        function getEventsConnectionsSuccess(response) {
            vm.friends = response.objects;
            vm.next = response.meta.next;
            vm.connections = [];
            for (var i = vm.friends.length - 1; i >= 0; i--) {

                var mutual_friends = ((vm.friends[i].mutual_friends_count === null) ? 0 : vm.friends[i].mutual_friends_count);
                var common_goals = ((vm.friends[i].common_goals_offers_interests === null) ? 0 : vm.friends[i].common_goals_offers_interests);
                var friend = {
                    first_name: vm.friends[i].first_name,
                    age: vm.friends[i].age,
                    common_goals_offers_interests: common_goals,
                    mutual_friends_count: mutual_friends,
                    tagline: vm.friends[i].tagline,
                    facebook_id: vm.friends[i].facebook_id,
                    friend_id: vm.friends[i].friend_id,
                    user: '/api/v1/auth/user/' + vm.friends[i].friend_id + '/',
                    is_invited: false,
                    member_id: null,
                    rsvp: '',
                    selected: false,
                    event: parseInt(vm.event.id),
                    image: '//graph.facebook.com/' + vm.friends[i].facebook_id + '/picture?type=square'
                };


                for (var j = vm.friends[i].events.length - 1; j >= 0; j--) {

                    if (vm.friends[i].events[j].event === friend.event) {
                        friend.is_invited = true;
                        friend.rsvp = vm.friends[i].events[j].rsvp;
                        friend.selected = true;
                        friend.member_id = vm.friends[i].events[j].id;
                    }
                }

                //check if connection was selected already
                if (lodash.includes(vm.selectedPeople, friend.friend_id)) {
                    friend.selected = true;
                }

                vm.connections.push(friend);




            }

            vm.counterNewInvites = vm.selectedPeople.length;

            vm.loadingConnections = false;

        }

        function getEventsConnectionsFailure(response) {

            var data = response.data,
                status = response.status,
                header = response.header,
                config = response.config,
                message = 'Error ' + status;
            $log.error(message);

            vm.loadingConnections = false;


        }

        function getInvitedPeople() {
            vm.invitedPeopleLoading = true;

            EventsAttendees.query({
                format: 'json',
                limit: 1000,
                offset: 0,
                event: parseInt(vm.event.id),
                is_organizer: false,
                user__first_name__icontains: vm.invitedPeopleFirstName
            }).$promise.then(getInvitedPeopleSuccess, getInvitedPeopleFailure);

            function getInvitedPeopleSuccess(response) {
                vm.invitedPeopleLoading = false;

                if (!vm.invitedPeopleAlreadyLoaded) {
                    vm.invitedPeopleCount = response.meta.total_count;
                }

                vm.invitedPeopleAlreadyLoaded = true;



                if (response.objects.length === 0) {
                    vm.invitedPeople = [];
                } else {
                    vm.invitedPeople = response.objects;
                    vm.invitedPeopleNext = response.meta.next;
                }

            }

            function getInvitedPeopleFailure(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;

                $log.error(message);
                vm.invitedPeopleLoading = false;


            }
        }

        //END INVITES



        function openInvitations() {
            vm.selection = 'invitations';
            vm.header = 'Invitations';
            vm.invitedPeopleAlreadyLoaded = false;
            vm.counterNewInvites = 0;
            vm.invitedPeopleCount = 0;
            vm.invitedPeopleFirstName = '';
            vm.connectionFirstName = '';
            vm.selectedPeople = [];
            vm.getConnections();
            vm.getInvitedPeople();
        }

        function closeInvitations() {
            vm.selection = 'edit';
            vm.header = 'Event Details';
        }

        //START ATTENDEES

        vm.getAttendees = getAttendees;

        vm.attendees = {
            yes: {
                data: [],
                alreadyLoaded: false,
                filtered: [],
                filters: {
                    firstName: '',
                    rsvp: 'yes',
                    event: vm.eventid
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
                    event: vm.eventid
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
                    event: vm.eventid
                },
                loading: false,
                noResults: false,
                nextOffset: 10,
                next: null,
                count: 0
            },
        };

        function getAttendees(type) {
            vm.attendees[type].next = null;
            vm.attendees[type].loading = true;
            EventsAttendees.query({
                format: 'json',
                limit: 1000,
                offset: 0,
                rsvp: vm.attendees[type].filters.rsvp,
                event: vm.event.id,
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

        function openAttendees() {
            vm.selection = 'attendees';
            vm.header = 'Attendees';
            vm.getAttendees('yes');
            vm.getAttendees('no');
            vm.getAttendees('maybe');
        }

        function closeAttendees() {
            vm.attendees['yes'].alreadyLoaded = false;
            vm.attendees['no'].alreadyLoaded = false;
            vm.attendees['maybe'].alreadyLoaded = false;
            vm.selection = 'view';
            vm.header = 'Event Details';
        }

        //END ATTENDEES


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

        vm.loadingDelete = false;


        function openModalDelete() {
            $log.info('openingmodal');
            $('#deleteEventModal').modal('show');
        }

        function deleteEvent() {
            if (vm.loadingDelete) {
                return;
            }
            vm.showError = false;
            vm.loadingDelete = true;
            EventsFactory.delete({
                    eventId: vm.eventEdit.id
                },
                function(success) {
                    vm.showError = false;

                    notify({
                        messageTemplate: '<div class="notify-info-header">Success</div>' +
                            '<p>Event has been successfully deleted.</p>',
                        classes: 'notify-info',
                        icon: 'check circle',
                        duration: 4000
                    });
                    vm.loadingDelete = false;
                    $rootScope.$broadcast('refreshEventFeed');

                    vm.closeEventModal();

                },
                function(error) {
                    vm.loadingDelete = false;
                    vm.errorMessage = [];
                    vm.showError = true;
                    if (error.data.event) {
                        vm.errorMessage = ['Event could not be deleted.'];
                    }

                });
        }



        function getEvent() {

            vm.selection = 'view';
            vm.pok = 0;
            vm.loadingEvent = true;
            EventsFactory.query({
                format: 'json'
            }, {
                eventId: vm.eventid
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

                vm.isHost = false;
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

        function closeEventModal() {
            vm.loadingInvitesSave = false;
            vm.show = false;
        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }


        //editing event

        vm.eventEdit = {
            starts_on: '',
            ends_on: '',
            address: ''
        };
        //date and time combine

        $scope.$watch(angular.bind(this, function(starts_on_date) {
            return vm.starts_on_date;
        }), function(newVal) {
            if (newVal !== null) {
                vm.combineDateTime('starts_on');
                vm.combineDateTime('ends_on');
            }
        });

        $scope.$watch(angular.bind(this, function(starts_on_time) {
            return vm.starts_on_time;
        }), function(newVal) {
            if (newVal !== null) {
                vm.combineDateTime('starts_on');
                vm.combineDateTime('ends_on');
            }
        });
        $scope.$watch(angular.bind(this, function(ends_on_date) {
            return vm.ends_on_date;
        }), function(newVal) {
            if (newVal !== null) {
                vm.combineDateTime('starts_on');
                vm.combineDateTime('ends_on');
            }
        });

        $scope.$watch(angular.bind(this, function(ends_on_time) {
            return vm.ends_on_time;
        }), function(newVal) {
            if (newVal !== null) {
                vm.combineDateTime('starts_on');
                vm.combineDateTime('ends_on');
            }
        });



        $scope.$watch(angular.bind(this, function(eventLocation) {
            return vm.eventLocation;
        }), function(newVal) {
            vm.parseLocation();
        });

        function validateDates() {
            //validate dates
            vm.startsTimeError = false;
            vm.endsTimeError = false;
            if (moment(vm.eventEdit.starts_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select a Starts Date that is not set in past.'];
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
            }

            if (moment(vm.eventEdit.ends_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select an Ends Date that is not set in past.'];
                vm.endsTimeError = true;
                return;
            }

            if (moment(vm.eventEdit.ends_on).unix() > moment().unix() && moment(vm.eventEdit.starts_on).unix() > moment().unix() && moment(vm.eventEdit.starts_on).unix() > moment(vm.eventEdit.ends_on).unix()) {
                vm.showError = true;
                vm.errorMessage = ['Ends Date must be greater or equal to Starts Date.'];
                vm.endsTimeError = true;
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
                vm.endsTimeError = false;
            }
        }

        //extract address from google places result
        function extractFromAddress(components, type, type2) {
            for (var i = 0; i < components.length; i++) {
                for (var j = 0; j < components[i].types.length; j++) {
                    if (components[i].types[j] === type) {
                        return components[i][type2];
                    }
                }
            }
            return '';

        }

        vm.pok = 0;

        //parse location
        function parseLocation() {

            if (vm.eventLocation !== null && typeof vm.eventLocation === 'object' && vm.eventLocation.hasOwnProperty('address_components') && vm.eventLocation.hasOwnProperty('geometry')) {
                var location = vm.eventLocation.address_components;

                vm.eventEdit.street = vm.extractFromAddress(location, 'route', 'long_name') + ' ' + vm.extractFromAddress(location, 'street_number', 'long_name');
                vm.eventEdit.zipcode = vm.extractFromAddress(location, 'postal_code', 'long_name');
                if (vm.eventEdit.zipcode === '') {
                    vm.eventEdit.zipcode = null;
                }
                vm.eventEdit.location_name = vm.eventLocation.name;
                vm.eventEdit.full_address = vm.eventLocation.formatted_address;
                vm.eventEdit.state = vm.extractFromAddress(location, 'administrative_area_level_1', 'short_name');
                vm.eventEdit.country = vm.extractFromAddress(location, 'country', 'short_name');
                if (vm.eventEdit.state.length > 3) {
                    vm.eventEdit.state = vm.eventEdit.country;
                }
                vm.eventEdit.city = vm.extractFromAddress(location, 'locality', 'long_name');

                vm.eventEdit.location = vm.eventLocation.geometry.location.lat() + ',' + vm.eventLocation.geometry.location.lng();
                vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation.formatted_address) + '/@' + vm.eventEdit.location + ',15z';
                vm.mapurlTrue = true;
            } else {
                if (vm.pok > 2) {
                    vm.eventEdit.address = vm.eventLocation;
                    vm.eventEdit.full_address = '';
                    vm.eventEdit.location_name = vm.eventLocation;
                    vm.eventEdit.location = '0,0';
                } else {
                    vm.pok++;
                }
            }

        }


        //helper function for 12 to 24 hour time conversion
        function convertTo24Hour(time) {
            var hours = parseInt(time.substr(0, 2));
            if (time.indexOf('AM') != -1 && hours == 12) {
                time = time.replace('12', '0');
            }
            if (time.indexOf('PM') != -1 && hours < 12) {
                time = time.replace(hours, (hours + 12));
            }
            return time.replace(/(AM|PM)/, '');
        }

        function combineDateTime(type) {

            if (vm[type + '_date'] && vm[type + '_time']) {
                var dateParts = vm[type + '_date'].split('/');
                var datePartsSorted = [dateParts[2], dateParts[0], dateParts[1]];
                var timeParts = convertTo24Hour(vm[type + '_time']).split(':');
                var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                if (datePartsSorted && timeParts) {
                    datePartsSorted[1] -= 1;
                    vm.eventEdit[type] = moment(datePartsSorted.concat(timeParts)).toISOString();
                }
            }
        }

        function editEvent() {
            vm.showError = false;
            vm.showSuccess = false;
            vm.errorMessage = [];
            vm.endsTimeError = false;
            vm.startsTimeError = false;
            vm.eventEdit = angular.copy(vm.event);
            //convert datetime to local timezone
            vm.starts_on_date = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('MM/DD/YYYY');
            vm.ends_on_date = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('MM/DD/YYYY');
            vm.starts_on_time = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('h:mm A');
            vm.ends_on_time = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('h:mm A');

            vm.modalId = 'createEventsModal';
            vm.selection = 'edit';

        }

        function saveEvent() {
            if (vm.loadingSave) {
                return;
            }
            vm.showError = false;
            vm.showSuccess = false;
            $('.ui.form')
                .form({
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Event name'
                            }]
                        },
                        location: {
                            identifier: 'location',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Location'
                            }]
                        },
                        max_attendees: {
                            identifier: 'max_attendees',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Max. attendees'
                            }, {
                                type: 'integer',
                                prompt: 'Please enter Max. attendees as numeric value'
                            }]
                        },
                        repeat: {
                            identifier: 'repeat',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Repeat'
                            }]
                        },
                        description: {
                            identifier: 'description',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Description'
                            }]
                        },
                        starts_on_date: {
                            identifier: 'starts_on_date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Starts Date'
                            }]
                        },
                        starts_on_time: {
                            identifier: 'starts_on_time',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Starts Time'
                            }]
                        },
                        ends_on_date: {
                            identifier: 'ends_on_date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Ends Date'
                            }]
                        },
                        ends_on_time: {
                            identifier: 'ends_on_time',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Ends Time'
                            }]
                        },
                    }
                });
            $('.ui.form').form('validate form');

            if (vm.eventEdit.description === '' || vm.eventEdit.max_attendees === '' || vm.eventEdit.ends_on === '' || vm.eventEdit.location === '' || vm.eventEdit.name === '' || vm.eventEdit.starts_on === '' || vm.eventEdit.repeat === '') {
                if (vm.eventEdit.starts_on === '' || vm.eventEdit.starts_on === null) {
                    vm.startsTimeError = true;
                }
                if (vm.eventEdit.ends_on === '' || vm.eventEdit.ends_on === null) {
                    vm.endsTimeError = true;
                }

                vm.showError = true;
                vm.errorMessage = ['Please enter all required fields.'];
            } else {

                //validate dates

                vm.validateDates();

                vm.showSuccess = false;
                if (!vm.showError) {
                    vm.loadingSave = true;
                    delete vm.eventEdit.members;
                    delete vm.eventEdit.attendees;
                    delete vm.eventEdit.most_common_elements;
                    EventsFactory.update({
                            eventId: vm.eventEdit.id
                        }, vm.eventEdit,
                        function(success) {
                            vm.showError = false;
                            vm.modalId = 'viewEventsModal';
                            vm.selection = 'view';
                            notify({
                                messageTemplate: '<div class="notify-info-header">Success</div>' +
                                    '<p>All changes have been saved.</p>',
                                classes: 'notify-info',
                                icon: 'check circle',
                                duration: 4000
                            });
                            $rootScope.$broadcast('refreshEventFeed');
                            vm.loadingSave = false;
                            vm.getEvent();
                        },
                        function(error) {
                            vm.errorMessage = [];
                            vm.showError = true;
                            if (error.data.event) {
                                vm.errorMessage = error.data.event.error;
                            }
                            vm.loadingSave = false;

                        });
                }
            }

        }



        //event chat
        vm.openChat = openChat;
        vm.closeChat = closeChat;

        function openChat() {
            vm.selection = 'chat';
            vm.header = $sce.trustAsHtml('Event Chat: <span class="eventNameChat">' + vm.event.name + '</span>');
            vm.getMessages();
        }

        function closeChat() {
            vm.selection = 'view';
            vm.header = 'Event Details';
        }

        vm.newmessage = '';

        vm.messages = [];

        vm.loadingMessages = false;
        vm.loadingOlderMessages = false;
        vm.sendingMessage = false;

        vm.sender = '/api/v1/auth/user/' + USER_ID + '/';
        vm.currentEvent = '/api/v1/event/' + vm.eventid + '/';

        var userPhoto = '//graph.facebook.com/' + USER_FACEBOOK_ID + '/picture?type=square';

        vm.status = {
            loading: false,
            loaded: false
        };

        vm.nextOffsetChat = 20;
        vm.nextChat = null;

        vm.sendMessage = sendMessage;
        vm.getMessages = getMessages;
        vm.loadMoreChat = loadMoreChat;

        function sendMessage() {

            if (vm.newmessage === '') {
                vm.sendingMessage = false;

            } else {

                vm.sendingMessage = true;
                var newMessage = {};
                newMessage = {
                    sender: vm.sender,
                    event: '/api/v1/event/' + vm.eventid + '/',
                    body: vm.newmessage
                };


                EventChatFactory.save({}, newMessage,
                    function(success) {
                        newMessage.left = true;
                        newMessage.sent_at = success.sent_at;
                        newMessage.sender = success.sender;
                        newMessage.photo = userPhoto;
                        var localDatePlain = $filter('amDateFormat')(newMessage.sent_at, 'L');
                        var localDate = $filter('amDateFormat')(newMessage.sent_at, 'dddd, MMMM D, YYYY');
                        var messageIndex = $filter('getIndexByProperty')('date', localDate, vm.messages);
                        newMessage.date = localDatePlain;

                        if (messageIndex === null) {
                            vm.messages.push({
                                date: localDate,
                                realDate: localDatePlain,
                                contents: []
                            });
                            messageIndex = vm.messages.length - 1;
                        }

                        vm.messages[messageIndex].contents.push(newMessage);
                        vm.newmessage = '';
                        $log.info('New chat message sent.');
                        vm.sendingMessage = false;
                        //scroll chat to top
                        $timeout(function() {
                            angular.element('#chat-conversation-content').filter(':not(:animated)').animate({
                                scrollTop: 0
                            }, 1500);
                        }, 100);

                    },
                    function(error) {
                        vm.sendingMessage = false;
                        $log.info(error);
                    });

            }

        }

        function getMessages() {
            vm.messages = [];
            vm.loadingMessages = true;
            vm.status.loaded = false;
            EventChatFactory.query({
                event_id: vm.eventid,
                limit: 20,
                offset: 0
            }).$promise.then(function(response) {
                var responseMessages = response.objects;
                vm.nextChat = response.meta.next;
                $filter('orderBy')(responseMessages, 'sent_at', true);

                vm.status.loaded = true;
                for (var obj in responseMessages) {
                    var localDate = $filter('amDateFormat')(responseMessages[obj].sent_at, 'dddd, MMMM D, YYYY');
                    var localDatePlain = $filter('amDateFormat')(responseMessages[obj].sent_at, 'L');

                    var messageIndex = $filter('getIndexByProperty')('date', localDate, vm.messages);

                    if (messageIndex === null) {
                        vm.messages.push({
                            date: localDate,
                            realDate: localDatePlain,
                            contents: []
                        });
                        messageIndex = vm.messages.length - 1;
                    }

                    //TODO put photo url from facebook_id

                    if (responseMessages[obj].sender === vm.sender) {
                        vm.messages[messageIndex].contents.push({
                            body: $sce.trustAsHtml(responseMessages[obj].body),
                            sender: responseMessages[obj].sender,
                            date: localDatePlain,
                            photo: userPhoto,
                            sent_at: responseMessages[obj].sent_at,
                            left: true
                        });
                    } else {
                        vm.messages[messageIndex].contents.push({
                            body: $sce.trustAsHtml(responseMessages[obj].body),
                            sender: responseMessages[obj].sender,
                            date: localDatePlain,
                            photo: userPhoto,
                            sent_at: responseMessages[obj].sent_at,
                            left: false
                        });
                    }
                    vm.messages[messageIndex].contents = $filter('orderBy')(vm.messages[messageIndex].contents, 'sent_at', true);
                }

                vm.messages = $filter('orderBy')(vm.messages, 'realDate');


                vm.loadingMessages = false;


            }, function(response) {
                vm.loadingMessages = false;
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                // error handler
                $log.error(message);

            });
        }

        function loadMoreChat() {

            $log.info('Loading more messages in chat');
            var deferred = $q.defer();

            if (vm.nextChat === null) {
                deferred.reject();
                return deferred.promise;
            }

            if (!vm.status.loading) {
                vm.status.loading = true;
                $timeout(function() {
                    EventChatFactory.query({
                        event_id: vm.eventid,
                        offset: vm.nextOffsetChat,
                        limit: 10
                    }).$promise.then(function(response) {
                        var responseMessages = response.objects;
                        vm.nextChat = response.meta.next;
                        $filter('orderBy')(responseMessages, 'sent_at', true);
                        vm.nextOffsetChat += 10;

                        for (var obj in responseMessages) {
                            var localDate = $filter('amDateFormat')(responseMessages[obj].sent_at, 'dddd, MMMM D, YYYY');
                            var localDatePlain = $filter('amDateFormat')(responseMessages[obj].sent_at, 'L');

                            var messageIndex = $filter('getIndexByProperty')('date', localDate, vm.messages);

                            if (messageIndex === null) {
                                vm.messages.push({
                                    date: localDate,
                                    realDate: localDatePlain,
                                    contents: []
                                });
                                messageIndex = vm.messages.length - 1;
                            }


                            //TODO put photo url from facebook_id

                            if (responseMessages[obj].sender === vm.sender) {
                                vm.messages[messageIndex].contents.push({
                                    body: $sce.trustAsHtml(responseMessages[obj].body),
                                    sender: responseMessages[obj].sender,
                                    date: localDatePlain,
                                    photo: userPhoto,
                                    sent_at: responseMessages[obj].sent_at,
                                    left: true
                                });
                            } else {
                                vm.messages[messageIndex].contents.push({
                                    body: $sce.trustAsHtml(responseMessages[obj].body),
                                    sender: responseMessages[obj].sender,
                                    date: localDatePlain,
                                    photo: userPhoto,
                                    sent_at: responseMessages[obj].sent_at,
                                    left: false
                                });
                            }
                            vm.messages[messageIndex].contents = $filter('orderBy')(vm.messages[messageIndex].contents, 'sent_at', true);
                        }

                        vm.messages = $filter('orderBy')(vm.messages, 'realDate');

                        vm.status.loading = false;
                        vm.status.loaded = true;
                        deferred.resolve();
                    }, function(response) {
                        deferred.reject();
                        vm.status.loading = false;
                        var data = response.data,
                            status = response.status,
                            header = response.header,
                            config = response.config,
                            message = 'Error ' + status;
                        // error handler
                        $log.error(message);

                    });
                }, 400);



            } else {
                deferred.reject();
            }
            return deferred.promise;
        }


        //TODO websocket for chat

        //END CHAT



    }



})();
