(function() {
    'use strict';

    angular
        .module('icebrak')
        .controller('EventCreateController', EventCreateController);

    /**
     * class EventCreateController
     * classDesc Create event
     * @ngInject
     */
    function EventCreateController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window) {
        var vm = this;
        vm.showError = false;
        vm.showSuccess = false;
        vm.errorMessage = [];
        vm.mapurl = '';
        vm.mapurlTrue = false;
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
            state: ''
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
        vm.resetForm = resetForm;
        vm.extractFromAddress = extractFromAddress;
        vm.parseLocation = parseLocation;

        $rootScope.$on('saveEvent', function() {
            $log.info('saveEvent');
            vm.saveEvent();
        });



        $scope.$watch(angular.bind(this, function(eventLocation) {
            return vm.eventLocation;
        }), function(newVal) {
            vm.parseLocation();
        });


        function saveEvent() {

            vm.showError = false;
            vm.showSuccess = false;
            if (vm.event.description === '' || vm.event.ends_on === '' || vm.event.location === '' || vm.event.name === '' || vm.event.starts_on === '' || vm.event.repeat === '') {
                vm.showError = true;
                vm.errorMessage = ['All fields are required.'];
            } else {
                $log.info('started saving event');
                vm.showError = false;
                vm.showSuccess = false;
                EventsFactory.save({}, vm.event,
                    function(success) {
                        vm.showError = false;
                        $state.go('events.myevents');
                    },
                    function(error) {
                        vm.errorMessage = [];
                        vm.errorShow = true;
                        if (error.data.event) {
                            vm.errorMessage = error.data.event.error;
                        }

                    });
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

                vm.event.street = vm.extractFromAddress(location, 'route', 'long_name') + ' ' + vm.extractFromAddress(location, 'street_number', 'long_name');
                vm.event.zipcode = vm.extractFromAddress(location, 'postal_code', 'long_name');
                if (vm.event.zipcode === '') {
                    vm.event.zipcode = null;
                }
                vm.event.state = vm.extractFromAddress(location, 'administrative_area_level_1', 'short_name');
                vm.event.country = vm.extractFromAddress(location, 'country', 'short_name');
                vm.event.city = vm.extractFromAddress(location, 'locality', 'long_name');
                if (vm.event.state.length > 3) {
                    vm.event.state = vm.event.country;
                }
                vm.event.location = vm.eventLocation.geometry.location['A'] + ',' + vm.eventLocation.geometry.location['F'];
                vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation.formatted_address) + '/@' + vm.event.location + ',15z';
                vm.mapurlTrue = true;
                $log.info(vm.mapurl);
            } else {
                vm.event.address = vm.eventLocation;
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
                state: ''
            };
        }

    }



})();