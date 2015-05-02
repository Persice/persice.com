'use strict';

angular.module('icebrak')
  .controller('AppCtrl', function($rootScope, LocationFactory, $geolocation, ezfb, $scope, USER_ID, FilterRepository, USER_FIRSTNAME, USER_PHOTO, $timeout, $state, $window, myIoSocket, $filter, $log, notify, $resource, $cookies, InboxRepository) {
    $rootScope.hideTopMenu = false;

    // ezfb.AppEvents.activateApp();

    // ezfb.AppEvents.logEvent(ezfb.AppEvents.EventNames.COMPLETED_REGISTRATION);



    //gelocation

    $scope.$geolocation = $geolocation;

    $geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 2
    }).then(function(location) {
      $scope.location = location;
      $log.info('New location:');
      $log.info($scope.location.coords);
      $scope.saveLocation($scope.location.coords);
    });

    $scope.saveLocation = function(position) {
      LocationFactory.query({
        format: 'json'
      }).$promise.then(function(data) {
        var newLocation = {
          user: '/api/v1/auth/user/' + USER_ID + '/',
          geometry: 'POINT (' + position.latitude + ' ' + position.longitude + ')',
          speed: position.speed,
          heading: position.heading,
          altitude: position.altitude,
          altitude_accuracy: position.altitudeAccuracy
        };

        $log.info(newLocation);

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

    // $geolocation.watchPosition({
    //   timeout: 60000,
    //   maximumAge: 250,
    //   enableHighAccuracy: true
    // });

    // $scope.$watch('myPosition.coords', function(newValue, oldValue) {

    // }, true);

    $rootScope.userImg = USER_PHOTO;
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