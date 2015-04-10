'use strict';

angular.module('beKindred')
  .controller('MyConnectionsCtrl', function($scope, FriendsFactory, USER_ID, $resource, ConnectionsFactory, $log) {
    $scope.friends = [];
    $scope.q = '';
    $scope.noConnections = false;
    $scope.pok = false;
    $scope.noResults = false;
    var myUrl = '/api/v1/auth/user/' + USER_ID + '/';

    $scope.loading = false;
    $scope.loadingMore = false;

    $scope.nextOffset = 5;
    $scope.next = null;

    $scope.reset = function() {
      $scope.q = '';
      $scope.getFriends();
    };


    $scope.getFriends = function() {
      $scope.nextOffset = 5;
      $scope.next = null;
      $scope.loading = true;
      ConnectionsFactory.query({
        format: 'json',
        first_name: $scope.q,
        limit: 5,
        offset: 0
      }).$promise.then(function(data) {

          $scope.friends = data.objects;
          $scope.next = data.meta.next;


          if ($scope.friends.length === 0) {
            if (!$scope.pok) {
              $scope.noConnections = true;
              $scope.pok = true;
            } else {
              $scope.noResults = true;
            }
          } else {
            $scope.pok = true;
            $scope.noResults = false;
            $scope.noConnections = false;
            //count mutual friends
            for (var obj in $scope.friends) {
              $scope.friends[obj].totalFriends = 0;
              $scope.friends[obj].totalFriends += $scope.friends[obj].mutual_bk_friends_count;
              $scope.friends[obj].totalFriends += $scope.friends[obj].mutual_fb_friends_count;
              $scope.friends[obj].totalFriends += $scope.friends[obj].mutual_linkedin_connections_count;
              $scope.friends[obj].totalFriends += $scope.friends[obj].mutual_twitter_friends_count;
              $scope.friends[obj].totalFriends += $scope.friends[obj].mutual_twitter_followers_count;
            }
          }

          $scope.loading = false;


        },
        function(response) {
          var data = response.data,
            status = response.status,
            header = response.header,
            config = response.config,
            message = 'Error ' + status;

          $log.error(message);

          $scope.noConnections = true;

          $scope.loading = false;

        });

    };

    $scope.getFriends();


    $scope.loadMoreFriends = function() {

      if ($scope.loadingMore) {
        return;
      }

      if ($scope.next !== null) {


        $scope.loadingMore = true;

        ConnectionsFactory.query({
          format: 'json',
          limit: 5,
          first_name: $scope.q,
          offset: $scope.nextOffset
        }).$promise.then(function(data) {

            var responseData = data.objects;
            $scope.next = data.meta.next;

            $scope.nextOffset += 5;



            //count mutual friends
            for (var obj in responseData) {
              responseData[obj].totalFriends = 0;
              responseData[obj].totalFriends += responseData[obj].mutual_bk_friends_count;
              responseData[obj].totalFriends += responseData[obj].mutual_fb_friends_count;
              responseData[obj].totalFriends += responseData[obj].mutual_linkedin_connections_count;
              responseData[obj].totalFriends += responseData[obj].mutual_twitter_friends_count;
              responseData[obj].totalFriends += responseData[obj].mutual_twitter_followers_count;

              $scope.friends.push(responseData[obj]);
            }

            $scope.loadingMore = false;


          },
          function(response) {
            var data = response.data,
              status = response.status,
              header = response.header,
              config = response.config,
              message = 'Error ' + status;

            $log.error(message);

            $scope.loadingMore = false;

          });
      }
    };


  });