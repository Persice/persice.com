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
    function EventsPageController($scope, $rootScope, $log) {
        var vm = this;

        vm.showModal = false;
        vm.showEventCreateModal = showEventCreateModal;
        vm.closeEventCreateModal = closeEventCreateModal;

        function showEventCreateModal() {
            vm.showModal = true;
        }

        function closeEventCreateModal() {
            vm.showModal = false;
        }

    }



})();