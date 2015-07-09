(function() {
    'use strict';

    angular
        .module('persice')
        .controller('MyProfileController', MyProfileController);

    /**
     * class MyProfileController
     * classDesc view user profile
     * @ngInject
     */
    function MyProfileController($scope, USER_ID, USER_PHOTO, $log) {
        var vm = this;
        vm.user = {
            id: USER_ID,
            photo: USER_PHOTO
        };


    }



})();