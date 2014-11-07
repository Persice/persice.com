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


    $scope.keywords = ['Travel', 'Soccer', 'Spanish', 'Technology', 'Hiking'];

    $scope.removeKeyword = function(index) {
        $scope.keywords.splice(index, 1);
    }

    $scope.addKeyword = function(item) {
        if (item != '') {
           $scope.keywords.push(item);
           $scope.newKeyword = '';
       }

   }

});
