(function() {
    'use strict';

    angular
        .module('persice')
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
        vm.viewMap = viewMap;
        vm.viewList = viewList;

        $rootScope.$on('closeModalCreateEvent', function(event, data) {
            vm.closeEventModal();
            if ($state.is('events.myevents')) {
                $rootScope.$broadcast('refreshEventFeed');
            } else {
                $state.go('events.myevents.list');
            }

        });

        $rootScope.$broadcast('refreshEventsFilters');

        $rootScope.$on('openViewEventModal', function(event, data) {
            vm.viewEvent = data;
            vm.showEventViewModal();


        });

        function viewMap() {
            if ($state.is('events.myevents.list')) {
                $state.go('events.myevents.map');
            }
            if ($state.is('events.mynetwork.list')) {
                $state.go('events.mynetwork.map');
            }
            if ($state.is('events.allevents.list')) {
                $state.go('events.allevents.map');
            }
        }

        function viewList() {
            if ($state.is('events.myevents.map')) {
                $state.go('events.myevents.list');
            }
            if ($state.is('events.mynetwork.map')) {
                $state.go('events.mynetwork.list');
            }
            if ($state.is('events.allevents.map')) {
                $state.go('events.allevents.list');
            }
        }

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


        $scope.$watch(angular.bind(this, function(showViewModal) {
            return vm.showViewModal;
        }), function(newVal) {
            if (!newVal) {
                $rootScope.eventChatModal = false;
            }
        });



    }



})();
