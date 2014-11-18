'use strict';

angular.module('beKindred', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngDraggable', 'ya.nouislider', 'angucomplete-alt', 'underscore'])
.config(function () {

})
.value('noUiSliderConfig', {step: 1})
.directive('ngEnter', function () {
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