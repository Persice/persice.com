'use strict';

angular.module('beKindred')
.controller('InboxCtrl', function ($scope, $log, ConnectionsFactory, USER_ID, MessagesFactory, $filter) {


  $scope.connections = [];
  var myUrl = '/api/v1/auth/user/' + USER_ID + '/';

  $scope.getFriends = function () {
    $scope.connections = [];
    ConnectionsFactory.query({format: 'json'}).$promise.then(function(data) {
      $scope.connections = data.objects;
      $scope.getLastMessage();

    }, function(response) {
      var data = response.data,
      status = response.status,
      header = response.header,
      config = response.config,
      message = 'Error ' + status;
      // error handler
      $log.error(message);

    });

  };

  $scope.getFriends();

  $scope.responseMessages = [];

  $scope.getLastMessage = function() {
    $scope.messages = [];
    $scope.loadingMessages = true;


    for(var obj in $scope.connections) {
      (function(obj) {
        MessagesFactory.query( {
          user_id: $scope.connections[obj].friend_id
        }).$promise.then(function(response) {
          var responseMessages = response.objects;
          $scope.connections[obj].messages = response.objects;
          if (responseMessages.length > 0) {
            var pok = true;
            var counter = 0;
            while (pok) {
              if (responseMessages[counter].recipient === '/api/v1/auth/user/' + USER_ID + '/') {
                var today = $filter('amDateFormat')(new Date(), 'L');
                $scope.connections[obj].lastMessage = responseMessages[counter];
                $scope.connections[obj].lastMessage.date =  $filter('amDateFormat')(responseMessages[counter].sent_at, 'L');

                if ($scope.connections[obj].lastMessage.date === today) {
                  $scope.connections[obj].lastMessage.display = $filter('amDateFormat')(responseMessages[counter].sent_at, 'h:mm a');
                }
                else {
                  $scope.connections[obj].lastMessage.display = $filter('amDateFormat')(responseMessages[counter].sent_at, 'MMM YY');
                }
                pok = false;
              }
              counter++;
              if (counter === responseMessages.length) {
                pok = false;
                $scope.connections[obj].lastMessage = {date: '', display: '', sent_at: '', body: 'There are no received messages from ' +  $scope.connections[obj].first_name};
              }

            }

          }
          else {
            $scope.connections[obj].lastMessage = {date: '02/15/2015', display: 'Feb 15', sent_at: '2015-02-10T01:07:47.810265', body: 'You and ' + $scope.connections[obj].first_name + ' are now Kindred peeps'};
          }


        }, function(response) {
          var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        // error handler
        $log.error(message);

      });
})(obj);

}

};


});
