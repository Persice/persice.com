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
    function SettingsController($rootScope, FiltersFactory, FilterRepository, USER_ID, $scope, $log, $timeout, $window, $http) {
        var vm = this;

        vm.userSettingsChanged = false;
        $timeout(function() {
            vm.filterId = FilterRepository.filterId;
            vm.userSettingsChanged = false;
        }, 1000);

        vm.setUnit = setUnit;
        vm.saveSettings = saveSettings;

        vm.deleteUser = deleteUser;
        vm.loadingSave = false;

        var pok = false;


        vm.distanceUnit = $rootScope.distance_unit;


        $rootScope.$on('distanceUnitChanged', function(event, value) {
            vm.distanceUnit = value;
            $log.info('from controller');
            $log.info(value);
            vm.userSettingsChanged = false;
        });



        $scope.$watch(angular.bind(vm, function(distanceUnit) {
            return vm.distanceUnit;
        }), function(newVal, oldVal) {
            $log.info('from watch');
            $log.info(newVal);
            if (pok === false) {
                pok = true;
            } else {
                vm.userSettingsChanged = true;
            }

        });

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
            FiltersFactory.update({
                filterId: vm.filterId
            }, {
                distance_unit: vm.distanceUnit,
                user: '/api/v1/auth/user/' + USER_ID + '/'
            }, saveFiltersSuccess, saveFiltersError);

            function saveFiltersSuccess(response) {
                FilterRepository.setDistanceUnit(vm.distanceUnit);
                vm.loadingSave = false;
                vm.userSettingsChanged = false;
            }

            function saveFiltersError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
                vm.loadingSave = false;
                vm.userSettingsChanged = true;


            }
        }

    }

})();