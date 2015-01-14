'use strict';

angular.module('beKindred')
.controller('MyProfileCtrl', function ($scope, USER_ID, UsersFactory, GoalsFactory, OffersFactory, InterestsFactory) {
    $scope.user = {
        id: 1,
        firstName: '',
        lastName: '',
        age: 35,
        about: '',
        photos: [
        {photo: 'static/img/profile/photo0.jpg', order: 0},
        {photo: 'static/img/profile/photo1.jpg', order: 1},
        {photo: 'static/img/profile/photo2.jpg', order: 2},
        {photo: 'static/img/profile/photo3.jpg', order: 3},
        {photo: 'static/img/profile/photo4.jpg', order: 4},
        {photo: 'static/img/profile/photo5.jpg', order: 5}
        ],
        goals: [

        ],
        offers: [

        ],
        likes: [
        {name: 'Interstellar movie', match: 1},
        {name: 'FC Barcelona', match: 0},
        {name: 'Manchester United', match: 0},
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

    $scope.photosSlider = $scope.user.photos;


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


});
