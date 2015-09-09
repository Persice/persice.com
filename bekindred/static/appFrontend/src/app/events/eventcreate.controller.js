(function() {
    'use strict';

    angular
        .module('persice')
        .controller('EventCreateController', EventCreateController);

    /**
     * class EventCreateController
     * classDesc Create event
     * @ngInject
     */
    function EventCreateController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window, moment, $geolocation) {
        var vm = this;
        vm.showError = false;
        vm.showMobile = true;
        vm.showSuccess = false;
        vm.errorMessage = [];
        vm.mapurl = '';
        vm.mapurlTrue = false;
        vm.endsTimeError = false;
        vm.startsTimeError = false;
        vm.loadingSave = false;

        vm.$geolocation = $geolocation;

        vm.image = '';

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

        vm.autocompleteOptions = {};
        vm.event = {
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
            country: '',
            max_attendees: '',
            event_photo: ''
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
            attachments: 'Attachments',
            max_attendees: 'Max. attendees',
            event_photo: 'Event photo'
        };

        vm.saveEvent = saveEvent;
        vm.openMap = openMap;
        vm.resetForm = resetForm;
        vm.extractFromAddress = extractFromAddress;
        vm.parseLocation = parseLocation;
        vm.validateDates = validateDates;

        $scope.$on('saveEvent', function() {
            vm.saveEvent();
        });

        $scope.$on('goBackEvents', function() {
            if ($rootScope.previousEventFeed !== undefined) {
                $state.go($rootScope.previousEventFeed);
            } else {
                $state.go('events.myevents.list');
            }


        });


        vm.checkDatesStarts = checkDatesStarts;
        vm.checkDatesEnds = checkDatesEnds;

        function checkDatesStarts() {

            if (vm.event.ends_on === '' || vm.event.ends_on === null) {
                vm.event.ends_on = moment(vm.event.starts_on).add(1, 'hour').toDate();
                return;
            }

            if (moment(vm.event.ends_on) <= moment(vm.event.starts_on)) {
                vm.event.ends_on = moment(vm.event.starts_on).add(1, 'hour').toDate();
                 return;
            }


        }

        function checkDatesEnds() {

            if (vm.event.starts_on === '' || vm.event.starts_on === null) {
                vm.event.starts_on = moment(vm.event.ends_on).subtract(1, 'hour').toDate();
                return;
            }

            if (moment(vm.event.ends_on) <= moment(vm.event.starts_on)) {
                vm.event.starts_on = moment(vm.event.ends_on).subtract(1, 'hour').toDate();
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
            if (moment(vm.event.starts_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select a Starts Date that is not set in past.'];
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
            }

            if (moment(vm.event.ends_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select an Ends Date that is not set in past.'];
                vm.endsTimeError = true;
                return;
            }

            if (moment(vm.event.ends_on).unix() > moment().unix() && moment(vm.event.starts_on).unix() > moment().unix() && moment(vm.event.starts_on).unix() > moment(vm.event.ends_on).unix()) {
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
                        // repeat: {
                        //     identifier: 'repeat',
                        //     rules: [{
                        //         type: 'empty',
                        //         prompt: 'Please enter Repeat'
                        //     }]
                        // },
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
            if (vm.event.description === '' || vm.event.max_attendees === '' || vm.event.ends_on === '' || vm.event.ends_on === null || vm.event.starts_on === null || vm.event.location === '' || vm.event.name === '' || vm.event.starts_on === '') {
                vm.showError = true;
                if (vm.event.starts_on === '' || vm.event.starts_on === null) {
                    vm.startsTimeError = true;
                }
                if (vm.event.ends_on === '' || vm.event.ends_on === null) {
                    vm.endsTimeError = true;
                }
                vm.errorMessage = ['Please enter all required fields.'];
            } else {
                vm.showError = false;
                vm.validateDates();

                vm.showSuccess = false;

                if (!vm.showError) {
                    vm.loadingSave = true;
                    EventsFactory.save({}, vm.event,
                        function(success) {
                            vm.loadingSave = false;
                            vm.showError = false;
                            $state.go('events.myevents.list');
                        },
                        function(error) {
                            vm.loadingSave = false;
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
            if (vm.eventLocation !== null && typeof vm.eventLocation === 'object' && vm.eventLocation.hasOwnProperty('address_components') && vm.eventLocation.hasOwnProperty('geometry')) {
                var location = vm.eventLocation.address_components;

                vm.event.street = vm.extractFromAddress(location, 'route', 'long_name') + ' ' + vm.extractFromAddress(location, 'street_number', 'long_name');
                vm.event.zipcode = vm.extractFromAddress(location, 'postal_code', 'long_name');
                if (vm.event.zipcode === '') {
                    vm.event.zipcode = null;
                }
                vm.event.location_name = vm.eventLocation.name;
                vm.event.full_address = vm.eventLocation.formatted_address;
                vm.event.state = vm.extractFromAddress(location, 'administrative_area_level_1', 'short_name');
                vm.event.country = vm.extractFromAddress(location, 'country', 'short_name');
                vm.event.city = vm.extractFromAddress(location, 'locality', 'long_name');
                if (vm.event.state.length > 3) {
                    vm.event.state = vm.event.country;
                }
                vm.event.location = vm.eventLocation.geometry.location.lat() + ',' + vm.eventLocation.geometry.location.lng();
                vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation.formatted_address) + '/@' + vm.event.location + ',15z';
                vm.mapurlTrue = true;
            } else {
                vm.event.address = vm.eventLocation;
                vm.event.full_address = '';
                vm.event.location_name = vm.eventLocation;
                vm.event.location = '0,0';
            }

        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }


        function resetForm() {
            vm.showError = false;
            vm.showSuccess = false;
            vm.errorMessage = [];
            vm.mapurl = '';
            vm.mapurlTrue = false;
            vm.eventLocation = '';
            vm.event = {
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
                country: '',
                max_attendees: '',
                event_photo: ''
            };
        }

    }



})();
