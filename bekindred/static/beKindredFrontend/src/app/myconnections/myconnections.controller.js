(function() {
  'use strict';

  angular
    .module('beKindred')
    .controller('MyConnectionsController', MyConnectionsController);

  /**
   * class MyConnectionsController
   * classDesc Fetch user connections
   * @ngInject
   */
  function MyConnectionsController($scope, FriendsFactory, USER_ID, $resource, ConnectionsFactory, $log, $timeout, $q) {
    var vm = this;
    vm.friends = [];
    vm.q = '';
    vm.noConnections = false;
    vm.pok = false;
    vm.noResults = false;
    vm.loading = false;
    vm.loadingMore = false;
    vm.nextOffset = 10;
    vm.next = null;

    vm.getFriends = getFriends;
    vm.loadMoreFriends = loadMoreFriends;
    vm.reset = reset;

    vm.getFriends();

    function reset() {
      vm.q = '';
      vm.getFriends();
    }

    function getFriends() {
      vm.nextOffset = 10;
      vm.next = null;
      vm.loading = true;
      ConnectionsFactory.query({
        format: 'json',
        first_name: vm.q,
        limit: 10,
        offset: 0
      }).$promise.then(function(data) {

          vm.friends = data.objects;
          vm.next = data.meta.next;


          if (vm.friends.length === 0) {
            if (!vm.pok) {
              vm.noConnections = true;
              vm.pok = true;
            } else {
              vm.noResults = true;
            }
          } else {
            vm.pok = true;
            vm.noResults = false;
            vm.noConnections = false;
            //count mutual friends
            for (var obj in vm.friends) {
              vm.friends[obj].totalFriends = 0;
              vm.friends[obj].totalFriends += vm.friends[obj].mutual_bk_friends_count;
              vm.friends[obj].totalFriends += vm.friends[obj].mutual_fb_friends_count;
              vm.friends[obj].totalFriends += vm.friends[obj].mutual_linkedin_connections_count;
              vm.friends[obj].totalFriends += vm.friends[obj].mutual_twitter_friends_count;
              vm.friends[obj].totalFriends += vm.friends[obj].mutual_twitter_followers_count;
            }
          }

          vm.loading = false;


        },
        function(response) {
          var data = response.data,
            status = response.status,
            header = response.header,
            config = response.config,
            message = 'Error ' + status;

          $log.error(message);

          vm.noConnections = true;

          vm.loading = false;

        });

    }

    function loadMoreFriends() {
      var deferred = $q.defer();



      if (vm.next === null) {
        deferred.reject();
        return deferred.promise;
      }

      if (!vm.loadingMore) {

        vm.loadingMore = true;
        ConnectionsFactory.query({
          format: 'json',
          limit: 10,
          first_name: vm.q,
          offset: vm.nextOffset
        }).$promise.then(function(data) {

            var responseData = data.objects;
            vm.next = data.meta.next;

            vm.nextOffset += 10;

            //count mutual friends
            for (var obj in responseData) {
              responseData[obj].totalFriends = 0;
              responseData[obj].totalFriends += responseData[obj].mutual_bk_friends_count;
              responseData[obj].totalFriends += responseData[obj].mutual_fb_friends_count;
              responseData[obj].totalFriends += responseData[obj].mutual_linkedin_connections_count;
              responseData[obj].totalFriends += responseData[obj].mutual_twitter_friends_count;
              responseData[obj].totalFriends += responseData[obj].mutual_twitter_followers_count;

              vm.friends.push(responseData[obj]);
            }

            vm.loadingMore = false;
            deferred.resolve();


          },
          function(response) {
            deferred.reject();
            var data = response.data,
              status = response.status,
              header = response.header,
              config = response.config,
              message = 'Error ' + status;

            $log.error(message);

            vm.loadingMore = false;

          });


      } else {
        deferred.reject();
      }


      return deferred.promise;
    }

  }



})();