(function() {
    'use strict';

    /**
     * @desc display filter for matchfeed
     * @example <matchfeed-filter></matchfeed-filter>
     */
    angular
        .module('persice')
        .directive('matchfeedFilter', matchfeedFilter);

    function matchfeedFilter($rootScope) {
        var directive = {
            controller: FilterController,
            controllerAs: 'filter',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class'
            },
            link: link,
            templateUrl: 'components/filter/matchfeedFilter.directive.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }

    /**
     * @desc controller for matchfeedFilter directive
     * @ngInject
     */
    function FilterController($scope, $timeout, $rootScope, $window, SettingsRepository, FiltersFactory, FilterRepository, USER_ID, lodash, $log) {
        var vm = this;

        $rootScope.filtersChanged = false;

        $timeout(function() {
            $rootScope.filtersChanged = false;
            vm.changed = false;
        }, 2000);


        $rootScope.$watch('filtersChanged', function(newVal, oldVal) {
            vm.changed = newVal;
        });

        vm.toggleGender = toggleGender;
        vm.saveFilters = saveFilters;
        vm.saveFiltersDebounce = lodash.debounce(saveFilters, 200);
        vm.getFilters = getFilters;
        vm.removeKeyword = removeKeyword;
        vm.addKeyword = addKeyword;
        vm.refreshMatchFeed = refreshMatchFeed;

        vm.orderByValues = [{
            name: 'Match score',
            value: 'match_score'

        }, {
            name: 'Distance',
            value: 'distance'
        }, {
            name: 'Mutual friends',
            value: 'mutual_friends'
        }];
        vm.orderBy = 'match_score';
        vm.distanceValue = 10000;
        vm.distanceUnit = 'miles';

        vm.male = false;
        vm.female = false;


        vm.checkedmale = false;
        vm.checkedfemale = false;

        vm.genders = '';
        vm.filtermessage = '';

        vm.currentFilters = null;

        vm.showFilterMessage = false;

        vm.ageValues = [25, 60];

        // In your controller
        vm.ageSlider = {
            min: 25,
            max: 60,
            ceil: 115,
            floor: 18
        };

        $scope.$watch(angular.bind(this, function(distanceValue) {
            return vm.distanceValue;
        }), function(newVal) {
            vm.saveFiltersDebounce();
        });

        $scope.$watch(angular.bind(this, function(ageSlider) {
            return vm.ageSlider.min;
        }), function(newVal) {
            vm.saveFiltersDebounce();
        });

        $scope.$watch(angular.bind(this, function(ageSlider) {
            return vm.ageSlider.max;
        }), function(newVal) {
            vm.saveFiltersDebounce();
        });

        vm.myKeywords = [];
        vm.gendersArr = [];


        vm.getFilters();


        $rootScope.$on('refreshFilters', function() {
            vm.getFilters();
        });

        function refreshMatchFeed() {
            $rootScope.$emit('triggerRefreshMatchfeed');
            $rootScope.$emit('filtersChanged');
        }

        $rootScope.$on('filtersChanged', function() {
            $rootScope.filtersChanged = false;
        });

        $rootScope.$on('distanceUnitChanged', function(event, value) {
            vm.distanceUnit = value;
        });

        function getFilters() {

            vm.currentFilters = FilterRepository.getFilterState();
            vm.distanceValue = vm.currentFilters.distance;
            vm.distanceUnit = $rootScope.distance_unit;
            vm.ageSlider.min = vm.currentFilters.min_age;
            vm.ageSlider.max = vm.currentFilters.max_age;

            if (vm.currentFilters.keyword !== '' && vm.currentFilters.keyword !== undefined) {
                vm.myKeywords = vm.currentFilters.keyword.split(',');
            } else {
                vm.myKeywords.splice(0, vm.myKeywords.length);
            }
            if (vm.currentFilters.gender === '') {
                vm.male = false;
                vm.female = false;
            }
            if (vm.currentFilters.gender === 'm,f') {
                vm.male = true;
                vm.female = true;
            }
            if (vm.currentFilters.gender === 'm') {
                vm.male = true;
                vm.female = false;
            }
            if (vm.currentFilters.gender === 'f') {
                vm.male = false;
                vm.female = true;
            }


            $rootScope.filtersChanged = true;
            $scope.$broadcast('reCalcViewDimensions');
            $scope.$broadcast('rzSliderForceRender');

        }



        function toggleGender(value, checked) {
            if (checked === true) {
                vm.gendersArr.push(value);
            } else {
                var index = vm.gendersArr.indexOf(value);
                vm.gendersArr.splice(index, 1);
            }
            vm.gendersArr.sort().reverse();
            vm.genders = vm.gendersArr.join(',');
            vm.saveFiltersDebounce();
        }

        function saveFilters() {

            vm.newFilters = {
                distance: vm.distanceValue,
                gender: vm.genders,
                order_criteria: vm.orderBy,
                min_age: vm.ageSlider.min,
                max_age: vm.ageSlider.max,
                keyword: vm.myKeywords.length === 0 ? '' : vm.myKeywords.join(),
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            $rootScope.filtersChanged = true;

            FilterRepository.saveFilters(vm.newFilters);
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