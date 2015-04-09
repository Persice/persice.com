'use strict';
angular.module('beKindred')
  .controller('FilterController', function($scope, $rootScope, FiltersFactory, USER_ID, $log) {
    $scope.distanceValue = 10000;
    $scope.distanceOptions = {
      range: {
        min: 1,
        max: 10000
      }
    };

    $scope.genders = '';
    $scope.filtermessage = '';



    $scope.defaultFilters = {
      objects: [{
        distance: 10000,
        gender: 'm,f',
        min_age: 25,
        max_age: 60,
        keyword: '',
        user: '/api/v1/auth/user/' + USER_ID + '/'
        }]

    };


    $scope.filters = $scope.defaultFilters.objects;

    $scope.showFilterMessage = false;
    $scope.filterID = null;

    $scope.ageValues = [25, 60];
    $scope.ageOptions = {
      range: {
        min: 18,
        max: 115
      }
    };


    $scope.myKeywords = [];


    $scope.saveFilters = function() {

      FiltersFactory.query({
        format: 'json'
      }).$promise.then(function(response) {
        $scope.filters = response.objects;

        $scope.filterID = $scope.filters[0].id;

        $scope.newFilters = {
          distance: $scope.distanceValue,
          gender: $scope.genders,
          min_age: $scope.ageValues[0],
          max_age: $scope.ageValues[1],
          keyword: $scope.myKeywords.join(),
          id: $scope.filterID,
          user: '/api/v1/auth/user/' + USER_ID + '/'
        };

        FiltersFactory.update({
            filterId: $scope.filterID
          }, $scope.newFilters,
          function(success) {},
          function(error) {});


      });


    };

    $scope.getFilters = function() {
      FiltersFactory.query({
        format: 'json'
      }).$promise.then(function(response) {
        $scope.filters = response.objects;

        if ($scope.filters.length === 0) {
          //API update filters - patch method
          FiltersFactory.update({}, $scope.defaultFilters,
            function(success) {
              $('.ui.checkbox').checkbox('check');
            },
            function(error) {
              console.log(error);
            });
        } else {
          $scope.distanceValue = response.objects[0].distance;
          $scope.ageValues[0] = response.objects[0].min_age;
          $scope.ageValues[1] = response.objects[0].max_age;
          if (response.objects[0].keyword !== '') {
            $scope.myKeywords = response.objects[0].keyword.split(',');
          }
          if (response.objects[0].gender === '') {
            $('.ui.checkbox').checkbox('uncheck');
          }
          if (response.objects[0].gender === 'm,f') {
            $('.ui.checkbox').checkbox('check');
          }
          if (response.objects[0].gender === 'm') {
            $('#male').checkbox('check');
            $('#female').checkbox('uncheck');
          }
          if (response.objects[0].gender === 'f') {
            $('#female').checkbox('check');
            $('#male').checkbox('uncheck');
          }
        }



      });
    };

    $scope.getFilters();



    $scope.removeKeyword = function(index) {
      $scope.myKeywords.splice(index, 1);
      $scope.saveFilters();
    };

    $scope.addKeyword = function(item) {
      console.log('filtering');
      $scope.filtermessage = '';
      if (item == '' || item == undefined) {
        $scope.filtermessage = 'Keyword must have at least 3 letters';
        $scope.showFilterMessage = true;
      } else {

        if ($scope.myKeywords.length < 5) {
          $scope.existing = false;
          for (var i = $scope.myKeywords.length - 1; i >= 0; i--) {
            if ($scope.myKeywords[i] === item) {
              $scope.existing = true;
            }
          }


          if ($scope.existing === false) {
            $scope.myKeywords.push(item);
            $scope.saveFilters();
            $scope.newKeyword = '';
            $scope.showFilterMessage = false;
          } else {
            $scope.filtermessage = 'Keyword already exists';
            $scope.showFilterMessage = true;
          }
        } else {
          $scope.filtermessage = 'You cannot add more than 5 keywords';
          $scope.showFilterMessage = true;
        }
      }

    };

  });