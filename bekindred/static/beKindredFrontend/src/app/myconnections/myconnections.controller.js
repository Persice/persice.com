'use strict';

angular.module('beKindred')
.controller('MyConnectionsCtrl', function ($scope, FriendsFactory, USER_ID, $resource) {
    $scope.friends = [];
    $scope.photo = 'http://lorempixel.com/100/100';
    var myUrl = '/api/v1/auth/user/' + USER_ID + '/';

    $scope.getFriends = function () {
        $scope.friends = [];
        FriendsFactory.query({format: 'json'}).$promise.then(function(data) {


            var results = data.objects;

            var matchUrl = null;
            for (var i = results.length - 1; i >= 0; i--) {
                matchUrl = null;



                if (results[i].status === 1) {

                    var friend1 = results[i].friend1;
                    var friend2 = results[i].friend2;
                    var friendshipId = results[i].id;

                    if (results[i].friend1 !== myUrl ) {
                        matchUrl = results[i].friend1;
                    }
                    else if (results[i].friend2 !== myUrl ) {
                        matchUrl = results[i].friend2;
                    }

                    var User = $resource(matchUrl);

                    User.get({format: 'json'}).$promise.then(function(data) {
                        $scope.friends.push(data);
                        $scope.friends[$scope.friends.length - 1 ].friend1 = friend1;
                        $scope.friends[$scope.friends.length - 1 ].friend2 = friend2;
                        $scope.friends[$scope.friends.length - 1 ].friendshipId = friendshipId;
                    });
                }

            }


        });

};

$scope.getFriends();


$scope.unFriend = function(index) {

    FriendsFactory.update({friendId:  $scope.friends[index].friendshipId}, {status: -1},
        function(success){
            $scope.friends.splice(index, 1);
        },
        function(error) {

        });
};

});
