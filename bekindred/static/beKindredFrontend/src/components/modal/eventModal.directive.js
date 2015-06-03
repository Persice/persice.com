(function() {
    'use strict';

    /**
     * @desc display modal
     * @example <ui-event-modal></ui-event-modal>
     */
    angular
        .module('frontend.semantic.modal', [])

    .directive('uiEventModal', uiEventModal);

    function uiEventModal() {
        var directive = {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: 'ngModel',
            template: '<div class="ui modal small centeraligned" id="createEventsModal" ng-transclude></div>',
            controller: EventModalController,
            controllerAs: 'singleevent',
            bindToController: true,
            link: link,
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            element.modal({
                onHide: function() {
                    ngModel.$setViewValue(false);
                }
            });
            scope.$watch(function() {
                return ngModel.$modelValue;
            }, function(modelValue) {
                element
                    .modal('setting', 'transition', 'scale')
                    .modal('setting', 'closable', false)
                    .modal(modelValue ? 'show' : 'hide');
            });

        }



    }

    /**
     * @desc controller for modal directive
     * @ngInject
     */
    function EventModalController($scope, USER_ID, EventsFactory, $state, $rootScope, $log) {
        var vm = this;

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
                        $rootScope.$broadcast('closeModalCreateEvent');
                        vm.resetForm();
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