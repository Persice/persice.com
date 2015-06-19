(function() {
    'use strict';

    angular
        .module('icebrak')
        .controller('EventEditController', EventEditController);

    /**
     * class EventEditController
     * classDesc Edit event
     * @ngInject
     */
    function EventEditController($scope, USER_ID, EventsFactory, $state, eventId, $rootScope, $log, $window, moment, angularMomentConfig) {
        var vm = this;
        vm.showError = false;
        vm.showMobile = true;
        vm.showSuccess = false;
        vm.errorMessage = [];
        vm.mapurl = '';
        vm.mapurlTrue = false;
        vm.endsTimeError = false;
        vm.startsTimeError = false;
        vm.eventEdit = {
            user: '/api/v1/auth/user/' + USER_ID + '/',
            description: '',
            ends_on: '',
            location: '',
            name: '',
            repeat: '',
            starts_on: '',
            street: '',
            city: '',
            zipcode: null,
            state: '',
            full_address: '',
            location_name: '',
            country: ''
        };

        vm.eventLocation = '';

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

        vm.saveEvent = saveEvent;
        vm.openMap = openMap;
        vm.extractFromAddress = extractFromAddress;
        vm.parseLocation = parseLocation;
        vm.validateDates = validateDates;
        vm.getEvent = getEvent;


        vm.getEvent();

        function getEvent() {
            $log.info('getting event: ' + eventId);



            vm.loadingEvent = true;
            EventsFactory.query({
                format: 'json'
            }, {
                eventId: eventId
            }).$promise.then(function(data) {

                vm.eventEdit = data;
                vm.eventLocation = '';
                vm.mapurlTrue = false;
                vm.mapurl = '';

                if (vm.eventEdit.location !== '0,0') {


                    if (vm.eventEdit.full_address !== '' && vm.eventEdit.full_address !== null) {
                        vm.eventLocation = vm.eventEdit.location_name + ', ' + vm.eventEdit.full_address;
                    } else {
                        vm.eventLocation = vm.eventEdit.street + ' ' + vm.eventEdit.city + ' ' + vm.eventEdit.zipcode + ' ' + vm.eventEdit.state;
                    }

                    vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation) + '/@' + vm.eventEdit.location + ',15z';
                    vm.mapurlTrue = true;

                } else {
                    vm.mapurlTrue = false;
                    vm.mapurl = '';
                    vm.eventLocation = vm.eventEdit.location_name;
                }


                //convert datetime to local timezone
                vm.eventEdit.starts_on = moment.utc(vm.eventEdit.starts_on, moment.ISO_8601).local().toDate();
                vm.eventEdit.ends_on = moment.utc(vm.eventEdit.ends_on, moment.ISO_8601).local().toDate();

                vm.isHost = false;
                $scope.eventpage.isHost.option = false;
                if (vm.eventEdit.members.length > 0) {
                    for (var i = vm.eventEdit.members.length - 1; i >= 0; i--) {
                        if (vm.eventEdit.members[i].is_organizer === true) {
                            if (vm.eventEdit.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {
                                vm.isHost = true;
                                $scope.eventpage.isHost.option = true;
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
                $log.error(message);


            });
        }

        $scope.$on('saveChangedEvent', function() {
            $log.info('saveChangedEvent');
            vm.saveEvent();
        });

        $scope.$on('goBackEvents', function() {
            $state.go('event.details', {
                eventId: vm.eventEdit.id
            });

        });



        vm.checkDatesStarts = checkDatesStarts;
        vm.checkDatesEnds = checkDatesEnds;

        function checkDatesStarts() {

            if (vm.eventEdit.ends_on === '' || vm.eventEdit.ends_on === null) {
                vm.eventEdit.ends_on = moment(vm.eventEdit.starts_on).add(1, 'hour').toDate();
                return;
            }

            if (moment(vm.eventEdit.ends_on) >= moment(vm.eventEdit.starts_on)) {
                vm.eventEdit.ends_on = moment(vm.eventEdit.starts_on).add(1, 'hour').toDate();
            }

        }

        function checkDatesEnds() {

            if (vm.eventEdit.starts_on === '' || vm.eventEdit.starts_on === null) {
                vm.eventEdit.starts_on = moment(vm.eventEdit.ends_on).subtract(1, 'hour').toDate();
                return;
            }

        }



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
                });
            $('.ui.form').form('validate form');
            if (vm.eventEdit.description === '' || vm.eventEdit.ends_on === '' || vm.eventEdit.ends_on === null || vm.eventEdit.starts_on === null || vm.eventEdit.location === '' || vm.eventEdit.name === '' || vm.eventEdit.starts_on === '' || vm.eventEdit.repeat === '') {
                vm.showError = true;
                if (vm.eventEdit.starts_on === '' || vm.eventEdit.starts_on === null) {
                    vm.startsTimeError = true;
                }
                if (vm.eventEdit.ends_on === '' || vm.eventEdit.ends_on === null) {
                    vm.endsTimeError = true;
                }
                vm.errorMessage = ['Please enter all required fields.'];
            } else {
                vm.showError = false;
                vm.validateDates();



                $log.info('started saving event');

                vm.showSuccess = false;

                if (!vm.showError) {
                    EventsFactory.update({
                            eventId: vm.eventEdit.id
                        }, vm.eventEdit,
                        function(success) {
                            vm.showError = false;
                            $state.go('event.details', {
                                eventId: vm.eventEdit.id
                            });
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

        //parse location
        function parseLocation() {
            vm.mapurl = '';
            vm.mapurlTrue = false;
            $log.info('parsing location');
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
                vm.eventEdit.city = vm.extractFromAddress(location, 'locality', 'long_name');
                if (vm.eventEdit.state.length > 3) {
                    vm.eventEdit.state = vm.eventEdit.country;
                }
                vm.eventEdit.location = vm.eventLocation.geometry.location['A'] + ',' + vm.eventLocation.geometry.location['F'];
                vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation.formatted_address) + '/@' + vm.eventEdit.location + ',15z';
                vm.mapurlTrue = true;
                $log.info(vm.mapurl);
            } else {
                vm.eventEdit.address = vm.eventLocation;
                vm.eventEdit.full_address = '';
                vm.eventEdit.location_name = vm.eventLocation;
                vm.eventEdit.location = '0,0';
            }

        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }



    }



})();