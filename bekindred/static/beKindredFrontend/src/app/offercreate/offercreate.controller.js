'use strict';

angular.module('beKindred')
.controller('OfferCreateCtrl', function ($scope, $state, $log) {
    $scope.subject = '';
    $scope.messageShow = false;

    $scope.inputChanged = function (str) {
        $scope.subject = str;
    };

    $scope.selectResult = function (object) {
        $scope.subject = object.description;
    };

    $scope.createOffer = function() {
        console.log($scope.subject);
        console.log($scope.searchStr);
        if ($scope.subject === '') {
            $scope.messageShow = true;
        }
        else {
            $state.go('matchfeed');
        }

    };


});
