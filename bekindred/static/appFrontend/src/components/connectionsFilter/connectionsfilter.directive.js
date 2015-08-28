(function() {
    'use strict';

    /**
     * @desc display filter for matchfeed
     * @example <connections-filter></connections-filter>
     */
     angular
     .module('persice')
     .directive('connectionsFilter', connectionsFilter);

     function connectionsFilter($rootScope) {
        var directive = {
            controller: ConnectionsFilterController,
            controllerAs: 'filter',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class'
            },
            link: link,
            templateUrl: 'components/connectionsFilter/filterConnections.tpl.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }

    /**
     * @desc controller for Connections Filter directive
     * @ngInject
     */
     function ConnectionsFilterController($scope, $state, $timeout, $rootScope, $window, lodash, $log, $q) {
        var vm = this;

        vm.changed = false;

        $timeout(function() {
            vm.changed = false;
        }, 1000);

        vm.refreshConnections = refreshConnections;
        vm.hasChanges = hasChanges;

        vm.orderByValues = [{
            name: 'Match score',
            value: 'match_score'

        }, {
            name: 'Distance',
            value: 'distance'
        },
        {
            name: 'Name',
            value: 'first_name'
        },
        {
            name: 'Date',
            value: 'date'
        },
        {
            name: 'Mutual Friends',
            value: 'mutual_friends'
        }];
        vm.orderBy = 'date';



        function hasChanges() {
            vm.changed = true;


        }

        function refreshConnections() {
            vm.changed = false;
            $rootScope.$emit('refreshConnections', {order: vm.orderBy});
        }


    }



})();
