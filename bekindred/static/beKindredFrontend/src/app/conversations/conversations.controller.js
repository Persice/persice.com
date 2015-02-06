'use strict';

angular.module('beKindred')
.controller('ConversationsCtrl', function ($rootScope, $scope, USER_ID, $log, $timeout, FRIEND, UsersFactory) {
  $scope.messages = [
  {left: true, content: 'Hey, my name is Sasa! I\'d like to help you to learn front end development', time: new Date() },
  {left: false, content: 'Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?', time: new Date() }
  ];

  $scope.q = '';

  $scope.friend = FRIEND;


  // $scope.getMessages = function() {
  //   MessagesFactory.query( {
  //     q: $scope.q
  //   }).$promise.then(function(response) {
  //     $scope.messages = response.messages;
  //   });
  // };


  $scope.submit = function() {
    angular.element('#myform').submit();
  };

  $scope.sendMessage = function() {
    angular.element('#sendform').submit();
  };

  $scope.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  $scope.sendNewMessage = function() {
    var newmessage = {};
    newmessage = {
      left: $scope.getRandomInt(0,1),
      content: $scope.newmessage,
      time: new Date()
    };
    $scope.messages.push(newmessage);
    $scope.newmessage = '';


    $timeout(function() {
      var height = angular.element('.conversation-content')[0].scrollHeight;
      console.log(height);

      angular.element('.conversation-content').animate({
        scrollTop: height
      }, 1500);


    }, 100);





  };
});