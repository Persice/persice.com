(function() {
    'use strict';

    angular
        .module('icebrak')
        .controller('EventsPageController', EventsPageController);

    /**
     * class EventsFeedController
     * classDesc Fetching events
     * @ngInject
     */
    function EventsPageController($scope, $rootScope, $log, $state, $timeout) {
        var vm = this;

        //first remove all modals from body
        $('.ui.dimmer.modals').remove();

        vm.viewEvent = null;
        vm.showModal = false;
        vm.showViewModal = false;
        vm.showEventModal = showEventModal;
        vm.closeEventModal = closeEventModal;
        vm.showEventViewModal = showEventViewModal;
        vm.closeEventViewModal = closeEventViewModal;

        $rootScope.$on('closeModalCreateEvent', function(event, data) {
            vm.closeEventModal();
            if ($state.is('events.myevents')) {
                $rootScope.$broadcast('refreshEventFeed');
            } else {
                $state.go('events.myevents');
            }

        });

        $rootScope.$on('openViewEventModal', function(event, data) {
            vm.viewEvent = data;
            vm.showEventViewModal();


        });

        function showEventModal() {
            vm.showModal = true;
        }

        function closeEventModal() {
            vm.showModal = false;
        }

        function showEventViewModal() {
            vm.showViewModal = true;
        }

        function closeEventViewModal() {
            vm.showViewModal = false;
        }

    }



})();