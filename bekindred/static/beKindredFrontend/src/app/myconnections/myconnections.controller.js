'use strict';

angular.module('beKindred')
.controller('MyConnectionsCtrl', function ($scope) {
    $scope.repeatN = function (n) {
        return new Array(n);
    };
    $scope.photo = 'http://lorempixel.com/100/100';
});
