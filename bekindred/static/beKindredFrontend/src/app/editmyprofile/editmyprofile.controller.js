'use strict';

angular.module('icebrak')
    .controller('EditMyProfileCtrl', function($scope, $timeout, USER_ID, $q, $state, UsersFactory, GoalsFactory, LikesFactory, SubjectsFactory, OffersFactory, InterestsFactory, PhotosFactory, $log, $filter, $cookies, $http, FB_TOKEN, $location, $anchorScroll, $window, $resource, notify) {
        $scope.social = {
            twitter: '',
            linkedin: ''
        };

        $scope.userUri = '/api/v1/auth/user/' + USER_ID + '/';
        $scope.user = {
            id: USER_ID,
            firstName: '',
            lastName: '',
            age: '',
            about_me: '',
            photos: [{
                id: 0,
                order: 0,
                photo: '',
                cropped_photo: ''
            }, {
                id: 0,
                order: 1,
                photo: '',
                cropped_photo: ''
            }, {
                id: 0,
                order: 2,
                photo: '',
                cropped_photo: ''
            }, {
                id: 0,
                order: 3,
                photo: '',
                cropped_photo: ''
            }, {
                id: 0,
                order: 4,
                photo: '',
                cropped_photo: ''
            }, {
                id: 0,
                order: 5,
                photo: '',
                cropped_photo: ''
            }],
            goals: [

            ],
            offers: [

            ],
            likes: [],
            interests: [],
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

        $scope.getUser = function() {

            $scope.loadingUser = true;
            $scope.loadingGoals = true;
            $scope.loadingOffers = true;
            $scope.loadingLikes = true;
            $scope.loadingInterests = true;

            GoalsFactory.query({
                user_id: USER_ID,
                format: 'json'
            }).$promise.then(function(data) {
                if (data.meta.total_count > 0) {
                    $scope.user.goals = data.objects;
                }
                $scope.loadingGoals = false;



            });

            OffersFactory.query({
                user_id: USER_ID,
                format: 'json'
            }).$promise.then(function(data) {
                if (data.meta.total_count > 0) {
                    $scope.user.offers = data.objects;
                }
                $scope.loadingOffers = false;

            });

            LikesFactory.query({
                user_id: USER_ID,
                format: 'json'
            }).$promise.then(function(data) {
                if (data.meta.total_count > 0) {
                    $scope.user.likes = data.objects;
                }
                $scope.loadingLikes = false;

            });


            InterestsFactory.query({
                user_id: USER_ID,
                format: 'json'
            }).$promise.then(function(data) {
                if (data.meta.total_count > 0) {
                    $scope.user.interests = data.objects;
                }
                $scope.loadingInterests = false;

            });



            UsersFactory.get({
                format: 'json'
            }, {
                userId: USER_ID
            }).$promise.then(function(data) {

                $scope.user.firstName = data.first_name;
                $scope.user.lastName = data.last_name;
                $scope.user.about_me = data.about_me;
                $scope.user.age = data.age;
                $scope.user.facebookId = data.facebook_id;
                $scope.user.facebookProfile = data.facebook_profile_url;
                if (data.twitter_provider !== null) {
                    $scope.social.twitter = data.twitter_provider;
                }

                if (data.linkedin_provider !== null) {
                    $scope.social.linkedin = data.linkedin_provider;
                }

                $scope.loadingUser = false;

            });
        };

        $scope.getUser();


        $scope.link = function(provider) {
            var w = 350;
            var h = 250;

            var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;


            var settings = 'height=' + h + ',width=' + w + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes';
            var url = '/social/associate/' + provider + '/?next=/goals/close_login_popup';
            var newWindow = window.open(url, 'Connecting...', settings);

            if (window.focus) {
                newWindow.focus();
            }
        };

        $scope.unlink = function(provider) {
            var w = 350;
            var h = 250;

            var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;


            var settings = 'height=' + h + ',width=' + w + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes';
            var url = '/social/disconnect/' + provider + '/';
            var newWindow = window.open(url, 'Disconnecting...', settings);

            if (window.focus) {
                newWindow.focus();
            }
        };


        $scope.refreshUser = function() {
            UsersFactory.get({
                format: 'json'
            }, {
                userId: USER_ID
            }).$promise.then(function(data) {
                $scope.twitter = data.twitter_provider;
                $scope.linkedin = data.linkedin_provider;
            });
        };


        //about_me
        $scope.loadingAbout = false;
        $scope.saveAbout = function() {
            $scope.loadingAbout = true;
            UsersFactory.update({
                    userId: USER_ID
                }, {
                    about_me: $scope.user.about_me
                },
                function(success) {

                    $scope.loadingAbout = false;
                },
                function(error) {
                    $log.info(error);
                });
        };

        //photos

        $scope.apiPhotos = [];
        $scope.facebookPhotos = [];

        $scope.onDropComplete = function(index, obj, evt) {
            var otherObj = $scope.user.photos[index];
            var otherIndex = $scope.user.photos.indexOf(obj);

            $scope.user.photos[index] = obj;
            $scope.user.photos[index].order = index;
            $scope.user.photos[otherIndex] = otherObj;
            $scope.user.photos[otherIndex].order = otherIndex;


            if ($scope.user.photos[index].id !== 0) {
                PhotosFactory.update({
                        photoId: $scope.user.photos[index].id
                    }, {
                        order: $scope.user.photos[index].order
                    },
                    function(success) {},
                    function(error) {
                        $log.info(error);
                    });

            }


            if ($scope.user.photos[otherIndex].id !== 0) {
                PhotosFactory.update({
                        photoId: $scope.user.photos[otherIndex].id
                    }, {
                        order: $scope.user.photos[otherIndex].order
                    },
                    function(success) {},
                    function(error) {
                        $log.info(error);
                    });

            }

        };

        $scope.getPhotos = function() {
            PhotosFactory.query({
                format: 'json'
            }).$promise.then(function(response) {
                $scope.apiPhotos = response.objects;
                for (var obj in $scope.apiPhotos) {
                    for (var p in $scope.user.photos) {
                        if ($scope.user.photos[p].order === $scope.apiPhotos[obj].order) {
                            $scope.user.photos[p].id = $scope.apiPhotos[obj].id;
                            $scope.user.photos[p].photo = $scope.apiPhotos[obj].photo;
                            $scope.user.photos[p].cropped_photo = $scope.apiPhotos[obj].cropped_photo;
                        }
                    }
                }
            });
        };

        $scope.getPhotos();

        $scope.currentAlbum = '';


        $scope.getFBPhotos = function(id, name) {
            $scope.showPhotos = true;
            $scope.myImage = null;
            $scope.photoIndex = null;
            $scope.hideAlbums = true;
            $scope.currentAlbum = name;
            $scope.photosLoading = true;
            $http.get('https://graph.facebook.com/' + id + '?fields=photos{id,height,width,source}&access_token=' + FB_TOKEN).
            success(function(data, status, headers, config) {
                $scope.photosLoading = false;
                $scope.facebookPhotos = data.photos.data;
            }).
            error(function(data, status, headers, config) {
                $scope.photosLoading = false;
            });



        };

        $scope.backToAlbums = function() {
            $scope.showPhotos = true;
            $scope.myImage = null;
            $scope.photoIndex = null;
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
                $scope.facebookAlbums = data.data;
                $scope.albumsLoading = false;

            }).
            error(function(data, status, headers, config) {
                $scope.albumsLoading = false;
            });



        };



        $scope.deletePhoto = function() {
            var deleteIndex = $scope.userPhotoDeleteIndex;
            PhotosFactory.delete({
                    photoId: $scope.user.photos[deleteIndex].id
                },
                function(success) {
                    $scope.user.photos[deleteIndex].photo = '';
                    $scope.user.photos[deleteIndex].cropped_photo = '';
                    $scope.user.photos[deleteIndex].id = 0;
                },
                function(error) {
                    $log.info(error);
                });

        };

        $scope.closeModal = function() {
            $scope.showModal = false;

            $scope.showPhotos = true;
            $scope.myImage = null;
            $scope.photoIndex = null;

            $timeout(function() {
                $location.hash('my-profile-header-edit');
                $anchorScroll();
            }, 600);

        };

        $scope.showModal = false;
        $scope.albumsLoading = false;
        $scope.photosLoading = false;

        $scope.showPhotos = true;
        $scope.myImage = null;
        $scope.photoIndex = null;
        $scope.myCroppedImage = null;

        $scope.showCrop = function(index) {
            $scope.photoIndex = index;
            $scope.myImage = $scope.facebookPhotos[index].source;
            $scope.showPhotos = false;
        };

        $scope.myCroppedImage = '';

        $scope.createPhoto = function(croppedPhoto) {

            var indexFbPhoto = $scope.photoIndex;


            var newFbPhoto = $scope.facebookPhotos[indexFbPhoto];
            var newPhoto = {
                cropped_photo: croppedPhoto,
                photo: newFbPhoto.source,
                order: $scope.newPhotoIndex,
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            PhotosFactory.save({}, newPhoto,
                function(success) {
                    var index = $scope.newPhotoIndex;
                    $scope.user.photos[index].photo = success.photo;
                    $scope.user.photos[index].cropped_photo = success.cropped_photo;
                    $scope.user.photos[index].id = success.id;
                    $scope.closeModal();


                },
                function(error) {});



        };

        $scope.$on('ngRepeatFinishedPhotos', function() {
            $('#deletePhotoModal').modal('attach events', '.delete_photo', 'show');

        });

        $scope.$on('ngRepeatFinished', function() {
            $('.ui.search.goals')
                .search({
                    apiSettings: {
                        url: 'api/v1/subject/?format=json&description__icontains={query}',
                    },
                    minCharacters: 3,
                    searchDelay: 400,
                    type: 'standard',
                    cache: false,
                    onSelect: function(result, response) {
                        var idx = $(this).attr('rel');
                        if (result !== undefined) {
                            $scope.user.goals[idx].subject = result.description;

                        }

                    }


                });


            $('.ui.search.offers')
                .search({
                    apiSettings: {
                        url: 'api/v1/subject/?format=json&description__icontains={query}',
                    },
                    minCharacters: 3,
                    searchDelay: 400,
                    type: 'standard',
                    cache: false,
                    onSelect: function(result, response) {
                        var idx = $(this).attr('rel');
                        if (result !== undefined) {
                            $scope.user.offers[idx].subject = result.description;

                        }

                    }


                });

            $('.ui.search.interests')
                .search({
                    apiSettings: {
                        url: 'api/v1/interest_subject/?format=json&description__icontains={query}',
                    },
                    minCharacters: 3,
                    searchDelay: 400,
                    type: 'standard',
                    cache: false,
                    onSelect: function(result, response) {
                        var idx = $(this).attr('rel');
                        if (result !== undefined) {
                            $scope.user.interests[idx].interest_subject = result.description;

                        }

                    }


                });

        });


        $scope.goalNeedSaving = function(index) {
            $scope.user.goals[index].changed = true;
        };

        $scope.createNewGoal = function() {

            var newGoal = {
                id: 0,
                subject: '',
                user: $scope.userUri,
                changed: true
            };

            $scope.user.goals.push(newGoal);

        };


        $scope.removeGoal = function(index) {

            var Goal = $resource($scope.user.goals[index].resource_uri);

            if ($scope.user.goals[index].id === 0) {
                $scope.user.goals.splice(index, 1);
            } else {
                Goal.delete().$promise.then(function(data) {
                    $scope.user.goals.splice(index, 1);
                });
            }

        };


        $scope.saveCurrentGoal = function(index) {

            var deferred = $q.defer();

            $scope.user.goals[index].errorMessage = '';
            $scope.user.goals[index].error = false;

            if ($scope.user.goals[index].subject.length > 300) {
                $scope.user.goals[index].error = true;
                $scope.user.goals[index].errorMessage = 'Goal cannot have more than 300 characters.';
                deferred.reject();
                return deferred.promise;
            }

            if ($scope.user.goals[index].subject === '') {
                $scope.user.goals[index].error = true;
                $scope.user.goals[index].errorMessage = 'Entering your goal is required.';
                deferred.reject();
            } else {
                if ($scope.user.goals[index].id === 0) {
                    //create new goal
                    var newGoal = {
                        goal_subject: $scope.user.goals[index].subject,
                        user: $scope.userUri
                    };
                    $scope.user.goals[index].loading = true;
                    $scope.user.goals[index].error = false;
                    GoalsFactory.save({}, newGoal,
                        function(success) {
                            $scope.user.goals[index].loading = false;
                            $scope.user.goals[index].error = false;
                            $scope.user.goals[index].id = success.id;
                            $scope.user.goals[index].goal = success.goal;
                            $scope.user.goals[index].goal_subject = success.goal_subject;
                            $scope.user.goals[index].resource_uri = success.resource_uri;
                            $scope.user.goals[index].user = success.user;

                            $scope.user.goals[index].changed = false;
                            deferred.resolve();
                        },
                        function(error) {
                            $scope.user.goals[index].errorMessage = error.data.goal.error[0];
                            $scope.user.goals[index].loading = false;
                            $scope.user.goals[index].error = true;
                            deferred.reject();

                        });
                } else {
                    //edit goal
                    $scope.user.goals[index].error = false;
                    $scope.user.goals[index].loading = true;
                    GoalsFactory.update({
                            goalId: $scope.user.goals[index].id
                        }, {
                            goal_subject: $scope.user.goals[index].subject
                        },
                        function(success) {
                            $scope.user.goals[index].loading = false;
                            $scope.user.goals[index].error = false;
                            $scope.user.goals[index].goal = success.goal;
                            $scope.user.goals[index].goal_subject = success.goal_subject;
                            $scope.user.goals[index].resource_uri = success.resource_uri;

                            $scope.user.goals[index].changed = false;
                            deferred.resolve();

                        },
                        function(error) {
                            if (error.data.goal) {
                                $scope.user.goals[index].errorMessage = error.data.goal.error[0];
                            } else {
                                $scope.user.goals[index].errorMessage = 'There was an error when trying to save this field.';
                            }
                            $scope.user.goals[index].loading = false;
                            $scope.user.goals[index].error = true;
                            deferred.reject();

                        });


                }
            }

            return deferred.promise;
        };

        $scope.offerNeedSaving = function(index) {
            $scope.user.offers[index].changed = true;
        };


        $scope.createNewOffer = function() {

            var newOffer = {
                id: 0,
                subject: '',
                user: $scope.userUri,
                changed: true
            };

            $scope.user.offers.push(newOffer);

        };


        $scope.removeOffer = function(index) {

            var Offer = $resource($scope.user.offers[index].resource_uri);

            if ($scope.user.offers[index].id === 0) {
                $scope.user.offers.splice(index, 1);
            } else {
                Offer.delete().$promise.then(function(data) {
                    $scope.user.offers.splice(index, 1);
                });
            }

        };


        $scope.saveCurrentOffer = function(index) {

            var deferred = $q.defer();

            $scope.user.offers[index].errorMessage = '';
            $scope.user.offers[index].error = false;

            if ($scope.user.offers[index].subject.length > 300) {
                $scope.user.offers[index].error = true;
                $scope.user.offers[index].errorMessage = 'Offer cannot have more than 300 characters.';
                deferred.reject();
                return deferred.promise;
            }

            if ($scope.user.offers[index].subject === '') {
                $scope.user.offers[index].error = true;
                $scope.user.offers[index].errorMessage = 'Entering your offer is required.';
                deferred.reject();
            } else {
                if ($scope.user.offers[index].id === 0) {
                    //create new offer
                    var newOffer = {
                        offer_subject: $scope.user.offers[index].subject,
                        user: $scope.userUri
                    };
                    $scope.user.offers[index].loading = true;
                    $scope.user.offers[index].error = false;
                    OffersFactory.save({}, newOffer,
                        function(success) {
                            $scope.user.offers[index].loading = false;
                            $scope.user.offers[index].error = false;
                            $scope.user.offers[index].id = success.id;
                            $scope.user.offers[index].offer = success.offer;
                            $scope.user.offers[index].offer_subject = success.offer_subject;
                            $scope.user.offers[index].resource_uri = success.resource_uri;
                            $scope.user.offers[index].user = success.user;

                            $scope.user.offers[index].changed = false;
                            deferred.resolve();
                        },
                        function(error) {
                            $scope.user.offers[index].errorMessage = error.data.offer.error[0];
                            $scope.user.offers[index].loading = false;
                            $scope.user.offers[index].error = true;
                            deferred.reject();

                        });
                } else {
                    //edit offer
                    $scope.user.offers[index].error = false;
                    $scope.user.offers[index].loading = true;
                    OffersFactory.update({
                            offerId: $scope.user.offers[index].id
                        }, {
                            offer_subject: $scope.user.offers[index].subject
                        },
                        function(success) {
                            $scope.user.offers[index].loading = false;
                            $scope.user.offers[index].error = false;
                            $scope.user.offers[index].offer = success.offer;
                            $scope.user.offers[index].offer_subject = success.offer_subject;
                            $scope.user.offers[index].resource_uri = success.resource_uri;

                            $scope.user.offers[index].changed = false;
                            deferred.resolve();

                        },
                        function(error) {
                            if (error.data.offer) {
                                $scope.user.offers[index].errorMessage = error.data.offer.error[0];
                            } else {
                                $scope.user.offers[index].errorMessage = 'There was an error when trying to save this field.';
                            }
                            $scope.user.offers[index].loading = false;
                            $scope.user.offers[index].error = true;
                            deferred.reject();

                        });


                }
            }

            return deferred.promise;
        };


        $scope.interestNeedSaving = function(index) {
            $scope.user.interests[index].changed = true;
        };

        $scope.createNewInterest = function() {

            var newInterest = {
                id: 0,
                interest_subject: '',
                interest: null,
                user: $scope.userUri,
                changed: true
            };

            $scope.user.interests.push(newInterest);

        };


        $scope.removeInterest = function(index) {

            var Interest = $resource($scope.user.interests[index].resource_uri);

            if ($scope.user.interests[index].id === 0) {
                $scope.user.interests.splice(index, 1);
            } else {
                Interest.delete().$promise.then(function(data) {
                    $scope.user.interests.splice(index, 1);
                });
            }

        };


        $scope.saveCurrentInterest = function(index) {
            var deferred = $q.defer();
            $scope.user.interests[index].errorMessage = '';
            $scope.user.interests[index].error = false;

            if ($scope.user.interests[index].interest_subject.length > 100) {
                $scope.user.interests[index].error = true;
                $scope.user.interests[index].errorMessage = 'Interest cannot have more than 100 characters.';
                deferred.reject();
                return deferred.promise;
            }

            if ($scope.user.interests[index].interest_subject === '') {
                $scope.user.interests[index].error = true;
                $scope.user.interests[index].errorMessage = 'Entering your interest is required.';
                deferred.reject();
            } else {
                if ($scope.user.interests[index].id === 0) {
                    //create new interest
                    var newInterest = {
                        interest_subject: $scope.user.interests[index].interest_subject,
                        user: $scope.userUri
                    };
                    $scope.user.interests[index].loading = true;
                    $scope.user.interests[index].error = false;
                    InterestsFactory.save({}, newInterest,
                        function(success) {
                            $scope.user.interests[index].loading = false;
                            $scope.user.interests[index].error = false;
                            $scope.user.interests[index].id = success.id;
                            $scope.user.interests[index].interest = success.interest;
                            $scope.user.interests[index].interest_subject = success.interest_subject;
                            $scope.user.interests[index].resource_uri = success.resource_uri;
                            $scope.user.interests[index].user = success.user;

                            $scope.user.interests[index].changed = false;
                            deferred.resolve();
                        },
                        function(error) {
                            $scope.user.interests[index].errorMessage = error.data.interest.error[0];
                            $scope.user.interests[index].loading = false;
                            $scope.user.interests[index].error = true;
                            deferred.reject();

                        });
                } else {
                    //edit interest
                    $scope.user.interests[index].error = false;
                    $scope.user.interests[index].loading = true;
                    InterestsFactory.update({
                            interestId: $scope.user.interests[index].id
                        }, {
                            interest_subject: $scope.user.interests[index].interest_subject
                        },
                        function(success) {
                            $scope.user.interests[index].loading = false;
                            $scope.user.interests[index].error = false;
                            $scope.user.interests[index].interest = success.interest;
                            $scope.user.interests[index].interest_subject = success.interest_subject;
                            $scope.user.interests[index].resource_uri = success.resource_uri;

                            $scope.user.interests[index].changed = false;
                            deferred.resolve();

                        },
                        function(error) {
                            if (error.data.interest) {
                                $scope.user.interests[index].errorMessage = error.data.interest.error[0];
                            } else {
                                $scope.user.interests[index].errorMessage = 'There was an error when trying to save this field.';
                            }
                            $scope.user.interests[index].loading = false;
                            $scope.user.interests[index].error = true;
                            deferred.reject();

                        });


                }
            }

            return deferred.promise;


        };


        //multiple save action for goals, offers and interests
        $scope.savingAllChanges = false;
        $scope.startSavingChanges = function() {

            var promise = $scope.saveChanges();
            $scope.savingAllChanges = true;
            promise.then(function(greeting) {
                $log.info('Success saving');
                $scope.savingAllChanges = false;
            notify({
                    messageTemplate: '<div class="notify-info-header">Success</div>' +
                        '<p>All changes have been saved.</p>',
                    classes: 'notify-info',
                    icon: 'check circle',
                    duration: 4000
                });
                $state.go('myprofile');
            }, function(reason) {
                $log.info('Failed');
                $scope.savingAllChanges = false;

                notify({
                    messageTemplate: '<div class="notify-error-header">Could not save your profile changes.</div>' +
                        '<p>There were some errors. Please see them below.</p>',
                    scope: $scope,
                    classes: 'notify-error',
                    icon: 'warning circle',
                    duration: 4000
                });

            }, function(update) {

            });

        };

        $scope.saveChanges = function() {
            var deferred = $q.defer();

            var needToSaveCounter = 0;
            for (var obj in $scope.user.goals) {
                if ($scope.user.goals[obj].changed) {
                    needToSaveCounter++;
                }
            }

            for (var obj in $scope.user.offers) {
                if ($scope.user.offers[obj].changed) {
                    needToSaveCounter++;
                }
            }

            for (var obj in $scope.user.interests) {
                if ($scope.user.interests[obj].changed) {
                    needToSaveCounter++;
                }
            }


            if (needToSaveCounter > 0) {
                for (var obj in $scope.user.goals) {
                    if ($scope.user.goals[obj].changed) {
                        $scope.saveCurrentGoal(obj).then(function(greeting) {
                            needToSaveCounter--;
                            if (needToSaveCounter === 0) {
                                deferred.resolve();
                            }
                        }, function(reason) {
                            deferred.reject();
                        }, function(update) {

                        });
                    }
                }

                for (var obj in $scope.user.offers) {
                    if ($scope.user.offers[obj].changed) {
                        $scope.saveCurrentOffer(obj).then(function(greeting) {
                            needToSaveCounter--;
                            if (needToSaveCounter === 0) {
                                deferred.resolve();
                            }
                        }, function(reason) {
                            deferred.reject();
                        }, function(update) {

                        });
                    }
                }

                for (var obj in $scope.user.interests) {
                    if ($scope.user.interests[obj].changed) {
                        $scope.saveCurrentInterest(obj).then(function(greeting) {
                            needToSaveCounter--;
                            if (needToSaveCounter === 0) {
                                deferred.resolve();
                            }
                        }, function(reason) {
                            deferred.reject();
                        }, function(update) {

                        });
                    }
                }
            } else {
                deferred.resolve();
            }

            return deferred.promise;


        };



    });