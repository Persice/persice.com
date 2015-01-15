'use strict';

angular.module('beKindred')
.controller('MyConnectionsCtrl', function ($scope, FriendsFactory, USER_ID, $resource, ConnectionsFactory) {
    $scope.friends = [];
    var myUrl = '/api/v1/auth/user/' + USER_ID + '/';

    $scope.getFriends = function () {
        $scope.friends = [];
        ConnectionsFactory.query({format: 'json'}).$promise.then(function(data) {

            $scope.friends = data.objects;
        });

    };

    $scope.getFriends();


    $scope.unFriend = function(index) {

        FriendsFactory.update({friendId:  $scope.friends[index].id}, {status: -1},
            function(success){
                $scope.friends.splice(index, 1);
            },
            function(error) {

            });
    };

});
