'use strict';

angular.module('beKindred')
.controller('InboxCtrl', function ($scope, ConnectionsFactory, USER_ID) {


  $scope.conversations = [];
  var myUrl = '/api/v1/auth/user/' + USER_ID + '/';

  $scope.getFriends = function () {
    $scope.conversations = [];
    ConnectionsFactory.query({format: 'json'}).$promise.then(function(data) {
      $scope.conversations = data.objects;
    });

  };

  $scope.getFriends();


});
