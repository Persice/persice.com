'use strict';

angular.module('beKindred', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'angular-spinkit'])
.config(function ($stateProvider, $urlRouterProvider) {

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
.run(function ($rootScope, $state, $stateParams) {

    $rootScope.$state = $state;

    $rootScope.isState = function(states){
        return $state.includes(states);
    };

    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function (event, next) {

    });


    $rootScope.$on('$stateChangeError', function(event) {
        $state.go('404');
    });


});
;
