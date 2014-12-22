'use strict';

angular.module('beKindred')
.controller('EditMyProfileCtrl', function ($scope) {
    $scope.user = {
        id: 1,
        first_name: 'Mark',
        last_name: 'Wahlberg',
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


    //photos
    //
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

    $scope.facebookPhotos = [];

    $scope.onDropComplete = function (index, obj, evt) {
        var otherObj = $scope.user.photos[index];
        var otherIndex = $scope.user.photos.indexOf(obj);
        $scope.user.photos[index] = obj;
        $scope.user.photos[index].order = index;
        $scope.user.photos[otherIndex] = otherObj;
        $scope.user.photos[otherIndex].order = otherIndex;


        // //API update photo - patch method
        // PhotosFactory.update({photoId: $scope.photos[index].id}, {order:  $scope.photos[index].order },
        //     function(success) {
        //         console.log('Photo order saved');
        //     }, function(error) {
        //         console.log(error);
        //     });

        // //API update photo - patch method
        // PhotosFactory.update({photoId: $scope.photos[otherIndex].id}, {order:  $scope.photos[otherIndex].order },
        //     function(success) {
        //         console.log('Photo order saved');
        //     }, function(error) {
        //         console.log(error);
        //     });

    };


});



angular.module('beKindred')
.controller('PhotosController', function ($scope, PhotosFactory, $filter, $cookies, $http, FB_TOKEN) {

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

    $scope.facebookPhotos = [];

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

        //API update photo - patch method
        PhotosFactory.update({photoId: $scope.photos[otherIndex].id}, {order:  $scope.photos[otherIndex].order },
            function(success) {
                console.log('Photo order saved');
            }, function(error) {
                console.log(error);
            });

    };

    $scope.getPhotos = function() {
        PhotosFactory.query( {
            format: 'json'
        }).$promise.then(function(response) {
            $scope.apiPhotos = response.objects;



            for(var obj in $scope.apiPhotos) {
                for(var p in $scope.photos) {
                    if ($scope.photos[p].order === $scope.apiPhotos[obj].order) {
                        $scope.photos[p].id = $scope.apiPhotos[obj].id;
                        $scope.photos[p].photo = $scope.apiPhotos[obj].photo;
                    }
                }
            }


            $scope.photosSlider = $scope.apiPhotos;





        });
    };

    $scope.getPhotos();

    $scope.currentAlbum = '';


    $scope.getFBPhotos = function(id, name) {

        $scope.currentAlbum = name;


        $http.get('https://graph.facebook.com/' + id + '?fields=photos{id,height,width,source}&access_token=' + FB_TOKEN).
        success(function(data, status, headers, config) {
            console.log(data);
            $scope.hideAlbums = true;
            $scope.facebookPhotos = data.photos.data;
        }).
        error(function(data, status, headers, config) {
            console.log(data);
        });



    };

    $scope.backToAlbums = function () {
        $scope.currentAlbum = '';
        $scope.hideAlbums = !$scope.hideAlbums;
    };

    $scope.facebookAlbums = [];
    $scope.hideAlbums = false;


    $scope.getFBAlbums = function() {

        $http.get('https://graph.facebook.com/me/albums?fields=picture,name&access_token=' + FB_TOKEN).
        success(function(data, status, headers, config) {
            console.log(data);
            $scope.facebookAlbums = data.data;

        }).
        error(function(data, status, headers, config) {
            console.log(data);
        });



    };

    $scope.getFBAlbums();

    // $scope.getFBPhotos();


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
            photo:  newFbPhoto.source,
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
        $('#photos_modal').modal('attach events', '.add_photo', 'show');
        $('#deletePhotoModal').modal('attach events', '.delete_photo', 'show');


        $('.special.cards .image').dimmer({
            on: 'hover'
        });

    });



});
