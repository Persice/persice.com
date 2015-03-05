(function(){
  'use strict';

  /**
   * class InterestsController
   * classDesc Select interests and activities during onboard user flow
   * @ngInject
   */
   function InterestsController (InterestsFactory, $log, $scope, notify, USER_ID, $filter, $resource, $state) {
    var vm = this;

    vm.useInterest = useInterest;
    vm.getAllInterests = getAllInterests;
    vm.nextStep = nextStep;
    vm.searchQuery = '';
    vm.userUri = '/api/v1/auth/user/' + USER_ID + '/';

    vm.allInterests = [];
    vm.counter = 0;

    vm.loadingInterests = false;

    vm.userInterests = [];

    vm.getAllInterests();


    function nextStep () {
      if (vm.counter > 0) {
        $state.go('goalcreate');
      }
      else {
        notify({
          messageTemplate: '<div class="notify-info-header">Warning</div>' +
          '<p>To continue please select at least one interest.</p>',
          scope: $scope,
          classes: 'notify-info',
          icon: 'warning circle'
        });
      }
    }

    function getAllInterests () {
      vm.loadingInterests = true;

      InterestsFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
        if (data.meta.total_count > 0) {
          vm.userInterests = data.objects;
        }

        InterestsFactory.query({format: 'json'}).$promise.then(function(data) {
          if (data.meta.total_count > 0) {
            vm.allInterests = data.objects;
          }

          //preselect already created interests
          for (var i = vm.userInterests.length - 1; i >= 0; i--) {
            for (var j = vm.allInterests.length - 1; j >= 0; j--) {
              if (vm.allInterests[j].description === vm.userInterests[i].description) {
                vm.allInterests[j] = vm.userInterests[i];
                vm.counter++;
                vm.allInterests[j].active = true;
              }
            }
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

function useInterest (id) {
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



        }
        else {
          if (vm.counter >= 10) {


            notify({
              messageTemplate: '<div class="notify-info-header">Warning</div>' +
              '<p>Please select up to 10 interests.</p>',
              scope: $scope,
              classes: 'notify-info',
              icon: 'warning circle'
            });
          }
          else {

            //select and save new interest
            var newInterest = {
              description: selected.description,
              user: vm.userUri
            };
            selected.loading = true;
            InterestsFactory.save({}, newInterest,
              function(success){
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


angular
.module('beKindred')
.controller('InterestsController', InterestsController);




})();