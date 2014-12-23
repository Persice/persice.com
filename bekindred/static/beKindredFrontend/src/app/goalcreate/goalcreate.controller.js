'use strict';

angular.module('beKindred')
.controller('GoalCreateCtrl', function ($scope, $state, $log, GoalsFactory, SubjectsFactory, USER_ID, $filter) {
    $scope.subject = '';
    $scope.resourceUri = null;
    $scope.messageShow = false;
    $scope.message = '';

    $scope.userUri = '/api/v1/auth/user/' + USER_ID + '/';

    $scope.inputChanged = function (str) {
        $scope.subject = str;
    };

    $scope.selectResult = function (object) {
        if (object !== undefined) {
            $scope.subject = object.originalObject.description;
            $scope.resourceUri = object.originalObject.resource_uri;
        }
        else {
            $scope.resourceUri = null;
        }

    };


    $scope.saveGoal = function() {
        var newGoal = {
            goal: $scope.resourceUri,
            user: $scope.userUri
        };

        GoalsFactory.save({}, newGoal,
            function(success){

                $state.go('offercreate');

            },
            function(error) {

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

        //check if subject already exists
        if ($scope.resourceUri !== null) {

            //check if user already has created this goal
            GoalsFactory.query({format: 'json'}).$promise.then(function(data) {
                var userGoals = data.objects;
                var findGoal = null;
                findGoal = $filter('getByProperty')('subject', $scope.subject, userGoals);
                if (findGoal !== null) {
                    $scope.message = 'You have already created this goal.';
                    $scope.messageShow = true;
                    return false;
                }
                else {
                    //create new goal
                    $scope.saveGoal();
                }
            });



        }
        else {
            //create new subject
            var newSubject = {
                description: $scope.subject,
            };

            SubjectsFactory.save({}, newSubject,
                function(success){
                    $scope.resourceUri = success.resource_uri;
                    $scope.saveGoal();

                },
                function(error) {
                    $scope.message = 'You have already created this goal.';
                    $scope.messageShow = true;
                });
        }

    };



});
