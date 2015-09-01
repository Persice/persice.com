'use strict';

angular.module('persice')
    .controller('AppCtrl', function($rootScope, APP_ID, USER_PHOTO_SMALL, NotificationsRepository, FilterRepository, $http, LocationFactory, $geolocation, ezfb, $scope, USER_ID, USER_FIRSTNAME, USER_PHOTO, $timeout, $state, $window, myIoSocket, $filter, $log, notify, $resource, $cookies, InboxRepository, moment, angularMomentConfig) {
        $rootScope.hideTopMenu = false;

        $rootScope.distance_unit = 'miles';
        $rootScope.eventChatModal = false;

        FilterRepository.getFilters().then(function(data) {
            $rootScope.distance_unit = data.distance_unit;

        }, function(error) {

        });

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


        //initiallcheck if we have new notifications for new connections or we have received new messages in inbox
        NotificationsRepository.refreshTotalInbox();
        NotificationsRepository.refreshTotalConnections();

        //gelocation
        $geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 250
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
                        function(success) {},
                        function(error) {
                            $log.error(error);
                        });

                } else {
                    //create new location
                    LocationFactory.save({}, newLocation,
                        function(success) {},
                        function(error) {
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


        $rootScope.viewEventsFeedMap = function() {
            if ($state.is('events.myevents.list')) {
                $state.go('events.myevents.map');
            }
            if ($state.is('events.mynetwork.list')) {
                $state.go('events.mynetwork.map');
            }
            if ($state.is('events.allevents.list')) {
                $state.go('events.allevents.map');
            }
        };


        $rootScope.goBack = function() {
            $rootScope.hideTopMenu = false;
            $('.horizontal.top.sidebar')
                .sidebar('hide');
            $rootScope.$broadcast('showFullProfile');
        };


        $scope.cancelMatch = function() {
            $('.dimmable').dimmer('hide');
            $rootScope.hideTopMenu = false;
            $('.horizontal.top.sidebar')
                .sidebar('hide');
            $rootScope.$broadcast('cancelMatchEvent');
        };

        $scope.confirmMatch = function() {
            $('.dimmable').dimmer('hide');
            $rootScope.hideTopMenu = false;
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

            var jsonData = JSON.parse(data);


            //event deleted notification
            if (jsonData.type === 'event_deleted.' + USER_ID) {
                var jsonDataEventDeleted = JSON.parse(jsonData.message);
                var dateEventStartsOn = moment.utc(jsonDataEventDeleted.event_start_date).local().format('dddd, MMMM D, YYYY H:mm A ');
                dateEventStartsOn += moment.tz(angularMomentConfig.timezone).format('z');

                var messageEventDeleted = 'The event ' + jsonDataEventDeleted.event_name + ' on ' + dateEventStartsOn + ' has been cancelled by ' + jsonDataEventDeleted.event_organizer_name + ', the event host. <br>We apologize for any inconvenience. (This is an automated message.)';

                var localTime = $filter('amDateFormat')(Date.now(), 'h:mm a');

                var newEventDeletedNotificationTemplate = '<div class="notify-info-header">Event is cancelled <br>' + localTime + ' </div>' + '<p>' + messageEventDeleted + '</p>';

                notify({
                    messageTemplate: newEventDeletedNotificationTemplate,
                    scope: $scope,
                    classes: 'notify-info',
                    icon: 'calendar',
                    duration: 8000
                });

            }

            //new connection notification
            if (jsonData.type === 'connection.' + USER_ID) {
                var jsonDataConnection = JSON.parse(data);
                var connectionData = JSON.parse(jsonDataConnection.message);
                var localTime = $filter('amDateFormat')(Date.now(), 'h:mm a');

                var me = '/api/v1/auth/user/' + USER_ID + '/';

                if (me === connectionData.friend1) {
                    var MyNewFriend = $resource(connectionData.friend2);
                }

                if (me === connectionData.friend2) {
                    var MyNewFriend = $resource(connectionData.friend1);
                }

                MyNewFriend.get().$promise.then(function(data) {

                    //refresh notification state for new connections
                    NotificationsRepository.refreshTotalConnections();

                    var newFriendNotificationTemplate = '<div class="notify-info-header"><a ui-sref="myconnections">New connection<br>' + localTime + ' </a></div>' +
                        '<p><a ui-sref="myconnections">You and ' + data.first_name + ' are now friends.</a></p>';

                    notify({
                        messageTemplate: newFriendNotificationTemplate,
                        scope: $scope,
                        classes: 'notify-info',
                        icon: 'user',
                        duration: 4000
                    });

                });
            }

            //new message notification
            if (jsonData.type === 'message.' + USER_ID) {

                if ($rootScope.isState('conversations')) {
                    $rootScope.$broadcast('receivedMessage', jsonData.message);
                } else {

                    //refresh counter of new messages
                    InboxRepository.getInboxMessages();

                    //refresh notification state
                    NotificationsRepository.refreshTotalInbox();

                    var jsonData = JSON.parse(data);
                    var contentData = JSON.parse(jsonData.message);
                    var message = $filter('words')(contentData.body, 10);
                    var localTime = $filter('amDateFormat')(contentData.sent_at, 'h:mm a');

                    var Sender = $resource(contentData.sender);
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
                            icon: 'wechat',
                            duration: 4000
                        });


                    });

                }

            }

            //new event chat message notification
            if (jsonData.type === 'chat_message.' + USER_ID) {
                $log.info($rootScope.eventChatModal);
                if ($rootScope.isState('event.chat') || $rootScope.eventChatModal) {
                    $rootScope.$broadcast('receivedEventChatMessage', jsonData.message);
                } else {

                    var jsonData = JSON.parse(data);
                    var contentData = JSON.parse(jsonData.message);
                    var message = $filter('words')(contentData.body, 10);
                    var localTime = $filter('amDateFormat')(contentData.sent_at, 'h:mm a');

                    var Sender = $resource(contentData.sender);
                    Sender.get().$promise.then(function(data) {

                        $scope.gotoEventChatMessage = function() {
                            $state.go('event.chat', {
                                eventId: contentData.event_id
                            });
                        };

                        var notification = '<div class="notify-info-header"><a href="" ng-click="gotoEventChatMessage()">Received new event chat message from ' + data.first_name + '<br>' + localTime + ' </a></div>' +
                            '<p><a href="" ng-click="gotoEventChatMessage">' + message + '</a></p>';

                        notify({
                            messageTemplate: notification,
                            scope: $scope,
                            classes: 'notify-info',
                            icon: 'wechat',
                            duration: 4000
                        });


                    });

                }

            }



        });



    });
