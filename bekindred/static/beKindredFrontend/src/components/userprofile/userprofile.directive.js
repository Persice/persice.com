(function() {
    'use strict';

    /**
     * @desc display for user profile
     * @example <user-profile></user-profile>
     */
    angular
        .module('icebrak')
        .directive('userProfile', userProfile);

    function userProfile() {
        var directive = {
            controller: UserProfileController,
            controllerAs: 'userprofile',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class',
                person: '=person'
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
    function UserProfileController($scope, UsersFactory, InterestsFactory, GoalsFactory, OffersFactory, LikesFactory, PhotosFactory, $log, lodash) {
        var vm = this;

        vm.userId = vm.person.id;
        vm.userPhoto = vm.person.photo;



        $log.info(vm.person);

        vm.getUser = getUser;
        vm.getPhotos = getPhotos;
        vm.nextImage = nextImage;

        vm.social = {
            twitter: '',
            linkedin: ''
        };
        vm.user = {
            id: 1,
            firstName: '',
            lastName: '',
            age: '',
            about_me: '',
            photos: [],
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

        vm.loadingUser = false;
        vm.loadingGoals = false;
        vm.loadingOffers = false;
        vm.loadingLikes = false;
        vm.loadingInterests = false;



        vm.photosSlider = [];


        vm.getUser();
        vm.getPhotos();


        function nextImage() {
            $('#photoSlider').flexslider('next');
        }

        function getUser() {

            vm.loadingUser = true;
            vm.loadingGoals = true;
            vm.loadingOffers = true;
            vm.loadingLikes = true;

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


            UsersFactory.get({
                format: 'json'
            }, {
                userId: vm.userId
            }).$promise.then(function(data) {

                vm.user.firstName = data.first_name;
                vm.user.lastName = data.last_name;
                vm.user.about_me = data.about_me;
                vm.user.age = data.age;
                vm.user.facebookId = data.facebook_id;
                vm.user.facebookProfile = data.facebook_profile_url;


                if (data.twitter_provider !== null) {
                    vm.social.twitter = data.twitter_provider;
                }

                if (data.linkedin_provider !== null) {
                    vm.social.linkedin = data.linkedin_provider;
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

        function getPhotos() {
            PhotosFactory.query({
                format: 'json'
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