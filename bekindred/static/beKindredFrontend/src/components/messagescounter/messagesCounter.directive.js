(function() {
    'use strict';

    /**
     * @desc display counter for new messages
     * @example <div messages-counter></div>
     */
    angular
        .module('icebrak')
        .directive('messagesCounter', messagesCounter);

    function messagesCounter() {
        var directive = {
            controller: MessagesController,
            controllerAs: 'messages',
            bindToController: true,
            scope: {

            },
            link: link,
            template: '<div ng-class="{\'hiddencounter\': messages.hideClass}" class="ui label">{{messages.counter}}</div>',
            restrict: 'E',
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {


        }



    }

    /**
     * @desc count new messages
     * @ngInject
     */
    function MessagesController($scope, InboxRepository, $rootScope, $log) {
        var vm = this;
        vm.counter = 0;
        vm.hideClass = true;

        vm.refreshCounter = refreshCounter;

        $rootScope.$on('refreshMessagesCounter', function(event, data) {
            vm.refreshCounter();
        });

        vm.refreshCounter();

        function refreshCounter() {
            vm.counter = InboxRepository.getUnreadMessagesCounter();
            $rootScope.$broadcast('refreshStateNotificationCircle');

            if (vm.counter > 0) {
                vm.hideClass = false;
            } else {
                vm.hideClass = true;
            }
        }



    }



})();