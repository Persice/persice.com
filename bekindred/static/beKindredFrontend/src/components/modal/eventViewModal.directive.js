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
                    scope.viewevent.editMode = false;
                    scope.viewevent.modalId = 'viewEventsModal';
                }
            });

            element.modal({
                onShow: function() {
                    scope.viewevent.editMode = false;
                    scope.viewevent.modalId = 'viewEventsModal';
                }
            });

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
    function EventViewModalController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window, moment, angularMomentConfig, notify, MembersFactory) {
        var vm = this;
        vm.showMobile = false;
        vm.closeEventModal = closeEventModal;
        vm.getEvent = getEvent;
        vm.openMap = openMap;
        vm.deleteEvent = deleteEvent;
        vm.event = {};

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

        vm.editMode = false;

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
            attachments: ''
        };


        vm.memberExists = false;

        $scope.$watch(angular.bind(this, function(show) {
            return vm.show;
        }), function(modelValue) {
            $log.info(modelValue);
            if (modelValue) {
                vm.getEvent();

            }
        });

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
                        },
                        function(error) {


                        });

                } else {
                    vm.eventRsvp.status = newStatus;
                    // create new member first with new rsvp status
                    MembersFactory.save({}, member,
                        function(success) {
                            $log.info(success);
                            vm.memberExists = true;
                            vm.event.members.push(success);
                            vm.memberId = success.id;
                        },
                        function(error) {
                            $log.info(error);

                        });
                }

            }
        }

        function deleteEvent() {
            vm.showError = false;
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

                    $rootScope.$broadcast('refreshEventFeed');

                    vm.closeEventModal();

                },
                function(error) {
                    vm.errorMessage = [];
                    vm.showError = true;
                    if (error.data.event) {
                        vm.errorMessage = ['Event could not be deleted.'];
                    }

                });
        }



        function getEvent() {

            vm.pok = 0;
            $log.info('getting event: ' + vm.eventid);
            vm.loadingEvent = true;
            EventsFactory.query({
                format: 'json'
            }, {
                eventId: vm.eventid
            }).$promise.then(function(data) {

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
                    status: ''
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
                vm.starts_on_time = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('H:mm A');
                vm.ends_on_time = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('H:mm A ') + moment.tz(angularMomentConfig.timezone).format('z');


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
                $log.error(message);


            });
        }

        function closeEventModal() {
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
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });

        $scope.$watch(angular.bind(this, function(starts_on_time) {
            return vm.starts_on_time;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });
        $scope.$watch(angular.bind(this, function(ends_on_date) {
            return vm.ends_on_date;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });

        $scope.$watch(angular.bind(this, function(ends_on_time) {
            return vm.ends_on_time;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
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
                $log.info('start date is not valid');
                vm.showError = true;
                vm.errorMessage = ['Please select a Starts Date that is not set in past.'];
                vm.startsTimeError = true;
                return;
            } else {
                $log.info('start date is OK');
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
            }

            if (moment(vm.eventEdit.ends_on).unix() < moment().unix()) {
                $log.info('end date is not valid');
                vm.showError = true;
                vm.errorMessage = ['Please select an Ends Date that is not set in past.'];
                vm.endsTimeError = true;
                return;
            }

            if (moment(vm.eventEdit.ends_on).unix() > moment().unix() && moment(vm.eventEdit.starts_on).unix() > moment().unix() && moment(vm.eventEdit.starts_on).unix() > moment(vm.eventEdit.ends_on).unix()) {
                $log.info('end date is not ok');
                vm.showError = true;
                vm.errorMessage = ['Ends Date must be greater or equal to Starts Date.'];
                vm.endsTimeError = true;
                vm.startsTimeError = true;
                return;
            } else {
                $log.info('end date is OK');
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

            $log.info('parsing location');
            if (vm.eventLocation !== null && typeof vm.eventLocation === 'object' && vm.eventLocation.hasOwnProperty('address_components') && vm.eventLocation.hasOwnProperty('geometry')) {
                $log.info('changing location');
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

                vm.eventEdit.location = vm.eventLocation.geometry.location['A'] + ',' + vm.eventLocation.geometry.location['F'];
                vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation.formatted_address) + '/@' + vm.eventEdit.location + ',15z';
                vm.mapurlTrue = true;
                $log.info(vm.mapurl);
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

        function combineDateTime(type) {

            if (vm[type + '_date'] && vm[type + '_time']) {
                var dateParts = vm[type + '_date'].split('/');
                var datePartsSorted = [dateParts[2], dateParts[0], dateParts[1]];
                var timeParts = vm[type + '_time'].split(':');
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
            vm.starts_on_time = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('H:mm');
            vm.ends_on_time = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('H:mm');

            vm.modalId = 'createEventsModal';
            vm.editMode = true;

        }

        function saveEvent() {
            vm.showError = false;
            vm.showSuccess = false;
            $('.ui.form')
                .form({
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
                });
            $('.ui.form').form('validate form');

            if (vm.eventEdit.description === '' || vm.eventEdit.ends_on === '' || vm.eventEdit.location === '' || vm.eventEdit.name === '' || vm.eventEdit.starts_on === '' || vm.eventEdit.repeat === '') {
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

                $log.info('started saving event');
                vm.showSuccess = false;
                if (!vm.showError) {

                    EventsFactory.update({
                            eventId: vm.eventEdit.id
                        }, vm.eventEdit,
                        function(success) {
                            vm.showError = false;
                            vm.modalId = 'viewEventsModal';
                            vm.editMode = false;
                            notify({
                                messageTemplate: '<div class="notify-info-header">Success</div>' +
                                    '<p>All changes have been saved.</p>',
                                classes: 'notify-info',
                                icon: 'check circle',
                                duration: 4000
                            });
                            $rootScope.$broadcast('refreshEventFeed');
                            vm.getEvent();
                        },
                        function(error) {
                            vm.errorMessage = [];
                            vm.showError = true;
                            if (error.data.event) {
                                vm.errorMessage = error.data.event.error;
                            }

                        });
                }
            }

        }



    }



})();