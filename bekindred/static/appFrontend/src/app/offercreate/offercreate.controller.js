'use strict';

angular.module('persice')
    .controller('OfferCreateCtrl', function($scope, $http, $rootScope, APP_ID, $state, $log, OffersFactory, SubjectsFactory, USER_ID, $filter) {
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

                    //post event to facebook analytics
                    var url = 'https://graph.facebook.com/v2.3/' + APP_ID + '/activities?access_token=' + $rootScope.fbAuth.accessToken;
                    var timestamp = Math.round(+new Date() / 1000);
                    var activity = {
                        'event': 'CUSTOM_APP_EVENTS',
                        'application_tracking_enabled': 1,
                        'advertiser_tracking_enabled': 0,
                        'custom_events': [{
                            '_eventName': 'Onboarding flow user created offer',
                            '_appVersion': '0.0.1',
                            '_logTime': timestamp,
                            'fb_content_type': 'Onboarding flow',
          }]
                    };
                    $http.post(url, activity).
                    success(function(data, status, headers, config) {
                        $log.info('FB activity post success');
                    }).
                    error(function(data, status, headers, config) {
                        $log.error('FB activity post failure');
                    });

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