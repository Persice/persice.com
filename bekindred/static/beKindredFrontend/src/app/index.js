'use strict';

angular.module('beKindred', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngResource',
    'ui.router',
    'angular-spinkit',
    'hj.gsapifyRouter',
    'frontend.semantic.dimmer',
    'truncate',
    'ya.nouislider',
    'ngDraggable',
    'angucomplete-alt',
    'angular-carousel'
    ])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $resourceProvider, gsapifyRouterProvider) {

    $httpProvider.defaults.headers.patch = {
        'Content-Type': 'application/json;charset=utf-8'
    };

    $resourceProvider.defaults.stripTrailingSlashes = false;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/json;charset=utf-8'
    };

    gsapifyRouterProvider.defaults = {
        enter: 'fadeIn',
        leave: 'none'
    };

    gsapifyRouterProvider.transition('fadeIn', {
        duration: 0.5,
        delay: 0,
        css: {
            opacity: 0,
        }
    });

    gsapifyRouterProvider.transition('fadeOut', {
        duration: 0.5,
        css: {
            opacity: 0,
        }
    });


    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: '/static/beKindredFrontend/src/app/main/main.html',
        controller: 'MainCtrl',
        resolve: {

        }
    })
    .state('goalcreate', {
        url: '/create-goal',
        templateUrl: '/static/beKindredFrontend/src/app/goalcreate/goalcreate.html',
        controller: 'GoalCreateCtrl'
    })
    .state('offercreate', {
        url: '/create-offer',
        templateUrl: '/static/beKindredFrontend/src/app/offercreate/offercreate.html',
        controller: 'OfferCreateCtrl'
    })
    .state('matchfeed', {
        url: '/match-feed',
        templateUrl: '/static/beKindredFrontend/src/app/matchfeed/matchfeed.html',
        controller: 'MatchFeedCtrl'
    })
    .state('myconnections', {
        url: '/my-connections',
        templateUrl: '/static/beKindredFrontend/src/app/myconnections/myconnections.html',
        controller: 'MyConnectionsCtrl'
    })
    .state('myprofile', {
        url: '/my-profile',
        templateUrl: '/static/beKindredFrontend/src/app/myprofile/myprofile.html',
        controller: 'MyProfileCtrl'
    })
    .state('editmyprofile', {
        url: '/my-profile/edit',
        templateUrl: '/static/beKindredFrontend/src/app/editmyprofile/editmyprofile.html',
        controller: 'EditMyProfileCtrl'
    })
    .state('inbox', {
        url: '/inbox',
        templateUrl: '/static/beKindredFrontend/src/app/inbox/inbox.html',
        controller: 'InboxCtrl'
    })
    .state('404', {
        url: '/page-not-found',
        templateUrl: '404.html',
    });



    $urlRouterProvider.otherwise('/');

})
.run(function ($rootScope, $state, $stateParams, $timeout) {

    $rootScope.$state = $state;

    $rootScope.isState = function(states){
        return $state.includes(states);
    };

    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function (event, next) {
        if ( $('.sidebar').sidebar('is visible')) $('.sidebar').sidebar('hide');
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

    });


    $rootScope.$on('$stateChangeError', function(event) {
    });






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
.directive('endRepeat', function ($timeout) {
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
})
.filter('getByProperty', function() {
    return function(propertyName, propertyValue, collection) {
        var i=0, len=collection.length;
        for (; i<len; i++) {
            if (collection[i][propertyName] == propertyValue) {
                return collection[i];
            }
        }
        return null;
    };
})
.directive('modal', function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            model: '=ngModel'
        },
        template: "<div class=\"ui dimmer modals page transition\" style=\"position: absolute;\" ng-class=\"{ 'active visible': model }\">" +
                    "<div class=\"ui long test modal transition scrolling\" style=\"top: 150px;\" ng-class=\"{ 'active visible': model }\" ng-transclude>" +
                    "</div>" +
                  "</div>",
        link: function (scope, element, attrs) {

        }
    };
});