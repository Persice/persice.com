'use strict';

angular.module('beKindred')
.controller('EditMyProfileCtrl', function ($scope, USER_ID, UsersFactory, GoalsFactory, OffersFactory, InterestsFactory, PhotosFactory, $log, $filter, $cookies, $http, FB_TOKEN, $window) {

    $scope.user = {
        id: USER_ID,
        firstName: '',
        lastName: '',
        age: 0,
        about: '',
        photos: [
        {id: 0, order: 0, photo: ''},
        {id: 0, order: 1, photo: ''},
        {id: 0, order: 2, photo: ''},
        {id: 0, order: 3, photo: ''},
        {id: 0, order: 4, photo: ''},
        {id: 0, order: 5, photo: ''}
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




    //photos

    $scope.apiPhotos = [];
    $scope.facebookPhotos = [];

    $scope.onDropComplete = function (index, obj, evt) {
        var otherObj = $scope.user.photos[index];
        var otherIndex = $scope.user.photos.indexOf(obj);

        $scope.user.photos[index] = obj;
        $scope.user.photos[index].order = index;
        $scope.user.photos[otherIndex] = otherObj;
        $scope.user.photos[otherIndex].order = otherIndex;


        if ($scope.user.photos[index].id !== 0) {
            //API update photo - patch method
            PhotosFactory.update({photoId: $scope.user.photos[index].id}, {order:  $scope.user.photos[index].order },
                function(success) {
                    $log.info('Photo order saved');
                }, function(error) {
                    $log.info(error);
                });

        }


        if ($scope.user.photos[otherIndex].id !== 0) {
            //API update photo - patch method
            PhotosFactory.update({photoId: $scope.user.photos[otherIndex].id}, {order:  $scope.user.photos[otherIndex].order },
                function(success) {
                    console.log('Photo order saved');
                }, function(error) {
                    console.log(error);
                });

        }

    };

    $scope.getPhotos = function() {
        PhotosFactory.query( {
            format: 'json'
        }).$promise.then(function(response) {
            $scope.apiPhotos = response.objects;
            $log.info($scope.apiPhotos);
            for(var obj in $scope.apiPhotos) {
                for(var p in $scope.user.photos) {
                    if ($scope.user.photos[p].order === $scope.apiPhotos[obj].order) {
                        $scope.user.photos[p].id = $scope.apiPhotos[obj].id;
                        $scope.user.photos[p].photo = $scope.apiPhotos[obj].photo;
                    }
                }
            }
        });
    };

    $scope.getPhotos();

    $scope.currentAlbum = '';


    $scope.getFBPhotos = function(id, name) {

        $scope.hideAlbums = true;
        $scope.currentAlbum = name;
        $scope.photosLoading = true;

        $http.get('https://graph.facebook.com/' + id + '?fields=photos{id,height,width,source}&access_token=' + FB_TOKEN).
        success(function(data, status, headers, config) {
            $log.info(data);

            $scope.photosLoading = false;

            $scope.facebookPhotos = data.photos.data;
        }).
        error(function(data, status, headers, config) {
            $log.info(data);
            $scope.photosLoading = false;
        });



    };

    $scope.backToAlbums = function () {
        $scope.currentAlbum = '';
        $scope.hideAlbums = !$scope.hideAlbums;
        $scope.getFBAlbums();

    };

    $scope.facebookAlbums = [];
    $scope.hideAlbums = false;


    $scope.getFBAlbums = function() {
        $scope.showModal = true;
        $scope.albumsLoading = true;
        $http.get('https://graph.facebook.com/me/albums?fields=picture,name&access_token=' + FB_TOKEN).
        success(function(data, status, headers, config) {
            $log.info(data);
            $scope.facebookAlbums = data.data;
            $scope.albumsLoading = false;

        }).
        error(function(data, status, headers, config) {
            $log.info(data);
            $scope.albumsLoading = false;
        });



    };




    $scope.deletePhoto = function() {
        var deleteIndex = $scope.userPhotoDeleteIndex;
        //API delete call
        PhotosFactory.delete({photoId: $scope.user.photos[deleteIndex].id},
            function(success) {
                $scope.user.photos[deleteIndex].photo = '';
                $scope.user.photos[deleteIndex].id = 0;
                $log.info('Photo deleted');

            },
            function(error) {
                $log.info(error);
            });

    };

    $scope.closeModal = function() {
        $scope.showModal = false;
    };

    $scope.showModal = false;
    $scope.albumsLoading = false;
    $scope.photosLoading = false;

    $scope.createPhoto = function(indexFbPhoto) {

        $log.info('Creating photo');

        var newFbPhoto = $scope.facebookPhotos[indexFbPhoto];

        //API create photo

        var newPhoto = {
            photo:  newFbPhoto.source,
            order: $scope.newPhotoIndex,
            user: '/api/v1/auth/user/' + USER_ID + '/'
        };

        PhotosFactory.save({}, newPhoto,
            function(success){
                $log.info('New photo saved.');
                var index = $scope.newPhotoIndex;
                $scope.user.photos[index].photo =  success.photo;
                $scope.user.photos[index].id =  success.id;
                $scope.closeModal();
                $window.scrollTo(0,0);

            },
            function(error) {
            });






    };

    $scope.$on('ngRepeatFinished', function () {

        // $('#photos_modal').modal('attach events', '.add_photo', 'show');
        $('#deletePhotoModal').modal('attach events', '.delete_photo', 'show');


        // $('.special.cards .image').dimmer({
        //     on: 'hover'
        // });



});



});