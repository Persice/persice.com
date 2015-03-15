(function() {
  'use strict';

  angular
    .module('beKindred')
    .controller('InterestsController', InterestsController);

  /**
   * class InterestsController
   * classDesc Select interests and activities during onboard user flow
   * @ngInject
   */
  function InterestsController(InterestsFactory, $log, notify, USER_ID, $filter, $resource, $state, $q, lodash, $scope, $window) {
    var vm = this;

    vm.useInterest = useInterest;
    vm.getAllInterests = getAllInterests;
    vm.nextStep = nextStep;
    vm.searchQuery = '';
    vm.userUri = '/api/v1/auth/user/' + USER_ID + '/';

    vm.next = null;
    vm.nextOffset = 30;
    vm.loadingMore = false;
    vm.noResults = false;
    vm.reset = reset;
    vm.limit = 30;
    vm.loadMore = loadMore;
    vm.resolveMore = resolveMore;

    vm.allInterests = [];
    vm.counter = 0;

    vm.loadingInterests = false;

    vm.userInterests = [];

    var w = angular.element($window);


    if (w.height() > 667) {
      vm.limit = 200;
    }

    vm.getAllInterests();



    function nextStep() {
      if (vm.counter > 0) {
        $state.go('goalcreate');
      } else {
        notify({
          messageTemplate: '<div class="notify-info-header">Warning</div>' +
            '<p>To continue please select at least one interest.</p>',
          scope: $scope,
          classes: 'notify-info',
          icon: 'warning circle'
        });
      }
    }

    function reset() {
      vm.searchQuery = '';
      vm.getAllInterests();
      vm.noResults = false;
      vm.counter = 0;
    }

    function getAllInterests() {
      vm.nextOffset = 30;
      vm.next = null;
      vm.noResults = false;
      vm.loadingInterests = true;
      vm.counter = 0;
      vm.allInterests.splice(0, vm.allInterests.length);

      InterestsFactory.query({
        user_id: USER_ID,
        format: 'json',
        limit: 200,
        offset: 0
      }).$promise.then(function(data) {



        if (data.objects.length > 0) {
          vm.userInterests = data.objects;
        }

        InterestsFactory.query({
          format: 'json',
          limit: vm.limit,
          description__icontains: vm.searchQuery,
          offset: 0
        }).$promise.then(function(data) {
          vm.next = data.meta.next;

          var results = data.objects;

          if (results.length > 0) {

            //preselect already created interests
            for (var j = results.length - 1; j >= 0; j--) {
              for (var i = vm.userInterests.length - 1; i >= 0; i--) {
                if (results[j].description === vm.userInterests[i].description) {
                  results[j] = vm.userInterests[i];
                  vm.counter++;
                  results[j].active = true;
                }
              }
              vm.allInterests.push(results[j]);
            }

          } else {
            vm.allInterests.splice(0, vm.allInterests.length);
            vm.noResults = true;
          }



          vm.loadingInterests = false;
        }, function(response) {
          var data = response.data,
            status = response.status,
            header = response.header,
            config = response.config,
            message = 'Error ' + status;
          $log.error(message);
          vm.loadingInterests = false;

        });



      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        $log.error(message);
        vm.loadingInterests = false;

      });


    }

    function loadMore() {
      var deferred = $q.defer();
      if (vm.next !== null) {

        InterestsFactory.query({
          user_id: USER_ID,
          format: 'json',
          limit: 200,
          offset: 0
        }).$promise.then(function(data) {

          if (data.objects.length > 0) {
            vm.userInterests = data.objects;
          }

          InterestsFactory.query({
            format: 'json',
            description__icontains: vm.searchQuery,
            offset: vm.nextOffset,
            limit: 30
          }).$promise.then(function(data) {
            var responseData = data.objects;
            vm.next = data.meta.next;
            vm.nextOffset += vm.limit;


            if (data.objects.length > 0) {
              responseData = data.objects;
            }



            for (var j = responseData.length - 1; j >= 0; j--) {
              for (var i = vm.userInterests.length - 1; i >= 0; i--) {
                if (responseData[j].description === vm.userInterests[i].description) {
                  responseData[j] = vm.userInterests[i];
                  vm.counter++;
                  responseData[j].active = true;
                }
              }
              vm.allInterests.push(responseData[j]);
            }

            deferred.resolve();
          }, function(response) {
            var data = response.data,
              status = response.status,
              header = response.header,
              config = response.config,
              message = 'Error ' + status;
            $log.error(message);
            deferred.reject();

          });


        }, function(response) {
          var data = response.data,
            status = response.status,
            header = response.header,
            config = response.config,
            message = 'Error ' + status;
          $log.error(message);
          deferred.reject();


        });

      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function resolveMore() {
      if (vm.loadingMore || vm.loadingInterests) {
        return;
      }

      vm.loadingMore = true;

      var promise = vm.loadMore();

      promise.then(function(greeting) {
        vm.loadingMore = false;
      }, function(reason) {
        vm.loadingMore = false;
      });


    }

    function useInterest(id) {
      var selected = $filter('getByProperty')('id', id, vm.allInterests);

      if (selected) {


        if (selected.active) {

          //deselect interest and delete from database
          var Interest = $resource(selected.resource_uri);
          selected.loading = true;
          Interest.delete().$promise.then(function(data) {
            selected.active = false;
            vm.counter--;
            selected.loading = false;
          }, function(response) {
            var data = response.data,
              status = response.status,
              header = response.header,
              config = response.config,
              message = 'Error ' + status;
            $log.error(message);
            selected.loading = false;
            selected.error = true;
          });



        } else {
          if (vm.counter >= 10) {


            notify({
              messageTemplate: '<div class="notify-info-header">Warning</div>' +
                '<p>Please select up to 10 interests.</p>',
              scope: $scope,
              classes: 'notify-info',
              icon: 'warning circle'
            });
          } else {

            //select and save new interest
            var newInterest = {
              description: selected.description,
              user: vm.userUri
            };
            selected.loading = true;
            InterestsFactory.save({}, newInterest,
              function(success) {
                $log.info(selected);
                selected.loading = false;
                selected.error = false;
                selected.interest = success.interest;
                selected.description = success.description;
                selected.resource_uri = success.resource_uri;
                selected.user = success.user;
                selected.active = true;
                selected.id = success.id;
                vm.counter++;
              },
              function(error) {
                selected.errorMessage = error.data.interest.error[0];

                notify({
                  messageTemplate: '<div class="notify-info-header">Error</div>' +
                    '<p>' + selected.errorMessage + '</p>',
                  scope: $scope,
                  classes: 'notify-info',
                  icon: 'warning circle'
                });

                selected.loading = false;
                selected.error = true;

              });

          }
        }



      }


    }
  }



})();