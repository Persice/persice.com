'use strict';

angular.module('beKindred')
.controller('MatchFeedCtrl', function ($rootScope, $scope, $timeout, USER_ID, MatchFeedFactory, FriendsFactory, $log) {

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
    {photo: 'static/img/profile/photo0.jpg', order: 0},
    {photo: 'static/img/profile/photo1.jpg', order: 1},
    {photo: 'static/img/profile/photo2.jpg', order: 2},
    {photo: 'static/img/profile/photo3.jpg', order: 3},
    {photo: 'static/img/profile/photo4.jpg', order: 4},
    {photo: 'static/img/profile/photo5.jpg', order: 5}
    ];

    $scope.loadingFeed = false;

    var pok = 0;

    if (pok === 0) {
        $scope.showDimmer = true;
        $rootScope.hideTopMenu = true;

        //load matchfeed initially;

        MatchFeedFactory.query({format: 'json'}).$promise.then(function(data) {

            $scope.total = data.meta.total_count;

            if ( $scope.total > 0) {

                $scope.matchedUser = data.objects[0];
                $scope.matchedUser.goals = [];
                $scope.matchedUser.offers = [];
                $scope.offset = data.meta.offset;
                $scope.total = data.meta.total_count;
                $scope.previous = data.meta.previous;
                $scope.next = data.meta.next;

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


    $rootScope.showfullprofile = false;


    $rootScope.$on('cancelMatchEvent', function() {
        $scope.cancelMatch();
    });

    $rootScope.$on('confirmMatchEvent', function() {
        $scope.confirmMatch();
    });

    $scope.getNextMatch = function() {

        $scope.loadingFeed = true;
        var newOffset = $scope.offset;
        newOffset++;

        if (newOffset === $scope.total) newOffset = 0;


        MatchFeedFactory.query({format: 'json', offset: newOffset, limit: 1}).$promise.then(function(data) {

            if (data.meta.total_count > 0) {
                $scope.matchedUser = data.objects[0];
                $scope.matchedUser.goals = [];
                $scope.offset = data.meta.offset;
                $scope.matchedUser.offers = [];
                $scope.total = data.meta.total_count;
                $scope.previous = data.meta.previous;
                $scope.next = data.meta.next;
            }
            else {
                $scope.matchedUser = [];
                $scope.total = data.meta.total_count;
                $scope.offset = 0;
                $scope.previous = null;
                $scope.next = null;
            };


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
                    if (obj.friend1 === myfriend) {
                        $scope.friend1 = obj.friend1;
                        $scope.friendshipStatus = friend.status;
                        $scope.friend2 = '/api/v1/auth/user/' + USER_ID + '/';
                        $scope.friendshipId = obj.id;
                        existingFriend = true;
                    }
                    if (obj.friend2 === myfriend) {
                        $scope.friend2 = obj.friend2;
                        $scope.friendshipStatus = friend.status;
                        $scope.friend1 = '/api/v1/auth/user/' + USER_ID + '/';
                        $scope.friendshipId = obj.id;
                        existingFriend = true;
                    }
                }

                if ( existingFriend) {
                    var changeExistingFriend = {
                        friend1: $scope.friend1,
                        friend2: $scope.friend2,
                        status: -1
                    }

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

            };


        });





};


$scope.confirmMatch = function () {

    $log.info('accept match');
    FriendsFactory.query({format: 'json'}).$promise.then(function(data) {

        var existingFriend = false;
        if (data.meta.total_count > 0) {
            var allfriends = data.objects;
            var myfriend = '/api/v1/auth/user/' + $scope.matchedUser.id + '/';
            for(var obj in allfriends) {
                if (obj.friend1 === myfriend) {
                    $scope.friend1 = obj.friend1;
                    $scope.friendshipStatus = friend.status;
                    $scope.friend2 = '/api/v1/auth/user/' + USER_ID + '/';
                    $scope.friendshipId = obj.id;
                    existingFriend = true;
                }
                if (obj.friend2 === myfriend) {
                    $scope.friend2 = obj.friend2;
                    $scope.friendshipStatus = friend.status;
                    $scope.friend1 = '/api/v1/auth/user/' + USER_ID + '/';
                    $scope.friendshipId = obj.id;
                    existingFriend = true;
                }
            }

            if ( existingFriend) {
                var changeExistingFriend = {
                    friend1: $scope.friend1,
                    friend2: $scope.friend2,
                    status: 1
                }

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





        }
        else {

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

            };


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
