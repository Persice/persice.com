(function() {
    'use strict';

    /**
     * @desc display modal
     * @example <ui-event-modal></ui-event-modal>
     */
    angular
        .module('frontend.semantic.modal', [])

    .directive('uiEventModal', uiEventModal);

    function uiEventModal() {
        var directive = {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: 'ngModel',
            template: '<div class="ui modal centeraligned" id="createEventsModal" ng-transclude></div>',
            controller: EventModalController,
            controllerAs: 'singleevent',
            bindToController: true,
            link: link,
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            element.modal({
                onHide: function() {
                    ngModel.$setViewValue(false);
                }
            });
            scope.$watch(function() {
                return ngModel.$modelValue;
            }, function(modelValue) {
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
    function EventModalController($scope, $log) {
        var vm = this;

        vm.saveEvent = saveEvent;

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

        function saveEvent() {
            $log.info('Saving event from modal');
        }


    }



})();