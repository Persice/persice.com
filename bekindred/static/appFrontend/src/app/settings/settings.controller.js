(function() {
    'use strict';

    angular
        .module('persice')
        .controller('SettingsController', SettingsController);

    /**
     * class SettingsController
     * classDesc User settings, delete account, logout
     * @ngInject
     */
    function SettingsController($rootScope, FilterRepository, USER_ID, $scope, $log, $timeout, $window, $http) {
        var vm = this;


        vm.changed = false;
        vm.setUnit = setUnit;
        vm.getDistanceUnit = getDistanceUnit;
        vm.saveSettings = saveSettings;
        vm.deleteUser = deleteUser;
        vm.loadingSave = false;

        vm.distanceUnit = 'miles';
        $timeout(function() {
            vm.changed = false;
        }, 1000);


        $scope.$watch(angular.bind(this, function(distanceUnit) {
            return vm.distanceUnit;
        }), function(newVal) {
            vm.changed = true;
        });

        vm.getDistanceUnit();

        function getDistanceUnit() {
            vm.changed = false;
            FilterRepository.getFilters().then(function(data) {
                vm.distanceUnit = data.distance_unit;
                $rootScope.distance_unit = data.distance_unit;
                vm.filterId = data.id;
                vm.changed = false;
            }, function(error) {

            });




        }

        function setUnit(value) {
            vm.distanceUnit = value;
        }

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


        function saveSettings() {
            vm.loadingSave = true;
            FilterRepository.saveFilters({
                distance_unit: vm.distanceUnit,
                user: '/api/v1/auth/user/' + USER_ID + '/'
            }).then(function(data) {
                vm.changed = false;
                vm.loadingSave = false;
                $rootScope.distance_unit = vm.distanceUnit;
            }, function(error) {
                vm.changed = false;
            });
        }

    }

})();
