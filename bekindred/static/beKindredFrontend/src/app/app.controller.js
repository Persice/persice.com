'use strict';

angular.module('beKindred')
.controller('AppCtrl', function ($rootScope, $scope, $timeout, $window) {
    $rootScope.hideTopMenu = false;


    $rootScope.goBack = function() {
        $rootScope.hideTopMenu = false;
        $rootScope.showfullprofile = false;
        $('.horizontal.top.sidebar')
        .sidebar('hide')
        ;
    };


    $scope.cancelMatch = function () {
        $('.dimmable').dimmer('hide');
        $rootScope.hideTopMenu = false;
        $rootScope.showfullprofile = false;
        $('.horizontal.top.sidebar')
        .sidebar('hide');
        $rootScope.$broadcast('cancelMatchEvent');
    };

    $scope.confirmMatch = function () {
        $('.dimmable').dimmer('hide');
        $rootScope.hideTopMenu = false;
        $rootScope.showfullprofile = false;
        $('.horizontal.top.sidebar')
        .sidebar('hide');
        $rootScope.$broadcast('confirmMatchEvent');
    };


    $scope.refreshMatchFeed = function () {
        $('.dimmable').dimmer('hide');
        $rootScope.$broadcast('refreshMatchFeed');
    };





});
