'use strict';

angular.module('beKindred')
.controller('MyProfileCtrl', function ($scope, USER_FIRSTNAME, USER_LASTNAME) {
    $scope.user = {
        id: 1,
        first_name:  USER_FIRSTNAME,
        last_name:  USER_LASTNAME,
        age: 35,
        distance: 40.3,
        about: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, inventore molestias mollitia officiis reiciendis sequi vero iure in. Magnam ut cupiditate pariatur praesentium tenetur dicta nam natus nesciunt ducimus dolorem.',
        photos: [
        {photo: 'static/img/profile/photo0.jpg', order: 0},
        {photo: 'static/img/profile/photo1.jpg', order: 1},
        {photo: 'static/img/profile/photo2.jpg', order: 2},
        {photo: 'static/img/profile/photo3.jpg', order: 3},
        {photo: 'static/img/profile/photo4.jpg', order: 4},
        {photo: 'static/img/profile/photo5.jpg', order: 5}
        ],
        goals: [
        {subject: 'Learn python', match: 1},
        {subject: 'Learn django', match: 1},
        {subject: 'Learn laravel', match: 0},
        {subject: 'Learn ruby on rails', match: 0}
        ],
        offers: [
        {subject: 'Teach C++', match: 1},
        {subject: 'Teach how to play tennis', match: 1},
        {subject: 'Teach how to play soccer', match: 1},
        {subject: 'Teach how to play basketball', match: 1}
        ],
        likes: [
        {name: 'Interstellar movie', match: 1},
        {name: 'FC Barcelona', match: 0},
        {name: 'Manchester United', match: 0},
        {name: 'Miami Heat', match: 1}
        ],
        interests: [
        {description: 'Django', match: 1},
        {description: 'Programming', match: 0},
        {description: 'Hiking', match: 0},
        {description: 'Street basketball', match: 1}
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


});
