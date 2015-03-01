'use strict';

angular.module('beKindred')
.controller('FriendProfileCtrl', function ($scope, User, UsersFactory, MutualFriendsFactory, InterestsFactory, GoalsFactory, OffersFactory, LikesFactory, PhotosFactory, $log) {

    $scope.middleActive = true;


    $scope.user = {
        id: User.objects[0].id,
        facebook_id: User.objects[0].facebook_id,
        firstName: User.objects[0].first_name,
        lastName: User.objects[0].last_name,
        age: User.objects[0].age,
        about_me: User.objects[0].about_me,
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
        linkedinconnections: [],
        linkedin_provider: User.objects[0].linkedin_provider,
        twitter_provider:  User.objects[0].twitter_provider
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


        var goals = [];
        var matchedgoals = User.objects[0].goals[0];
        for (var key in matchedgoals) {
            var goal = {value: key, match: matchedgoals[key]};
            goals.push(goal);
        }
        $scope.user.goals = goals;

        var offers = [];
        var matchedoffers = User.objects[0].offers[0];
        for (var key in matchedoffers) {
            var offer = {value: key, match: matchedoffers[key]};
            offers.push(offer);
        }
        $scope.user.offers = offers;

        var interests = [];
        var matchedinterests = User.objects[0].interests[0];
        for (var key in matchedinterests) {
            var interest = {value: key, match: matchedinterests[key]};
            interests.push(interest);
        }
        $scope.user.interests = interests;

        var likes = [];
        var matchedlikes = User.objects[0].likes[0];
        for (var key in matchedlikes) {
            var like = {value: key, match: matchedlikes[key]};
            likes.push(like);
        }
        $scope.user.likes = likes;

        //mutual friends
        MutualFriendsFactory.query({format: 'json', user_id: $scope.user.id }).$promise.then(function(data) {
            if (data.objects.length > 0) {
                $scope.user.friends = data.objects[0].mutual_bk_friends;
                $scope.user.facebookfriends = data.objects[0].mutual_fb_friends;
                $scope.user.linkedinconnections = data.objects[0].mutual_linkedin_connections;
                $scope.user.twitterfollowers = data.objects[0].mutual_twitter_followers;
                $scope.user.twitterfriends = data.objects[0].mutual_twitter_friends;

                $scope.loadingUser = false;
                $scope.loadingGoals = false;
                $scope.loadingOffers = false;
                $scope.loadingLikes = false;
                $scope.loadingInterests = false;
            }

        }, function(response) {
            var data = response.data,
            status = response.status,
            header = response.header,
            config = response.config,
            message = 'Error ' + status;
            // error handler
            $log.error(message);
            $scope.loadingUser = false;
            $scope.loadingGoals = false;
            $scope.loadingOffers = false;
            $scope.loadingLikes = false;

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
   }, function(response) {
    var data = response.data,
    status = response.status,
    header = response.header,
    config = response.config,
    message = 'Error ' + status;
    // error handler
    $log.error(message);

});
};

$scope.getPhotos();


});
