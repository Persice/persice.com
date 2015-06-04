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
    function EventsPageController($scope, $rootScope, $log, $state) {
        var vm = this;

        vm.showModal = false;
        vm.showEventCreateModal = showEventCreateModal;
        vm.closeEventCreateModal = closeEventCreateModal;

        $rootScope.$on('closeModalCreateEvent', function(event, data) {
            vm.closeEventCreateModal();
            if ($state.is('events.myevents')) {
                $rootScope.$broadcast('refreshEventFeed');
            } else {
                $state.go('events.myevents');
            }

        });

        function showEventCreateModal() {
            vm.showModal = true;
        }

        function closeEventCreateModal() {
            vm.showModal = false;
        }

    }



})();