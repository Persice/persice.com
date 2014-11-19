'use strict';

angular.module('beKindred')
.controller('MainCtrl', function ($scope) {
    $scope.repeatN = function (n) {
        return new Array(n);
    };
});


angular.module('beKindred')
.controller('PhotosController', function ($scope, PhotosFactory) {
    $scope.photos = [
    ];



    $scope.onDropComplete = function (index, obj, evt) {
        var otherObj = $scope.photos[index];
        var otherIndex = $scope.photos.indexOf(obj);
        console.log(evt);
        $scope.photos[index] = obj;
        $scope.photos[index].order = index;
        $scope.photos[otherIndex] = otherObj;
        $scope.photos[otherIndex].order = otherIndex;

        PhotosFactory.save({format: 'json', objects: $scope.photos}, function(success) {
            console.log('photos order saved');
            console.log(success);
        }, function(error) {
            console.log('photos order not saved');
            console.log(error);
        });
    };


    $scope.getPhotos = function() {
        PhotosFactory.query( {
            format: 'json'
        }).$promise.then(function(response) {
            $scope.photos = response.objects;
        });
    };

    $scope.getPhotos();


    $scope.$on('ngRepeatFinished', function () {
        var mySwiper = new Swiper('.swiper-container',{
         pagination: '.pagination',
         loop:false,
         grabCursor: true,
         paginationClickable: true
     });
    });



});


angular.module('beKindred')
.controller('FilterController', function ($scope) {
    $scope.distanceValue = 50;
    $scope.distanceOptions = {
        range: {min: 1, max: 10000}
    };


    $scope.gender = [];
    $scope.showMessage = false;


    $scope.ageValues = [25,60];
    $scope.ageOptions = {
        range: {min: 18, max: 115}
    };


    $scope.myKeywords = [];

    $scope.removeKeyword = function(index) {
        $scope.myKeywords.splice(index, 1);
    };

    $scope.addKeyword = function(item) {

        var existing = _.some($scope.myKeywords, function(i) {
            return i == item;
        });

        if (!existing) {
            $scope.myKeywords.push(item);
            $scope.newKeyword = '';
            $scope.showMessage = false;
        }
        else {
            $scope.showMessage = true;
        }

    };

});


angular.module('beKindred')
.controller('GoalsController', function ($scope, GoalsFactory) {
    $scope.goals = [];


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
    {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() }
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



