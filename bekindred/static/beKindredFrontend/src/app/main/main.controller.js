'use strict';

angular.module('beKindred')
.controller('MainCtrl', function ($scope) {
    $scope.repeatN = function (n) {
        return new Array(n);
    };

    $scope.showfullprofile = false;

    $scope.switchFullProfile = function () {
        $scope.showfullprofile = !$scope.showfullprofile;
    };


});


angular.module('beKindred')
.controller('MyPageController', function ($scope, PhotosFactory, USER_ID, USER_PHOTO) {

    $scope.photosSlider = [];

    $scope.getPhotos = function() {
        PhotosFactory.query( {
            format: 'json'
        }).$promise.then(function(response) {
            $scope.photosSlider = response.objects;




            if ($scope.photosSlider.length === 0) {
                var newPhoto = {
                    photo:  USER_PHOTO,
                    order: 0,
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
            }
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
.controller('PhotosMatchedProfileController', function ($scope, PhotosFactory, MATCHED_ID, MATCHED_PHOTO) {

    $scope.photosSlider = [{photo: MATCHED_PHOTO, order: 0}];

    // $scope.getPhotos = function() {
    //     PhotosFactory.query( {
    //         format: 'json'
    //     }).$promise.then(function(response) {
    //         $scope.photosSlider = response.objects;




    //         if ($scope.photosSlider.length === 0) {
    //             var newPhoto = {
    //                 photo:  MATCHED_PHOTO,
    //                 order: 0,
    //                 user: '/api/v1/auth/user/' + MATCHED_ID + '/'
    //             };

    //             PhotosFactory.save({}, newPhoto,
    //                 function(success){
    //                     console.log(success);
    //                     console.log('New photo saved.');

    //                     $scope.getPhotos();
    //                 },
    //                 function(error) {
    //                     console.log(error);
    //                 });
    //         }
    //     });
    // };

    // $scope.getPhotos();


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
.controller('PhotosController', function ($scope, PhotosFactory, $filter, USER_ID, USER_PHOTO, $cookies, $http, FB_TOKEN) {

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


angular.module('beKindred')
.controller('FilterController', function ($scope, FiltersFactory, USER_ID) {
    $scope.distanceValue = 50;
    $scope.distanceOptions = {
        range: {min: 1, max: 10000}
    };

    $scope.genders = '';



    $scope.defaultFilters = {
        objects: [{
            distance: 50,
            gender: 'm,f',
            min_age: 25,
            max_age: 60,
            keyword: '',
            user: '/api/v1/auth/user/' + USER_ID + '/'
        }]

    };

    $scope.showMessage = false;
    $scope.filterID = null;

    $scope.ageValues = [25,60];
    $scope.ageOptions = {
        range: {min: 18, max: 115}
    };


    $scope.myKeywords = [];


    $scope.saveFilters = function () {

        FiltersFactory.query( {
            format: 'json'
        }).$promise.then(function(response) {
            $scope.filters = response.objects;

            $scope.filterID = $scope.filters[0].id;

            $scope.newFilters = {
                distance: $scope.distanceValue,
                gender: $scope.genders,
                min_age: $scope.ageValues[0],
                max_age: $scope.ageValues[1],
                keyword:  $scope.myKeywords.join(),
                id: $scope.filterID,
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            FiltersFactory.update({filterId: $scope.filterID}, $scope.newFilters,
                function(success) {
                }, function(error) {
                });


        });


    };

    $scope.getFilters = function() {
        FiltersFactory.query( {
            format: 'json'
        }).$promise.then(function(response) {
            $scope.filters = response.objects;

            if ($scope.filters.length === 0) {
                //API update filters - patch method
                FiltersFactory.update({}, $scope.defaultFilters,
                    function(success) {
                        $('.ui.checkbox').checkbox('check');
                    }, function(error) {
                        console.log(error);
                    });
            }
            else {
                $scope.distanceValue = response.objects[0].distance;
                $scope.ageValues[0] = response.objects[0].min_age;
                $scope.ageValues[1] = response.objects[0].max_age;
                if (response.objects[0].keyword !== '') {
                    $scope.myKeywords = response.objects[0].keyword.split(',');
                }
                if (response.objects[0].gender === '') {
                    $('.ui.checkbox').checkbox('uncheck');
                }
                if (response.objects[0].gender === 'm,f') {
                    $('.ui.checkbox').checkbox('check');
                }
                if (response.objects[0].gender === 'm') {
                    $('#male').checkbox('check');
                    $('#female').checkbox('uncheck');
                }
                if (response.objects[0].gender === 'f') {
                    $('#female').checkbox('check');
                    $('#male').checkbox('uncheck');
                }
            }



        });
};

$scope.getFilters();




$scope.removeKeyword = function(index) {
    $scope.myKeywords.splice(index, 1);
    $scope.saveFilters();
};

$scope.addKeyword = function(item) {

    var existing = _.some($scope.myKeywords, function(i) {
        return i === item;
    });

    if (!existing) {
        $scope.myKeywords.push(item);
        $scope.saveFilters();
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