'use strict';

angular.module('beKindred')
.controller('OfferCreateCtrl', function ($scope, $state, $log) {
    $scope.subject = '';
    $scope.createOffer = function() {
        $log.info($scope.subject);
        $state.go('matchfeed');

    };

});
