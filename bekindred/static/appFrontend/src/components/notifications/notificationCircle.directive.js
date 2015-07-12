(function() {
    'use strict';

    /**
     * @desc display counter for new messages
     * @example <notification-cirle></notification-circle>
     */
    angular
        .module('persice')
        .directive('notificationCircle', notificationCircle);

    function notificationCircle() {
        var directive = {
            controller: NotificationCircleController,
            controllerAs: 'notificationcircle',
            bindToController: true,
            scope: {
                color: '@color'
            },
            link: link,
            template: '<mark class="notification {{notificationcircle.color}}"  ng-class="{\'hidden-notification\': notificationcircle.hideClass}"></mark>',
            restrict: 'E',
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {


        }



    }

    /**
     * @desc display/hide new notifications red circle
     * @ngInject
     */
    function NotificationCircleController($scope, $rootScope, NotificationsRepository) {
        var vm = this;
        vm.hideClass = true;
        vm.counter = NotificationsRepository.getTotal();


        $rootScope.$on('displayNotificationCircle', function(event, data) {
            vm.hideClass = false;
        });

        $rootScope.$on('hideNotificationCircle', function(event, data) {
            vm.hideClass = true;
        });

        $rootScope.$on('refreshStateNotificationCircle', function(event, data) {

            vm.counter = NotificationsRepository.getTotal();

            if (vm.counter > 0) {
                vm.hideClass = false;
            } else {
                vm.hideClass = true;
            }

        });



    }



})();