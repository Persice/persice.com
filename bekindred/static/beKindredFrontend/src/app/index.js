'use strict';

angular.module('beKindred', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngDraggable', 'ya.nouislider', 'angucomplete-alt', 'underscore', 'checklist-model'])
<<<<<<< HEAD
.config(function () {

=======
.config(function ($httpProvider, $resourceProvider) {
  $httpProvider.defaults.headers.patch = {
    'Content-Type': 'application/json;charset=utf-8'
  };


  $resourceProvider.defaults.stripTrailingSlashes = false;

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

  $httpProvider.defaults.headers.post = {
    'Content-Type': 'application/json;charset=utf-8'
  };
>>>>>>> 3f6f55558f7a9c6e175fc49a87583fdd78598951
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
})
.directive('endRepeat', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  }
}])
;