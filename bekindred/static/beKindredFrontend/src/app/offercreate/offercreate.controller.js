'use strict';

angular.module('icebrak')
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
          if (error.data.offer) {
            $scope.message = error.data.offer.error[0];
          } else {
            $scope.message = 'There was an error when trying to save your offer.';
          }

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

      //if subject is has more than 300 chars, warn the user
      if ($scope.subject.length > 300) {
        $scope.message = 'Offer cannot have more than 300 characters.';
        $scope.messageShow = true;
        return false;
      }

      $scope.saveOffer();

    };



  });