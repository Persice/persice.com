(function() {
    'use strict';

    /**
     * @desc display for user profile
     * @example <user-profile></user-profile>
     */
    angular
        .module('persice')
        .directive('userProfile', userProfile);

    function userProfile() {
        var directive = {
            controller: UserProfileController,
            controllerAs: 'userprofile',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class',
                header: '@header',
                body: '@body',
                person: '=person',
                type: '@type'
            },
            link: link,
            templateUrl: 'components/userprofile/userprofile.template.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }

    /**
     * @desc controller for userProfile directive
     * @ngInject
     */
    function UserProfileController($scope, UsersFactory, InterestsFactory, ProfileFactory, MatchFeedFactory, MutualFriendsFactory, GoalsFactory, OffersFactory, LikesFactory, PhotosFactory, $log, lodash) {
        var vm = this;

        vm.userId = vm.person.id;
        vm.userPhoto = vm.person.photo;

        vm.getUser = getUser;
        vm.getUserInfo = getUserInfo;
        vm.getPhotos = getPhotos;
        vm.nextImage = nextImage;

        vm.showfullprofile = true;

        vm.social = {
            twitter: '',
            linkedin: '',
            facebook: ''
        };
        vm.user = {
            id: vm.person.id,
            first_name: '',
            last_name: '',
            age: '',
            about_me: '',
            photos: [],
            goals: [

            ],
            offers: [

            ],
            likes: [],
            interests: [],
            friends: [],
            facebookfriends: [],
            twitterfriends: [],
            twitterfollowers: [],
            linkedinconnections: [],
            distance: []
        };

        vm.photosSlider = [];


        vm.getUser();
        vm.getPhotos();


        function nextImage() {
            $('#photoSlider').flexslider('next');
        }


        function getUserInfo() {
            UsersFactory.get({
                format: 'json'
            }, {
                userId: vm.userId
            }).$promise.then(function(data) {

                vm.user.first_name = data.first_name;
                vm.user.last_name = data.last_name;
                vm.user.about_me = data.about_me;
                vm.user.age = data.age;
                vm.user.facebookId = data.facebook_id;

                if (data.twitter_provider !== null) {
                    vm.social.twitter = data.twitter_provider;
                }

                if (data.linkedin_provider !== null) {
                    vm.social.linkedin = data.linkedin_provider;
                }

                if (data.facebook_profile_url !== null) {
                    vm.social.facebook = data.facebook_profile_url;
                }

                vm.loadingUser = false;

            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                vm.loadingUser = false;
                $log.error(message);


            });
        }

        function getUser() {


            if (vm.type === 'loggedInUser' || vm.type === 'friend') {
                vm.getUserInfo();
            }

            if (vm.type === 'loggedInUser') {

                GoalsFactory.query({
                    user_id: vm.userId,
                    format: 'json'
                }).$promise.then(function(data) {
                    if (data.meta.total_count > 0) {
                        vm.user.goals = data.objects;
                    }
                    vm.loadingGoals = false;

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    $log.error(message);


                });

                OffersFactory.query({
                    user_id: vm.userId,
                    format: 'json'
                }).$promise.then(function(data) {
                    if (data.meta.total_count > 0) {
                        vm.user.offers = data.objects;
                    }
                    vm.loadingOffers = false;

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    $log.error(message);


                });

                LikesFactory.query({
                    format: 'json'
                }).$promise.then(function(data) {
                    if (data.meta.total_count > 0) {
                        vm.user.likes = data.objects;
                    }
                    vm.loadingLikes = false;

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    $log.error(message);


                });


                InterestsFactory.query({
                    user_id: vm.userId,
                    format: 'json'
                }).$promise.then(function(data) {
                    if (data.meta.total_count > 0) {
                        vm.user.interests = data.objects;
                    }
                    vm.loadingInterests = false;

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    $log.error(message);


                });

            }

            if (vm.type === 'friend') {

                ProfileFactory.get({
                    user_id: vm.userId,
                    format: 'json'
                }).$promise.then(function(data) {
                    var goals = [];
                    var matchedgoals = data.objects[0].goals[0];
                    for (var key in matchedgoals) {
                        var goal = {
                            value: key,
                            match: matchedgoals[key]
                        };
                        goals.push(goal);
                    }
                    vm.user.goals = goals;

                    var offers = [];
                    var matchedoffers = data.objects[0].offers[0];
                    for (var key in matchedoffers) {
                        var offer = {
                            value: key,
                            match: matchedoffers[key]
                        };
                        offers.push(offer);
                    }
                    vm.user.offers = offers;

                    var interests = [];
                    var matchedinterests = data.objects[0].interests[0];
                    for (var key in matchedinterests) {
                        var interest = {
                            value: key,
                            match: matchedinterests[key]
                        };
                        interests.push(interest);
                    }
                    vm.user.interests = interests;

                    var likes = [];
                    var matchedlikes = data.objects[0].likes[0];
                    for (var key in matchedlikes) {
                        var like = {
                            value: key,
                            match: matchedlikes[key]
                        };
                        likes.push(like);
                    }
                    vm.user.likes = likes;

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    // error handler
                    $log.error(message);


                });



                MutualFriendsFactory.query({
                    format: 'json',
                    user_id: vm.userId
                }).$promise.then(function(data) {
                    if (data.objects.length > 0) {
                        vm.user.friends = data.objects[0].mutual_bk_friends;
                        vm.user.facebookfriends = data.objects[0].mutual_fb_friends;
                        vm.user.linkedinconnections = data.objects[0].mutual_linkedin_connections;
                        vm.user.twitterfollowers = data.objects[0].mutual_twitter_followers;
                        vm.user.twitterfriends = data.objects[0].mutual_twitter_friends;

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
            }



        }

        function getPhotos() {
            PhotosFactory.query({
                format: 'json',
                user_id: vm.userId
            }).$promise.then(function(response) {
                vm.user.photos = response.objects;

                if (vm.user.photos.length === 0) {
                    var newPhoto = {
                        photo: vm.userPhoto,
                        cropped_photo: '',
                        order: 0,
                        user: '/api/v1/auth/user/' + vm.userId + '/'
                    };

                    PhotosFactory.save({}, newPhoto, function(success) {
                        $log.info(success);
                        $log.info('New photo saved.');
                        vm.user.photos.push({
                            photo: vm.userPhoto,
                            cropped_photo: '',
                            order: 0
                        });
                        vm.photosSlider = vm.user.photos;

                    }, function(error) {
                        $log.info(error);
                    });
                } else {
                    vm.photosSlider = vm.user.photos;
                }
            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                $log.error(message);
            });
        }



    }



})();