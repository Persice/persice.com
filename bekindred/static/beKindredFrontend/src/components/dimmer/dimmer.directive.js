angular.module('frontend.semantic.dimmer', [])

.directive("pageDimmer", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope : {
            show : "=?",
            model: '=ngModel'
        },
        template: "<div class=\"{{dimmer_class}}\" ng-click=\"click_on_dimmer()\">" +
        "<div class=\"content\">" +
        "<div class=\"center\" ng-transclude></div>" +
        "</div>" +
        "</div>",
        link : function(scope, element, attrs, ngModel) {

            if (scope.show == true) {
                scope.dimmer_class = 'ui page inverted active dimmer';
            }
            else {
                scope.show = false;
                scope.dimmer_class = 'ui page inverted disable dimmer';
            }

            //
            // Click on dimmer handler
            //
            scope.click_on_dimmer = function(){
                scope.model = true;
                scope.show = true;
                scope.dimmer_class = 'ui page inverted active dimmer';
            }

            //
            // Watch for the ng-model changing
            //
            scope.$watch('model', function(val){
                if (val == false || val == undefined) {
                    scope.show = false;
                    scope.dimmer_class = 'ui page inverted disable dimmer';
                    return;
                }


                else
                    scope.dimmer_class = 'ui page inverted active dimmer';
            });
        }
    };
});