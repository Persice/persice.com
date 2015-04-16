'use strict';

angular.module('beKindred')
  .controller('GoalCreateCtrl', function($scope, $state, $log, GoalsFactory, SubjectsFactory, USER_ID) {
    $scope.subject = '';
    $scope.resourceUri = null;
    $scope.messageShow = false;
    $scope.message = '';

    $scope.userUri = '/api/v1/auth/user/' + USER_ID + '/';

    $scope.inputChanged = function(str) {
      $scope.subject = str;
    };

    $scope.selectResult = function(object) {
      if (object !== undefined) {
        $scope.subject = object.originalObject.description;
        $scope.resourceUri = object.originalObject.resource_uri;
      } else {
        $scope.resourceUri = null;
      }

    };


    $scope.saveGoal = function() {
      var newGoal = {
        goal_subject: $scope.subject,
        user: $scope.userUri
      };

      GoalsFactory.save({}, newGoal,
        function(success) {

          $state.go('offercreate');

        },
        function(error) {
          $scope.resourceUri = null;
          $scope.messageShow = true;
          if (error.data.goal) {
            $scope.message = error.data.goal.error[0];
          } else {
            $scope.message = 'There was an error when trying to save your goal.';
          }
        });
    };

    $scope.createGoal = function() {
      $scope.messageShow = false;
      $scope.message = '';


      //if subject is empty warn user to enter subject
      if ($scope.subject === '') {
        $scope.message = 'Entering your goal is required to continue.';
        $scope.messageShow = true;
        return false;
      }

      //if subject is has more than 300 chars, warn the user
      if ($scope.subject.length > 300) {
        $scope.message = 'Goal cannot have more than 300 characters.';
        $scope.messageShow = true;
        return false;
      }



      $scope.saveGoal();



    };



  });