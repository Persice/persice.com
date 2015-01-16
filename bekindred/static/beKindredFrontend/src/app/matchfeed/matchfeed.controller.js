'use strict';

angular.module('beKindred')
.controller('MatchFeedCtrl', function ($rootScope, $scope, $timeout, USER_ID, MatchFeedFactory, PhotosFactory, FriendsFactory, $log) {

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

    if (pok === 0) {
        $scope.showDimmer = true;
        $rootScope.hideTopMenu = true;

        //load matchfeed initially;

        MatchFeedFactory.query({format: 'json'}).$promise.then(function(data) {

            $scope.total = data.meta.total_count;

            if ( $scope.total > 0) {

                $scope.matchedUser = data.objects[0];
                $scope.offset = data.meta.offset;
                $scope.total = data.meta.total_count;
                $scope.previous = data.meta.previous;
                $scope.next = data.meta.next;


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
            console.log($scope.matchedUser);
            $scope.offset = data.meta.offset;
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

            };


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
