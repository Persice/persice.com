'use strict';

angular.module('beKindred')
.controller('AppCtrl', function ($rootScope, $scope, USER_ID, $timeout, $window, myIoSocket, $filter, $log, toaster, $resource, $cookies) {
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
        var jsonData = JSON.parse(data);

        $log.info('new message');

        var localDate = $filter('amDateFormat')(jsonData.sent_at, 'dddd, MMMM D, YYYY');
        var localDatePlain = $filter('amDateFormat')(jsonData.sent_at, 'L');

        var messageIndex = $filter('getIndexByProperty')('date', localDate, $rootScope.messages);

        if (messageIndex === null) {
            $rootScope.messages.push({date: localDate, realDate: localDatePlain, contents: [] });
            messageIndex = $rootScope.messages.length - 1;
        }



        $rootScope.messages[messageIndex].contents.push({
            body: jsonData.body,
            sender: jsonData.sender,
            recipient: jsonData.recipient,
            date: localDatePlain,
            sent_at: jsonData.sent_at,
            left: false
        });

        $rootScope.notifications.push({
            body: jsonData.body,
            sender: jsonData.sender,
            recipient: jsonData.recipient,
            date: localDatePlain,
            sent_at: jsonData.sent_at
        });

        $rootScope.messages[messageIndex].contents = $filter('orderBy')($rootScope.messages[messageIndex].contents, 'sent_at', true);
        $rootScope.messages = $filter('orderBy')($rootScope.messages, 'realDate');

        if ($rootScope.isState('conversations')) {
            $timeout(function() {
                var height = angular.element('.conversation-content')[0].scrollHeight;
                angular.element('.conversation-content').animate({
                    scrollTop: height
                }, 1500);
            }, 100);
        }
        else {
            var Sender = $resource(jsonData.sender);
            Sender.get().$promise.then(function(data) {
                toaster.pop('info', 'Notification', 'You have a new message from ' + data.first_name);
            });

            if ($rootScope.isState('inbox')) {
                $rootScope.$broadcast('refreshInbox');
            }

        }

    });





});
