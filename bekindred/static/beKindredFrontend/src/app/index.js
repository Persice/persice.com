'use strict';

angular.module('beKindred', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.sortable', 'ya.nouislider'])
  .config(function () {

  })
  .value('noUiSliderConfig', {step: 1})
;

angular.module('beKindred').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});