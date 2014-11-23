'use strict';

angular.module('beKindred')
.controller('MainCtrl', function ($scope) {
    $scope.repeatN = function (n) {
        return new Array(n);
    };
});


angular.module('beKindred')
.controller('PhotosController', function ($scope, PhotosFactory, $filter, USER_ID, USER_PHOTO, $cookies, $http) {

    $scope.apiPhotos = [];
    $scope.photos = [
    {id: 0, order: 0, photo: ''},
    {id: 0, order: 1, photo: ''},
    {id: 0, order: 2, photo: ''},
    {id: 0, order: 3, photo: ''},
    {id: 0, order: 4, photo: ''},
    {id: 0, order: 5, photo: ''}
    ];

    $scope.photosSlider = [];

    $scope.facebookPhotos = [
    {photo: 'http://www.realtimearts.net/data/images/art/46/4640_profile_nilssonpolias.jpg'},
    {photo: 'http://media.cirrusmedia.com.au/LW_Media_Library/594partner-profile-pic-An.jpg'},
    {photo: 'http://www.exchangewire.com/wp-content/uploads/2013/10/Profile-Pic.png'},
    {photo: 'http://fancyholidays.com/wp-content/uploads/2013/02/Andrew_avatar.jpg'},
    {photo: 'https://www.berlinale.de/media/60_jubilaeum_1/starportraits/2011_4/2011-02-10-9358-0662_Jeff_Bridges_IMG_x900.jpg'},
    {photo: 'http://i.telegraph.co.uk/multimedia/archive/02833/ronanfarrow_2833413b.jpg'},
    {photo: 'http://arstechnica.com/wp-content//uploads/authors/ars_profile.jpg'},
    {photo: 'https://pbs.twimg.com/profile_images/1771648774/Sacca_profile_400x400.jpg'}
    ];



    $scope.onDropComplete = function (index, obj, evt) {
        var otherObj = $scope.photos[index];
        var otherIndex = $scope.photos.indexOf(obj);
        console.log(evt);
        $scope.photos[index] = obj;
        $scope.photos[index].order = index;
        $scope.photos[otherIndex] = otherObj;
        $scope.photos[otherIndex].order = otherIndex;


        //API update photo - patch method
        PhotosFactory.update({photoId: $scope.photos[index].id}, {order:  $scope.photos[index].order },
            function(success) {
                console.log('Photo order saved');
            }, function(error) {
                console.log(error);
            });

    };

    var defaultPhoto = {id: 0, order: 0, photo: USER_PHOTO};

    $scope.getPhotos = function() {
        PhotosFactory.query( {
            format: 'json'
        }).$promise.then(function(response) {
            $scope.apiPhotos = response.objects;
            $filter('orderBy')( $scope.photos, 'order', false);


            for(var obj in $scope.apiPhotos) {
                for(var p in $scope.photos) {
                    if ($scope.photos[p].order == $scope.apiPhotos[obj].order) {
                        $scope.photos[p].id = $scope.apiPhotos[obj].id;
                        $scope.photos[p].photo = $scope.apiPhotos[obj].photo;
                    }
                }
            }

            $scope.photosSlider = $scope.apiPhotos;

            $scope.photosSlider.push(defaultPhoto);



        });
    };

    $scope.getPhotos();


    $scope.deletePhoto = function() {
        var deleteIndex = $scope.userPhotoDeleteIndex;
        //API delete call
        PhotosFactory.delete({photoId: $scope.photos[deleteIndex].id},
            function(success) {
                $scope.photos[deleteIndex].photo = '';
                console.log('Photo deleted');

            },
            function(error) {
                console.log(error);
            });

    };

    $scope.createPhoto = function(indexFbPhoto) {

        console.log('Creating photo');

        var newFbPhoto = $scope.facebookPhotos[indexFbPhoto];

        //API create photo

        var newPhoto = {
            photo:  newFbPhoto.photo,
            order: $scope.newPhotoIndex,
            user: '/api/v1/auth/user/' + USER_ID + '/'
        };

        PhotosFactory.save({}, newPhoto,
            function(success){
                console.log(success);
                console.log('New photo saved.');

                $scope.getPhotos();
            },
            function(error) {
                console.log(error);
            });

        var index = $scope.newPhotoIndex;
        $scope.photos[index].photo =  newFbPhoto.photo;

        $('#photos_modal').modal('hide');

    };

    $scope.$on('ngRepeatFinished', function () {
        var mySwiper = new Swiper('.swiper-container',{
            pagination: '.pagination',
            loop:false,
            grabCursor: true,
            paginationClickable: true
        });


        $('#photos_modal').modal('attach events', '.add_photo', 'show');
        $('#deletePhotoModal').modal('attach events', '.delete_photo', 'show');


        $('.special.cards .image').dimmer({
            on: 'hover'
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