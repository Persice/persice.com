'use strict';

angular.module('beKindred')
.controller('OfferCreateCtrl', function ($scope, $state, $log, OffersFactory, SubjectsFactory, USER_ID, $filter) {
    $scope.subject = '';
    $scope.resourceUri = null;
    $scope.messageShow = false;
    $scope.message = '';

    $scope.userUri = '/api/v1/auth/user/' + USER_ID + '/';

    $scope.inputChanged = function (str) {
        $scope.subject = str;
    };

    $scope.selectResult = function (object) {
        if (object !== undefined) {
            $scope.subject = object.originalObject.description;
            $scope.resourceUri = object.originalObject.resource_uri;
        }
        else {
            $scope.resourceUri = null;
        }

    };


    $scope.saveOffer = function() {
        var newOffer = {
            offer: $scope.resourceUri,
            user: $scope.userUri
        };

        OffersFactory.save({}, newOffer,
            function(success){

                $state.go('matchfeed');

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

        //check if subject already exists
        if ($scope.resourceUri !== null) {

            $scope.saveOffer();

        }
        else {

            SubjectsFactory.query({format: 'json', description: $scope.subject}).$promise.then(function(data) {


                if (data.meta.total_count === 0) {
                    //create new subject
                    var newSubject = {
                        description: $scope.subject,
                    };

                    SubjectsFactory.save({}, newSubject,
                        function(success){
                            $scope.resourceUri = success.resource_uri;
                            $scope.saveOffer();

                        },
                        function(error) {
                            $scope.message = 'You have already created this offer.';
                            $scope.messageShow = true;
                        });
                }
                else {

                    $scope.resourceUri = data.objects[0].resource_uri;
                    $scope.saveOffer();
                }

            });

        }

    };




});
