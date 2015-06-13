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
    function EventViewModalController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window, moment) {
        var vm = this;

        vm.closeEventModal = closeEventModal;
        vm.getEvent = getEvent;
        vm.openMap = openMap;
        vm.event = {};

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
                vm.eventLocation = vm.event.street + ', ' + vm.event.city + ', ' + vm.event.zipcode + ' ' + vm.event.state;

                if (vm.event.location !== '0,0') {
                    vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation) + '/@' + vm.event.location + ',15z';
                    vm.mapurlTrue = true;
                } else {
                    vm.mapurlTrue = false;
                }

                //convert datetime to local timezone
                vm.starts_on_date = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('MM/DD/YYYY');
                vm.ends_on_date = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('MM/DD/YYYY');
                vm.starts_on_time = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('HH:mm');
                vm.ends_on_time = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('HH:mm');

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