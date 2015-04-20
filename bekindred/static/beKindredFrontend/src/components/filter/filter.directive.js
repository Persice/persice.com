(function() {
  'use strict';

  /**
   * @desc display filter for matchfeed
   * @example <matchfeed-filter></matchfeed-filter>
   */
  angular
    .module('beKindred')
    .directive('matchfeedFilter', matchfeedFilter);

  function matchfeedFilter() {
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
  function FilterController($scope, $rootScope, $window, FiltersFactory, FilterRepository, USER_ID, lodash) {
    var vm = this;


    vm.toggleGender = toggleGender;
    vm.saveFilters = saveFilters;
    vm.saveFiltersDebounce = lodash.debounce(saveFilters, 300);
    vm.getFilters = getFilters;
    vm.removeKeyword = removeKeyword;
    vm.addKeyword = addKeyword;
    vm.refreshMatchFeed = refreshMatchFeed;

    vm.distanceValue = 10000;

    vm.distanceOptions = {
      range: {
        min: 1,
        max: 10000
      }
    };

    vm.male = false;
    vm.female = false;


    vm.checkedmale = false;
    vm.checkedfemale = false;

    vm.genders = '';
    vm.filtermessage = '';

    vm.currentFilters = null;

    vm.showFilterMessage = false;

    vm.ageValues = [25, 60];
    vm.ageOptions = {
      range: {
        min: 18,
        max: 115
      }
    };

    vm.myKeywords = [];
    vm.gendersArr = [];


    vm.getFilters();


    $rootScope.$on('refreshFilters', function() {
      vm.getFilters();
    });

    function refreshMatchFeed() {
      $rootScope.$emit('triggerRefreshMatchfeed');
    }

    function getFilters() {
      vm.currentFilters = FilterRepository.getFilterState();
      vm.distanceValue = vm.currentFilters.distance;
      vm.ageValues[0] = vm.currentFilters.min_age;
      vm.ageValues[1] = vm.currentFilters.max_age;
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
      vm.saveFilters();
    }

    function saveFilters() {

      vm.newFilters = {
        distance: parseInt(vm.distanceValue),
        gender: vm.genders,
        min_age: parseInt(vm.ageValues[0]),
        max_age: parseInt(vm.ageValues[1]),
        keyword: vm.myKeywords.length === 0 ? '' : vm.myKeywords.join(),
        user: '/api/v1/auth/user/' + USER_ID + '/'
      };

      FilterRepository.saveFilters(vm.newFilters);

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