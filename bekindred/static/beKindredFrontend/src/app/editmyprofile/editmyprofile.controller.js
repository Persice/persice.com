'use strict';

angular.module('beKindred')
.controller('EditMyProfileCtrl', function ($scope, USER_ID, USER_TWITTER, USER_LINKEDIN_NAME, USER_LINKEDIN_URL, UsersFactory, GoalsFactory, LikesFactory, SubjectsFactory, OffersFactory, InterestsFactory, PhotosFactory, $log, $filter, $cookies, $http, FB_TOKEN, $window, $resource) {
    $scope.twitter = USER_TWITTER;
    $scope.linkedin = USER_LINKEDIN_NAME;
    $scope.linkedinUrl = USER_LINKEDIN_URL;
    $scope.user = {
        id: USER_ID,
        firstName: '',
        lastName: '',
        age: '',
        about_me: '',
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
        $scope.loadingInterests = true;

        GoalsFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
            if (data.meta.total_count > 0) {
                $scope.user.goals = data.objects;
            }
            $scope.loadingGoals = false;

        });

        OffersFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
            if (data.meta.total_count > 0) {
                $scope.user.offers = data.objects;
            }
            $scope.loadingOffers = false;

        });

        LikesFactory.query({format: 'json'}).$promise.then(function(data) {
            if (data.meta.total_count > 0) {
                $scope.user.likes = data.objects;
            }
            $scope.loadingLikes = false;

        });


        InterestsFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
            if (data.meta.total_count > 0) {
                $scope.user.interests = data.objects;
            }
            $scope.loadingInterests = false;

        });



        UsersFactory.get({format: 'json'}, {userId: USER_ID}).$promise.then(function(data) {

            $scope.user.firstName = data.first_name;
            $scope.user.lastName = data.last_name;
            $scope.user.about_me = data.about_me;
            $scope.user.age = data.age;
            $scope.user.facebookId = data.facebook_id;

            $scope.loadingUser = false;

        });
    };

    $scope.getUser();


    //about_me
    $scope.loadingAbout = false;
    $scope.saveAbout = function() {
        $scope.loadingAbout = true;
        UsersFactory.update({userId: USER_ID}, {about_me:  $scope.user.about_me },
            function(success) {
                $log.info('About changes saved');
                $scope.loadingAbout = false;
            }, function(error) {
                $log.info(error);
            });
    };

    //interests

    $scope.newinterest = '';
    $scope.editInterest = false;
    $scope.newInterest = false;
    $scope.changeInterest = false;
    $scope.interestIndex = null;


    $scope.closeEditInterest = function() {
        $scope.newinterest = '';
        $scope.messageShow = false;
        $scope.message = '';
        $scope.editInterest = false;
        $scope.newInterest = false;
        $scope.changeInterest = false;
        $scope.interestIndex = null;
    };

    $scope.createInterest = function(interest) {

        //if subject is empty warn user to enter subject
        if (interest === '') {
            $scope.message = 'Interest cannot be empty';
            $scope.messageShow = true;
            return false;
        }

        var newInterest = {
            user: $scope.userUri,
            description: interest
        };


        //check if user already has created this interest
        InterestsFactory.query({format: 'json', description: interest, user_id: USER_ID}).$promise.then(function(data) {
            var userInterests = data.objects;
            var findInterest = null;
            findInterest = $filter('getByProperty')('description', interest, userInterests);
            if (findInterest !== null) {
                $scope.message = 'You have already created this interest.';
                $scope.messageShow = true;
            }
            else {
                InterestsFactory.save({}, newInterest,
                    function(success){
                        $scope.user.interests.push(success);
                        $scope.closeEditInterest();
                    },
                    function(error) {

                    });
            }
        });



    };

    $scope.saveChangedInterest = function(interest) {

        //if subject is empty warn user to enter subject
        if (interest === '') {
            $scope.message = 'Interest cannot be empty';
            $scope.messageShow = true;
            return false;
        }

        InterestsFactory.update({interestId: $scope.user.interests[$scope.interestIndex].id}, {description: interest },
            function(success) {
                $log.info('Interest update saved');
                $scope.user.interests[$scope.interestIndex].description = interest;
                $scope.closeEditInterest();
            }, function(error) {
                $log.info(error);
            });
    };

    $scope.createNewInterest = function() {
        $log.info('creating interest');
        $scope.editInterest = true;
        $scope.newInterest = true;
    };


    $scope.editCurrentInterest = function(index) {
        $log.info('editing interest');

        $scope.editInterest = true;
        $scope.changeInterest = true;
        $scope.interestIndex = index;
        $scope.newinterest = $scope.user.interests[index].description;
    };

    $scope.removeInterest = function(index) {

        var Interest = $resource($scope.user.interests[index].resource_uri);

        Interest.delete().$promise.then(function(data) {
            $scope.user.interests.splice(index, 1);
        });
    };










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
                    $log.info('Photo order saved');
                }, function(error) {
                    $log.info(error);
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
        $('#deletePhotoModal').modal('attach events', '.delete_photo', 'show');
    });


    //Goals

    $scope.editGoal = false;

    $scope.subject = '';
    $scope.resourceUri = null;
    $scope.messageShow = false;
    $scope.message = '';

    $scope.userUri = '/api/v1/auth/user/' + USER_ID + '/';

    $scope.inputChanged = function (str) {
        $scope.subject = str;
    };

    $scope.selectResult = function (object) {
        if (object !== undefined) {
            $scope.subject = object.originalObject.description;
            $scope.resourceUri = object.originalObject.resource_uri;
        }
        else {
            $scope.resourceUri = null;
        }

    };


    $scope.createNewGoal = function() {
        $log.info('creating goal');
        $scope.editGoal = true;
    };

    $scope.closeEditGoal = function() {
        $scope.subject = '';
        $scope.resourceUri = null;
        $scope.messageShow = false;
        $scope.message = '';
        $scope.editGoal = false;
    };

    $scope.removeGoal = function(index) {

        var Goal = $resource($scope.user.goals[index].resource_uri);

        Goal.delete().$promise.then(function(data) {
            $scope.user.goals.splice(index, 1);
        });
    };



    $scope.saveGoal = function() {
        var newGoal = {
            goal: $scope.resourceUri,
            user: $scope.userUri
        };

        GoalsFactory.save({}, newGoal,
            function(success){
                $scope.editGoal = !$scope.editGoal;
                $scope.user.goals.push(success);

                $scope.subject = '';
                $scope.resourceUri = null;
                $scope.messageShow = false;
                $scope.message = '';

            },
            function(error) {

            });
    };

    $scope.createGoal = function() {
        $scope.messageShow = false;
        $scope.message = '';


        //if subject is empty warn user to enter subject
        if ($scope.subject === '') {
            $scope.message = 'Entering your goal is required to continue.';
            $scope.messageShow = true;
            return false;
        }

        //check if subject already exists
        if ($scope.resourceUri !== null) {

            //check if user already has created this goal
            GoalsFactory.query({format: 'json'}).$promise.then(function(data) {
                var userGoals = data.objects;
                var findGoal = null;
                findGoal = $filter('getByProperty')('subject', $scope.subject, userGoals);
                if (findGoal !== null) {
                    $scope.message = 'You have already created this goal.';
                    $scope.messageShow = true;
                    return false;
                }
                else {
                    //create new goal
                    $scope.saveGoal();
                }
            });



        }
        else {
            //create new subject
            var newSubject = {
                description: $scope.subject,
            };

            SubjectsFactory.save({}, newSubject,
                function(success){
                    $scope.resourceUri = success.resource_uri;
                    $scope.saveGoal();

                },
                function(error) {
                    $scope.message = 'You have already created this goal.';
                    $scope.messageShow = true;
                });
        }

    };


    //Offers

    $scope.editOffer = false;

    $scope.createNewOffer = function() {
        $log.info('creating offer');
        $scope.editOffer = true;
    };

    $scope.closeEditOffer = function() {
        $scope.editOffer = false;
        $scope.subject = '';
        $scope.resourceUri = null;
        $scope.messageShow = false;
        $scope.message = '';
        $scope.editOffer = false;
    };

    $scope.removeOffer = function(index) {

        var Offer = $resource($scope.user.offers[index].resource_uri);

        Offer.delete().$promise.then(function(data) {
            $scope.user.offers.splice(index, 1);
        });
    };



    $scope.saveOffer = function() {
        var newOffer = {
            offer: $scope.resourceUri,
            user: $scope.userUri
        };

        OffersFactory.save({}, newOffer,
            function(success){
                $scope.editOffer = !$scope.editOffer;
                $scope.user.offers.push(success);

                $scope.subject = '';
                $scope.resourceUri = null;
                $scope.messageShow = false;
                $scope.message = '';

            },
            function(error) {

            });
    };

    $scope.createOffer = function() {
        $scope.messageShow = false;
        $scope.message = '';


        //if subject is empty warn user to enter subject
        if ($scope.subject === '') {
            $scope.message = 'Entering your offer is required to continue.';
            $scope.messageShow = true;
            return false;
        }

        //check if subject already exists
        if ($scope.resourceUri !== null) {

            //check if user already has created this offer
            OffersFactory.query({format: 'json'}).$promise.then(function(data) {
                var userOffers = data.objects;
                var findOffer = null;
                findOffer = $filter('getByProperty')('subject', $scope.subject, userOffers);
                if (findOffer !== null) {
                    $scope.message = 'You have already created this offer.';
                    $scope.messageShow = true;
                    return false;
                }
                else {
                    //create new offer
                    $scope.saveOffer();
                }
            });



        }
        else {
            //create new subject
            var newSubject = {
                description: $scope.subject,
            };

            SubjectsFactory.save({}, newSubject,
                function(success){
                    $scope.resourceUri = success.resource_uri;
                    $scope.saveOffer();

                },
                function(error) {
                    $scope.message = 'You have already created this offer.';
                    $scope.messageShow = true;
                });
        }

    };


    //Edit About


    $scope.editAbout = false;





});