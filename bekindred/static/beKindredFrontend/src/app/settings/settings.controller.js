'use strict';

angular.module('icebrak')
  .controller('SettingsCtrl', function($rootScope, $scope, $log, $timeout, $window, $http) {

    $scope.deleteUser = function() {
      $log.info('delete user');
      $http({
        method: 'POST',
        url: '/accounts/deactivate/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      $window.location.href = '/accounts/logout';
      $window.location.assign();

    };

  });