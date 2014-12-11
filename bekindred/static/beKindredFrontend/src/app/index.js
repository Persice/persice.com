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
    'angular-owl-carousel'
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

    gsapifyRouterProvider.transition('slideAbove', {
        duration: 1,
        ease: 'Quart.easeInOut',
        css: {
            y: '-100%'
        }
    });

    gsapifyRouterProvider.transition('slideBelow', {
        duration: 1,
        ease: 'Quart.easeInOut',
        css: {
            y: '100%'
        }
    });

    gsapifyRouterProvider.transition('slideLeft', {
        duration: 1,
        ease: 'Quint.easeInOut',
        css: {
            x: '-100%'
        }
    });

    gsapifyRouterProvider.transition('slideRight', {
        duration: 1,
        ease: 'Quint.easeInOut',
        delay: 0.5,
        css: {
            x: '100%'
        }
    });

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

    gsapifyRouterProvider.transition('scaleDown', {
        duration: 0.5,
        css: {
            scale: 0,
            opacity: 0
        }
    });

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {

        }
    })
    .state('goalcreate', {
        url: '/create-goal',
        templateUrl: 'app/goalcreate/goalcreate.html',
        controller: 'GoalCreateCtrl'
    })
    .state('offercreate', {
        url: '/create-offer',
        templateUrl: 'app/offercreate/offercreate.html',
        controller: 'OfferCreateCtrl'
    })
    .state('matchfeed', {
        url: '/match-feed',
        templateUrl: 'app/matchfeed/matchfeed.html',
        controller: 'MatchFeedCtrl'
    })
    .state('myconnections', {
        url: '/my-connections',
        templateUrl: 'app/myconnections/myconnections.html',
        controller: 'MyConnectionsCtrl'
    })
    .state('myprofile', {
        url: '/my-profile',
        templateUrl: 'app/myprofile/myprofile.html',
        controller: 'MyProfileCtrl'
    })
    .state('inbox', {
        url: '/inbox',
        templateUrl: 'app/inbox/inbox.html',
        controller: 'InboxCtrl'
    })
    .state('404', {
        url: '/page-not-found',
        templateUrl: '404.html',
        controller: 'InboxCtrl'
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
        $state.go('404');
    });


})
;