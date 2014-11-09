'use strict';

angular.module('beKindred')
.controller('MainCtrl', function () {

});


angular.module('beKindred')
.controller('PhotosController', function ($scope) {
    $scope.photos = [
    {i: 1, url: 'https://a2.muscache.com/ic/users/8657382/profile_pic/1415203551/original.jpg?interpolation=lanczos-none&amp;crop=w:w;*,*&amp;crop=h:h;*,*&amp;resize=225:*&amp;output-format=jpg&amp;output-quality=70'},
    {i: 2, url: 'https://a1.muscache.com/ic/users/8657382/profile_pic/1415203535/original.jpg?interpolation=lanczos-none&amp;crop=w:w;*,*&amp;crop=h:h;*,*&amp;resize=68:*&amp;output-format=jpg&amp;output-quality=70'},
    {i: 3, url: 'https://a0.muscache.com/ic/users/8657382/profile_pic/1415203541/original.jpg?interpolation=lanczos-none&amp;crop=w:w;*,*&amp;crop=h:h;*,*&amp;resize=68:*&amp;output-format=jpg&amp;output-quality=70'}
    ];

    $scope.sortableOptions = {
        stop: function() {
            for (var index in $scope.photos) {
                $scope.photos[index].i = index;
            }


        }
    };





});


angular.module('beKindred')
.controller('FilterController', function ($scope) {
    $scope.distanceValue = 50;
    $scope.distanceOptions = {
        range: {min: 1, max: 10000}
    };


    $scope.ageValues = [25,60];
    $scope.ageOptions = {
        range: {min: 18, max: 115}
    };


    $scope.keywords = [];

    $scope.removeKeyword = function(index) {
        $scope.keywords.splice(index, 1);
    };

    $scope.addKeyword = function(item) {
        if (item !== '') {
            $scope.keywords.push(item);
            $scope.newKeyword = '';
        }

    };

});


angular.module('beKindred')
.controller('GoalsController', function ($scope, GoalsFactory) {
    $scope.goals = [
    {name: 'Learn to play tennis'},
    {name: 'Learn to play piano'},
    {name: 'Learn to play guitar'},
    {name: 'Learn to play football'},
    {name: 'Learn to play basketball'},
    {name: 'Learn to play squash'},
    {name: 'Learn to code django'},
    {name: 'Learn to code laravel'},
    {name: 'Learn to code python'},
    {name: 'Find a running partner'},
    {name: 'Hire a cat sitter'},
    {name: 'Move my 500 lb sofa'}
    ];


    $scope.getGoals = function(val) {
        GoalsFactory.query( {
            query: val
        }).$promise.then(function(response) {
            $scope.goals = response.goals;
        });
    };

})
angular.module('beKindred')
.controller('MessagesController', function ($scope, MessagesFactory) {
    $scope.messages = [
    {user: 'Thomas', photo: 'phpotourl', subject: 'You and Jessica are now peeps.', time: moment().subtract(1, 'days' )},
    ];

    $scope.q = '';


    $scope.getMessages = function() {
        MessagesFactory.query( {
            q: $scope.q
        }).$promise.then(function(response) {
            $scope.messages = response.messages;
        });
    };


    $scope.submit = function() {
        angular.element('#myform').submit();
    }

    $scope.sendMessage = function() {
        angular.element('#sendform').submit();
    }

});

