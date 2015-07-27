(function() {
    'use strict';

    /**
     * @desc display for user profile
     * @example <user-profile></user-profile>
     */
    angular
        .module('persice')
        .directive('matchfeedProfile', matchfeedProfile);

    function matchfeedProfile() {
        var directive = {
            controller: MatchfeedProfileController,
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
            templateUrl: 'components/matchfeedprofile/matchfeedprofile.template.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }

    /**
     * @desc controller for matchfeedProfile directive
     * @ngInject
     */
    function MatchfeedProfileController($scope, $timeout, $filter, $rootScope, USER_ID, FriendsFactory, MatchFeedFactory, MutualFriendsFactory, PhotosFactory, $log, lodash) {
        var vm = this;

        vm.social = {
            twitter: '',
            linkedin: '',
            facebook: ''
        };

        vm.user = [];
        vm.total = 0;
        vm.offset = 0;
        vm.previous = null;
        vm.next = null;

        vm.me = '/api/v1/auth/user/' + USER_ID + '/';
        vm.friendshipStatus = null;
        vm.friendshipId = null;

        vm.showfullprofile = false;


        $rootScope.$on('cancelMatchEvent', function() {
            vm.cancelMatch();
        });

        $rootScope.$on('confirmMatchEvent', function() {
            vm.confirmMatch();
        });

        $rootScope.$on('refreshMatchFeed', function() {
            vm.initloadMatches();
        });

        vm.nextImage = function() {
            $('#photoSlider').flexslider('next');
        };


        vm.photosSlider = [];

        vm.loadingFeed = false;


        vm.totalfriendscount = 0;
        vm.totalmatchingcount = 0;
        vm.initloadMatches = initloadMatches;
        vm.loadUser = loadUser;
        vm.getNextMatch = getNextMatch;
        vm.cancelMatch = cancelMatch;
        vm.cancelMatchDesktop = cancelMatchDesktop;
        vm.confirmMatch = confirmMatch;
        vm.confirmMatchDesktop = confirmMatchDesktop;
        vm.changeTopMenu = changeTopMenu;
        vm.getMutualFriends = getMutualFriends;
        vm.getPhotos = getPhotos;


        //load matchfeed initially;
        vm.initloadMatches();

        function initloadMatches() {

            vm.totalfriendscount = 0;
            vm.totalmatchingcount = 0;
            vm.showDimmer = true;
            vm.showfullprofile = false;
            $rootScope.hideTopMenu = true;
            $('#filtersMenu').sidebar('hide');
            vm.user = [];
            vm.total = 0;
            vm.social = {
                twitter: '',
                linkedin: '',
                facebook: ''
            };


            vm.loadUser();



        }


        function loadUser() {
            vm.loadingFeed = true;
            MatchFeedFactory.query({
                format: 'json',
                filter: true,
                offset: 0,
                limit: 1
            }).$promise.then(function(data) {
                vm.user = [];
                vm.total = 0;
                var result = data.objects;
                if (result.length > 0) {
                    vm.total = data.meta.total_count;
                    vm.user = data.objects[0];

                    if (vm.user.twitter_provider !== null) {
                        vm.social.twitter = vm.user.twitter_provider;
                    }

                    if (vm.user.linkedin_provider !== null) {
                        vm.social.linkedin = vm.user.linkedin_provider;
                    }

                    if (vm.user.facebook_id !== null) {
                        vm.social.facebook = 'https://www.facebook.com/app_scoped_user_id/' + vm.user.facebook_id;
                    }


                    var goals = [];
                    var matchedgoals = vm.user.goals[0];
                    for (var key in matchedgoals) {
                        var goal = {
                            value: key,
                            match: matchedgoals[key]
                        };
                        goals.push(goal);
                    }
                    vm.user.goals = goals;

                    var offers = [];
                    var matchedoffers = vm.user.offers[0];
                    for (var key in matchedoffers) {
                        var offer = {
                            value: key,
                            match: matchedoffers[key]
                        };
                        offers.push(offer);
                    }
                    vm.user.offers = offers;

                    var interests = [];
                    var matchedinterests = vm.user.interests[0];
                    for (var key in matchedinterests) {
                        var interest = {
                            value: key,
                            match: matchedinterests[key]
                        };
                        interests.push(interest);

                    }
                    vm.user.interests = interests;

                    var likes = [];
                    var matchedlikes = vm.user.likes[0];
                    for (var key in matchedlikes) {
                        var like = {
                            value: key,
                            match: matchedlikes[key]
                        };
                        likes.push(like);
                    }
                    vm.user.likes = likes;

                    vm.totalmatchingcount = vm.user.score;


                    vm.getMutualFriends();

                    vm.getPhotos();


                } else {
                    vm.user = [];
                    vm.total = 0;

                }
                vm.showDimmer = false;
                $rootScope.hideTopMenu = false;
                vm.loadingFeed = false;
            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                // error handler
                $log.error(message);
                vm.user = [];
                vm.showDimmer = false;
                $rootScope.hideTopMenu = false;
                vm.loadingFeed = false;
            });
        }

        function getPhotos() {
            //get default photo
            vm.defaultUserPhoto = '//graph.facebook.com/' + vm.user.facebook_id + '/picture?type=large';
            //save default photo if no photos

            PhotosFactory.query({
                format: 'json',
                user_id: vm.user.user_id
            }).$promise.then(function(response) {
                vm.user.photos = response.objects;
                if (vm.user.photos.length > 0) {
                    vm.photosSlider = vm.user.photos;
                } else {
                    var newPhoto = {
                        photo: vm.defaultUserPhoto,
                        order: 0,
                        user: '/api/v1/auth/user/' + vm.user.user_id + '/'
                    };


                    PhotosFactory.save({}, newPhoto,
                        function(success) {
                            $log.info(success);
                            $log.info('New photo saved.');
                            vm.user.photos.push(success);
                            vm.photosSlider = vm.user.photos;

                        },
                        function(error) {
                            $log.info(error);
                        });

                }

                vm.photosSlider = $filter('orderBy')(vm.photosSlider, 'order', false);

            });


        }

        function getMutualFriends() {
            //mutual friends
            MutualFriendsFactory.query({
                format: 'json',
                user_id: vm.user.id
            }).$promise.then(function(data) {
                if (data.objects.length > 0) {
                    vm.user.friends = data.objects[0].mutual_bk_friends;
                    vm.user.facebookfriends = data.objects[0].mutual_fb_friends;
                    vm.user.linkedinconnections = data.objects[0].mutual_linkedin_connections;
                    vm.user.twitterfollowers = data.objects[0].mutual_twitter_followers;
                    vm.user.twitterfriends = data.objects[0].mutual_twitter_friends;
                    vm.totalfriendscount += data.objects[0].mutual_bk_friends_count;
                    vm.totalfriendscount += data.objects[0].mutual_fb_friends_count;
                    vm.totalfriendscount += data.objects[0].mutual_linkedin_connections_count;
                    vm.totalfriendscount += data.objects[0].mutual_twitter_followers_count;
                    vm.totalfriendscount += data.objects[0].mutual_twitter_friends_count;
                }

            });
        }

        function getNextMatch() {

            vm.totalfriendscount = 0;
            vm.totalmatchingcount = 0;
            vm.showfullprofile = false;
            $rootScope.hideTopMenu = true;
            vm.loadingFeed = true;
            vm.loadUser();

        }

        function cancelMatch() {
            $log.info('cancel match');

            var friendship = {
                friend1: vm.me,
                friend2: '/api/v1/auth/user/' + vm.user.user_id + '/',
                status: -1
            };

            //deny friendship with status -1
            FriendsFactory.save(friendship,
                function(success) {
                    vm.getNextMatch();
                },
                function(error) {

                });

        }

        function cancelMatchDesktop() {
            $rootScope.hideTopMenu = false;
            vm.showfullprofile = false;
            vm.cancelMatch();
        }

        function confirmMatchDesktop() {
            $rootScope.hideTopMenu = false;
            vm.showfullprofile = false;
            vm.confirmMatch();
        }


        function confirmMatch() {
            var friendship = {
                friend1: vm.me,
                friend2: '/api/v1/auth/user/' + vm.user.user_id + '/',
                status: 0
            };

            //add to friends with status 0
            FriendsFactory.save(friendship,
                function(success) {
                    vm.getNextMatch();
                },
                function(error) {

                });


        }


        function changeTopMenu() {
            if (!vm.showfullprofile) {
                $rootScope.hideTopMenu = true;
                vm.showfullprofile = true;

                $('#MatchMenu')
                    .sidebar('toggle')
            }


        }

        $rootScope.$on('showFullProfile', function() {
            vm.showfullprofile = false;
        });



    }



})();
