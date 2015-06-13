(function() {
    'use strict';

    angular
        .module('icebrak')
        .controller('EventPageController', EventPageController);

    /**
     * class EventPageController
     * classDesc Create/View/Edit event
     * @ngInject
     */
    function EventPageController($scope, $rootScope, $log, $state) {
        var vm = this;

        vm.saveEvent = saveEvent;

        function saveEvent() {
            $log.info('Saving event');
            $rootScope.$broadcast('saveEvent');
        }

        function editEvent() {
            $log.info('Editing event');
        }

    }



})();