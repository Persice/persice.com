'use strict';

angular.module('beKindred')
.controller('ConversationsCtrl', function ($rootScope, myIoSocket, $scope, USER_ID, $log, $timeout, FRIEND, MessagesFactory, $filter, angularMomentConfig, toaster) {


  $rootScope.messages = [];


  $scope.q = '';
  $scope.newmessage = '';

  $scope.friend = FRIEND;

  $scope.recipient = '/api/v1/auth/user/' + $scope.friend.id + '/';
  $scope.sender = '/api/v1/auth/user/' + USER_ID + '/';

  $scope.loadingMessages = false;
  $scope.sendingMessage = false;



  $scope.scrollConversations = function() {
    $timeout(function() {
      var height = angular.element('.conversation-content')[0].scrollHeight;

      angular.element('.conversation-content').animate({
        scrollTop: height
      }, 1500);
    }, 100);
  };


  $scope.getMessages = function() {
    $rootScope.messages = [];
    $scope.loadingMessages = true;
    MessagesFactory.query( {
      user_id: $scope.friend.id
    }).$promise.then(function(response) {
      var responseMessages = response.objects;
      $filter('orderBy')(responseMessages, 'sent_at', true);


      for(var obj in responseMessages) {
        var localDate = $filter('amDateFormat')(responseMessages[obj].sent_at, 'dddd, MMMM D, YYYY');
        var localDatePlain = $filter('amDateFormat')(responseMessages[obj].sent_at, 'L');

        var messageIndex = $filter('getIndexByProperty')('date', localDate, $rootScope.messages);

        if (messageIndex === null) {
          $rootScope.messages.push({date: localDate, realDate: localDatePlain, contents: [] });
          messageIndex = $rootScope.messages.length - 1;
        }


        if (responseMessages[obj].sender === $scope.sender) {
          $rootScope.messages[messageIndex].contents.push({
            body: responseMessages[obj].body,
            sender: responseMessages[obj].sender,
            recipient: responseMessages[obj].recipient,
            date: localDatePlain,
            sent_at: responseMessages[obj].sent_at,
            left: true
          });
        }
        else {
          $rootScope.messages[messageIndex].contents.push({
            body: responseMessages[obj].body,
            sender: responseMessages[obj].sender,
            recipient: responseMessages[obj].recipient,
            date: localDatePlain,
            sent_at: responseMessages[obj].sent_at,
            left: false
          });
        }
        $rootScope.messages[messageIndex].contents = $filter('orderBy')($rootScope.messages[messageIndex].contents, 'sent_at', true);
      }

      $rootScope.messages = $filter('orderBy')($rootScope.messages, 'realDate');


      if ($rootScope.messages.length > 0) {
        $timeout(function() {
          var height = angular.element('.conversation-content')[0].scrollHeight;
          angular.element('.conversation-content').animate({
            scrollTop: height
          }, 0);
        }, 100);
      }

      $scope.loadingMessages = false;


    }, function(response) {
      $scope.loadingMessages = false;
      var data = response.data,
      status = response.status,
      header = response.header,
      config = response.config,
      message = 'Error ' + status;
      // error handler
      $log.error(message);

    });
};

$scope.getMessages();




$scope.sendNewMessage = function() {

  if ($scope.newmessage === '') {
    $scope.sendingMessage = false;

  }
  else {

    $scope.sendingMessage = true;
    var newMessage = {};
    newMessage = {
      sender: $scope.sender,
      recipient: $scope.recipient,
      body: $scope.newmessage
    };


    MessagesFactory.save({}, newMessage,
      function(success){
        // myIoSocket.emit('notification', success);
        newMessage.left = true;
        newMessage.sent_at = success.sent_at;
        newMessage.sender = success.sender;
        newMessage.recipient = success.recipient;
        var localDatePlain = $filter('amDateFormat')(newMessage.sent_at, 'L');
        var localDate = $filter('amDateFormat')(newMessage.sent_at, 'dddd, MMMM D, YYYY');
        var messageIndex = $filter('getIndexByProperty')('date', localDate, $rootScope.messages);
        newMessage.date = localDatePlain;

        if (messageIndex === null) {
          $rootScope.messages.push({date: localDate, realDate: localDatePlain, contents: [] });
          messageIndex = $rootScope.messages.length - 1;
        }

        $rootScope.messages[messageIndex].contents.push(newMessage);
        $scope.newmessage = '';
        $log.info('New message saved.');
        $scope.sendingMessage = false;
        $scope.scrollConversations();

      },
      function(error) {
       toaster.clear();
       toaster.pop('error', 'Error', 'Message could not be sent. Please try again.');
       $scope.sendingMessage = false;
       $log.info(error);
     });

}

};


});