'use strict';

angular.module('beKindred')
.controller('AppCtrl', function ($rootScope, $scope, USER_ID, $timeout, $state, $window, myIoSocket, $filter, $log, notify, $resource, $cookies) {
    $rootScope.hideTopMenu = false;

    $cookies.userid = USER_ID;

    $rootScope.goBack = function() {
        $rootScope.hideTopMenu = false;
        $rootScope.showfullprofile = false;
        $('.horizontal.top.sidebar')
        .sidebar('hide')
        ;
    };


    $scope.cancelMatch = function () {
        $('.dimmable').dimmer('hide');
        $rootScope.hideTopMenu = false;
        $rootScope.showfullprofile = false;
        $('.horizontal.top.sidebar')
        .sidebar('hide');
        $rootScope.$broadcast('cancelMatchEvent');
    };

    $scope.confirmMatch = function () {
        $('.dimmable').dimmer('hide');
        $rootScope.hideTopMenu = false;
        $rootScope.showfullprofile = false;
        $('.horizontal.top.sidebar')
        .sidebar('hide');
        $rootScope.$broadcast('confirmMatchEvent');
    };


    $scope.refreshMatchFeed = function () {
        $('.dimmable').dimmer('hide');
        $rootScope.$broadcast('refreshMatchFeed');
    };


    $rootScope.notifications = [];
    $rootScope.messages = [];
    //web socket for messages
    $scope.$on('socket:message', function (ev, data) {

        if ($rootScope.isState('conversations')) {
            $rootScope.$broadcast('receivedMessage', data);
        }

        else {


            var jsonData = JSON.parse(data);
            var message = $filter('words')(jsonData.body, 10 );
            var localTime = $filter('amDateFormat')(jsonData.sent_at, 'h:mm a');

            var Sender = $resource(jsonData.sender);
            Sender.get().$promise.then(function(data) {


                if ($rootScope.isState('inbox')) {
                    $rootScope.$broadcast('refreshInbox');
                }

                $scope.gotoConversation = function() {
                    $state.go('conversations', {userId: data.id} );
                };

                var notification = '<div class="notify-info-header"><a href="" ng-click="gotoConversation()">Received new message from ' + data.first_name + '<br>' + localTime + ' </a></div>' +
                '<p><a href="" ng-click="gotoConversation()">' + message + '</a></p>';

                notify({
                    messageTemplate: notification,
                    scope: $scope,
                    classes: 'notify-info'
                });


            });

        }







    });





});
