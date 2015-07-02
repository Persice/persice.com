(function() {
    'use strict';

    /**
     * @desc display filter for matchfeed
     * @example <events-filter></events-filter>
     */
    angular
        .module('icebrak')
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
    function EventsFilterController($scope, $timeout, $rootScope, $window, SettingsRepository, EventsFiltersFactory, EventsFilterRepository, USER_ID, lodash, $log) {
        var vm = this;

        $rootScope.eventsFiltersChanged = false;

        $timeout(function() {
            $rootScope.eventsFiltersChanged = false;
            vm.changed = false;
        }, 2000);



        $rootScope.$watch('eventsFiltersChanged', function(newVal, oldVal) {
            vm.changed = newVal;
        });

        vm.saveFilters = saveFilters;
        vm.saveFiltersDebounce = lodash.debounce(saveFilters, 200);
        vm.getFilters = getFilters;
        vm.removeKeyword = removeKeyword;
        vm.addKeyword = addKeyword;
        vm.refreshEventsFeed = refreshEventsFeed;


        vm.distanceValue = 10000;
        vm.distanceUnit = 'miles';

        vm.filtermessage = '';
        vm.currentFilters = null;
        vm.showFilterMessage = false;

        vm.myKeywords = [];

        vm.getFilters();


        $rootScope.$on('refreshEventsFilters', function() {
            vm.getFilters();
        });

        $scope.$watch(angular.bind(this, function(distanceValue) {
            return vm.distanceValue;
        }), function(newVal) {
            vm.saveFiltersDebounce();
        });


        function refreshEventsFeed() {
            $rootScope.$emit('refreshEventFeed');
            $rootScope.$emit('eventsFiltersChanged');
        }

        $rootScope.$on('eventsFiltersChanged', function() {
            $rootScope.eventsFiltersChanged = false;
        });

        $rootScope.$on('distanceUnitChanged', function(event, value) {
            vm.distanceUnit = value;
        });

        function getFilters() {

            vm.currentFilters = EventsFilterRepository.getFilterState();
            vm.distanceValue = vm.currentFilters.distance;
            vm.distanceUnit = $rootScope.distance_unit;
            if (vm.currentFilters.keyword !== '' && vm.currentFilters.keyword !== undefined) {
                vm.myKeywords = vm.currentFilters.keyword.split(',');
            } else {
                vm.myKeywords.splice(0, vm.myKeywords.length);
            }

            $scope.$broadcast('reCalcViewDimensions');
            $scope.$broadcast('rzSliderForceRender');
            $rootScope.eventsFiltersChanged = true;

        }



        function saveFilters() {

            vm.newFilters = {
                distance: vm.distanceValue,
                keyword: vm.myKeywords.length === 0 ? '' : vm.myKeywords.join(),
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            $rootScope.eventsFiltersChanged = true;

            EventsFilterRepository.saveFilters(vm.newFilters);
            $scope.$broadcast('reCalcViewDimensions');
            $scope.$broadcast('rzSliderForceRender');
        }

        function removeKeyword(index) {
            vm.myKeywords.splice(index, 1);
            vm.saveFilters();
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
                        vm.saveFilters();
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