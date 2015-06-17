(function() {
    'use strict';

    /**
     * @desc display modal
     * @example <ui-event-create-modal></ui-event-create-modal>
     */
    angular
        .module('frontend.semantic.modal.event.create', [])

    .directive('uiEventCreateModal', uiEventCreateModal);

    function uiEventCreateModal() {
        var directive = {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: {
                show: '=show'
            },
            templateUrl: 'components/modal/modalcreate.html',
            controller: EventModalController,
            controllerAs: 'singleevent',
            bindToController: true,
            link: link,
        };
        return directive;

        function link(scope, element, attrs, singleevent) {
            element.modal({
                onHide: function() {
                    scope.singleevent.show = false;
                }
            });


            scope.$watch('singleevent.show', function(modelValue) {
                console.log(modelValue);
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
    function EventModalController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window, moment) {
        var vm = this;

        vm.mapurl = '';
        vm.mapurlTrue = false;
        vm.eventLocation = '';
        vm.showMobile = false;
        vm.endsTimeError = false;
        vm.startsTimeError = false;

        vm.blah = blah;

        function blah() {

        }
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


        vm.starts_on_date = '';
        vm.starts_on_time = '';
        vm.ends_on_date = '';
        vm.ends_on_time = '';
        vm.today = moment().format('MM/DD/YYYY');

        $log.info(vm.today);

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
            street: '',
            city: '',
            zipcode: null,
            state: ''
        };

        vm.saveEvent = saveEvent;
        vm.openMap = openMap;
        vm.resetForm = resetForm;
        vm.extractFromAddress = extractFromAddress;
        vm.parseLocation = parseLocation;
        vm.combineDateTime = combineDateTime;
        vm.closeEventModal = closeEventModal;
        vm.validateDates = validateDates;

        function closeEventModal() {
            vm.show = false;
        }

        $rootScope.$on('saveEvent', function() {
            $log.info('saveEvent');
            vm.saveEvent();
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
            if (moment(vm.event.starts_on).unix() < moment().unix()) {
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

            if (moment(vm.event.ends_on).unix() < moment().unix()) {
                $log.info('end date is not valid');
                vm.showError = true;
                vm.errorMessage = ['Please select an Ends Date that is not set in past.'];
                vm.endsTimeError = true;
                return;
            }

            if (moment(vm.event.ends_on).unix() > moment().unix() && moment(vm.event.starts_on).unix() > moment().unix() && moment(vm.event.starts_on).unix() > moment(vm.event.ends_on).unix()) {
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

            if (vm.event.description === '' || vm.event.ends_on === '' || vm.event.location === '' || vm.event.name === '' || vm.event.starts_on === '' || vm.event.repeat === '') {
                if (vm.event.starts_on === '' || vm.event.starts_on === null) {
                    vm.startsTimeError = true;
                }
                if (vm.event.ends_on === '' || vm.event.ends_on === null) {
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
                    EventsFactory.save({}, vm.event,
                        function(success) {
                            vm.showError = false;
                            $rootScope.$broadcast('closeModalCreateEvent');
                            vm.resetForm();
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

                vm.event.street = vm.extractFromAddress(location, 'route', 'long_name') + ' ' + vm.extractFromAddress(location, 'street_number', 'long_name');
                vm.event.zipcode = vm.extractFromAddress(location, 'postal_code', 'long_name');
                if (vm.event.zipcode === '') {
                    vm.event.zipcode = null;
                }
                vm.event.state = vm.extractFromAddress(location, 'administrative_area_level_1', 'short_name');
                vm.event.country = vm.extractFromAddress(location, 'country', 'short_name');
                if (vm.event.state.length > 3) {
                    vm.event.state = vm.event.country;
                }
                vm.event.city = vm.extractFromAddress(location, 'locality', 'long_name');

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
            vm.starts_on_date = null;
            vm.starts_on_time = null;
            vm.ends_on_date = null;
            vm.ends_on_time = null;
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



        //date and time combine
        //
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


        function combineDateTime(type) {

            if (vm[type + '_date'] && vm[type + '_time']) {
                var dateParts = vm[type + '_date'].split('/');
                var datePartsSorted = [dateParts[2], dateParts[0], dateParts[1]];
                $log.info(datePartsSorted);
                var timeParts = vm[type + '_time'].split(':');
                var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                if (datePartsSorted && timeParts) {
                    datePartsSorted[1] -= 1;
                    vm.event[type] = moment(datePartsSorted.concat(timeParts)).toISOString();
                }
            }
        }


    }



})();