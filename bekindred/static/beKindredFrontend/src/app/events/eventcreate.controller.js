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
    function EventCreateController($scope, USER_ID, EventsFactory, $state, $rootScope, $log) {
        var vm = this;
        vm.showError = false;
        vm.showSuccess = false;
        vm.errorMessage = [];
        vm.event = {
            user: '/api/v1/auth/user/' + USER_ID + '/',
            description: '',
            ends_on: '',
            location: '',
            name: '',
            repeat: '',
            starts_on: '',
            street: 'China Camp State Park',
            city: 'San Rafael',
            zipcode: 94941,
            state: 'CA'
        };

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
        vm.resetForm = resetForm;

        $rootScope.$on('saveEvent', function() {
            $log.info('saveEvent');
            vm.saveEvent();
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


        function resetForm() {
            vm.event = {
                user: '/api/v1/auth/user/' + USER_ID + '/',
                description: '',
                ends_on: '',
                location: '',
                name: '',
                repeat: '',
                starts_on: '',
                street: 'China Camp State Park',
                city: 'San Rafael',
                zipcode: 94941,
                state: 'CA'
            };
        }

    }



})();