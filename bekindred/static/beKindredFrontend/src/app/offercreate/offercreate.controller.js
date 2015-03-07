'use strict';

angular.module('beKindred')
  .controller('OfferCreateCtrl', function($scope, $state, $log, OffersFactory, SubjectsFactory, USER_ID, $filter) {
    $scope.subject = '';
    $scope.resourceUri = null;
    $scope.messageShow = false;
    $scope.message = '';

    $scope.userUri = '/api/v1/auth/user/' + USER_ID + '/';

    $scope.inputChanged = function(str) {
      $scope.subject = str;
    };

    $scope.selectResult = function(object) {
      if (object !== undefined) {
        $scope.subject = object.originalObject.description;
        $scope.resourceUri = object.originalObject.resource_uri;
      } else {
        $scope.resourceUri = null;
      }

    };


    $scope.saveOffer = function() {
      var newOffer = {
        offer_subject: $scope.subject,
        user: $scope.userUri
      };

      OffersFactory.save({}, newOffer,
        function(success) {

          $state.go('finalstep');

        },
        function(error) {
          $scope.resourceUri = null;
          $scope.messageShow = true;
          $scope.message = error.data.offer.error[0];
        });
    };

    $scope.createOffer = function() {
      $scope.messageShow = false;
      $scope.message = '';


      //if subject is empty warn user to enter subject
      if ($scope.subject === '') {
        $scope.message = 'Entering your offer is required to continue.';
        $scope.messageShow = true;
        return false;
      }

      $scope.saveOffer();

    };



  });