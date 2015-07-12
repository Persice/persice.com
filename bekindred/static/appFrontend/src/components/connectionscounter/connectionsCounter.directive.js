(function() {
    'use strict';

    /**
     * @desc display counter for new connections
     * @example <div connections-counter></div>
     */
    angular
        .module('persice')
        .directive('connectionsCounter', connectionsCounter);

    function connectionsCounter() {
        var directive = {
            controller: ConnectionsController,
            controllerAs: 'connections',
            bindToController: true,
            scope: {

            },
            link: link,
            template: '<div ng-class="{\'hiddencounter\': connections.hideClass}" class="ui label">{{connections.counter}}</div>',
            restrict: 'E',
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {


        }



    }

    /**
     * @desc count new connections
     * @ngInject
     */
    function ConnectionsController($scope, $rootScope, NotificationsRepository) {
        var vm = this;
        vm.counter = 0;
        vm.hideClass = true;

        vm.refreshCounter = refreshCounter;

        $rootScope.$on('refreshConnectionsCounter', function(event, data) {
            vm.refreshCounter();
        });

        vm.refreshCounter();

        function refreshCounter() {
            vm.counter = 0;
            vm.counter = NotificationsRepository.getTotalConnections();

            if (vm.counter > 0) {
                vm.hideClass = false;
            } else {
                vm.hideClass = true;
            }
        }



    }



})();