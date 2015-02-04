'use strict';

angular.module('beKindred')
.controller('FriendProfileCtrl', function ($scope, User, UsersFactory, MutualFriendsFactory, InterestsFactory, GoalsFactory, OffersFactory, LikesFactory, PhotosFactory, $log) {
    $scope.user = {
        id: User.id,
        facebook_id: User.facebook_id,
        firstName: User.first_name,
        lastName: User.last_name,
        age: '',
        about_me: User.about_me,
        photos: [
        ],
        goals: [],
        offers: [],
        likes: [],
        interests: [],
        friends: [],
        facebookfriends: [],
        twitterfriends: [],
        twitterfollowers: [],
        linkedinconnections: []
    };

    $scope.defaultUserPhoto = '//graph.facebook.com/' + $scope.user.facebook_id + '/picture?type=large';

    $scope.loadingUser = false;
    $scope.loadingGoals = false;
    $scope.loadingOffers = false;
    $scope.loadingLikes = false;
    $scope.loadingInterests = false;

    $scope.getUser = function () {

        $scope.loadingUser = true;
        $scope.loadingGoals = true;
        $scope.loadingOffers = true;
        $scope.loadingLikes = true;

        GoalsFactory.query({user_id: $scope.user.id, format: 'json'}).$promise.then(function(data) {
            if (data.meta.total_count > 0) {
                $scope.user.goals = data.objects;
            }
            $scope.loadingGoals = false;

        });

        OffersFactory.query({user_id: $scope.user.id, format: 'json'}).$promise.then(function(data) {
            if (data.meta.total_count > 0) {
                $scope.user.offers = data.objects;
            }
            $scope.loadingOffers = false;

        });

        LikesFactory.query({user_id: $scope.user.id, format: 'json'}).$promise.then(function(data) {
            if (data.meta.total_count > 0) {
                $scope.user.likes = data.objects;
            }
            $scope.loadingLikes = false;

        });


        InterestsFactory.query({user_id: $scope.user.id, format: 'json'}).$promise.then(function(data) {
            if (data.meta.total_count > 0) {
                $scope.user.interests = data.objects;
            }
            $scope.loadingInterests = false;

        });


        UsersFactory.get({format: 'json'}, {userId: $scope.user.id}).$promise.then(function(data) {

            $scope.user.firstName = data.first_name;
            $scope.user.lastName = data.last_name;
            $scope.user.about_me = data.about_me;
            $scope.user.id = data.id;
            $scope.user.age = data.age;
            $scope.user.facebookId = data.facebook_id;

            $scope.loadingUser = false;

        });

        //mutual friends
        MutualFriendsFactory.query({format: 'json', user_id: $scope.user.id }).$promise.then(function(data) {
            if (data.objects.length > 0) {
                $scope.user.friends = data.objects[0].mutual_bk_friends;
                $scope.user.facebookfriends = data.objects[0].mutual_fb_friends;
                $scope.user.linkedinconnections = data.objects[0].mutual_linkedin_connections;
                $scope.user.twitterfollowers = data.objects[0].mutual_twitter_followers;
                $scope.user.twitterfriends = data.objects[0].mutual_twitter_friends;
            }

        });
    };

    $scope.getUser();

    $scope.photosSlider = [];


    $scope.getPhotos = function() {
        PhotosFactory.query( {
            format: 'json',
            user_id: $scope.user.id
        }).$promise.then(function(response) {
            $scope.user.photos = response.objects;




            if ($scope.user.photos.length === 0) {
                var newPhoto = {
                    photo:  $scope.defaultUserPhoto,
                    order: 0,
                    user: '/api/v1/auth/user/' + $scope.user.id + '/'
                };

                PhotosFactory.save({}, newPhoto,
                    function(success){
                        $log.info(success);
                        $log.info('New photo saved.');
                        $scope.user.photos.push({photo:  $scope.defaultUserPhoto, cropped_photo: '', order: 0 });
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
