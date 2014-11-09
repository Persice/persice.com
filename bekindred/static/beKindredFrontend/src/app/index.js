'use strict';

angular.module('beKindred', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.sortable', 'ya.nouislider', 'angucomplete-alt'])
.config(function () {

})
.value('noUiSliderConfig', {step: 1})
;

angular.module('beKindred')
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
})
.filter('cut', function () {
  return function (value, wordwise, max, tail) {
    if (!value) return '';

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length <= max) return value;

    value = value.substr(0, max);
    if (wordwise) {
      var lastspace = value.lastIndexOf(' ');
      if (lastspace != -1) {
        value = value.substr(0, lastspace);
      }
    }

    return value + (tail || ' …');
  };
});
