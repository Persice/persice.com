'use strict';

angular.module('beKindred')
.controller('MyProfileCtrl', function ($scope, USER_ID, UsersFactory, GoalsFactory, OffersFactory, InterestsFactory, PhotosFactory, USER_PHOTO, $log) {
    $scope.user = {
        id: 1,
        firstName: '',
        lastName: '',
        age: 35,
        about: '',
        photos: [
        ],
        goals: [

        ],
        offers: [

        ],
        likes: [
        ],
        interests: [
        ],
        mutual: {
            friends: [],
            facebookfriends: [],
            twitterfriends: [],
            twitterfollowers: [],
            linkedinconnections: [],
        }
    };

    GoalsFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
        if (data.meta.total_count > 0) {
            $scope.user.goals = data.objects;
        }

    });

    OffersFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
        if (data.meta.total_count > 0) {
            $scope.user.offers = data.objects;
        }

    });

    InterestsFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
        if (data.meta.total_count > 0) {
            $scope.user.interests = data.objects;
        }

    });


    UsersFactory.get({format: 'json'}, {userId: USER_ID}).$promise.then(function(data) {

        $scope.user.firstName = data.first_name;
        $scope.user.lastName = data.last_name;
        $scope.user.about = data.about;
        $scope.user.facebookId = data.facebook_id;


    });

    $scope.photosSlider = [];


    $scope.getPhotos = function() {
        PhotosFactory.query( {
            format: 'json'
        }).$promise.then(function(response) {
            $scope.user.photos = response.objects;




            if ($scope.user.photos.length === 0) {
                var newPhoto = {
                    photo:  USER_PHOTO,
                    order: 0,
                    user: '/api/v1/auth/user/' + USER_ID + '/'
                };

                PhotosFactory.save({}, newPhoto,
                    function(success){
                        $log.info(success);
                        $log.info('New photo saved.');
                        $scope.user.photos.push({photo:  USER_PHOTO, order: 0 });
                        $scope.photosSlider = $scope.user.photos;

                    },
                    function(error) {
                        $log.info(error);
                    });
            }
            else {
               $scope.photosSlider = $scope.user.photos;
           }
       });
    };

    $scope.getPhotos();


});
