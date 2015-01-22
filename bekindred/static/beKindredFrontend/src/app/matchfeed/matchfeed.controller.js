'use strict';

angular.module('beKindred')
.controller('MatchFeedCtrl', function ($rootScope, $scope, $timeout, USER_ID, MatchFeedFactory, PhotosFactory, FriendsFactory, $log, MutualFriendsFactory) {

    $scope.matchedUser = [];
    $scope.total = 0;
    $scope.offset = 0;
    $scope.previous = null;
    $scope.next = null;

    $scope.friend1 = null;
    $scope.friend2 = null;
    $scope.friendshipStatus = null;
    $scope.friendshipId = null;

    // $scope.photosSlider = $scope.matchedUser.photos;
    $scope.photosSlider =  [
    ];

    $scope.loadingFeed = false;

    var pok = 0;


    $scope.toggleSidebarFilters = function() {
        $log.info('Toggle sidebar');
        $('#filtersMenu').sidebar('toggle');
    };


    $scope.loadMatches = function() {

        if (pok === 0) {
            $scope.showDimmer = true;
            $rootScope.hideTopMenu = true;
            $('#filtersMenu').sidebar('hide');
            MatchFeedFactory.query({format: 'json'}).$promise.then(function(data) {
                $scope.total = data.meta.total_count;
                if ( data.objects.length > 0) {
                    $scope.matchedUser = data.objects[0];
                    $scope.offset = data.meta.offset;
                    $scope.total = data.meta.total_count;
                    $scope.previous = data.meta.previous;
                    $scope.next = data.meta.next;

                    var goals = [];
                    var matchedgoals = $scope.matchedUser.goals[0];
                    for (var key in matchedgoals) {
                        var goal = {value: key, match: matchedgoals[key]};
                        goals.push(goal);
                    }
                    $scope.matchedUser.goals = goals;

                    var offers = [];
                    var matchedoffers = $scope.matchedUser.offers[0];
                    for (var key in matchedoffers) {
                        var offer = {value: key, match: matchedoffers[key]};
                        offers.push(offer);
                    }
                    $scope.matchedUser.offers = offers;

                    var interests = [];
                    var matchedinterests = $scope.matchedUser.interests[0];
                    for (var key in matchedinterests) {
                        var interest = {value: key, match: matchedinterests[key]};
                        interests.push(interest);
                    }
                    $scope.matchedUser.interests = interests;

                    var likes = [];
                    var matchedlikes = $scope.matchedUser.likes[0];
                    for (var key in matchedlikes) {
                        var like = {value: key, match: matchedlikes[key]};
                        likes.push(like);
                    }
                    $scope.matchedUser.likes = likes;




                    //mutual friends
                    MutualFriendsFactory.query({format: 'json', user_id: $scope.matchedUser.id }).$promise.then(function(data) {
                        if (data.objects.length > 0) {
                            $scope.matchedUser.facebookfriends = data.objects[0].mutual_fb_friends;
                            $scope.matchedUser.linkedinconnections = data.objects[0].mutual_linkedin_connections;
                            $scope.matchedUser.twitterfollowers = data.objects[0].mutual_twitter_followers;
                            $scope.matchedUser.twitterfriends = data.objects[0].mutual_twitter_friends;
                        }

                    });

                    //get default photo
                    $scope.defaultUserPhoto = 'http://graph.facebook.com/' + $scope.matchedUser.facebook_id + '/picture?type=large';
                    //save default photo if no photos
                    if ($scope.matchedUser.photos.length > 0) {
                        $scope.photosSlider = $scope.matchedUser.photos;
                    }
                    else {
                        var newPhoto = {
                            photo:  $scope.defaultUserPhoto,
                            order: 0,
                            user: '/api/v1/auth/user/' + $scope.matchedUser.user_id + '/'
                        };


                        PhotosFactory.save({}, newPhoto,
                            function(success){
                                $log.info(success);
                                $log.info('New photo saved.');
                                $scope.matchedUser.photos.push($scope.defaultUserPhoto);
                                $scope.photosSlider = $scope.matchedUser.photos;

                            },
                            function(error) {
                                $log.info(error);
                            });

                    }

                }
                $scope.showDimmer = false;
                $rootScope.hideTopMenu = false;
            });
pok = 1;

}
else {
    $scope.showDimmer = false;
    $rootScope.hideTopMenu = false;
}




};



    //load matchfeed initially;
    $scope.loadMatches();





    $rootScope.showfullprofile = false;


    $rootScope.$on('cancelMatchEvent', function() {
        $scope.cancelMatch();
    });

    $rootScope.$on('confirmMatchEvent', function() {
        $scope.confirmMatch();
    });

    $rootScope.$on('refreshMatchFeed', function() {
        pok = 0;
        $scope.loadMatches();
    });

    $scope.getNextMatch = function() {

        $scope.loadingFeed = true;
        var newOffset = $scope.offset;
        newOffset++;

        if (newOffset === $scope.total) newOffset = 0;


        MatchFeedFactory.query({format: 'json', offset: newOffset, limit: 1}).$promise.then(function(data) {

            if (data.objects.length > 0) {
                $scope.matchedUser = data.objects[0];
                $scope.offset = data.meta.offset;
                $scope.total = data.meta.total_count;
                $scope.previous = data.meta.previous;
                $scope.next = data.meta.next;

                var goals = [];
                var matchedgoals = $scope.matchedUser.goals[0];
                for (var key in matchedgoals) {
                    var goal = {value: key, match: matchedgoals[key]};
                    goals.push(goal);
                }
                $scope.matchedUser.goals = goals;

                var offers = [];
                var matchedoffers = $scope.matchedUser.offers[0];
                for (var key in matchedoffers) {
                    var offer = {value: key, match: matchedoffers[key]};
                    offers.push(offer);
                }
                $scope.matchedUser.offers = offers;

                var interests = [];
                var matchedinterests = $scope.matchedUser.interests[0];
                for (var key in matchedinterests) {
                    var interest = {value: key, match: matchedinterests[key]};
                    interests.push(interest);
                }
                $scope.matchedUser.interests = interests;

                var likes = [];
                var matchedlikes = $scope.matchedUser.likes[0];
                for (var key in matchedlikes) {
                    var like = {value: key, match: matchedlikes[key]};
                    likes.push(like);
                }
                $scope.matchedUser.likes = likes;

                //mutual friends
                MutualFriendsFactory.query({format: 'json', user_id: $scope.matchedUser.id }).$promise.then(function(data) {
                    if (data.objects.length > 0) {
                        $scope.matchedUser.facebookfriends = data.objects[0].mutual_fb_friends;
                        $scope.matchedUser.linkedinconnections = data.objects[0].mutual_linkedin_connections;
                        $scope.matchedUser.twitterfollowers = data.objects[0].mutual_twitter_followers;
                        $scope.matchedUser.twitterfriends = data.objects[0].mutual_twitter_friends;
                    }

                });

                //get default photo
                $scope.defaultUserPhoto = 'http://graph.facebook.com/' + $scope.matchedUser.facebook_id + '/picture?type=large';
                //save default photo if no photos
                if ($scope.matchedUser.photos.length > 0) {
                    $scope.photosSlider = $scope.matchedUser.photos;
                }
                else {
                    var newPhoto = {
                        photo:  $scope.defaultUserPhoto,
                        order: 0,
                        user: '/api/v1/auth/user/' + $scope.matchedUser.user_id + '/'
                    };


                    PhotosFactory.save({}, newPhoto,
                        function(success){
                            $log.info(success);
                            $log.info('New photo saved.');
                            $scope.matchedUser.photos.push($scope.defaultUserPhoto);
                            $scope.photosSlider = $scope.matchedUser.photos;

                        },
                        function(error) {
                            $log.info(error);
                        });

                }
            }
            else {
                $scope.matchedUser = [];
                $scope.total = data.meta.total_count;
                $scope.offset = 0;
                $scope.previous = null;
                $scope.next = null;
            }


            $scope.loadingFeed = false;
        });

};


$scope.cancelMatch = function () {
    $log.info('cancel match');


    FriendsFactory.query({format: 'json'}).$promise.then(function(data) {

        var existingFriend = false;
        if (data.meta.total_count > 0) {
            var allfriends = data.objects;
            var myfriend = '/api/v1/auth/user/' + $scope.matchedUser.id + '/';
            for(var obj in allfriends) {
                if (allfriends[obj].friend1 === myfriend) {
                    $scope.friend1 = allfriends[obj].friend1;
                    $scope.friendshipStatus = allfriends[obj].status;
                    $scope.friend2 = '/api/v1/auth/user/' + USER_ID + '/';
                    $scope.friendshipId = allfriends[obj].id;
                    existingFriend = true;
                }
                if (allfriends[obj].friend2 === myfriend) {
                    $scope.friend2 = allfriends[obj].friend2;
                    $scope.friendshipStatus = allfriends[obj].status;
                    $scope.friend1 = '/api/v1/auth/user/' + USER_ID + '/';
                    $scope.friendshipId = allfriends[obj].id;
                    existingFriend = true;
                }
            }

            if ( existingFriend) {
                $log.info('not existing friend');
                var changeExistingFriend = {
                    friend1: $scope.friend1,
                    friend2: $scope.friend2,
                    status: -1
                };

                    //confirm friendship with status 1
                    FriendsFactory.update({friendId:  $scope.friendshipId}, changeExistingFriend,
                        function(success){
                            $scope.friend1 = null;
                            $scope.friend2 = null;
                            $scope.friendshipStatus = null;
                            $scope.friendshipId = null;
                            $scope.getNextMatch();
                        },
                        function(error) {

                        });
                }

                else {
                    $log.info('not existing friend');
                    //create new friendship with status 0
                    var newFriend = {
                        friend1: '/api/v1/auth/user/' + USER_ID + '/',
                        friend2: '/api/v1/auth/user/' + $scope.matchedUser.id + '/',
                        status: -1
                    };

                    FriendsFactory.save({}, newFriend,
                        function(success){
                            $scope.friend1 = null;
                            $scope.friend2 = null;
                            $scope.getNextMatch();
                        },
                        function(error) {

                        });
                }





            }
            else {
                $log.info('not existing friend');
                //create new friendship with status -1
                var newFriend = {
                    friend1: '/api/v1/auth/user/' + USER_ID + '/',
                    friend2: '/api/v1/auth/user/' + $scope.matchedUser.id + '/',
                    status: -1
                };

                FriendsFactory.save({}, newFriend,
                    function(success){
                        $scope.friend1 = null;
                        $scope.friend2 = null;
                        $scope.getNextMatch();
                    },
                    function(error) {

                    });

            }


        });





};


$scope.confirmMatch = function () {

    $log.info('accept match');
    FriendsFactory.query({format: 'json'}).$promise.then(function(data) {

        var existingFriend = false;
        if (data.meta.total_count > 0) {
            $log.info('total count > 0');
            var allfriends = data.objects;
            var myfriend = '/api/v1/auth/user/' + $scope.matchedUser.id + '/';
            for(var obj in allfriends) {
                $log.info(allfriends[obj]);
                if (allfriends[obj].friend1 === myfriend) {
                    $scope.friend1 = allfriends[obj].friend1;
                    $scope.friendshipStatus = allfriends[obj].status;
                    $scope.friend2 = '/api/v1/auth/user/' + USER_ID + '/';
                    $scope.friendshipId = allfriends[obj].id;
                    existingFriend = true;
                }
                if (allfriends[obj].friend2 === myfriend) {
                    $scope.friend2 = allfriends[obj].friend2;
                    $scope.friendshipStatus = allfriends[obj].status;
                    $scope.friend1 = '/api/v1/auth/user/' + USER_ID + '/';
                    $scope.friendshipId = allfriends[obj].id;
                    existingFriend = true;
                }
            }

            if ( existingFriend === true) {
                $log.info('existing friend');

                var changeExistingFriend = {
                    friend1: $scope.friend1,
                    friend2: $scope.friend2,
                    status: 1
                };

                //confirm friendship with status 1
                FriendsFactory.update({friendId:  $scope.friendshipId}, changeExistingFriend,
                    function(success){
                        $scope.friend1 = null;
                        $scope.friend2 = null;
                        $scope.friendshipStatus = null;
                        $scope.friendshipId = null;
                        existingFriend = false;
                        $scope.getNextMatch();
                    },
                    function(error) {

                    });
            }

            else {
                $log.info('not existing friend');
                //create new friendship with status 0
                var newFriend = {
                    friend1: '/api/v1/auth/user/' + USER_ID + '/',
                    friend2: '/api/v1/auth/user/' + $scope.matchedUser.id + '/',
                    status: 0
                };

                FriendsFactory.save({}, newFriend,
                    function(success){
                        $scope.friend1 = null;
                        $scope.friend2 = null;
                        existingFriend = false;
                        $scope.getNextMatch();
                    },
                    function(error) {

                    });
            }





        }
        else {
            $log.info('not existing friend');
            //create new friendship with status 0
            var newFriend = {
                friend1: '/api/v1/auth/user/' + USER_ID + '/',
                friend2: '/api/v1/auth/user/' + $scope.matchedUser.id + '/',
                status: 0
            };

            FriendsFactory.save({}, newFriend,
                function(success){
                    $scope.friend1 = null;
                    $scope.friend2 = null;
                    $scope.getNextMatch();
                },
                function(error) {

                });

        }


    });





};


$scope.changeTopMenu = function() {
    $rootScope.hideTopMenu = true;
    $rootScope.showfullprofile = true;

    $('.horizontal.top.sidebar')
    .sidebar('show')
    ;
};

});
