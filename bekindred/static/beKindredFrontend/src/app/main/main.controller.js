'use strict';

angular.module('beKindred')
.controller('MainCtrl', function () {

});


angular.module('beKindred')
.controller('PhotosController', function ($scope, PhotosFactory) {
    // $scope.photos = [
    // {i: 1, url: 'http://graph.facebook.com/100008382799410/picture?type=large'},
    // {i: 2, url: 'http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg'},
    // {i: 3, url: 'http://organicthemes.com/demo/profile/files/2012/12/profile_img.png'},
    // {i: 4, url: 'http://www.uwmbionlp.org/uwmbionlp/images/thumb5.jpg'},
    // {i: 5, url: 'http://darylgoodrich.com/wp-content/uploads/2011/08/person.jpg'},
    // {i: 6, url: 'http://sxsw.com/sites/default/files/news/image/Neil-deGrasse-Tyson-body.jpg'}
    // ];
    //
    $scope.photos = [];

    $scope.sortableOptions = {
        stop: function() {
            for (var index in $scope.photos) {
                $scope.photos[index].order = index;
            }

            console.log($scope.photos);


        }
    };


    $scope.getPhotos = function() {
       PhotosFactory.query( {
            format: 'json'
        }).$promise.then(function(response) {
            $scope.photos = response.objects;
        });
    };

    $scope.getPhotos();





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
.controller('MessagesController', function ($scope, MessagesFactory, $timeout) {
    $scope.messages = [
    {left: true, content: 'Hey, my name is Sasa! I\'d like to help you to learn front end development', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() },
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
    };

    $scope.sendMessage = function() {
        angular.element('#sendform').submit();
    };

    $scope.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    $scope.sendNewMessage = function() {
        var newmessage = {};
        newmessage = {
            left: $scope.getRandomInt(0,1),
            content: $scope.newmessage,
            time: new Date()
        };
        $scope.messages.push(newmessage);
        $scope.newmessage = '';


        $timeout(function() {
            var height = angular.element('.conversation-content')[0].scrollHeight;
            console.log(height);

            angular.element('.conversation-content').animate({
                scrollTop: height
          }, 1500);


        }, 100);





    };

});



