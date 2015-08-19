(function() {
    'use strict';

    angular
        .module('persice')
        .controller('CrowdController', CrowdController);

    /**
     * class CrowdController
     * classDesc view match feed crowd
     * @ngInject
     */
    function CrowdController($scope, $log, $timeout) {
        var vm = this;

        vm.range = range;

        function range(n) {
            return new Array(n);
        }

        vm.percent = 65;
        vm.options = {
            animate: {
                duration: 1500,
                enabled: true
            },
            size: 70,
            barColor: '#FA8072',
            scaleColor: false,
            lineWidth: 3,
            lineCap: 'circle',
            rotate: 180,
            trackColor: '#C0C0C0',
        };


    }



})();
