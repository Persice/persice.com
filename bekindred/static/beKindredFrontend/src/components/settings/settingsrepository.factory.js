(function() {
    'use strict';
    angular
        .module('icebrak')
        .factory('SettingsRepository', SettingsRepository);

    /**
     * class SettingsRepository
     * classDesc Service for Settings
     * @ngInject
     */
    function SettingsRepository(SettingsFactory, $log, $filter, $rootScope, USER_ID) {

        var defaultState = {
            distance_unit: 'miles',
            user: '/api/v1/auth/user/' + USER_ID + '/'
        };

        var service = {
            settingsState: {
                distance_unit: 'miles',
                user: '/api/v1/auth/user/' + USER_ID + '/'
            },
            settingId: null,
            getSettings: getSettings,
            saveSettings: saveSettings,
            createSettings: createSettings,
            getSettingState: getSettingsState
        };
        return service;



        function getSettings() {
            $log.info('fetching settings');
            return SettingsFactory.query({
                format: 'json'
            }).$promise.then(getSettingsComplete, getSettingsFailed);

            function getSettingsComplete(response) {
                if (response.objects.length === 0) {
                    service.createSettings(defaultState);
                    service.settingsState = defaultState;
                } else {
                    service.settingId = response.objects[0].id;
                    service.settingsState = response.objects[0];
                }
            }

            function getSettingsFailed(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
                service.settingsState = defaultState;
            }
        }

        function getSettingsState() {
            return service.settingsState;
        }


        function saveSettings(newSettings) {
            $log.info('saving settings');

            if (service.settingId === null) {
                return;
            }



            return SettingsFactory.update({
                settingId: service.settingId
            }, newSettings, saveSettingsSuccess, saveSettingsError);

            function saveSettingsSuccess(response) {
                service.settingsState = newSettings;
            }

            function saveSettingsError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);


            }

        }

        function createSettings(newSettings) {
            $log.info('creating settings');

            return SettingsFactory.save(newSettings, createSettingsSuccess, createSettingsError);

            function createSettingsSuccess(response) {
                $log.info('new settings created');
                service.settingId = response.id;
            }

            function createSettingsError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);


            }

        }



    }

})();