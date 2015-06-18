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
                }
            });
            scope.$watch('viewevent.show', function(modelValue) {
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
    function EventViewModalController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window, moment, angularMomentConfig) {
        var vm = this;
        vm.showMobile = false;
        vm.closeEventModal = closeEventModal;
        vm.getEvent = getEvent;
        vm.openMap = openMap;
        vm.event = {};

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



        $scope.$watch(angular.bind(this, function(show) {
            return vm.show;
        }), function(modelValue) {
            $log.info(modelValue);
            if (modelValue) {
                vm.getEvent();

            }
        });


        function getEvent() {
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
                        vm.eventLocation = vm.event.location_name + ', ' + vm.event.full_address;
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
                if (vm.event.members.length > 0) {
                    for (var i = vm.event.members.length - 1; i >= 0; i--) {
                        if (vm.event.members[i].is_organizer === true) {
                            if (vm.event.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {
                                vm.isHost = true;
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

    }



})();