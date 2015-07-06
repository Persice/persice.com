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
        vm.eventId = null;

        vm.isHost = {
            option: false
        };

        vm.header = 'Event Details';

        //remove all modals
        $('.ui.dimmer.modals').remove();

        vm.makeactionEvent = makeactionEvent;
        vm.gotoPreviousState = gotoPreviousState;

        function makeactionEvent() {
            if ($state.current.name === 'event.edit') {
                $log.info('Saving modified event');
                $scope.$broadcast('saveChangedEvent');
            }

            if ($state.current.name === 'event.create') {
                $log.info('Saving new event');
                $scope.$broadcast('saveEvent');
            }

            if ($state.current.name === 'event.details') {
                $state.go('event.edit', {
                    eventId: vm.eventId
                });
            }

            if ($state.current.name === 'event.invitations') {
                $scope.$broadcast('sendInvites');
            }
        }

        function gotoPreviousState() {
            $scope.$broadcast('goBackEvents');
        }

    }



})();