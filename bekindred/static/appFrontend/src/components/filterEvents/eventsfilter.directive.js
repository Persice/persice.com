(function() {
    'use strict';

    /**
     * @desc display filter for matchfeed
     * @example <events-filter></events-filter>
     */
    angular
        .module('persice')
        .directive('eventsFilter', eventsFilter);

    function eventsFilter($rootScope) {
        var directive = {
            controller: EventsFilterController,
            controllerAs: 'filter',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class'
            },
            link: link,
            templateUrl: 'components/filterEvents/filterEvents.template.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }

    /**
     * @desc controller for Events Filter directive
     * @ngInject
     */
    function EventsFilterController($scope, $timeout, $rootScope, $window, SettingsRepository, EventsFiltersFactory, EventsFilterRepository, USER_ID, lodash, $log, $q) {
        var vm = this;

        vm.changed = false;

        $timeout(function() {
            vm.changed = false;
        }, 1000);
        vm.saveFilters = saveFilters;
        vm.getFilters = getFilters;
        vm.removeKeyword = removeKeyword;
        vm.addKeyword = addKeyword;
        vm.refreshEventsFeed = refreshEventsFeed;
        vm.hasChanges = hasChanges;

        vm.orderByValues = [{
            name: 'Match score',
            value: 'match_score'

        }, {
            name: 'Distance',
            value: 'distance'
        }];
        vm.orderBy = 'distance';

        vm.distanceValue = 10000;
        vm.distanceUnit = 'miles';

        vm.filtermessage = '';
        vm.currentFilters = null;
        vm.showFilterMessage = false;

        vm.myKeywords = [];

        function hasChanges() {
            vm.changed = true;
        }


        function refreshEventsFeed() {
            vm.saveFilters();
        }


        $scope.$watch(angular.bind(this, function(distanceValue) {
            return vm.distanceValue;
        }), function(newVal) {
            vm.hasChanges();

        });

        vm.getFilters();

        function getFilters() {
            vm.changed = false;
            EventsFilterRepository.getFilters().then(function(data) {
                vm.currentFilters = data;
                vm.distanceValue = vm.currentFilters.distance;
                vm.orderBy = vm.currentFilters.order_criteria;
                vm.distanceUnit = $rootScope.distance_unit;
                if (vm.currentFilters.keyword !== '' && vm.currentFilters.keyword !== undefined) {
                    vm.myKeywords = vm.currentFilters.keyword.split(',');
                } else {
                    vm.myKeywords.splice(0, vm.myKeywords.length);
                }
                $scope.$broadcast('reCalcViewDimensions');
                $scope.$broadcast('rzSliderForceRender');
                vm.changed = false;

            }, function(error) {

            });



        }



        function saveFilters() {

            vm.newFilters = {
                distance: vm.distanceValue,
                order_criteria: vm.orderBy,
                keyword: vm.myKeywords.length === 0 ? '' : vm.myKeywords.join(),
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            EventsFilterRepository.saveFilters(vm.newFilters).then(function(data) {
                vm.changed = false;
                $rootScope.$emit('refreshEventFeed');
            }, function(error) {

            });
            $scope.$broadcast('reCalcViewDimensions');
            $scope.$broadcast('rzSliderForceRender');
        }

        function removeKeyword(index) {
            vm.myKeywords.splice(index, 1);
            vm.hasChanges();
        }

        function addKeyword(item) {
            vm.filtermessage = '';
            if (item === '' || item === undefined) {
                vm.filtermessage = 'Keyword must have at least 3 letters';
                vm.showFilterMessage = true;
            } else {

                if (vm.myKeywords.length < 5) {
                    vm.existing = false;
                    for (var i = vm.myKeywords.length - 1; i >= 0; i--) {
                        if (vm.myKeywords[i] === item) {
                            vm.existing = true;
                        }
                    }


                    if (vm.existing === false) {
                        vm.myKeywords.push(item);
                        vm.hasChanges();
                        vm.newKeyword = '';
                        vm.showFilterMessage = false;
                    } else {
                        vm.filtermessage = 'Keyword already exists';
                        vm.showFilterMessage = true;
                    }
                } else {
                    vm.filtermessage = 'You cannot add more than 5 keywords';
                    vm.showFilterMessage = true;
                }
            }

        }

    }



})();
