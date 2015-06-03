'use strict';

angular.module('frontend.semantic.modal', [])

.directive('uiModal', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        require: 'ngModel',
        template: '<div class="ui modal centeraligned" ng-transclude></div>',
        link: function(scope, element, attrs, ngModel) {
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
    };
});