(function() {
  'use strict';

  angular
    .module('icebrak')
    .controller('SettingsController', SettingsController);

  /**
   * class SettingsController
   * classDesc User settings, delete account, logout
   * @ngInject
   */
  function SettingsController($rootScope, $scope, $log, $timeout, $window, $http) {
    var vm = this;
    vm.userSettings = {
      distance_unit: 'miles',
    };



    vm.deleteUser = deleteUser;


    $timeout(function() {
      vm.userSettingsChanged = false;
    }, 200);

    $scope.$watch(angular.bind(vm, function() {
      return vm.userSettings.distance_unit;
    }), function(newVal, oldVal) {
      vm.userSettingsChanged = true;
    });


    function deleteUser() {
      $http({
        method: 'POST',
        url: '/accounts/deactivate/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      $window.location.href = '/accounts/logout';
      $window.location.assign();

    }

  }

})();