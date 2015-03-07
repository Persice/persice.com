'use strict';

angular.module('beKindred', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngResource',
    'ui.router',
    'angular-spinkit',
    'frontend.semantic.dimmer',
    'truncate',
    'ya.nouislider',
    'ngDraggable',
    'angucomplete-alt',
    'angular-carousel',
    'cgNotify',
    'ngImgCrop',
    'angularMoment',
    'btford.socket-io',
    'zInfiniteScroll',
    'infinite-scroll'
  ])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider, $resourceProvider) {

    $httpProvider.defaults.headers.patch = {
      'Content-Type': 'application/json;charset=utf-8'
    };

    $resourceProvider.defaults.stripTrailingSlashes = false;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post = {
      'Content-Type': 'application/json;charset=utf-8'
    };

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        data: {
          displayName: 'Kindred',
        },
        resolve: {

        }
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsCtrl',
        data: {
          displayName: 'Settings',
        },
        resolve: {

        }
      })
      .state('conversations', {
        url: '/conversation/:userId',
        data: {
          displayName: 'Conversations',
        },
        resolve: {
          userId: ['$stateParams', function($stateParams) {
            return $stateParams.userId;
          }],
          UsersFactory: 'UsersFactory',
          FRIEND: function(UsersFactory, $stateParams) {
            var userId = $stateParams.userId;
            return UsersFactory.get({
              userId: userId,
              format: 'json'
            }).$promise;
          },
          ConnectionsFactory: 'ConnectionsFactory',
          Connection: function(ConnectionsFactory, $stateParams) {
            var userId = $stateParams.userId;
            return ConnectionsFactory.query({
              friend: userId,
              format: 'json'
            }).$promise;
          }

        },
        templateUrl: 'app/conversations/conversations.html',
        controller: 'ConversationsCtrl'
      })
      .state('goalcreate', {
        url: '/create-goal',
        data: {
          displayName: 'Create a goal',
        },
        templateUrl: 'app/goalcreate/goalcreate.html',
        controller: 'GoalCreateCtrl'
      })
      .state('finalstep', {
        url: '/final-step',
        data: {
          displayName: 'Final Step',
        },
        templateUrl: 'app/finalstep/finalstep.html',
        controller: 'FinalStepController',
        controllerAs: 'finalstep'
      })
      .state('selectinterests', {
        url: '/select-interests',
        data: {
          displayName: 'What interests you?',
        },
        templateUrl: 'app/interests/interests.html',
        controller: 'InterestsController',
        controllerAs: 'interest'
      })
      .state('offercreate', {
        url: '/create-offer',
        data: {
          displayName: 'Post an offer',
        },
        templateUrl: 'app/offercreate/offercreate.html',
        controller: 'OfferCreateCtrl'
      })
      .state('matchfeed', {
        url: '/match-feed',
        data: {
          displayName: 'Match Feed',
        },
        templateUrl: 'app/matchfeed/matchfeed.html',
        controller: 'MatchFeedCtrl'
      })
      .state('myconnections', {
        url: '/my-connections',
        data: {
          displayName: 'Connections',
        },
        templateUrl: 'app/myconnections/myconnections.html',
        controller: 'MyConnectionsCtrl'
      })
      .state('friendprofile', {
        url: '/friend-profile/:userId',
        data: {
          displayName: 'Connection',
        },
        resolve: {
          userId: ['$stateParams', function($stateParams) {
            return $stateParams.userId;
          }],
          ProfileFactory: 'ProfileFactory',
          ConnectionsFactory: 'ConnectionsFactory',
          User: function(ProfileFactory, $stateParams) {
            var usrId = $stateParams.userId;
            return ProfileFactory.get({
              user_id: usrId,
              format: 'json'
            }).$promise;
          },
          Connection: function(ConnectionsFactory, $stateParams) {
            var usrId = $stateParams.userId;
            return ConnectionsFactory.query({
              friend: usrId,
              format: 'json'
            }).$promise;
          }
        },
        templateUrl: 'app/friendprofile/friendprofile.html',
        controller: 'FriendProfileCtrl'
      })
      .state('myprofile', {
        url: '/my-profile',
        data: {
          displayName: 'Profile',
        },
        templateUrl: 'app/myprofile/myprofile.html',
        controller: 'MyProfileCtrl'
      })
      .state('editmyprofile', {
        url: '/my-profile/edit',
        data: {
          displayName: 'Edit profile',
        },
        templateUrl: 'app/editmyprofile/editmyprofile.html',
        controller: 'EditMyProfileCtrl'
      })
      .state('inbox', {
        url: '/messages',
        data: {
          displayName: 'Messages',
        },
        templateUrl: 'app/inbox/inbox.html',
        controller: 'InboxCtrl'
      });



    $urlRouterProvider.otherwise('/');

  })
  .run(function($rootScope, $state, $stateParams, $timeout) {

    $rootScope.$state = $state;

    $rootScope.isState = function(states) {
      return $state.includes(states);
    };

    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function(event, next) {
      if ($('.sidebar').sidebar('is visible')) $('.sidebar').sidebar('hide');
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

    });


    $rootScope.$on('$stateChangeError', function(event) {});



  })
  .value('noUiSliderConfig', {
    step: 1
  })
  .directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind('keydown keypress', function(event) {
        if (event.which === 13) {
          scope.$apply(function() {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  })
  .directive('updateTitle', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    return {
      link: function(scope, element) {

        var listener = function(event, toState, toParams, fromState, fromParams) {
          var title = 'Kinred';
          if (toState.data && toState.data.displayName) title = toState.data.displayName;
          $timeout(function() {
            element.text(title);
          });
        };

        $rootScope.$on('$stateChangeSuccess', listener);
      }
    };
  }])
  .directive('endRepeat', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function() {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    }
  })
  .directive('endRepeatPhotos', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function() {
            scope.$emit('ngRepeatFinishedPhotos');
          });
        }
      }
    }
  })
  .filter('getByProperty', function() {
    return function(propertyName, propertyValue, collection) {
      var i = 0,
        len = collection.length;
      for (; i < len; i++) {
        if (collection[i][propertyName] === propertyValue) {
          return collection[i];
        }
      }
      return null;
    };
  })
  .filter('lastMessage', function() {
    return function(property) {
      if (property === null) {
        return 'No messages.';
      } else {
        return property;
      }
    };
  })
  .filter('getIndexByProperty', function() {
    return function(propertyName, propertyValue, collection) {
      var i = 0,
        len = collection.length;
      for (; i < len; i++) {
        if (collection[i][propertyName] === propertyValue) {
          return i;
        }
      }
      return null;
    };
  })
  .filter('getByPropertyExcept', function() {
    return function(propertyName, propertyValue, propertyExceptName, propertyExceptValue, collection) {
      var i = 0,
        len = collection.length;
      for (; i < len; i++) {
        if (collection[i][propertyName] === propertyValue && collection[i][propertyExceptName] !== propertyExceptValue) {
          return collection[i];
        }
      }
      return null;
    };
  })
  .directive('modal', function() {
    return {
      restrict: "E",
      replace: true,
      transclude: true,
      scope: {
        model: '=ngModel'
      },
      template: "<div class=\"ui dimmer modals page transition\" style=\"position: absolute;\" ng-class=\"{ 'active visible': model }\">" +
        "<div class=\"ui long test modal transition scrolling\" style=\"top: 150px;\" ng-class=\"{ 'active visible': model }\" ng-transclude>" +
        "</div>" +
        "</div>",
      link: function(scope, element, attrs) {

      }
    };
  })
  .directive('ngChangeOnBlur', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attrs, ngModelCtrl) {
        if (attrs.type === 'radio' || attrs.type === 'checkbox')
          return;

        var expressionToCall = attrs.ngChangeOnBlur;

        var oldValue = null;
        elm.bind('focus', function() {
          scope.$apply(function() {
            oldValue = elm.val();
          });
        });
        elm.bind('blur', function() {
          scope.$apply(function() {
            var newValue = elm.val();
            if (newValue !== oldValue) {
              scope.$eval(expressionToCall);
            }
          });
        });
      }
    };
  })
  .factory('myIoSocket', function(socketFactory) {
    var myIoSocket = io.connect('//' + window.location.hostname + ':3000');


    myIoSocket = socketFactory({
      ioSocket: myIoSocket
    });
    myIoSocket.forward('message');
    myIoSocket.forward('error');

    return myIoSocket;
  });