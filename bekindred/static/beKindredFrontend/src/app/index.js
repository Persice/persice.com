'use strict';

angular.module('icebrak', [
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
  'cgNotify',
  'ngImgCrop',
  'angularMoment',
  'btford.socket-io',
  'ngLodash',
  'hj.gsapifyRouter',
  'angular-flexslider',
  'ngGeolocation',
  'ezfb'
  ])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider, $resourceProvider, gsapifyRouterProvider, ezfbProvider) {


    ezfbProvider.setInitParams({
      appId: '634990373263225',
      version: 'v2.3',
      status: true,
      xfbml: true
    });

    $httpProvider.defaults.headers.patch = {
      'Content-Type': 'application/json;charset=utf-8'
    };

    $resourceProvider.defaults.stripTrailingSlashes = false;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post = {
      'Content-Type': 'application/json;charset=utf-8'
    };


    // Set default transitions to use if unspecified
    gsapifyRouterProvider.defaults = {

      // name of transition to use or 'none'
      enter: 'fadeIn',

      leave: 'fadeOut'

    };


    gsapifyRouterProvider.transition('slideAbove', {
      duration: 1,
      ease: 'Quart.easeInOut',
      css: {
        y: '-100%'
      }
    });

    gsapifyRouterProvider.transition('slideBelow', {
      duration: 1,
      ease: 'Quart.easeInOut',
      css: {
        y: '100%'
      }
    });

    gsapifyRouterProvider.transition('slideLeft', {
      duration: 1,
      ease: 'Quint.easeInOut',
      css: {
        x: '-100%'
      }
    });

    gsapifyRouterProvider.transition('slideRight', {
      duration: 1,
      ease: 'Quint.easeInOut',
      delay: 0.5,
      css: {
        x: '100%'
      }
    });

    gsapifyRouterProvider.transition('fadeIn', {
      duration: 0.5,
      delay: 0.2,
      css: {
        opacity: 0,
      }
    });

    gsapifyRouterProvider.transition('fadeOut', {
      duration: 0.2,
      css: {
        opacity: 0,
      }
    });

    gsapifyRouterProvider.transition('scaleDown', {
      duration: 0.5,
      css: {
        scale: 0,
        opacity: 0
      }
    });

    // Optionally enable transition on initial load
    gsapifyRouterProvider.initialTransitionEnabled = true; // defaults to false

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        data: {
          displayName: 'icebr&#257;k',
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
        resolve: {
          UsersFactory: 'UsersFactory',
          User: function(UsersFactory, USER_ID) {
            var userId = USER_ID;
            return UsersFactory.get({
              userId: userId,
              format: 'json'
            }).$promise;
          },
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
      .state('bigmatchfeed', {
        url: '/big-match-feed',
        data: {
          displayName: 'Match Feed',
        },
        templateUrl: 'app/bigmatchfeed/bigmatchfeed.html',
        controller: 'BigMatchFeedCtrl'
      })
      .state('myconnections', {
        url: '/my-connections',
        data: {
          displayName: 'Connections',
        },
        templateUrl: 'app/myconnections/myconnections.html',
        controller: 'MyConnectionsController',
        controllerAs: 'myconnections'
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
          UsersFactory: 'UsersFactory',
          User: function(ProfileFactory, $stateParams) {
            var usrId = $stateParams.userId;
            return ProfileFactory.get({
              user_id: usrId,
              format: 'json'
            }).$promise;
          },
          UserProfile: function(UsersFactory, $stateParams) {
            return UsersFactory.query({
              userId: $stateParams.userId,
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
        controller: 'FriendProfileController',
        controllerAs: 'friendprofile'
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
        controller: 'InboxController',
        controllerAs: 'inbox'
      });



    $urlRouterProvider.otherwise('/');

  })
  .run(function($rootScope, $state, $stateParams, $timeout, ezfb) {

    $rootScope.$state = $state;

    $rootScope.isState = function(states) {
      return $state.includes(states);
    };



    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function(event, next) {
      if ($('.sidebar').sidebar('is visible')) $('.sidebar').sidebar('hide');
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;

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
          var title = 'icebr&#257;k';
          if (toState.data && toState.data.displayName) {
            title = toState.data.displayName;
          }
          $timeout(function() {
            element.html(title);
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
  })
  .directive('whenScrollEnds', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var visibleHeight = element.height();
        var threshold = 100;

        element.scroll(function() {
          var scrollableHeight = element.prop('scrollHeight');
          var hiddenContentHeight = scrollableHeight - visibleHeight;

          if (hiddenContentHeight - element.scrollTop() <= threshold) {
            scope.$apply(attrs.whenScrollEnds);
          }
        });
      }
    };
  })
  .directive('whenScrolled', function($timeout) {
    return function(scope, elm, attr) {
      var raw = elm[0];

      elm.bind('scroll', function() {
        if (raw.scrollTop <= 100) {
          var sh = raw.scrollHeight;
          scope.$apply(attr.whenScrolled).then(function() {
            $timeout(function() {
              raw.scrollTop = raw.scrollHeight - sh;
            });
          });
        }
      });
    };
  })
  .directive('scrollBottomOn', function($timeout) {
    return function(scope, elm, attr) {
      scope.$watch(attr.scrollBottomOn, function(value) {
        if (value) {
          $timeout(function() {
            elm[0].scrollTop = elm[0].scrollHeight;
          });
        }
      });
    };
  })

.directive('uicheckbox', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    require: 'ngModel',
    scope: {
      type: '@',
      value: '@',
      size: '@',
      checked: '@',
      change: '&',
      model: '=ngModel'
    },
    template: "<div class=\"{{checkbox_class}}\">" +
      "<input type=\"checkbox\">" +
      "<label ng-click=\"click_on_checkbox()\" ng-transclude></label>" +
      "</div>",
    link: function(scope, element, attrs) {

      //
      // set up checkbox class and type
      //
      if (scope.type === 'standard' || scope.type === undefined) {
        scope.type = 'standard';
        scope.checkbox_class = 'ui checkbox';
      } else if (scope.type === 'slider') {
        scope.type = 'slider';
        scope.checkbox_class = 'ui slider checkbox';
      } else if (scope.type === 'toggle') {
        scope.type = 'toggle';
        scope.checkbox_class = 'ui toggle checkbox';
      } else {
        scope.type = 'standard';
        scope.checkbox_class = 'ui checkbox';
      }

      //
      // set checkbox size
      //
      if (scope.size === 'large') {
        scope.checkbox_class = scope.checkbox_class + ' large';
      } else if (scope.size === 'huge') {
        scope.checkbox_class = scope.checkbox_class + ' huge';
      }

      //
      // set checked/unchecked
      //
      if (scope.checked === 'false' || scope.checked === undefined) {
        scope.checked = false;
      } else {
        scope.checked = true;
        element.children()[0].setAttribute('checked', '');
      }

      //
      // Click handler
      //
      element.bind('click', function() {
        scope.$apply(function() {
          if (scope.checked === true) {
            scope.checked = true;
            scope.model = false;
            element.children()[0].removeAttribute('checked');


          } else {
            scope.checked = true;
            scope.model = true;
            element.children()[0].setAttribute('checked', 'true');

          }
        });
      });

      //
      // Watch for ng-model
      //
      scope.$watch('model', function(val) {
        if (val === undefined) {
          return;
        }

        if (val === true) {
          scope.checked = true;
          element.children()[0].setAttribute('checked', 'true');
          scope.change({
            value: scope.value,
            checked: scope.checked
          });


        } else {
          scope.checked = false;
          element.children()[0].removeAttribute('checked');
          scope.change({
            value: scope.value,
            checked: scope.checked
          });
        }
      });


    }
  };
});