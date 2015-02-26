'use strict';

angular.module('beKindred')
.controller('InboxCtrl', function ($scope, $rootScope, $log, USER_ID, InboxFactory, $filter) {


  $scope.inboxLastMessages = [];


  $rootScope.$on('refreshInbox', function () {
    $scope.getInbox();
  });

  $scope.loadingMessages = false;

  $scope.getInbox = function () {
    $scope.loadingMessages = true;
    InboxFactory.query({format: 'json'}).$promise.then(function(data) {
      $scope.inboxLastMessages.splice(0,$scope.inboxLastMessages.length);
      var receivedMessages = data.objects;
      $scope.loadingMessages = false;
      for (var obj in receivedMessages) {
        $scope.inboxLastMessages.push({
          firstName: receivedMessages[obj].first_name,
          friendId: receivedMessages[obj].friend_id,
          facebookId: receivedMessages[obj].facebook_id,
          sentAt: $filter('amDateFormat')(receivedMessages[obj].sent_at, 'h:mm a'),
          readAt: receivedMessages[obj].read_at,
          id: receivedMessages[obj].id,
          body: $filter('lastMessage')(receivedMessages[obj].last_message_body)
        });
      }
    }, function(response) {
      $scope.loadingMessages = false;
      $scope.inboxLastMessages.splice(0,$scope.inboxLastMessages.length);
      var data = response.data,
      status = response.status,
      header = response.header,
      config = response.config,
      message = 'Error ' + status;
      // error handler
      $log.error(message);

    });

  };

  $scope.getInbox();






});
