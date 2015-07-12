(function() {
    'use strict';

    /**
     * @desc display modal
     * @example <ui-modal></ui-modal>
     */
    angular
        .module('frontend.semantic.modal', [])

    .directive('uiModal', uiModal);

    function uiModal() {
        var directive = {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: 'ngModel',
            template: '<div class="ui modal" ng-transclude></div>',
            controller: uiModalController,
            controllerAs: 'uimodal',
            bindToController: true,
            link: link,
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            console.log('pero');
            console.log(element);
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
    function uiModalController($scope, $log) {
        var vm = this;

    }



})();