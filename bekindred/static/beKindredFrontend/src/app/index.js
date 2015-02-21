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
    'zInfiniteScroll'
    ])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $resourceProvider) {

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
        resolve: {

        }
    })
    .state('settings', {
        url: '/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {

        }
    })
    .state('conversations', {
        url: '/conversation/:userId',
        resolve: {
            userId: ['$stateParams', function($stateParams){
                return $stateParams.userId;
            }],
            UsersFactory: 'UsersFactory',
            FRIEND: function(UsersFactory, $stateParams){
                var userId = $stateParams.userId;
                return UsersFactory.get({userId: userId, format: 'json'}).$promise;
            }

        },
        templateUrl: 'app/conversations/conversations.html',
        controller: 'ConversationsCtrl'
    })
    .state('goalcreate', {
        url: '/create-goal',
        templateUrl: 'app/goalcreate/goalcreate.html',
        controller: 'GoalCreateCtrl'
    })
    .state('offercreate', {
        url: '/create-offer',
        templateUrl: 'app/offercreate/offercreate.html',
        controller: 'OfferCreateCtrl'
    })
    .state('matchfeed', {
        url: '/match-feed',
        templateUrl: 'app/matchfeed/matchfeed.html',
        controller: 'MatchFeedCtrl'
    })
    .state('myconnections', {
        url: '/my-connections',
        templateUrl: 'app/myconnections/myconnections.html',
        controller: 'MyConnectionsCtrl'
    })
    .state('friendprofile', {
        url: '/friend-profile/:userId',
        resolve: {
            userId: ['$stateParams', function($stateParams){
                return $stateParams.userId;
            }],
            ProfileFactory: 'ProfileFactory',
            User: function(ProfileFactory, $stateParams){
                var usrId = $stateParams.userId;
                return ProfileFactory.get({user_id: usrId, format: 'json'}).$promise;
            }
        },
        templateUrl: 'app/friendprofile/friendprofile.html',
        controller: 'FriendProfileCtrl'
    })
    .state('myprofile', {
        url: '/my-profile',
        templateUrl: 'app/myprofile/myprofile.html',
        controller: 'MyProfileCtrl'
    })
    .state('editmyprofile', {
        url: '/my-profile/edit',
        templateUrl: 'app/editmyprofile/editmyprofile.html',
        controller: 'EditMyProfileCtrl'
    })
    .state('inbox', {
        url: '/inbox',
        templateUrl: 'app/inbox/inbox.html',
        controller: 'InboxCtrl'
    });



    $urlRouterProvider.otherwise('/');

})
.run(function ($rootScope, $state, $stateParams, $timeout) {

    $rootScope.$state = $state;

    $rootScope.isState = function(states){
        return $state.includes(states);
    };

    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function (event, next) {
        if ( $('.sidebar').sidebar('is visible')) $('.sidebar').sidebar('hide');
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

    });


    $rootScope.$on('$stateChangeError', function(event) {
    });






})
.value('noUiSliderConfig', {step: 1})
.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
      });

        event.preventDefault();
    }
});
};
})
.directive('endRepeat', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})
.directive('endRepeatPhotos', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinishedPhotos');
                });
            }
        }
    }
})
.filter('getByProperty', function() {
    return function(propertyName, propertyValue, collection) {
        var i=0, len=collection.length;
        for (; i<len; i++) {
            if (collection[i][propertyName] === propertyValue) {
                return collection[i];
            }
        }
        return null;
    };
})
.filter('getIndexByProperty', function() {
    return function(propertyName, propertyValue, collection) {
        var i=0, len=collection.length;
        for (; i<len; i++) {
            if (collection[i][propertyName] === propertyValue) {
                return i;
            }
        }
        return null;
    };
})
.filter('getByPropertyExcept', function() {
    return function(propertyName, propertyValue, propertyExceptName, propertyExceptValue, collection) {
        var i=0, len=collection.length;
        for (; i<len; i++) {
            if (collection[i][propertyName] === propertyValue && collection[i][propertyExceptName] !== propertyExceptValue) {
                return collection[i];
            }
        }
        return null;
    };
})
.directive('modal', function () {
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
        link: function (scope, element, attrs) {

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
            elm.bind('focus',function() {
                scope.$apply(function() {
                    oldValue = elm.val();
                });
            });
            elm.bind('blur', function() {
                scope.$apply(function() {
                    var newValue = elm.val();
                    if (newValue !== oldValue){
                        scope.$eval(expressionToCall);
                    }
                });
            });
        }
    };
})
.factory('myIoSocket', function (socketFactory) {
  var myIoSocket = io.connect('//' + window.location.hostname + ':3000');


  myIoSocket = socketFactory({
    ioSocket: myIoSocket
  });
  myIoSocket.forward('message');
  myIoSocket.forward('error');

  return myIoSocket;
});





