'use strict';

angular.module('beKindred')
.controller('InboxCtrl', function ($scope, $rootScope, $log, USER_ID, InboxFactory, $filter) {


  $scope.inboxLastMessages = [];
  var myUrl = '/api/v1/auth/user/' + USER_ID + '/';


  $rootScope.$on('refreshInbox', function () {
    $scope.getInbox();
  });

  $scope.getInbox = function () {
    InboxFactory.query({format: 'json'}).$promise.then(function(data) {
      var receivedMessages = data.objects;
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
      $scope.inboxLastMessages = [];
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
