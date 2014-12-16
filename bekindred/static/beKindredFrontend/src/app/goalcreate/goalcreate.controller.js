'use strict';

angular.module('beKindred')
.controller('GoalCreateCtrl', function ($scope, $state, $log) {
    $scope.subject = '';
    $scope.createGoal = function() {
        $log.info($scope.subject);
        $state.go('offercreate');
    };



});
