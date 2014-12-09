'use strict';

angular.module('beKindred', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router'])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // use the HTML5 History API
    // $locationProvider.html5Mode(true);


    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
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
    });






    $urlRouterProvider.otherwise('/');
})
;
