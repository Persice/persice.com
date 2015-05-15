'use strict';

angular.module('icebrak')
    .controller('AppCtrl', function($rootScope, APP_ID, USER_PHOTO_SMALL, $http, LocationFactory, $geolocation, ezfb, $scope, USER_ID, FilterRepository, USER_FIRSTNAME, USER_PHOTO, $timeout, $state, $window, myIoSocket, $filter, $log, notify, $resource, $cookies, InboxRepository) {
        $rootScope.hideTopMenu = false;

        $rootScope.orderBy = 'Match score';

        $scope.checkLogin = function() {
            ezfb.getLoginStatus()
                .then(function(res) {
                    $rootScope.fbAuth = res.authResponse;
                    ezfb.api('/me', function(res) {
                        $rootScope.apiMe = res;
                    });
                });
        };

        $scope.checkLogin();



        //gelocation

        $scope.$geolocation = $geolocation;

        $geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 2
        }).then(function(location) {
            $scope.location = location;
            $scope.saveLocation($scope.location.coords);
        });

        $scope.saveLocation = function(position) {
            LocationFactory.query({
                format: 'json'
            }).$promise.then(function(data) {
                var newLocation = {
                    user: '/api/v1/auth/user/' + USER_ID + '/',
                    position: position.latitude + ',' + position.longitude,
                    speed: position.speed,
                    heading: position.heading,
                    altitude: position.altitude,
                    altitude_accuracy: position.altitudeAccuracy
                };


                if (data.meta.total_count > 0) {
                    //update existing location
                    $scope.serverLocation = data.objects[0];

                    LocationFactory.update({
                            locationId: $scope.serverLocation.id
                        }, newLocation,
                        function(success) {
                            $log.info('New location updated.');
                        },
                        function(error) {
                            $log.error('Error updating location.');
                            $log.error(error);
                        });

                } else {
                    //create new location
                    LocationFactory.save({}, newLocation,
                        function(success) {
                            $log.info('New location created.');
                        },
                        function(error) {
                            $log.error('Error creating location.');
                            $log.error(error);
                        });

                }

            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                $log.error(message);


            });
        };



        $rootScope.userImg = USER_PHOTO_SMALL;
        $rootScope.userName = USER_FIRSTNAME;

        $cookies.userid = USER_ID;

        FilterRepository.getFilters();

        $rootScope.$on('triggerRefreshFilters', function() {
            FilterRepository.getFilters();
        });



        $rootScope.goBack = function() {
            $rootScope.hideTopMenu = false;
            $rootScope.showfullprofile = false;
            $('.horizontal.top.sidebar')
                .sidebar('hide');
        };


        $scope.cancelMatch = function() {
            $('.dimmable').dimmer('hide');
            $rootScope.hideTopMenu = false;
            $rootScope.showfullprofile = false;
            $('.horizontal.top.sidebar')
                .sidebar('hide');
            $rootScope.$broadcast('cancelMatchEvent');
        };

        $scope.confirmMatch = function() {
            $('.dimmable').dimmer('hide');
            $rootScope.hideTopMenu = false;
            $rootScope.showfullprofile = false;
            $('.horizontal.top.sidebar')
                .sidebar('hide');
            $rootScope.$broadcast('confirmMatchEvent');
        };

        $rootScope.$on('triggerRefreshMatchfeed', function() {
            $rootScope.showfullprofile = false;
            $rootScope.hideTopMenu = true;
            $scope.refreshMatchFeed();
        });

        $scope.refreshMatchFeed = function() {
            $('.dimmable').dimmer('hide');
            $rootScope.$broadcast('refreshMatchFeed');
        };

        InboxRepository.getInboxMessages();
        $rootScope.notifications = [];
        $rootScope.messages = [];
        //web socket for messages
        $scope.$on('socket:message', function(ev, data) {



            if ($rootScope.isState('conversations')) {
                $rootScope.$broadcast('receivedMessage', data);
            } else {

                InboxRepository.getInboxMessages();

                var jsonData = JSON.parse(data);
                var message = $filter('words')(jsonData.body, 10);
                var localTime = $filter('amDateFormat')(jsonData.sent_at, 'h:mm a');

                var Sender = $resource(jsonData.sender);
                Sender.get().$promise.then(function(data) {

                    $scope.gotoConversation = function() {
                        $state.go('conversations', {
                            userId: data.id
                        });
                    };

                    var notification = '<div class="notify-info-header"><a href="" ng-click="gotoConversation()">Received new message from ' + data.first_name + '<br>' + localTime + ' </a></div>' +
                        '<p><a href="" ng-click="gotoConversation()">' + message + '</a></p>';

                    notify({
                        messageTemplate: notification,
                        scope: $scope,
                        classes: 'notify-info',
                        icon: 'wechat'
                    });


                });

            }



        });



    });