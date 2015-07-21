/*global angular*/

(function withAngular(angular) {
    'use strict';

    angular.module('frontend.ui.tooltips', [])
        .directive('tooltips', ['$window', '$compile', '$timeout', function manageDirective($window, $compile, $timeout) {

            var TOOLTIP_SMALL_MARGIN = 8 //px
                ,
                TOOLTIP_MEDIUM_MARGIN = 9 //px
                ,
                TOOLTIP_LARGE_MARGIN = 10 //px
                ,
                CSS_PREFIX = '_720kb-tooltip-';
            return {
                'restrict': 'A',
                'scope': {},
                'link': function linkingFunction($scope, element, attr) {

                    var initialized = false,
                        thisElement = angular.element(element[0]),
                        body = angular.element($window.document.getElementsByTagName('body')[0]),
                        theTooltip, theTooltipHeight, theTooltipWidth, theTooltipMargin //used both for margin top left right bottom
                        , height, width, offsetTop, timeout = attr.tooltipTimeout || 0,
                        offsetLeft, title = attr.tooltipTitle || attr.title || '',
                        content = attr.tooltipContent || '',
                        showTriggers = attr.tooltipShowTrigger || 'mouseover',
                        hideTriggers = attr.tooltipHideTrigger || 'mouseleave',
                        originSide = attr.tooltipSide || 'top',
                        side = originSide,
                        size = attr.tooltipSize || 'medium',
                        tryPosition = typeof attr.tooltipTry !== 'undefined' && attr.tooltipTry !== null ? $scope.$eval(attr.tooltipTry) : true,
                        className = attr.tooltipClass || '',
                        speed = (attr.tooltipSpeed || 'medium').toLowerCase(),
                        lazyMode = typeof attr.tooltipLazy !== 'undefined' && attr.tooltipLazy !== null ? $scope.$eval(attr.tooltipLazy) : true,
                        htmlTemplate =
                        '<div class="_720kb-tooltip ' + CSS_PREFIX + size + '">' +
                        '<div class="' + CSS_PREFIX + 'title"> ' + title + '</div>' +
                        content + ' <span class="' + CSS_PREFIX + 'caret"></span>' +
                        '</div>';

                    //parse the animation speed of tooltips
                    $scope.parseSpeed = function parseSpeed() {

                        switch (speed) {
                            case 'fast':
                                speed = 100;
                                break;
                            case 'medium':
                                speed = 450;
                                break;
                            case 'slow':
                                speed = 800;
                                break;
                            default:
                                speed = Number(speed);
                        }
                    };
                    //create the tooltip
                    theTooltip = $compile(htmlTemplate)($scope);

                    theTooltip.addClass(className);

                    body.append(theTooltip);

                    $scope.isTooltipEmpty = function checkEmptyTooltip() {

                        if (!title && !content) {

                            return true;
                        }
                    };

                    $scope.initTooltip = function initTooltip(tooltipSide) {

                        if (!$scope.isTooltipEmpty()) {

                            height = thisElement[0].offsetHeight;
                            width = thisElement[0].offsetWidth;
                            offsetTop = $scope.getRootOffsetTop(thisElement[0], 0);
                            offsetLeft = $scope.getRootOffsetLeft(thisElement[0], 0);
                            //get tooltip dimension
                            theTooltipHeight = theTooltip[0].offsetHeight;
                            theTooltipWidth = theTooltip[0].offsetWidth;

                            $scope.parseSpeed();
                            $scope.tooltipPositioning(tooltipSide);
                        }
                    };

                    $scope.getRootOffsetTop = function getRootOffsetTop(elem, val) {

                        if (elem.offsetParent === null) {

                            return val + elem.offsetTop;
                        }

                        return $scope.getRootOffsetTop(elem.offsetParent, val + elem.offsetTop);
                    };

                    $scope.getRootOffsetLeft = function getRootOffsetLeft(elem, val) {

                        if (elem.offsetParent === null) {

                            return val + elem.offsetLeft;
                        }

                        return $scope.getRootOffsetLeft(elem.offsetParent, val + elem.offsetLeft);
                    };

                    thisElement.bind(showTriggers, function onMouseEnterAndMouseOver() {

                        if (!lazyMode || !initialized) {

                            initialized = true;
                            $scope.initTooltip(side);
                        }
                        if (tryPosition) {

                            $scope.tooltipTryPosition();
                        }
                        $scope.showTooltip();
                    });

                    thisElement.bind(hideTriggers, function onMouseLeaveAndMouseOut() {

                        $scope.hideTooltip();
                    });

                    $scope.showTooltip = function showTooltip() {

                        theTooltip.addClass(CSS_PREFIX + 'open');
                        theTooltip.css('transition', 'opacity ' + speed + 'ms linear');
                        if (timeout > 0) {
                            $timeout(function() {

                                $scope.hideTooltip();

                            }, timeout);
                        }
                    };

                    $scope.hideTooltip = function hideTooltip() {

                        theTooltip.css('transition', 'opacity ' + speed);
                        theTooltip.removeClass(CSS_PREFIX + 'open');

                    };

                    $scope.removePosition = function removeTooltipPosition() {

                        theTooltip
                            .removeClass(CSS_PREFIX + 'left')
                            .removeClass(CSS_PREFIX + 'right')
                            .removeClass(CSS_PREFIX + 'top')
                            .removeClass(CSS_PREFIX + 'bottom ');
                    };

                    $scope.tooltipPositioning = function tooltipPositioning(tooltipSide) {

                        $scope.removePosition();

                        var topValue, leftValue;

                        if (size === 'small') {

                            theTooltipMargin = TOOLTIP_SMALL_MARGIN;

                        } else if (size === 'medium') {

                            theTooltipMargin = TOOLTIP_MEDIUM_MARGIN;

                        } else if (size === 'large') {

                            theTooltipMargin = TOOLTIP_LARGE_MARGIN;
                        }

                        if (tooltipSide === 'left') {

                            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
                            leftValue = offsetLeft - (theTooltipWidth + theTooltipMargin);

                            theTooltip.css('top', topValue + 'px');
                            theTooltip.css('left', leftValue + 'px');
                            theTooltip.addClass(CSS_PREFIX + 'left');
                        }

                        if (tooltipSide === 'right') {

                            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
                            leftValue = offsetLeft + width + theTooltipMargin;

                            theTooltip.css('top', topValue + 'px');
                            theTooltip.css('left', leftValue + 'px');
                            theTooltip.addClass(CSS_PREFIX + 'right');
                        }

                        if (tooltipSide === 'top') {

                            topValue = offsetTop - theTooltipMargin - theTooltipHeight;
                            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

                            theTooltip.css('top', topValue + 'px');
                            theTooltip.css('left', leftValue + 'px');
                            theTooltip.addClass(CSS_PREFIX + 'top');
                        }

                        if (tooltipSide === 'bottom') {

                            topValue = offsetTop + height + theTooltipMargin;
                            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;
                            theTooltip.css('top', topValue + 'px');
                            theTooltip.css('left', leftValue + 'px');
                            theTooltip.addClass(CSS_PREFIX + 'bottom');
                        }
                    };

                    $scope.tooltipTryPosition = function tooltipTryPosition() {


                        var theTooltipH = theTooltip[0].offsetHeight,
                            theTooltipW = theTooltip[0].offsetWidth,
                            topOffset = theTooltip[0].offsetTop,
                            leftOffset = theTooltip[0].offsetLeft,
                            winWidth = $window.outerWidth,
                            winHeight = $window.outerHeight,
                            rightOffset = winWidth - (theTooltipW + leftOffset),
                            bottomOffset = winHeight - (theTooltipH + topOffset)
                            //element OFFSETS (not tooltip offsets)
                            ,
                            elmHeight = thisElement[0].offsetHeight,
                            elmWidth = thisElement[0].offsetWidth,
                            elmOffsetLeft = thisElement[0].offsetLeft,
                            elmOffsetTop = thisElement[0].offsetTop,
                            elmOffsetRight = winWidth - (elmOffsetLeft + elmWidth),
                            elmOffsetBottom = winHeight - (elmHeight + elmOffsetTop),
                            offsets = {
                                'left': leftOffset,
                                'top': topOffset,
                                'bottom': bottomOffset,
                                'right': rightOffset
                            },
                            posix = {
                                'left': elmOffsetLeft,
                                'right': elmOffsetRight,
                                'top': elmOffsetTop,
                                'bottom': elmOffsetBottom
                            },
                            bestPosition = Object.keys(posix).reduce(function(best, key) {

                                return posix[best] > posix[key] ? best : key;
                            }),
                            worstOffset = Object.keys(offsets).reduce(function(worst, key) {

                                return offsets[worst] < offsets[key] ? worst : key;
                            });

                        if (offsets[worstOffset] < 5) {

                            side = bestPosition;

                            $scope.initTooltip(bestPosition);
                        }
                    };

                    angular.element($window).bind('resize', function onResize() {

                        $scope.hideTooltip();
                        $scope.initTooltip(originSide);
                    });
                }
            };
            }]);
}(angular));
'use strict';

angular
    .module('persice', [
        'ngAnimate',
        'ngCookies',
        'ngTouch',
        'ngSanitize',
        'ngResource',
        'ui.router',
        'angular-spinkit',
        'frontend.semantic.dimmer',
        'frontend.semantic.modal.event.create',
        'frontend.semantic.modal.event.view',
        'truncate',
        'ngDraggable',
        'cgNotify',
        'ngImgCrop',
        'angularMoment',
        'btford.socket-io',
        'ngLodash',
        'hj.gsapifyRouter',
        'angular-flexslider',
        'ngGeolocation',
        'ezfb',
        'frontend.ui.tooltips',
        'frontend.ui.autocomplete',
        'google.places',
        'ngMask',
        'rzModule'
    ])

.config(["$compileProvider", "$stateProvider", "$urlRouterProvider", "APP_ID", "$httpProvider", "$resourceProvider", "gsapifyRouterProvider", "ezfbProvider", function($compileProvider, $stateProvider, $urlRouterProvider, APP_ID, $httpProvider, $resourceProvider, gsapifyRouterProvider, ezfbProvider) {

        //disable debug in production, enable debug manually angular.reloadWithDebugInfo();
        // $compileProvider.debugInfoEnabled(false);

        ezfbProvider.setInitParams({
            appId: APP_ID,
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
                    displayName: 'persice',
                },
                resolve: {

                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'app/settings/settings.html',
                controller: 'SettingsController',
                controllerAs: 'settings',
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
                    FRIEND: ["UsersFactory", "$stateParams", function(UsersFactory, $stateParams) {
                        var userId = $stateParams.userId;
                        return UsersFactory.get({
                            userId: userId,
                            format: 'json'
                        }).$promise;
                    }],
                    ConnectionsFactory: 'ConnectionsFactory',
                    Connection: ["ConnectionsFactory", "$stateParams", function(ConnectionsFactory, $stateParams) {
                        var userId = $stateParams.userId;
                        return ConnectionsFactory.query({
                            friend: userId,
                            format: 'json'
                        }).$promise;
                    }]

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
                    User: ["UsersFactory", "USER_ID", function(UsersFactory, USER_ID) {
                        var userId = USER_ID;
                        return UsersFactory.get({
                            userId: userId,
                            format: 'json'
                        }).$promise;
                    }],
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
                url: '/crowd',
                data: {
                    displayName: 'Crowd',
                },
                templateUrl: 'app/matchfeed/matchfeed.html',
                controller: 'MatchFeedController',
                controllerAs: 'matchfeed'
            })
            .state('bigmatchfeed', {
                url: '/big-crowd',
                data: {
                    displayName: 'Crowd',
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
                    ConnectionsFactory: 'ConnectionsFactory',
                    UsersFactory: 'UsersFactory',
                    UserProfile: ["UsersFactory", "$stateParams", function(UsersFactory, $stateParams) {
                        return UsersFactory.query({
                            userId: $stateParams.userId,
                            format: 'json'
                        }).$promise;
                    }],
                    Connection: ["ConnectionsFactory", "$stateParams", function(ConnectionsFactory, $stateParams) {
                        var usrId = $stateParams.userId;
                        return ConnectionsFactory.query({
                            friend: usrId,
                            format: 'json'
                        }).$promise;
                    }]
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
                controller: 'MyProfileController',
                controllerAs: 'myprofile'
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
            })
            .state('events', {
                abstract: true,
                url: '/events',
                templateUrl: 'app/events/events_page.html',
                controller: 'EventsPageController',
                controllerAs: 'eventspage',
                resolve: {


                },
                data: {
                    displayName: '',
                }
            })
            .state('events.mynetwork', {
                url: '/my-network',
                templateUrl: 'app/events/events_mynetwork.html',
                data: {

                }
            })
            .state('events.myevents', {
                url: '/my-events',
                templateUrl: 'app/events/events_myevents.html',
                data: {

                }
            })
            .state('events.allevents', {
                url: '/all-events',
                templateUrl: 'app/events/events_allevents.html',
                data: {

                }
            })
            .state('events.map', {
                url: '/map',
                templateUrl: 'app/events/events_map.html',
                data: {

                }
            })
            .state('event', {
                url: '/event',
                abstract: true,
                templateUrl: 'app/events/event.html',
                controller: 'EventPageController',
                controllerAs: 'eventpage',
                resolve: {


                },
                data: {
                    displayName: 'Event Details',
                }
            })
            .state('event.create', {
                url: '/create',
                templateUrl: 'app/events/event_create.html',
                controller: 'EventCreateController',
                controllerAs: 'singleevent',
                data: {
                    displayName: 'Event Details',
                }
            })
            .state('event.edit', {
                url: '/edit/:eventId',
                templateUrl: 'app/events/event_edit.html',
                controller: 'EventEditController',
                controllerAs: 'viewevent',
                resolve: {
                    eventId: ['$stateParams', function($stateParams) {
                        return $stateParams.eventId;
                    }],
                },
                data: {
                    displayName: 'Event Details',
                }
            })
            .state('event.invitations', {
                url: '/invitations/:eventId',
                templateUrl: 'app/events/event_invitations.html',
                controller: 'EventInvitationsController',
                controllerAs: 'viewevent',
                resolve: {
                    eventId: ['$stateParams', function($stateParams) {
                        return $stateParams.eventId;
                    }],
                },
                data: {
                    displayName: 'Invitations'
                }
            })
            .state('event.attendees', {
                url: '/attendees/:eventId',
                templateUrl: 'app/events/event_attendees.html',
                controller: 'EventAttendeesController',
                controllerAs: 'viewevent',
                resolve: {
                    eventId: ['$stateParams', function($stateParams) {
                        return $stateParams.eventId;
                    }],
                },
                data: {
                    displayName: 'Attendees'
                }
            })
            .state('event.details', {
                url: '/details/:eventId',
                templateUrl: 'app/events/event_view.html',
                controller: 'EventViewController',
                controllerAs: 'viewevent',
                resolve: {
                    eventId: ['$stateParams', function($stateParams) {
                        return $stateParams.eventId;
                    }],
                },
                data: {
                    displayName: 'Event Details',
                }

            });



        $urlRouterProvider.otherwise('/');

    }])
    .run(["$rootScope", "$state", "$stateParams", "$timeout", "ezfb", function($rootScope, $state, $stateParams, $timeout, ezfb) {

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
            $rootScope.previousState = {
                name: fromState.name,
                params: fromParams
            };

            //remember state in events feed
            if ((fromState.name === 'events.myevents' || fromState.name === 'events.allevents' || fromState.name === 'events.mynetwork') && (toState.name === 'event.details' || toState.name === 'event.create')) {
                $rootScope.previousEventFeed = fromState.name;
            }


        });


        $rootScope.$on('$stateChangeError', function(event) {});



    }])
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
                    var title = 'persice';
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
    .directive('endRepeat', ["$timeout", function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }])
    .directive('endRepeatPhotos', ["$timeout", function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinishedPhotos');
                    });
                }
            }
        };
    }])
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
    .factory('myIoSocket', ["socketFactory", function(socketFactory) {
        var myIoSocket = io.connect('//' + window.location.hostname + ':3000');


        myIoSocket = socketFactory({
            ioSocket: myIoSocket
        });
        myIoSocket.forward('message');
        myIoSocket.forward('error');

        return myIoSocket;
    }])
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
    .directive('whenScrolled', ["$timeout", function($timeout) {
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
    }])
    .directive('scrollBottomOn', ["$timeout", function($timeout) {
        return function(scope, elm, attr) {
            scope.$watch(attr.scrollBottomOn, function(value) {
                if (value) {
                    $timeout(function() {
                        elm[0].scrollTop = elm[0].scrollHeight;
                    });
                }
            });
        };;
    }])

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
    })
    .directive('autoFocus', ["$timeout", function($timeout) {
        return {
            restrict: 'AC',
            link: function(_scope, _element) {
                $timeout(function() {
                    _element[0].focus();
                }, 0);
            }
        };
    }]);
(function() {
    'use strict';

    angular
    .module('persice')
    .controller('SettingsController', SettingsController);

    /**
     * class SettingsController
     * classDesc User settings, delete account, logout
     * @ngInject
     */
     function SettingsController($rootScope, FilterRepository, USER_ID, $scope, $log, $timeout, $window, $http) {
        var vm = this;


        vm.changed = false;
        vm.setUnit = setUnit;
        vm.getDistanceUnit = getDistanceUnit;
        vm.saveSettings = saveSettings;
        vm.deleteUser = deleteUser;
        vm.loadingSave = false;

        vm.distanceUnit = 'miles';
        $timeout(function() {
            vm.changed = false;
        }, 1000);


        $scope.$watch(angular.bind(this, function(distanceUnit) {
            return vm.distanceUnit;
        }), function(newVal) {
            vm.changed = true;
        });

        vm.getDistanceUnit();

        function getDistanceUnit() {
            vm.changed = false;
            FilterRepository.getFilters().then(function(data) {
                vm.distanceUnit = data.distance_unit;
                $rootScope.distance_unit = data.distance_unit;
                vm.filterId = data.id;
                vm.changed = false;
            }, function(error) {

            });




        }

        function setUnit(value) {
            vm.distanceUnit = value;
        }

        function deleteUser() {
            $http({
                method: 'POST',
                url: '/accounts/deactivate/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            $window.location.href = '/accounts/logout';
            $window.location.assign();

        }


        function saveSettings() {
            vm.loadingSave = true;
            FilterRepository.saveFilters({
                distance_unit: vm.distanceUnit,
                user: '/api/v1/auth/user/' + USER_ID + '/'
            }).then(function(data) {
                vm.changed = false;
                vm.loadingSave = false;
                $rootScope.distance_unit = vm.distanceUnit;
                $rootScope.$broadcast('refreshEventFilters');
                $rootScope.$broadcast('refreshFilters');
            }, function(error) {
                vm.changed = false;
            });
        }

    }
    SettingsController.$inject = ["$rootScope", "FilterRepository", "USER_ID", "$scope", "$log", "$timeout", "$window", "$http"];

})();

'use strict';

angular.module('persice')
    .controller('OfferCreateCtrl', ["$scope", "$http", "$rootScope", "APP_ID", "$state", "$log", "OffersFactory", "SubjectsFactory", "USER_ID", "$filter", function($scope, $http, $rootScope, APP_ID, $state, $log, OffersFactory, SubjectsFactory, USER_ID, $filter) {
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



    }]);
(function() {
    'use strict';

    angular
        .module('persice')
        .controller('MyProfileController', MyProfileController);

    /**
     * class MyProfileController
     * classDesc view user profile
     * @ngInject
     */
    function MyProfileController($scope, USER_ID, USER_PHOTO, $log) {
        var vm = this;
        vm.user = {
            id: USER_ID,
            photo: USER_PHOTO
        };


    }
    MyProfileController.$inject = ["$scope", "USER_ID", "USER_PHOTO", "$log"];



})();
(function() {
    'use strict';

    angular
        .module('persice')
        .controller('MyConnectionsController', MyConnectionsController);

    /**
     * class MyConnectionsController
     * classDesc Fetch user connections
     * @ngInject
     */
    function MyConnectionsController($scope, FriendsFactory, USER_ID, $resource, ConnectionsFactory, $log, $timeout, $q, $http, $filter, $state, NotificationsRepository) {
        var vm = this;
        vm.friends = [];
        vm.q = '';
        vm.noConnections = false;
        vm.pok = false;
        vm.noResults = false;
        vm.loading = false;
        vm.loadingMore = false;
        vm.nextOffset = 10;
        vm.next = null;

        vm.getFriends = getFriends;
        vm.loadMoreFriends = loadMoreFriends;
        vm.gotoConnection = gotoConnection;
        vm.reset = reset;

        vm.getFriends();

        function reset() {
            vm.q = '';
            vm.getFriends();
        }

        function getFriends() {
            vm.nextOffset = 10;
            vm.next = null;
            vm.loading = true;
            ConnectionsFactory.query({
                format: 'json',
                first_name: vm.q,
                limit: 10,
                offset: 0
            }).$promise.then(function(data) {

                    vm.friends = data.objects;
                    vm.next = data.meta.next;


                    if (vm.friends.length === 0) {
                        if (!vm.pok) {
                            vm.noConnections = true;
                            vm.pok = true;
                        } else {
                            vm.noResults = true;
                        }
                    } else {
                        vm.pok = true;
                        vm.noResults = false;
                        vm.noConnections = false;
                        //count mutual friends
                        for (var obj in vm.friends) {
                            vm.friends[obj].totalFriends = 0;
                            vm.friends[obj].totalFriends += vm.friends[obj].mutual_bk_friends_count;
                            vm.friends[obj].totalFriends += vm.friends[obj].mutual_fb_friends_count;
                            vm.friends[obj].totalFriends += vm.friends[obj].mutual_linkedin_connections_count;
                            vm.friends[obj].totalFriends += vm.friends[obj].mutual_twitter_friends_count;
                            vm.friends[obj].totalFriends += vm.friends[obj].mutual_twitter_followers_count;
                        }
                    }

                    vm.loading = false;


                },
                function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;

                    $log.error(message);

                    vm.noConnections = true;

                    vm.loading = false;

                });

        }

        function loadMoreFriends() {
            var deferred = $q.defer();



            if (vm.next === null) {
                deferred.reject();
                return deferred.promise;
            }

            if (!vm.loadingMore) {

                vm.loadingMore = true;
                ConnectionsFactory.query({
                    format: 'json',
                    limit: 10,
                    first_name: vm.q,
                    offset: vm.nextOffset
                }).$promise.then(function(data) {

                        var responseData = data.objects;
                        vm.next = data.meta.next;

                        vm.nextOffset += 10;

                        //count mutual friends
                        for (var obj in responseData) {
                            responseData[obj].totalFriends = 0;
                            responseData[obj].totalFriends += responseData[obj].mutual_bk_friends_count;
                            responseData[obj].totalFriends += responseData[obj].mutual_fb_friends_count;
                            responseData[obj].totalFriends += responseData[obj].mutual_linkedin_connections_count;
                            responseData[obj].totalFriends += responseData[obj].mutual_twitter_friends_count;
                            responseData[obj].totalFriends += responseData[obj].mutual_twitter_followers_count;
                            vm.friends.push(responseData[obj]);
                        }

                        vm.loadingMore = false;
                        deferred.resolve();


                    },
                    function(response) {
                        deferred.reject();
                        var data = response.data,
                            status = response.status,
                            header = response.header,
                            config = response.config,
                            message = 'Error ' + status;

                        $log.error(message);

                        vm.loadingMore = false;

                    });


            } else {
                deferred.reject();
            }


            return deferred.promise;
        }

        function gotoConnection(index) {


            if (vm.friends[index].updated_at === null) {
                //mark new connection as seen
                $http.get('/api/v1/new_connections/updated_at/?format=json&friend_id=' + vm.friends[index].friend_id).
                success(function(data, status, headers, config) {

                    //refresh notification state
                    NotificationsRepository.refreshTotalConnections();
                    $state.go('friendprofile', {
                        userId: vm.friends[index].friend_id
                    });
                }).
                error(function(data, status, headers, config) {
                    $state.go('friendprofile', {
                        userId: vm.friends[index].friend_id
                    });
                });
            } else {

                $state.go('friendprofile', {
                    userId: vm.friends[index].friend_id
                });
            }



        }

    }
    MyConnectionsController.$inject = ["$scope", "FriendsFactory", "USER_ID", "$resource", "ConnectionsFactory", "$log", "$timeout", "$q", "$http", "$filter", "$state", "NotificationsRepository"];



})();
'use strict';

angular.module('persice')
    .controller('MainCtrl', ["$scope", function($scope) {
        $scope.greetingMessage = 'Welcome to';
    }]);
'use strict';

angular.module('persice')
    .factory('MatchFeedFactory', ["$resource", function($resource) {
        return $resource('/api/v1/matchfeed/:matchId/:param', {
            matchId: '@matchId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }]);
(function() {
    'use strict';

    angular
        .module('persice')
        .controller('MatchFeedController', MatchFeedController);

    /**
     * class MatchFeedController
     * classDesc view match feed
     * @ngInject
     */
    function MatchFeedController($scope, $log, $timeout) {
        var vm = this;



    }
    MatchFeedController.$inject = ["$scope", "$log", "$timeout"];



})();
(function() {
    'use strict';

    angular
        .module('persice')
        .controller('InterestsController', InterestsController);

    /**
     * class InterestsController
     * classDesc Select interests and activities during onboard user flow
     * @ngInject
     */
    function InterestsController(InterestsFactory, $rootScope, $http, APP_ID, InterestSubjectFactory, $log, notify, USER_ID, $filter, $timeout, $resource, $state, $q, lodash, $scope, $window) {
        var vm = this;

        vm.useInterest = useInterest;
        vm.getAllInterests = getAllInterests;
        vm.nextStep = nextStep;
        vm.searchQuery = '';
        vm.userUri = '/api/v1/auth/user/' + USER_ID + '/';

        vm.next = null;
        vm.nextOffset = 100;
        vm.loadingMore = false;
        vm.noResults = false;
        vm.reset = reset;
        vm.loadMoreInterests = loadMoreInterests;

        vm.allInterests = [];
        vm.counter = 0;

        vm.loadingInterests = false;

        vm.userInterests = [];

        var w = angular.element($window);

        vm.limit = 100;


        vm.getAllInterests();



        function nextStep() {
            if (vm.counter > 0) {
                //post event to facebook analytics
                var url = 'https://graph.facebook.com/v2.3/' + APP_ID + '/activities?access_token=' + $rootScope.fbAuth.accessToken;
                var timestamp = Math.round(+new Date() / 1000);
                var activity = {
                    'event': 'CUSTOM_APP_EVENTS',
                    'application_tracking_enabled': 1,
                    'advertiser_tracking_enabled': 0,
                    'custom_events': [{
                        '_eventName': 'Onboarding flow user created interests',
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
                $state.go('goalcreate');

            } else {
                notify({
                    messageTemplate: '<div class="notify-info-header">Warning</div>' +
                        '<p>To continue please select at least one interest.</p>',
                    scope: $scope,
                    classes: 'notify-info',
                    icon: 'warning circle',
                    duration: 4000
                });
            }
        }

        function reset() {
            vm.searchQuery = '';
            vm.getAllInterests();
            vm.noResults = false;
        }

        function getAllInterests() {
            vm.userInterests = [];
            if (w.width() > 400) {
                vm.limit = 400;
            }


            vm.nextOffset = 100;
            vm.next = null;
            vm.noResults = false;
            vm.loadingInterests = true;
            vm.allInterests.splice(0, vm.allInterests.length);

            InterestsFactory.query({
                user_id: USER_ID,
                format: 'json',
                limit: 200,
                offset: 0
            }).$promise.then(function(data) {

                vm.counter = data.meta.total_count;

                if (data.objects.length > 0) {
                    vm.userInterests = data.objects;
                }

                InterestSubjectFactory.query({
                    format: 'json',
                    limit: vm.limit,
                    description__icontains: vm.searchQuery,
                    offset: 0
                }).$promise.then(function(data) {
                    vm.next = data.meta.next;

                    var results = data.objects;

                    if (results.length > 0) {

                        //preselect already created interests
                        for (var j = results.length - 1; j >= 0; j--) {
                            results[j].active = false;
                            results[j].interest_resource = null;
                            for (var i = vm.userInterests.length - 1; i >= 0; i--) {
                                if (results[j].resource_uri === vm.userInterests[i].interest) {
                                    results[j].interest_resource = vm.userInterests[i].resource_uri;
                                    results[j].active = true;
                                }
                            }
                            vm.allInterests.push(results[j]);
                        }

                    } else {
                        vm.allInterests.splice(0, vm.allInterests.length);
                        vm.noResults = true;
                    }



                    vm.loadingInterests = false;
                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    $log.error(message);
                    vm.loadingInterests = false;

                });



            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                $log.error(message);
                vm.loadingInterests = false;

            });


        }

        function loadMoreInterests() {
            var deferred = $q.defer();
            if (!vm.loadingMore) {
                if (vm.next !== null) {

                    vm.loadingMore = true;
                    $timeout(function() {
                        InterestsFactory.query({
                            user_id: USER_ID,
                            format: 'json',
                            limit: 200,
                            offset: 0
                        }).$promise.then(function(data) {
                            vm.counter = data.meta.total_count;
                            if (data.objects.length > 0) {
                                vm.userInterests = data.objects;
                            }

                            InterestSubjectFactory.query({
                                format: 'json',
                                description__icontains: vm.searchQuery,
                                offset: vm.nextOffset,
                                limit: 30
                            }).$promise.then(function(data) {
                                var responseData = data.objects;
                                vm.next = data.meta.next;
                                vm.nextOffset += 30;


                                if (data.objects.length > 0) {
                                    responseData = data.objects;

                                }



                                for (var j = responseData.length - 1; j >= 0; j--) {
                                    responseData[j].active = false;
                                    responseData[j].interest_resource = null;
                                    for (var i = vm.userInterests.length - 1; i >= 0; i--) {
                                        if (responseData[j].resource_uri === vm.userInterests[i].interest) {
                                            responseData[j].interest_resource = vm.userInterests[i].resource_id;

                                            responseData[j].active = true;
                                        }
                                    }
                                    vm.allInterests.push(responseData[j]);
                                }
                                vm.loadingMore = false;
                                deferred.resolve();
                            }, function(response) {
                                var data = response.data,
                                    status = response.status,
                                    header = response.header,
                                    config = response.config,
                                    message = 'Error ' + status;
                                $log.error(message);
                                vm.loadingMore = false;
                                deferred.reject();

                            });


                        }, function(response) {
                            var data = response.data,
                                status = response.status,
                                header = response.header,
                                config = response.config,
                                message = 'Error ' + status;
                            $log.error(message);
                            deferred.reject();


                        });

                    }, 400);

                } else {
                    deferred.reject();
                }

            } else {

                deferred.reject();
            }

            return deferred.promise;
        }


        function useInterest(index) {
            var selected = vm.allInterests[index];

            if (selected) {


                if (selected.active) {

                    //deselect interest and delete from database
                    var Interest = $resource(selected.interest_resource);
                    selected.loading = true;
                    Interest.delete().$promise.then(function(data) {
                        selected.active = false;
                        selected.interest_resource = null;
                        vm.counter--;
                        selected.loading = false;
                    }, function(response) {
                        var data = response.data,
                            status = response.status,
                            header = response.header,
                            config = response.config,
                            message = 'Error ' + status;
                        $log.error(message);
                        selected.loading = false;
                        selected.error = true;
                    });



                } else {
                    if (vm.counter >= 10) {


                        notify({
                            messageTemplate: '<div class="notify-info-header">Warning</div>' +
                                '<p>Please select up to 10 interests.</p>',
                            scope: $scope,
                            classes: 'notify-info',
                            icon: 'warning circle'
                        });
                    } else {

                        //select and save new interest
                        var newInterest = {
                            interest_subject: selected.description,
                            user: vm.userUri
                        };
                        selected.loading = true;
                        InterestsFactory.save({}, newInterest,
                            function(success) {
                                // $log.info(selected);
                                selected.loading = false;
                                selected.error = false;
                                selected.interest_resource = success.resource_uri;
                                selected.active = true;
                                vm.counter++;
                            },
                            function(error) {
                                selected.errorMessage = error.data.interest.error[0];

                                notify({
                                    messageTemplate: '<div class="notify-info-header">Error</div>' +
                                        '<p>' + selected.errorMessage + '</p>',
                                    scope: $scope,
                                    classes: 'notify-info',
                                    icon: 'warning circle'
                                });

                                selected.loading = false;
                                selected.error = true;

                            });

                    }
                }



            }


        }
    }
    InterestsController.$inject = ["InterestsFactory", "$rootScope", "$http", "APP_ID", "InterestSubjectFactory", "$log", "notify", "USER_ID", "$filter", "$timeout", "$resource", "$state", "$q", "lodash", "$scope", "$window"];



})();
(function() {
    'use strict';
    angular
        .module('persice')
        .factory('InboxRepository', InboxRepository);

    /**
     * class InboxRepository
     * classDesc Service for Inbox: messages and counter for unread messages
     * @ngInject
     */
    function InboxRepository(InboxFactory, NotificationsRepository, $log, $filter, $rootScope, $q) {


        var service = {
            getInboxMessages: getInboxMessages,
            getUnreadMessagesCounter: getUnreadMessagesCounter,
            getAllMessages: getAllMessages,
            loadMore: loadMore,
            unreadMessagesCounter: 0,
            inboxMessages: [],
            limit: 10,
            offset: 0,
            nextOffset: 10,
            next: null,
            total: 0,
            pageSize: 10,
            loadingMore: false
        };
        return service;

        function getInboxMessages() {
            $log.info('fetching inbox');
            return InboxFactory.query({
                format: 'json',
                limit: service.limit,
                offset: 0
            }).$promise.then(getInboxMessagesComplete, getInboxMessagesFailed);

            function getInboxMessagesComplete(response) {
                service.inboxMessages.splice(0, service.inboxMessages.length);
                service.next = response.meta.next;
                service.total = response.meta.total;
                service.nextOffset = 10;

                var receivedMessages = response.objects;
                var i = 0;
                for (var obj in receivedMessages) {
                    if (receivedMessages[obj].read_at === null && receivedMessages[obj].last_message_body !== null) {
                        i++;
                    }
                    service.inboxMessages.push({
                        firstName: receivedMessages[obj].first_name,
                        friendId: receivedMessages[obj].friend_id,
                        facebookId: receivedMessages[obj].facebook_id,
                        sentAt: $filter('amDateFormat')(receivedMessages[obj].sent_at, 'h:mm a'),
                        readAt: receivedMessages[obj].read_at,
                        id: receivedMessages[obj].id,
                        body: receivedMessages[obj].last_message_body
                    });
                }

                service.unreadMessagesCounter = i;

                // NotificationsRepository.setTotalInbox(service.unreadMessagesCounter);
                // $rootScope.$broadcast('refreshMessagesCounter');
            }

            function getInboxMessagesFailed(error) {
                service.inboxMessages.splice(0, service.inboxMessages.length);
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);



            }
        }

        function getUnreadMessagesCounter() {
            return service.unreadMessagesCounter;
        }

        function getAllMessages() {
            return service.inboxMessages;
        }

        function loadMoreSuccess(response) {

            service.next = response.meta.next;
            service.nextOffset += service.pageSize;

            var receivedMessages = response.objects;
            var newMessages = [];
            var i = 0;
            for (var obj in receivedMessages) {
                if (receivedMessages[obj].read_at === null && receivedMessages[obj].last_message_body !== null) {
                    i++;
                }
                service.inboxMessages.push({
                    firstName: receivedMessages[obj].first_name,
                    friendId: receivedMessages[obj].friend_id,
                    facebookId: receivedMessages[obj].facebook_id,
                    sentAt: $filter('amDateFormat')(receivedMessages[obj].sent_at, 'h:mm a'),
                    readAt: receivedMessages[obj].read_at,
                    id: receivedMessages[obj].id,
                    body: receivedMessages[obj].last_message_body
                });
            }
            service.unreadMessagesCounter += i;
            // $rootScope.$broadcast('refreshMessagesCounter');
            service.loadingMore = false;
            deferred.resolve();
        }

        function loadMoreFailed(response) {
            var data = response.data,
                status = response.status,
                header = response.header,
                config = response.config,
                message = 'Error ' + status;
            $log.error(message);
            service.loadingMore = false;
            deferred.reject();
        }

        function loadMore() {
            console.log('loading more messages in inbox');
            var deferred = $q.defer();

            if (service.next === null) {
                deferred.reject();
                return deferred.promise;
            }

            if (!service.loadingMore) {

                service.loadingMore = true;
                InboxFactory.query({
                    format: 'json',
                    limit: 10,
                    offset: service.nextOffset
                }).$promise.then(loadMoreSuccess, loadMoreFailed);



            } else {
                deferred.reject();
            }
            return deferred.promise;
        }

    }
    InboxRepository.$inject = ["InboxFactory", "NotificationsRepository", "$log", "$filter", "$rootScope", "$q"];

})();
(function() {
    'use strict';

    angular
        .module('persice')
        .controller('InboxController', InboxController);

    /**
     * class InboxController
     * classDesc Controller for Inbox view
     * @ngInject
     */
    function InboxController($scope, $rootScope, $log, InboxRepository, $q) {
        var vm = this;

        vm.allMessages = [];
        vm.loadInbox = loadInbox;
        vm.loadMore = loadMore;
        vm.refresh = refresh;
        vm.loadingMessages = false;
        vm.loadingMore = false;
        vm.q = '';

        vm.refresh();

        function refresh() {
            vm.loadingMessages = true;
            InboxRepository.getInboxMessages().then(getInboxMessagesSuccess, getInboxMessagesFailed);

            function getInboxMessagesSuccess(data) {
                vm.loadingMessages = false;
                vm.loadInbox();
            }

            function getInboxMessagesFailed(data) {
                vm.loadingMessages = false;
            }
        }

        function loadInbox() {
            vm.allMessages = InboxRepository.getAllMessages();
        }

        function loadMore() {
            vm.loadingMore = true;
            InboxRepository.loadMore().then(loadMoreSuccess, loadMoreFailed);

            function loadMoreSuccess(data) {
                vm.loadingMore = false;
            }

            function loadMoreFailed(data) {
                vm.loadingMore = false;
            }

        }



    }
    InboxController.$inject = ["$scope", "$rootScope", "$log", "InboxRepository", "$q"];


})();
'use strict';

angular.module('persice')
    .controller('GoalCreateCtrl', ["$scope", "$http", "$rootScope", "APP_ID", "$state", "$log", "GoalsFactory", "SubjectsFactory", "USER_ID", function($scope, $http, $rootScope, APP_ID, $state, $log, GoalsFactory, SubjectsFactory, USER_ID) {
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


        $scope.saveGoal = function() {
            var newGoal = {
                goal_subject: $scope.subject,
                user: $scope.userUri
            };

            GoalsFactory.save({}, newGoal,
                function(success) {


                    //post event to facebook analytics
                    var url = 'https://graph.facebook.com/v2.3/' + APP_ID + '/activities?access_token=' + $rootScope.fbAuth.accessToken;
                    var timestamp = Math.round(+new Date() / 1000);
                    var activity = {
                        'event': 'CUSTOM_APP_EVENTS',
                        'application_tracking_enabled': 1,
                        'advertiser_tracking_enabled': 0,
                        'custom_events': [{
                            '_eventName': 'Onboarding flow user created goal',
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

                    $state.go('offercreate');


                },
                function(error) {
                    $scope.resourceUri = null;
                    $scope.messageShow = true;
                    if (error.data.goal) {
                        $scope.message = error.data.goal.error[0];
                    } else {
                        $scope.message = 'There was an error when trying to save your goal.';
                    }
                });
        };

        $scope.createGoal = function() {
            $scope.messageShow = false;
            $scope.message = '';


            //if subject is empty warn user to enter subject
            if ($scope.subject === '') {
                $scope.message = 'Entering your goal is required to continue.';
                $scope.messageShow = true;
                return false;
            }

            //if subject is has more than 300 chars, warn the user
            if ($scope.subject.length > 300) {
                $scope.message = 'Goal cannot have more than 300 characters.';
                $scope.messageShow = true;
                return false;
            }



            $scope.saveGoal();



        };



    }]);
(function() {
    'use strict';

    /**
     * class FinalStepController
     * classDesc Connect with LinkedIn and Twitter or skip to mathcfeed
     * @ngInject
     */
    function FinalStepController($log, USER_ID, UsersFactory, User) {
        var vm = this;

        vm.loading = false;
        vm.link = link;
        vm.refreshUser = refreshUser;
        vm.twitter = '';
        vm.linkedin = '';
        vm.firstName = User.first_name;

        if (User.linkedin_provider !== null) {
            vm.linkedin = User.linkedin_provider;
        }

        if (User.twitter_provider !== null) {
            vm.twitter = User.twitter_username;
        }

        function link(provider) {
            var w = 400;
            var h = 300;


            var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;


            var settings = 'height=' + h + ',width=' + w + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes';
            var url = '/social/associate/' + provider + '/?next=/goals/close_login_popup';
            var newWindow = window.open(url, 'Connecting...', settings);

            if (window.focus) {
                newWindow.focus();
            }
        }


        function refreshUser() {
            vm.loading = true;
            UsersFactory.get({
                format: 'json'
            }, {
                userId: USER_ID
            }).$promise.then(function(data) {
                if (data.linkedin_provider !== null) {
                    vm.linkedin = data.linkedin_provider;
                }

                if (data.twitter_provider !== null) {
                    vm.twitter = data.twitter_username;
                }

                vm.firstName = data.first_name;
                vm.loading = false;
            });
        }


    }
    FinalStepController.$inject = ["$log", "USER_ID", "UsersFactory", "User"];

    angular
        .module('persice')
        .controller('FinalStepController', FinalStepController);



})();
(function() {
    'use strict';

    angular
        .module('persice')
        .controller('FriendProfileController', FriendProfileController);

    /**
     * class FriendProfileController
     * classDesc Connect with LinkedIn and Twitter or skip to mathcfeed
     * @ngInject
     */
    function FriendProfileController($scope, userId, Connection, UserProfile, $log, $state, FriendsFactory) {
        var vm = this;

        $log.info(UserProfile);
        vm.userInfo = {
            id: userId,
            first_name: UserProfile.first_name,
            photo: '//graph.facebook.com/' + UserProfile.facebook_id + '/picture?type=large'
        };

        vm.middleActive = true;
        vm.friendshipId = Connection.objects[0].id;
        vm.unFriend = unFriend;

        function unFriend() {

            FriendsFactory.update({
                    friendId: vm.friendshipId
                }, {
                    status: -1
                },
                function(success) {
                    InboxRepository.getInboxMessages();
                    $state.go('myconnections');
                },
                function(error) {

                });
        }

    }
    FriendProfileController.$inject = ["$scope", "userId", "Connection", "UserProfile", "$log", "$state", "FriendsFactory"];



})();
(function() {
    'use strict';

    angular
        .module('persice')
        .controller('EventViewController', EventViewController);

    /**
     * class EventViewController
     * classDesc Create event
     * @ngInject
     */
    function EventViewController($scope, USER_ID, EventsFactory, $state, eventId, $rootScope, $log, $window, angularMomentConfig, MembersFactory) {
        var vm = this;
        vm.showMobile = true;
        vm.mapurl = '';
        vm.mapurlTrue = false;
        vm.event = {};
        vm.eventNotFound = false;
        vm.editEvent = editEvent;

        vm.eventLocation = '';

        $scope.eventpage.header = 'Event Details';

        vm.placeholder = {
            name: 'Event Name',
            starts: 'Starts',
            ends: 'Ends',
            repeat: 'Repeat',
            location: 'Location',
            description: 'Description',
            costs: 'Costs',
            invitations: 'Invitations',
            attachments: 'Attachments'
        };

        vm.eventRsvp = {
            status: ''
        };

        vm.changeRsvpStatus = changeRsvpStatus;
        vm.openMap = openMap;
        vm.getEvent = getEvent;

        vm.openAttendees = openAttendees;


        function openAttendees() {
            $state.go('event.attendees', {
                eventId: eventId
            });
        }

        $scope.$on('goBackEvents', function() {
            if ($rootScope.previousEventFeed !== undefined) {
                $state.go($rootScope.previousEventFeed);
            } else {
                $state.go('events.myevents');
            }


        });

        function editEvent() {
            $state.go('event.edit', {
                eventId: eventId
            });
        }


        vm.isHost = null;

        function changeRsvpStatus(newStatus) {
            var member = {
                event: '/api/v1/event/' + vm.event.id + '/',
                rsvp: newStatus,
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            //change RSVP status if different than previous
            if (vm.eventRsvp.status !== newStatus) {
                //check if member is already created.
                if (vm.memberExists) {
                    vm.eventRsvp.status = newStatus;
                    //update rsvp status
                    MembersFactory.update({
                            memberId: vm.memberId
                        }, member,
                        function(success) {
                            for (var i = vm.event.members.length - 1; i >= 0; i--) {

                                if (vm.event.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {

                                    vm.event.members[i].rsvp = newStatus;
                                }

                            }
                        },
                        function(error) {


                        });

                } else {
                    vm.eventRsvp.status = newStatus;
                    // create new member first with new rsvp status
                    MembersFactory.save({}, member,
                        function(success) {
                            vm.memberExists = true;
                            vm.event.members.push(success);
                            vm.memberId = success.id;
                        },
                        function(error) {

                        });
                }

            }
        }

        vm.getEvent();

        function getEvent() {



            vm.loadingEvent = true;
            EventsFactory.query({
                format: 'json'
            }, {
                eventId: eventId
            }).$promise.then(function(data) {
                vm.eventNotFound = false;
                vm.event = data;
                vm.eventLocation = '';
                vm.mapurlTrue = false;
                vm.mapurl = '';

                if (vm.event.location !== '0,0') {


                    if (vm.event.full_address !== '' && vm.event.full_address !== null) {
                        vm.eventLocation = vm.event.full_address;
                    } else {
                        vm.eventLocation = vm.event.street + ' ' + vm.event.city + ' ' + vm.event.zipcode + ' ' + vm.event.state;
                    }

                    vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation) + '/@' + vm.event.location + ',15z';
                    vm.mapurlTrue = true;

                } else {
                    vm.mapurlTrue = false;
                    vm.mapurl = '';
                    vm.eventLocation = vm.event.location_name;
                }


                //convert datetime to local timezone
                vm.starts_on_date = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('dddd, MMMM D, YYYY');
                vm.ends_on_date = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('dddd, MMMM D, YYYY');
                vm.starts_on_time = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('h:mm A');
                vm.ends_on_time = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('h:mm A ') + moment.tz(angularMomentConfig.timezone).format('z');



                if (vm.ends_on_date !== vm.starts_on_date) {
                    vm.firstrow = vm.starts_on_date + ' ' + vm.starts_on_time;
                    vm.secondrow = vm.ends_on_date + ' ' + vm.ends_on_time;
                } else {
                    vm.firstrow = vm.starts_on_date;
                    vm.secondrow = vm.starts_on_time + ' to ' + vm.ends_on_time;
                }


                vm.isHost = false;
                $scope.eventpage.isHost.option = false;
                $scope.eventpage.eventId = vm.event.id;


                vm.eventRsvp = {
                    status: ''
                };
                vm.memberExists = false;
                vm.memberId = null;
                if (vm.event.members.length > 0) {
                    for (var i = vm.event.members.length - 1; i >= 0; i--) {
                        if (vm.event.members[i].is_organizer === true) {
                            if (vm.event.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {
                                vm.isHost = true;
                                $scope.eventpage.isHost.option = true;
                            }
                        } else {
                            if (vm.event.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {
                                vm.memberId = vm.event.members[i].id;
                                if (vm.event.members[i].rsvp !== null) {
                                    vm.eventRsvp.status = vm.event.members[i].rsvp;
                                }

                                vm.memberExists = true;

                            }
                        }
                    }
                }


                vm.loadingEvent = false;

            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                vm.loadingEvent = false;
                vm.eventNotFound = true;


            });
        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }



    }
    EventViewController.$inject = ["$scope", "USER_ID", "EventsFactory", "$state", "eventId", "$rootScope", "$log", "$window", "angularMomentConfig", "MembersFactory"];



})();

(function() {
    'use strict';

    angular
        .module('persice')
        .controller('EventsPageController', EventsPageController);

    /**
     * class EventsFeedController
     * classDesc Fetching events
     * @ngInject
     */
    function EventsPageController($scope, $rootScope, $log, $state, $timeout) {
        var vm = this;

        //first remove all modals from body
        $('.ui.dimmer.modals').remove();

        vm.viewEvent = null;
        vm.showModal = false;
        vm.showViewModal = false;
        vm.showEventModal = showEventModal;
        vm.closeEventModal = closeEventModal;
        vm.showEventViewModal = showEventViewModal;
        vm.closeEventViewModal = closeEventViewModal;

        $rootScope.$on('closeModalCreateEvent', function(event, data) {
            vm.closeEventModal();
            if ($state.is('events.myevents')) {
                $rootScope.$broadcast('refreshEventFeed');
            } else {
                $state.go('events.myevents');
            }

        });

        $rootScope.$broadcast('refreshEventsFilters');

        $rootScope.$on('openViewEventModal', function(event, data) {
            vm.viewEvent = data;
            vm.showEventViewModal();


        });

        function showEventModal() {
            vm.showModal = true;
        }

        function closeEventModal() {
            vm.showModal = false;
        }

        function showEventViewModal() {
            vm.showViewModal = true;
        }

        function closeEventViewModal() {
            vm.showViewModal = false;
        }

    }
    EventsPageController.$inject = ["$scope", "$rootScope", "$log", "$state", "$timeout"];



})();
(function() {
    'use strict';

    angular
    .module('persice')
    .controller('EventPageController', EventPageController);

    /**
     * class EventPageController
     * classDesc Create/View/Edit event
     * @ngInject
     */
     function EventPageController($scope, $rootScope, $log, $state) {
        var vm = this;
        vm.eventId = null;
        vm.loadingSave = false;

        vm.isHost = {
            option: false
        };

        vm.header = 'Event Details';

        //remove all modals
        $('.ui.dimmer.modals').remove();

        vm.makeactionEvent = makeactionEvent;
        vm.gotoPreviousState = gotoPreviousState;

        function makeactionEvent() {
            if ($state.current.name === 'event.edit') {
                $scope.$broadcast('saveChangedEvent');
            }

            if ($state.current.name === 'event.create') {
                $scope.$broadcast('saveEvent');
            }

            if ($state.current.name === 'event.details') {
                $state.go('event.edit', {
                    eventId: vm.eventId
                });
            }

            if ($state.current.name === 'event.invitations') {
                $scope.$broadcast('sendInvites');
            }
        }

        function gotoPreviousState() {
            $scope.$broadcast('goBackEvents');
        }

    }
    EventPageController.$inject = ["$scope", "$rootScope", "$log", "$state"];



})();
(function() {
    'use strict';

    /**
     * class EventInvitationsController
     * classDesc event invitations
     * @ngInject
     */
    function EventInvitationsController($scope, USER_ID, EventsFactory, MembersFactory, $q, EventsConnections, $state, $timeout, eventId, $rootScope, $log, $filter, notify) {
        var vm = this;

        vm.loadingInvitesSave = false;
        vm.counterNewInvites = 0;
        vm.markSelected = markSelected;
        vm.removeInvite = removeInvite;
        vm.sendInvites = sendInvites;
        vm.getConnections = getConnections;

        vm.nextOffset = 10;
        vm.loadingConnections = false;
        vm.connectionFirstName = '';

        vm.invitationsOptions = {
            attendingPref: 'private',
            guestInvite: true
        };

        $scope.eventpage.header = 'Invitations';

        $scope.$on('goBackEvents', function() {
            $state.go('event.edit', {
                eventId: eventId
            });

        });

        vm.friends = [];
        vm.connections = [];
        vm.invitedPeople = [];

        vm.getConnections();


        function markSelected(index) {
            if (!vm.connections[index].is_invited) {
                vm.connections[index].selected = !vm.connections[index].selected;

                if (vm.connections[index].selected) {
                    vm.counterNewInvites++;
                } else {
                    vm.counterNewInvites--;
                }
            }

        }

        function removeInvite(index) {
            //remove from invite list and refresh selected status
            var findIndex = $filter('getIndexByProperty')('friend_id', vm.invitedPeople[index].friend_id, vm.connections);

            if (vm.connections[findIndex].member_id !== undefined) {
                MembersFactory.delete({
                        memberId: vm.connections[findIndex].member_id
                    },
                    function(success) {
                        vm.connections[findIndex].is_invited = false;
                        vm.connections[findIndex].selected = false;
                        vm.invitedPeople.splice(index, 1);
                        if (vm.counterNewInvites > 0) {
                            vm.counterNewInvites--;
                        }
                    },
                    function(error) {
                        $log.info(error);
                    });
            }





        }

        $scope.$on('sendInvites', function() {
            $log.info('sendInvites Event');
            vm.sendInvites();
        });

        function sendInvites() {
            if (vm.counterNewInvites > 0) {
                //return if already sending invites
                if (vm.loadingInvitesSave) {
                    return;
                }
                vm.loadingInvitesSave = true;
                //sending invites

                var promises = [];

                for (var i = vm.connections.length - 1; i >= 0; i--) {
                    if (vm.connections[i].selected && !vm.connections[i].is_invited) {
                        //prepare promises array
                        var member = {
                            event: '/api/v1/event/' + eventId + '/',
                            is_invited: false,
                            user: '/api/v1/auth/user/' + vm.connections[i].friend_id + '/'
                        };

                        promises.push(MembersFactory.save({}, member).$promise);
                    }

                }


                $q.all(promises).then(function(result) {
                    angular.forEach(result, function(response) {
                        var findMemberIndex = $filter('getIndexByProperty')('user', response.user, vm.connections);
                        vm.connections[findMemberIndex].member_id = response.id;
                        vm.connections[findMemberIndex].is_invited = true;
                        vm.connections[findMemberIndex].rsvp = '';
                        vm.invitedPeople.push(vm.connections[findMemberIndex]);
                    });

                }).then(function(tmpResult) {
                    $log.info('Sending invites finished.');
                    vm.counterNewInvites = 0;
                    vm.loadingInvitesSave = false;
                    notify({
                        messageTemplate: '<div class="notify-info-header">Success</div>' +
                            '<p>All event invitations have been successfully sent.</p>',
                        classes: 'notify-info',
                        icon: 'check circle',
                        duration: 4000
                    });
                    $scope.$emit('invitesSent');
                });

            } else {
                notify({
                    messageTemplate: '<div class="notify-error-header">Warning</div>' +
                        '<p>Please select connections to invite.</p>',
                    classes: 'notify-error',
                    icon: 'remove circle',
                    duration: 4000
                });
            }


        }

        function getConnections() {
            vm.connections = [];
            vm.friends = [];
            vm.invitedPeople = [];
            vm.counterNewInvites = 0;

            vm.nextOffset = 10;
            vm.next = null;
            vm.loadingConnections = true;
            EventsConnections.query({
                format: 'json',
                first_name: vm.connectionFirstName,
                limit: 10,
                offset: 0
            }).$promise.then(getEventsConnectionsSuccess, getEventsConnectionsFailure);

        }

        function getEventsConnectionsSuccess(response) {
            vm.friends = response.objects;
            vm.next = response.meta.next;


            for (var i = vm.friends.length - 1; i >= 0; i--) {

                var mutual_friends = ((vm.friends[i].mutual_friends_count === null) ? 0 : vm.friends[i].mutual_friends_count);
                var common_goals = ((vm.friends[i].common_goals_offers_interests === null) ? 0 : vm.friends[i].common_goals_offers_interests);
                var friend = {
                    first_name: vm.friends[i].first_name,
                    age: vm.friends[i].age,
                    common_goals_offers_interests: common_goals,
                    mutual_friends_count: mutual_friends,
                    tagline: vm.friends[i].tagline,
                    facebook_id: vm.friends[i].facebook_id,
                    friend_id: vm.friends[i].friend_id,
                    user: '/api/v1/auth/user/' + vm.friends[i].friend_id + '/',
                    is_invited: false,
                    member_id: null,
                    rsvp: '',
                    selected: false,
                    event: parseInt(eventId),
                    image: '//graph.facebook.com/' + vm.friends[i].facebook_id + '/picture?type=square'
                };


                for (var j = vm.friends[i].events.length - 1; j >= 0; j--) {

                    if (vm.friends[i].events[j].event === friend.event) {
                        friend.is_invited = true;
                        friend.rsvp = vm.friends[i].events[j].rsvp;
                        friend.selected = true;
                        friend.member_id = vm.friends[i].events[j].id;

                        vm.invitedPeople.push(friend);
                    }
                }

                vm.connections.push(friend);




            }

            vm.loadingConnections = false;

        }

        function getEventsConnectionsFailure(response) {

            var data = response.data,
                status = response.status,
                header = response.header,
                config = response.config,
                message = 'Error ' + status;
            $log.error(message);

            vm.loadingConnetions = false;


        }


    }
    EventInvitationsController.$inject = ["$scope", "USER_ID", "EventsFactory", "MembersFactory", "$q", "EventsConnections", "$state", "$timeout", "eventId", "$rootScope", "$log", "$filter", "notify"];



    angular
        .module('persice')
        .controller('EventInvitationsController', EventInvitationsController);

})();

(function() {
    'use strict';

    angular
        .module('persice')
        .controller('EventEditController', EventEditController);

    /**
     * class EventEditController
     * classDesc Edit event
     * @ngInject
     */
    function EventEditController($scope, USER_ID, EventsFactory, $state, eventId, $rootScope, $log, $window, moment, angularMomentConfig, notify, $geolocation) {
        var vm = this;
        vm.showError = false;
        vm.showMobile = true;
        vm.showSuccess = false;
        $scope.eventpage.loadingSave = false;
        vm.errorMessage = [];
        vm.mapurl = '';
        vm.mapurlTrue = false;
        vm.endsTimeError = false;
        vm.startsTimeError = false;
        vm.eventEdit = {
            user: '/api/v1/auth/user/' + USER_ID + '/',
            description: '',
            ends_on: '',
            location: '',
            name: '',
            repeat: '',
            starts_on: '',
            street: '',
            city: '',
            zipcode: null,
            state: '',
            full_address: '',
            location_name: '',
            country: ''
        };

        vm.eventLocation = '';

        $scope.eventpage.header = 'Event Details';

        vm.placeholder = {
            name: 'Event Name',
            starts: 'Starts',
            ends: 'Ends',
            repeat: 'Repeat',
            location: 'Location',
            description: 'Description',
            costs: 'Costs',
            invitations: 'Invitations',
            attachments: 'Attachments'
        };

        vm.$geolocation = $geolocation;

        $geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 2
        }).then(function(location) {
            vm.autocompleteOptions = {
                location: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
                radius: 50000
            };

        });

        vm.autocompleteOptions = {
            location: '0,0',
            radius: 50000
        };

        vm.saveEvent = saveEvent;
        vm.deleteEvent = deleteEvent;
        vm.openMap = openMap;
        vm.extractFromAddress = extractFromAddress;
        vm.parseLocation = parseLocation;
        vm.validateDates = validateDates;
        vm.getEvent = getEvent;
        vm.openInvitations = openInvitations;

        function openInvitations() {
            $state.go('event.invitations', {
                eventId: vm.eventEdit.id
            });
        }


        function deleteEvent() {
            vm.showError = false;
            EventsFactory.delete({
                    eventId: vm.eventEdit.id
                },
                function(success) {
                    vm.showError = false;

                    notify({
                        messageTemplate: '<div class="notify-info-header">Success</div>' +
                            '<p>Event has been successfully deleted.</p>',
                        classes: 'notify-info',
                        icon: 'check circle',
                        duration: 4000
                    });


                    if ($rootScope.previousEventFeed !== undefined) {
                        $state.go($rootScope.previousEventFeed);
                    } else {
                        $state.go('events.myevents');
                    }
                },
                function(error) {
                    vm.errorMessage = [];
                    vm.showError = true;
                    if (error.data.event) {
                        vm.errorMessage = ['Event could not be deleted.'];
                    }

                });
        }


        vm.getEvent();

        function getEvent() {
            vm.pok = 0;
            vm.loadingEvent = true;
            EventsFactory.query({
                format: 'json'
            }, {
                eventId: eventId
            }).$promise.then(function(data) {

                vm.eventEdit = data;
                vm.eventLocation = '';
                vm.mapurlTrue = false;
                vm.mapurl = '';

                if (vm.eventEdit.location !== '0,0') {


                    if (vm.eventEdit.full_address !== '' && vm.eventEdit.full_address !== null) {
                        vm.eventLocation = vm.eventEdit.full_address;
                    } else {
                        vm.eventLocation = vm.eventEdit.street + ' ' + vm.eventEdit.city + ' ' + vm.eventEdit.zipcode + ' ' + vm.eventEdit.state;
                    }

                    vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation) + '/@' + vm.eventEdit.location + ',15z';
                    vm.mapurlTrue = true;

                } else {
                    vm.mapurlTrue = false;
                    vm.mapurl = '';
                    vm.eventLocation = vm.eventEdit.location_name;
                }


                //convert datetime to local timezone
                vm.eventEdit.starts_on = moment.utc(vm.eventEdit.starts_on, moment.ISO_8601).local().toDate();
                vm.eventEdit.ends_on = moment.utc(vm.eventEdit.ends_on, moment.ISO_8601).local().toDate();

                vm.isHost = false;
                $scope.eventpage.isHost.option = false;
                if (vm.eventEdit.members.length > 0) {
                    for (var i = vm.eventEdit.members.length - 1; i >= 0; i--) {
                        if (vm.eventEdit.members[i].is_organizer === true) {
                            if (vm.eventEdit.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {
                                vm.isHost = true;
                                $scope.eventpage.isHost.option = true;
                            }
                        }
                    }
                }


                vm.loadingEvent = false;

            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                vm.loadingEvent = false;


            });
        }

        $scope.$on('saveChangedEvent', function() {
            vm.saveEvent();
        });

        $scope.$on('goBackEvents', function() {
            $state.go('event.details', {
                eventId: vm.eventEdit.id
            });

        });



        vm.checkDatesStarts = checkDatesStarts;
        vm.checkDatesEnds = checkDatesEnds;

        function checkDatesStarts() {

            if (vm.eventEdit.ends_on === '' || vm.eventEdit.ends_on === null) {
                vm.eventEdit.ends_on = moment(vm.eventEdit.starts_on).add(1, 'hour').toDate();
                return;
            }

            if (moment(vm.eventEdit.ends_on) >= moment(vm.eventEdit.starts_on)) {
                vm.eventEdit.ends_on = moment(vm.eventEdit.starts_on).add(1, 'hour').toDate();
            }

        }

        function checkDatesEnds() {

            if (vm.eventEdit.starts_on === '' || vm.eventEdit.starts_on === null) {
                vm.eventEdit.starts_on = moment(vm.eventEdit.ends_on).subtract(1, 'hour').toDate();
                return;
            }

        }



        $scope.$watch(angular.bind(this, function(eventLocation) {
            return vm.eventLocation;
        }), function(newVal) {
            vm.parseLocation();
        });


        function validateDates() {
            //validate dates
            vm.startsTimeError = false;
            vm.endsTimeError = false;
            if (moment(vm.eventEdit.starts_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select a Starts Date that is not set in past.'];
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
            }

            if (moment(vm.eventEdit.ends_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select an Ends Date that is not set in past.'];
                vm.endsTimeError = true;
                return;
            }

            if (moment(vm.eventEdit.ends_on).unix() > moment().unix() && moment(vm.eventEdit.starts_on).unix() > moment().unix() && moment(vm.eventEdit.starts_on).unix() > moment(vm.eventEdit.ends_on).unix()) {
                vm.showError = true;
                vm.errorMessage = ['Ends Date must be greater or equal to Starts Date.'];
                vm.endsTimeError = true;
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
                vm.endsTimeError = false;
            }
        }


        function saveEvent() {

            vm.showError = false;
            vm.showSuccess = false;

            $('.ui.form')
                .form({
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Event name'
                            }]
                        },
                        location: {
                            identifier: 'location',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Location'
                            }]
                        },
                        repeat: {
                            identifier: 'repeat',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Repeat'
                            }]
                        },
                        description: {
                            identifier: 'description',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Description'
                            }]
                        },
                    }
                });
            $('.ui.form').form('validate form');
            if (vm.eventEdit.description === '' || vm.eventEdit.ends_on === '' || vm.eventEdit.ends_on === null || vm.eventEdit.starts_on === null || vm.eventEdit.location === '' || vm.eventEdit.name === '' || vm.eventEdit.starts_on === '' || vm.eventEdit.repeat === '') {
                vm.showError = true;
                if (vm.eventEdit.starts_on === '' || vm.eventEdit.starts_on === null) {
                    vm.startsTimeError = true;
                }
                if (vm.eventEdit.ends_on === '' || vm.eventEdit.ends_on === null) {
                    vm.endsTimeError = true;
                }
                vm.errorMessage = ['Please enter all required fields.'];
            } else {
                vm.showError = false;
                vm.validateDates();

                vm.showSuccess = false;

                if (!vm.showError) {
                    $scope.eventpage.loadingSave = true;
                    EventsFactory.update({
                            eventId: vm.eventEdit.id
                        }, vm.eventEdit,
                        function(success) {
                            vm.showError = false;

                            notify({
                                messageTemplate: '<div class="notify-info-header">Success</div>' +
                                    '<p>All changes have been saved.</p>',
                                classes: 'notify-info',
                                icon: 'check circle',
                                duration: 4000
                            });

                            $scope.eventpage.loadingSave = false;
                            $state.go('event.details', {
                                eventId: vm.eventEdit.id
                            });
                        },
                        function(error) {
                            vm.errorMessage = [];
                            vm.showError = true;
                            $scope.eventpage.loadingSave = false;
                            if (error.data.event) {
                                vm.errorMessage = error.data.event.error;
                            }

                        });
                }
            }

        }

        //extract address from google places result
        function extractFromAddress(components, type, type2) {
            for (var i = 0; i < components.length; i++) {
                for (var j = 0; j < components[i].types.length; j++) {
                    if (components[i].types[j] === type) {
                        return components[i][type2];
                    }
                }
            }
            return '';

        }

        vm.pok = 0;

        //parse location
        function parseLocation() {
            if (vm.eventLocation !== null && typeof vm.eventLocation === 'object' && vm.eventLocation.hasOwnProperty('address_components') && vm.eventLocation.hasOwnProperty('geometry')) {

                var location = vm.eventLocation.address_components;

                vm.eventEdit.street = vm.extractFromAddress(location, 'route', 'long_name') + ' ' + vm.extractFromAddress(location, 'street_number', 'long_name');
                vm.eventEdit.zipcode = vm.extractFromAddress(location, 'postal_code', 'long_name');
                if (vm.eventEdit.zipcode === '') {
                    vm.eventEdit.zipcode = null;
                }
                vm.eventEdit.location_name = vm.eventLocation.name;
                vm.eventEdit.full_address = vm.eventLocation.formatted_address;
                vm.eventEdit.state = vm.extractFromAddress(location, 'administrative_area_level_1', 'short_name');
                vm.eventEdit.country = vm.extractFromAddress(location, 'country', 'short_name');
                vm.eventEdit.city = vm.extractFromAddress(location, 'locality', 'long_name');
                if (vm.eventEdit.state.length > 3) {
                    vm.eventEdit.state = vm.eventEdit.country;
                }
                vm.eventEdit.location = vm.eventLocation.geometry.location['A'] + ',' + vm.eventLocation.geometry.location['F'];
                vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation.formatted_address) + '/@' + vm.eventEdit.location + ',15z';
                vm.mapurlTrue = true;
            } else {
                if (vm.pok > 2) {
                    vm.eventEdit.full_address = '';
                    vm.eventEdit.location_name = vm.eventLocation;
                    vm.eventEdit.location = '0,0';
                    vm.eventEdit.address = vm.eventLocation;
                } else {
                    vm.pok++;
                    return;
                }


            }

        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }



    }
    EventEditController.$inject = ["$scope", "USER_ID", "EventsFactory", "$state", "eventId", "$rootScope", "$log", "$window", "moment", "angularMomentConfig", "notify", "$geolocation"];



})();

(function() {
    'use strict';

    angular
        .module('persice')
        .controller('EventCreateController', EventCreateController);

    /**
     * class EventCreateController
     * classDesc Create event
     * @ngInject
     */
    function EventCreateController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window, moment, $geolocation) {
        var vm = this;
        vm.showError = false;
        vm.showMobile = true;
        vm.showSuccess = false;
        vm.errorMessage = [];
        vm.mapurl = '';
        vm.mapurlTrue = false;
        vm.endsTimeError = false;
        vm.startsTimeError = false;

        vm.$geolocation = $geolocation;

        $geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 2
        }).then(function(location) {
            vm.autocompleteOptions = {
                location: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
                radius: 50000
            };

        });

        vm.autocompleteOptions = {
            location: '0,0',
            radius: 50000
        };
        vm.event = {
            user: '/api/v1/auth/user/' + USER_ID + '/',
            description: '',
            ends_on: '',
            location: '',
            name: '',
            repeat: '',
            starts_on: '',
            street: '',
            city: '',
            zipcode: null,
            state: '',
            full_address: '',
            location_name: '',
            country: ''
        };

        vm.eventLocation = '';

        vm.placeholder = {
            name: 'Event Name',
            starts: 'Starts',
            ends: 'Ends',
            repeat: 'Repeat',
            location: 'Location',
            description: 'Description',
            costs: 'Costs',
            invitations: 'Invitations',
            attachments: 'Attachments'
        };

        vm.saveEvent = saveEvent;
        vm.openMap = openMap;
        vm.resetForm = resetForm;
        vm.extractFromAddress = extractFromAddress;
        vm.parseLocation = parseLocation;
        vm.validateDates = validateDates;

        $scope.$on('saveEvent', function() {
            vm.saveEvent();
        });

        $scope.$on('goBackEvents', function() {
            if ($rootScope.previousEventFeed !== undefined) {
                $state.go($rootScope.previousEventFeed);
            } else {
                $state.go('events.myevents');
            }


        });


        vm.checkDatesStarts = checkDatesStarts;
        vm.checkDatesEnds = checkDatesEnds;

        function checkDatesStarts() {

            if (vm.event.ends_on === '' || vm.event.ends_on === null) {
                vm.event.ends_on = moment(vm.event.starts_on).add(1, 'hour').toDate();
                return;
            }

            if (moment(vm.event.ends_on) >= moment(vm.event.starts_on)) {
                vm.event.ends_on = moment(vm.event.starts_on).add(1, 'hour').toDate();
            }

        }

        function checkDatesEnds() {

            if (vm.event.starts_on === '' || vm.event.starts_on === null) {
                vm.event.starts_on = moment(vm.event.ends_on).subtract(1, 'hour').toDate();
                return;
            }

        }



        $scope.$watch(angular.bind(this, function(eventLocation) {
            return vm.eventLocation;
        }), function(newVal) {
            vm.parseLocation();
        });


        function validateDates() {
            //validate dates
            vm.startsTimeError = false;
            vm.endsTimeError = false;
            if (moment(vm.event.starts_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select a Starts Date that is not set in past.'];
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
            }

            if (moment(vm.event.ends_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select an Ends Date that is not set in past.'];
                vm.endsTimeError = true;
                return;
            }

            if (moment(vm.event.ends_on).unix() > moment().unix() && moment(vm.event.starts_on).unix() > moment().unix() && moment(vm.event.starts_on).unix() > moment(vm.event.ends_on).unix()) {
                vm.showError = true;
                vm.errorMessage = ['Ends Date must be greater or equal to Starts Date.'];
                vm.endsTimeError = true;
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
                vm.endsTimeError = false;
            }
        }


        function saveEvent() {

            vm.showError = false;
            vm.showSuccess = false;
            $('.ui.form')
                .form({
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Event name'
                            }]
                        },
                        location: {
                            identifier: 'location',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Location'
                            }]
                        },
                        repeat: {
                            identifier: 'repeat',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Repeat'
                            }]
                        },
                        description: {
                            identifier: 'description',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Description'
                            }]
                        },
                        starts_on_date: {
                            identifier: 'starts_on_date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Starts Date'
                            }]
                        },
                        starts_on_time: {
                            identifier: 'starts_on_time',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Starts Time'
                            }]
                        },
                        ends_on_date: {
                            identifier: 'ends_on_date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Ends Date'
                            }]
                        },
                        ends_on_time: {
                            identifier: 'ends_on_time',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Ends Time'
                            }]
                        },
                    }
                });
            $('.ui.form').form('validate form');
            if (vm.event.description === '' || vm.event.ends_on === '' || vm.event.ends_on === null || vm.event.starts_on === null || vm.event.location === '' || vm.event.name === '' || vm.event.starts_on === '' || vm.event.repeat === '') {
                vm.showError = true;
                if (vm.event.starts_on === '' || vm.event.starts_on === null) {
                    vm.startsTimeError = true;
                }
                if (vm.event.ends_on === '' || vm.event.ends_on === null) {
                    vm.endsTimeError = true;
                }
                vm.errorMessage = ['Please enter all required fields.'];
            } else {
                vm.showError = false;
                vm.validateDates();

                vm.showSuccess = false;

                if (!vm.showError) {
                    EventsFactory.save({}, vm.event,
                        function(success) {
                            vm.showError = false;
                            $state.go('events.myevents');
                        },
                        function(error) {
                            vm.errorMessage = [];
                            vm.showError = true;
                            if (error.data.event) {
                                vm.errorMessage = error.data.event.error;
                            }

                        });
                }
            }

        }

        //extract address from google places result
        function extractFromAddress(components, type, type2) {
            for (var i = 0; i < components.length; i++) {
                for (var j = 0; j < components[i].types.length; j++) {
                    if (components[i].types[j] === type) {
                        return components[i][type2];
                    }
                }
            }
            return '';

        }

        //parse location
        function parseLocation() {
            vm.mapurl = '';
            vm.mapurlTrue = false;
            if (vm.eventLocation !== null && typeof vm.eventLocation === 'object' && vm.eventLocation.hasOwnProperty('address_components') && vm.eventLocation.hasOwnProperty('geometry')) {
                var location = vm.eventLocation.address_components;

                vm.event.street = vm.extractFromAddress(location, 'route', 'long_name') + ' ' + vm.extractFromAddress(location, 'street_number', 'long_name');
                vm.event.zipcode = vm.extractFromAddress(location, 'postal_code', 'long_name');
                if (vm.event.zipcode === '') {
                    vm.event.zipcode = null;
                }
                vm.event.location_name = vm.eventLocation.name;
                vm.event.full_address = vm.eventLocation.formatted_address;
                vm.event.state = vm.extractFromAddress(location, 'administrative_area_level_1', 'short_name');
                vm.event.country = vm.extractFromAddress(location, 'country', 'short_name');
                vm.event.city = vm.extractFromAddress(location, 'locality', 'long_name');
                if (vm.event.state.length > 3) {
                    vm.event.state = vm.event.country;
                }
                vm.event.location = vm.eventLocation.geometry.location['A'] + ',' + vm.eventLocation.geometry.location['F'];
                vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation.formatted_address) + '/@' + vm.event.location + ',15z';
                vm.mapurlTrue = true;
            } else {
                vm.event.address = vm.eventLocation;
                vm.event.full_address = '';
                vm.event.location_name = vm.eventLocation;
                vm.event.location = '0,0';
            }

        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }


        function resetForm() {
            vm.showError = false;
            vm.showSuccess = false;
            vm.errorMessage = [];
            vm.mapurl = '';
            vm.mapurlTrue = false;
            vm.eventLocation = '';
            vm.event = {
                user: '/api/v1/auth/user/' + USER_ID + '/',
                description: '',
                ends_on: '',
                location: '',
                name: '',
                repeat: '',
                starts_on: '',
                street: '',
                city: '',
                zipcode: null,
                state: '',
                full_address: '',
                location_name: '',
                country: ''
            };
        }

    }
    EventCreateController.$inject = ["$scope", "USER_ID", "EventsFactory", "$state", "$rootScope", "$log", "$window", "moment", "$geolocation"];



})();
(function() {
    'use strict';

    angular
        .module('persice')
        .controller('EventAttendeesController', EventAttendeesController);

    /**
     * class EventAttendeesController
     * classDesc view event attendees
     * @ngInject
     */
    function EventAttendeesController($scope, USER_ID, EventsFactory, $state, eventId, $rootScope, $log, $window, angularMomentConfig, MembersFactory) {
        var vm = this;


        vm.connectionsYes = [{
                id: 1,
                rsvp: '',
                first_name: 'Lena',
                age: 35,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Creative designer & hiker'
            }, {
                id: 3,
                rsvp: '',
                first_name: 'Charlie',
                age: 39,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Hacker, Guitaris, and veteran Burner'
            }

        ];


        vm.connectionsNo = [{
                id: 2,
                rsvp: 'YES',
                first_name: 'Brian',
                age: 31,
                invited: true,
                selected: true,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Engineer kiteboarding chess geek'
            },

        ];


        vm.connectionsMaybe = [

            {
                id: 4,
                rsvp: '',
                first_name: 'Daniel',
                age: 25,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Grad student from London'
            },

        ];


        $scope.eventpage.header = 'Attendees';

        $scope.$on('goBackEvents', function() {
            $state.go('event.details', {
                eventId: eventId
            });

        });

    }
    EventAttendeesController.$inject = ["$scope", "USER_ID", "EventsFactory", "$state", "eventId", "$rootScope", "$log", "$window", "angularMomentConfig", "MembersFactory"];



})();

'use strict';

angular.module('persice')
    .controller('EditMyProfileCtrl', ["$scope", "$timeout", "USER_ID", "$q", "$state", "UsersFactory", "GoalsFactory", "LikesFactory", "SubjectsFactory", "OffersFactory", "InterestsFactory", "PhotosFactory", "$log", "$filter", "$cookies", "$http", "FB_TOKEN", "$location", "$anchorScroll", "$window", "$resource", "notify", function($scope, $timeout, USER_ID, $q, $state, UsersFactory, GoalsFactory, LikesFactory, SubjectsFactory, OffersFactory, InterestsFactory, PhotosFactory, $log, $filter, $cookies, $http, FB_TOKEN, $location, $anchorScroll, $window, $resource, notify) {
        $scope.social = {
            twitter: '',
            linkedin: ''
        };

        $scope.userUri = '/api/v1/auth/user/' + USER_ID + '/';
        $scope.user = {
            id: USER_ID,
            firstName: '',
            lastName: '',
            age: '',
            about_me: '',
            photos: [{
                id: 0,
                order: 0,
                photo: '',
                cropped_photo: ''
            }, {
                id: 0,
                order: 1,
                photo: '',
                cropped_photo: ''
            }, {
                id: 0,
                order: 2,
                photo: '',
                cropped_photo: ''
            }, {
                id: 0,
                order: 3,
                photo: '',
                cropped_photo: ''
            }, {
                id: 0,
                order: 4,
                photo: '',
                cropped_photo: ''
            }, {
                id: 0,
                order: 5,
                photo: '',
                cropped_photo: ''
            }],
            goals: [

            ],
            offers: [

            ],
            likes: [],
            interests: [],
            mutual: {
                friends: [],
                facebookfriends: [],
                twitterfriends: [],
                twitterfollowers: [],
                linkedinconnections: [],
            }
        };



        $scope.loadingUser = false;
        $scope.loadingGoals = false;
        $scope.loadingOffers = false;
        $scope.loadingLikes = false;
        $scope.loadingInterests = false;

        $scope.getUser = function() {

            $scope.loadingUser = true;
            $scope.loadingGoals = true;
            $scope.loadingOffers = true;
            $scope.loadingLikes = true;
            $scope.loadingInterests = true;

            GoalsFactory.query({
                user_id: USER_ID,
                format: 'json'
            }).$promise.then(function(data) {
                if (data.meta.total_count > 0) {
                    $scope.user.goals = data.objects;
                }
                $scope.loadingGoals = false;



            });

            OffersFactory.query({
                user_id: USER_ID,
                format: 'json'
            }).$promise.then(function(data) {
                if (data.meta.total_count > 0) {
                    $scope.user.offers = data.objects;
                }
                $scope.loadingOffers = false;

            });

            LikesFactory.query({
                user_id: USER_ID,
                format: 'json'
            }).$promise.then(function(data) {
                if (data.meta.total_count > 0) {
                    $scope.user.likes = data.objects;
                }
                $scope.loadingLikes = false;

            });


            InterestsFactory.query({
                user_id: USER_ID,
                format: 'json'
            }).$promise.then(function(data) {
                if (data.meta.total_count > 0) {
                    $scope.user.interests = data.objects;
                }
                $scope.loadingInterests = false;

            });



            UsersFactory.get({
                format: 'json'
            }, {
                userId: USER_ID
            }).$promise.then(function(data) {

                $scope.user.firstName = data.first_name;
                $scope.user.lastName = data.last_name;
                $scope.user.about_me = data.about_me;
                $scope.user.age = data.age;
                $scope.user.facebookId = data.facebook_id;
                $scope.user.facebookProfile = data.facebook_profile_url;
                if (data.twitter_provider !== null) {
                    $scope.social.twitter = data.twitter_username;
                }

                if (data.linkedin_provider !== null) {
                    $scope.social.linkedin = data.linkedin_provider;
                }

                $scope.loadingUser = false;

            });
        };

        $scope.getUser();


        $scope.link = function(provider) {
            var w = 350;
            var h = 250;

            var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;


            var settings = 'height=' + h + ',width=' + w + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes';
            var url = '/social/associate/' + provider + '/?next=/goals/close_login_popup';
            var newWindow = window.open(url, 'Connecting...', settings);

            if (window.focus) {
                newWindow.focus();
            }
        };

        $scope.unlink = function(provider) {
            var w = 350;
            var h = 250;

            var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;


            var settings = 'height=' + h + ',width=' + w + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes';
            var url = '/social/disconnect/' + provider + '/';
            var newWindow = window.open(url, 'Disconnecting...', settings);

            if (window.focus) {
                newWindow.focus();
            }
        };


        $scope.refreshUser = function() {
            UsersFactory.get({
                format: 'json'
            }, {
                userId: USER_ID
            }).$promise.then(function(data) {
                if (data.twitter_provider === null) {
                    $scope.social.twitter = '';
                } else {
                    $scope.social.twitter = data.twitter_username;
                }

                if (data.linkedin_provider === null) {
                    $scope.social.linkedin = '';
                } else {
                    $scope.social.linkedin = data.linkedin_provider;
                }


            });
        };


        //about_me
        $scope.loadingAbout = false;
        $scope.saveAbout = function() {
            $scope.loadingAbout = true;
            UsersFactory.update({
                    userId: USER_ID
                }, {
                    about_me: $scope.user.about_me
                },
                function(success) {

                    $scope.loadingAbout = false;
                },
                function(error) {
                    $log.info(error);
                });
        };

        //photos

        $scope.apiPhotos = [];
        $scope.facebookPhotos = [];

        $scope.onDropComplete = function(index, obj, evt) {
            var otherObj = $scope.user.photos[index];
            var otherIndex = $scope.user.photos.indexOf(obj);

            $scope.user.photos[index] = obj;
            $scope.user.photos[index].order = index;
            $scope.user.photos[otherIndex] = otherObj;
            $scope.user.photos[otherIndex].order = otherIndex;


            if ($scope.user.photos[index].id !== 0) {
                PhotosFactory.update({
                        photoId: $scope.user.photos[index].id
                    }, {
                        order: $scope.user.photos[index].order
                    },
                    function(success) {},
                    function(error) {
                        $log.info(error);
                    });

            }


            if ($scope.user.photos[otherIndex].id !== 0) {
                PhotosFactory.update({
                        photoId: $scope.user.photos[otherIndex].id
                    }, {
                        order: $scope.user.photos[otherIndex].order
                    },
                    function(success) {},
                    function(error) {
                        $log.info(error);
                    });

            }

        };

        $scope.getPhotos = function() {
            PhotosFactory.query({
                format: 'json'
            }).$promise.then(function(response) {
                $scope.apiPhotos = response.objects;
                for (var obj in $scope.apiPhotos) {
                    for (var p in $scope.user.photos) {
                        if ($scope.user.photos[p].order === $scope.apiPhotos[obj].order) {
                            $scope.user.photos[p].id = $scope.apiPhotos[obj].id;
                            $scope.user.photos[p].photo = $scope.apiPhotos[obj].photo;
                            $scope.user.photos[p].cropped_photo = $scope.apiPhotos[obj].cropped_photo;
                        }
                    }
                }
            });
        };

        $scope.getPhotos();

        $scope.currentAlbum = '';


        $scope.getFBPhotos = function(id, name) {
            $scope.showPhotos = true;
            $scope.myImage = null;
            $scope.photoIndex = null;
            $scope.hideAlbums = true;
            $scope.currentAlbum = name;
            $scope.photosLoading = true;
            $http.get('https://graph.facebook.com/' + id + '?fields=photos{id,height,width,source}&access_token=' + FB_TOKEN).
            success(function(data, status, headers, config) {
                $scope.photosLoading = false;
                $scope.facebookPhotos = data.photos.data;
            }).
            error(function(data, status, headers, config) {
                $scope.photosLoading = false;
            });



        };

        $scope.backToAlbums = function() {
            $scope.showPhotos = true;
            $scope.myImage = null;
            $scope.photoIndex = null;
            $scope.currentAlbum = '';
            $scope.hideAlbums = !$scope.hideAlbums;
            $scope.getFBAlbums();

        };

        $scope.facebookAlbums = [];
        $scope.hideAlbums = false;


        $scope.getFBAlbums = function() {
            $scope.showModal = true;
            $scope.albumsLoading = true;
            $http.get('https://graph.facebook.com/me/albums?fields=picture,name&access_token=' + FB_TOKEN).
            success(function(data, status, headers, config) {
                $scope.facebookAlbums = data.data;
                $scope.albumsLoading = false;

            }).
            error(function(data, status, headers, config) {
                $scope.albumsLoading = false;
            });



        };



        $scope.deletePhoto = function() {
            var deleteIndex = $scope.userPhotoDeleteIndex;
            PhotosFactory.delete({
                    photoId: $scope.user.photos[deleteIndex].id
                },
                function(success) {
                    $scope.user.photos[deleteIndex].photo = '';
                    $scope.user.photos[deleteIndex].cropped_photo = '';
                    $scope.user.photos[deleteIndex].id = 0;
                },
                function(error) {
                    $log.info(error);
                });

        };

        $scope.closeModal = function() {
            $scope.showModal = false;

            $scope.showPhotos = true;
            $scope.myImage = null;
            $scope.photoIndex = null;

            $timeout(function() {
                $location.hash('my-profile-header-edit');
                $anchorScroll();
            }, 600);

        };

        $scope.showModal = false;
        $scope.albumsLoading = false;
        $scope.photosLoading = false;

        $scope.showPhotos = true;
        $scope.myImage = null;
        $scope.photoIndex = null;
        $scope.myCroppedImage = null;

        $scope.showCrop = function(index) {
            $scope.photoIndex = index;
            $scope.myImage = $scope.facebookPhotos[index].source;
            $scope.showPhotos = false;
        };

        $scope.myCroppedImage = '';

        $scope.createPhoto = function(croppedPhoto) {

            var indexFbPhoto = $scope.photoIndex;


            var newFbPhoto = $scope.facebookPhotos[indexFbPhoto];
            var newPhoto = {
                cropped_photo: croppedPhoto,
                photo: newFbPhoto.source,
                order: $scope.newPhotoIndex,
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            PhotosFactory.save({}, newPhoto,
                function(success) {
                    var index = $scope.newPhotoIndex;
                    $scope.user.photos[index].photo = success.photo;
                    $scope.user.photos[index].cropped_photo = success.cropped_photo;
                    $scope.user.photos[index].id = success.id;
                    $scope.closeModal();


                },
                function(error) {});



        };

        $scope.$on('ngRepeatFinishedPhotos', function() {
            $('#deletePhotoModal').modal('attach events', '.delete_photo', 'show');

        });

        $scope.$on('ngRepeatFinished', function() {
            $('.ui.search.goals')
                .search({
                    apiSettings: {
                        url: 'api/v1/subject/?format=json&description__icontains={query}',
                        onResponse: function(apiResponse) {
                            var
                                response = {
                                    results: []
                                };
                            // translate api response to work with search
                            $.each(apiResponse.objects, function(index, item) {

                                // add result to response array
                                response.results.push({
                                    title: item.description,
                                });
                            });
                            return response;
                        },
                    },
                    minCharacters: 3,
                    searchDelay: 300,
                    searchFields: ['title'],
                    type: 'standard',
                    cache: false,
                    error: {
                        noResults: 'No existing goal found. Create new goal &raquo;',
                    },
                    onSelect: function(result, response) {
                        var idx = $(this).attr('rel');
                        if (result !== undefined) {
                            $scope.user.goals[idx].subject = result.title;

                        }

                    }


                });


            $('.ui.search.offers')
                .search({
                    apiSettings: {
                        url: 'api/v1/subject/?format=json&description__icontains={query}',
                        onResponse: function(apiResponse) {
                            var
                                response = {
                                    results: []
                                };
                            // translate api response to work with search
                            $.each(apiResponse.objects, function(index, item) {

                                // add result to response array
                                response.results.push({
                                    title: item.description,
                                });
                            });
                            return response;
                        },
                    },
                    minCharacters: 3,
                    searchDelay: 400,
                    searchFields: ['title'],
                    type: 'standard',
                    error: {
                        noResults: 'No existing offer found. Create new offer &raquo;',
                    },
                    cache: false,
                    onSelect: function(result, response) {
                        var idx = $(this).attr('rel');
                        if (result !== undefined) {
                            $scope.user.offers[idx].subject = result.title;

                        }

                    }


                });

            $('.ui.search.interests')
                .search({
                    apiSettings: {
                        url: 'api/v1/interest_subject/?format=json&description__icontains={query}',
                        onResponse: function(apiResponse) {
                            var
                                response = {
                                    results: []
                                };
                            // translate api response to work with search
                            $.each(apiResponse.objects, function(index, item) {

                                // add result to response array
                                response.results.push({
                                    title: item.description,
                                });
                            });
                            return response;
                        },
                    },
                    searchFields: ['title'],
                    minCharacters: 3,
                    searchDelay: 400,
                    type: 'standard',
                    error: {
                        noResults: 'No existing interest found. Create new interest &raquo;',
                    },
                    cache: false,
                    onSelect: function(result, response) {
                        var idx = $(this).attr('rel');
                        if (result !== undefined) {
                            $scope.user.interests[idx].interest_subject = result.title;

                        }

                    }


                });

        });


        $scope.goalNeedSaving = function(index) {
            $scope.user.goals[index].changed = true;
        };

        $scope.createNewGoal = function() {

            var newGoal = {
                id: 0,
                subject: '',
                user: $scope.userUri,
                changed: true
            };

            $scope.user.goals.push(newGoal);

        };


        $scope.removeGoal = function(index) {

            var Goal = $resource($scope.user.goals[index].resource_uri);

            if ($scope.user.goals[index].id === 0) {
                $scope.user.goals.splice(index, 1);
            } else {
                Goal.delete().$promise.then(function(data) {
                    $scope.user.goals.splice(index, 1);
                });
            }

        };


        $scope.saveCurrentGoal = function(index) {

            var deferred = $q.defer();

            $scope.user.goals[index].errorMessage = '';
            $scope.user.goals[index].error = false;

            if ($scope.user.goals[index].subject.length > 300) {
                $scope.user.goals[index].error = true;
                $scope.user.goals[index].errorMessage = 'Goal cannot have more than 300 characters.';
                deferred.reject();
                return deferred.promise;
            }

            if ($scope.user.goals[index].subject === '') {
                $scope.user.goals[index].error = true;
                $scope.user.goals[index].errorMessage = 'Entering your goal is required.';
                deferred.reject();
            } else {
                if ($scope.user.goals[index].id === 0) {
                    //create new goal
                    var newGoal = {
                        goal_subject: $scope.user.goals[index].subject,
                        user: $scope.userUri
                    };
                    $scope.user.goals[index].loading = true;
                    $scope.user.goals[index].error = false;
                    GoalsFactory.save({}, newGoal,
                        function(success) {
                            $scope.user.goals[index].loading = false;
                            $scope.user.goals[index].error = false;
                            $scope.user.goals[index].id = success.id;
                            $scope.user.goals[index].goal = success.goal;
                            $scope.user.goals[index].goal_subject = success.goal_subject;
                            $scope.user.goals[index].resource_uri = success.resource_uri;
                            $scope.user.goals[index].user = success.user;

                            $scope.user.goals[index].changed = false;
                            deferred.resolve();
                        },
                        function(error) {
                            $scope.user.goals[index].errorMessage = error.data.goal.error[0];
                            $scope.user.goals[index].loading = false;
                            $scope.user.goals[index].error = true;
                            deferred.reject();

                        });
                } else {
                    //edit goal
                    $scope.user.goals[index].error = false;
                    $scope.user.goals[index].loading = true;
                    GoalsFactory.update({
                            goalId: $scope.user.goals[index].id
                        }, {
                            goal_subject: $scope.user.goals[index].subject
                        },
                        function(success) {
                            $scope.user.goals[index].loading = false;
                            $scope.user.goals[index].error = false;
                            $scope.user.goals[index].goal = success.goal;
                            $scope.user.goals[index].goal_subject = success.goal_subject;
                            $scope.user.goals[index].resource_uri = success.resource_uri;

                            $scope.user.goals[index].changed = false;
                            deferred.resolve();

                        },
                        function(error) {
                            if (error.data.goal) {
                                $scope.user.goals[index].errorMessage = error.data.goal.error[0];
                            } else {
                                $scope.user.goals[index].errorMessage = 'There was an error when trying to save this field.';
                            }
                            $scope.user.goals[index].loading = false;
                            $scope.user.goals[index].error = true;
                            deferred.reject();

                        });


                }
            }

            return deferred.promise;
        };

        $scope.offerNeedSaving = function(index) {
            $scope.user.offers[index].changed = true;
        };


        $scope.createNewOffer = function() {

            var newOffer = {
                id: 0,
                subject: '',
                user: $scope.userUri,
                changed: true
            };

            $scope.user.offers.push(newOffer);

        };


        $scope.removeOffer = function(index) {

            var Offer = $resource($scope.user.offers[index].resource_uri);

            if ($scope.user.offers[index].id === 0) {
                $scope.user.offers.splice(index, 1);
            } else {
                Offer.delete().$promise.then(function(data) {
                    $scope.user.offers.splice(index, 1);
                });
            }

        };


        $scope.saveCurrentOffer = function(index) {

            var deferred = $q.defer();

            $scope.user.offers[index].errorMessage = '';
            $scope.user.offers[index].error = false;

            if ($scope.user.offers[index].subject.length > 300) {
                $scope.user.offers[index].error = true;
                $scope.user.offers[index].errorMessage = 'Offer cannot have more than 300 characters.';
                deferred.reject();
                return deferred.promise;
            }

            if ($scope.user.offers[index].subject === '') {
                $scope.user.offers[index].error = true;
                $scope.user.offers[index].errorMessage = 'Entering your offer is required.';
                deferred.reject();
            } else {
                if ($scope.user.offers[index].id === 0) {
                    //create new offer
                    var newOffer = {
                        offer_subject: $scope.user.offers[index].subject,
                        user: $scope.userUri
                    };
                    $scope.user.offers[index].loading = true;
                    $scope.user.offers[index].error = false;
                    OffersFactory.save({}, newOffer,
                        function(success) {
                            $scope.user.offers[index].loading = false;
                            $scope.user.offers[index].error = false;
                            $scope.user.offers[index].id = success.id;
                            $scope.user.offers[index].offer = success.offer;
                            $scope.user.offers[index].offer_subject = success.offer_subject;
                            $scope.user.offers[index].resource_uri = success.resource_uri;
                            $scope.user.offers[index].user = success.user;

                            $scope.user.offers[index].changed = false;
                            deferred.resolve();
                        },
                        function(error) {
                            $scope.user.offers[index].errorMessage = error.data.offer.error[0];
                            $scope.user.offers[index].loading = false;
                            $scope.user.offers[index].error = true;
                            deferred.reject();

                        });
                } else {
                    //edit offer
                    $scope.user.offers[index].error = false;
                    $scope.user.offers[index].loading = true;
                    OffersFactory.update({
                            offerId: $scope.user.offers[index].id
                        }, {
                            offer_subject: $scope.user.offers[index].subject
                        },
                        function(success) {
                            $scope.user.offers[index].loading = false;
                            $scope.user.offers[index].error = false;
                            $scope.user.offers[index].offer = success.offer;
                            $scope.user.offers[index].offer_subject = success.offer_subject;
                            $scope.user.offers[index].resource_uri = success.resource_uri;

                            $scope.user.offers[index].changed = false;
                            deferred.resolve();

                        },
                        function(error) {
                            if (error.data.offer) {
                                $scope.user.offers[index].errorMessage = error.data.offer.error[0];
                            } else {
                                $scope.user.offers[index].errorMessage = 'There was an error when trying to save this field.';
                            }
                            $scope.user.offers[index].loading = false;
                            $scope.user.offers[index].error = true;
                            deferred.reject();

                        });


                }
            }

            return deferred.promise;
        };


        $scope.interestNeedSaving = function(index) {
            $scope.user.interests[index].changed = true;
        };

        $scope.createNewInterest = function() {

            var newInterest = {
                id: 0,
                interest_subject: '',
                interest: null,
                user: $scope.userUri,
                changed: true
            };

            $scope.user.interests.push(newInterest);

        };


        $scope.removeInterest = function(index) {

            var Interest = $resource($scope.user.interests[index].resource_uri);

            if ($scope.user.interests[index].id === 0) {
                $scope.user.interests.splice(index, 1);
            } else {
                Interest.delete().$promise.then(function(data) {
                    $scope.user.interests.splice(index, 1);
                });
            }

        };


        $scope.saveCurrentInterest = function(index) {
            var deferred = $q.defer();
            $scope.user.interests[index].errorMessage = '';
            $scope.user.interests[index].error = false;

            if ($scope.user.interests[index].interest_subject.length > 100) {
                $scope.user.interests[index].error = true;
                $scope.user.interests[index].errorMessage = 'Interest cannot have more than 100 characters.';
                deferred.reject();
                return deferred.promise;
            }

            if ($scope.user.interests[index].interest_subject === '') {
                $scope.user.interests[index].error = true;
                $scope.user.interests[index].errorMessage = 'Entering your interest is required.';
                deferred.reject();
            } else {
                if ($scope.user.interests[index].id === 0) {
                    //create new interest
                    var newInterest = {
                        interest_subject: $scope.user.interests[index].interest_subject,
                        user: $scope.userUri
                    };
                    $scope.user.interests[index].loading = true;
                    $scope.user.interests[index].error = false;
                    InterestsFactory.save({}, newInterest,
                        function(success) {
                            $scope.user.interests[index].loading = false;
                            $scope.user.interests[index].error = false;
                            $scope.user.interests[index].id = success.id;
                            $scope.user.interests[index].interest = success.interest;
                            $scope.user.interests[index].interest_subject = success.interest_subject;
                            $scope.user.interests[index].resource_uri = success.resource_uri;
                            $scope.user.interests[index].user = success.user;

                            $scope.user.interests[index].changed = false;
                            deferred.resolve();
                        },
                        function(error) {
                            $scope.user.interests[index].errorMessage = error.data.interest.error[0];
                            $scope.user.interests[index].loading = false;
                            $scope.user.interests[index].error = true;
                            deferred.reject();

                        });
                } else {
                    //edit interest
                    $scope.user.interests[index].error = false;
                    $scope.user.interests[index].loading = true;
                    InterestsFactory.update({
                            interestId: $scope.user.interests[index].id
                        }, {
                            interest_subject: $scope.user.interests[index].interest_subject
                        },
                        function(success) {
                            $scope.user.interests[index].loading = false;
                            $scope.user.interests[index].error = false;
                            $scope.user.interests[index].interest = success.interest;
                            $scope.user.interests[index].interest_subject = success.interest_subject;
                            $scope.user.interests[index].resource_uri = success.resource_uri;

                            $scope.user.interests[index].changed = false;
                            deferred.resolve();

                        },
                        function(error) {
                            if (error.data.interest) {
                                $scope.user.interests[index].errorMessage = error.data.interest.error[0];
                            } else {
                                $scope.user.interests[index].errorMessage = 'There was an error when trying to save this field.';
                            }
                            $scope.user.interests[index].loading = false;
                            $scope.user.interests[index].error = true;
                            deferred.reject();

                        });


                }
            }

            return deferred.promise;


        };


        //multiple save action for goals, offers and interests
        $scope.savingAllChanges = false;
        $scope.startSavingChanges = function() {

            var promise = $scope.saveChanges();
            $scope.savingAllChanges = true;
            promise.then(function(greeting) {
                $log.info('Success saving');
                $scope.savingAllChanges = false;
                notify({
                    messageTemplate: '<div class="notify-info-header">Success</div>' +
                        '<p>All changes have been saved.</p>',
                    classes: 'notify-info',
                    icon: 'check circle',
                    duration: 4000
                });
                $state.go('myprofile');
            }, function(reason) {
                $log.info('Failed');
                $scope.savingAllChanges = false;

                notify({
                    messageTemplate: '<div class="notify-error-header">Could not save your profile changes.</div>' +
                        '<p>There were some errors. Please see them below.</p>',
                    scope: $scope,
                    classes: 'notify-error',
                    icon: 'warning circle',
                    duration: 4000
                });

            }, function(update) {

            });

        };

        $scope.saveChanges = function() {
            var deferred = $q.defer();

            var needToSaveCounter = 0;
            for (var obj in $scope.user.goals) {
                if ($scope.user.goals[obj].changed) {
                    needToSaveCounter++;
                }
            }

            for (var obj in $scope.user.offers) {
                if ($scope.user.offers[obj].changed) {
                    needToSaveCounter++;
                }
            }

            for (var obj in $scope.user.interests) {
                if ($scope.user.interests[obj].changed) {
                    needToSaveCounter++;
                }
            }


            if (needToSaveCounter > 0) {
                for (var obj in $scope.user.goals) {
                    if ($scope.user.goals[obj].changed) {
                        $scope.saveCurrentGoal(obj).then(function(greeting) {
                            needToSaveCounter--;
                            if (needToSaveCounter === 0) {
                                deferred.resolve();
                            }
                        }, function(reason) {
                            deferred.reject();
                        }, function(update) {

                        });
                    }
                }

                for (var obj in $scope.user.offers) {
                    if ($scope.user.offers[obj].changed) {
                        $scope.saveCurrentOffer(obj).then(function(greeting) {
                            needToSaveCounter--;
                            if (needToSaveCounter === 0) {
                                deferred.resolve();
                            }
                        }, function(reason) {
                            deferred.reject();
                        }, function(update) {

                        });
                    }
                }

                for (var obj in $scope.user.interests) {
                    if ($scope.user.interests[obj].changed) {
                        $scope.saveCurrentInterest(obj).then(function(greeting) {
                            needToSaveCounter--;
                            if (needToSaveCounter === 0) {
                                deferred.resolve();
                            }
                        }, function(reason) {
                            deferred.reject();
                        }, function(update) {

                        });
                    }
                }
            } else {
                deferred.resolve();
            }

            return deferred.promise;


        };



    }]);

'use strict';

angular.module('persice')
    .controller('ConversationsCtrl', ["$rootScope", "notify", "$resource", "$window", "$state", "NotificationsRepository", "InboxRepository", "myIoSocket", "Connection", "$q", "$http", "$scope", "USER_ID", "$log", "$timeout", "FRIEND", "MessagesFactory", "$filter", "FriendsFactory", function($rootScope, notify, $resource, $window, $state, NotificationsRepository, InboxRepository, myIoSocket, Connection, $q, $http, $scope, USER_ID, $log, $timeout, FRIEND, MessagesFactory, $filter, FriendsFactory) {

        $scope.leftActive = true;
        $scope.messages = [];
        $scope.friendshipId = Connection.objects[0].id;
        $scope.friendImage = '//graph.facebook.com/' + Connection.objects[0].facebook_id + '/picture?type=square';
        notify.closeAll();



        $scope.status = {
            loading: false,
            loaded: false
        };

        $scope.q = '';
        $scope.newmessage = '';

        $scope.nextOffset = 20;
        $scope.next = null;

        $scope.friend = FRIEND;

        $scope.recipient = '/api/v1/auth/user/' + $scope.friend.id + '/';
        $scope.sender = '/api/v1/auth/user/' + USER_ID + '/';

        $scope.loadingMessages = false;
        $scope.loadingOlderMessages = false;
        $scope.sendingMessage = false;



        $scope.scrollConversations = function() {
            $timeout(function() {
                var height = angular.element('.conversation-content')[0].scrollHeight;

                angular.element('.conversation-content').filter(':not(:animated)').animate({
                    scrollTop: height
                }, 1500);
            }, 100);
        };

        $scope.loadMore = function() {
            var deferred = $q.defer();

            if ($scope.next === null) {
                deferred.reject();
                return deferred.promise;
            }

            if (!$scope.status.loading) {
                $scope.status.loading = true;
                // simulate an ajax request
                $timeout(function() {
                    MessagesFactory.query({
                        user_id: $scope.friend.id,
                        offset: $scope.nextOffset,
                        limit: 10
                    }).$promise.then(function(response) {
                        var responseMessages = response.objects;
                        $scope.next = response.meta.next;
                        $filter('orderBy')(responseMessages, 'sent_at', true);
                        $scope.nextOffset += 10;

                        for (var obj in responseMessages) {
                            var localDate = $filter('amDateFormat')(responseMessages[obj].sent_at, 'dddd, MMMM D, YYYY');
                            var localDatePlain = $filter('amDateFormat')(responseMessages[obj].sent_at, 'L');

                            var messageIndex = $filter('getIndexByProperty')('date', localDate, $scope.messages);

                            if (messageIndex === null) {
                                $scope.messages.push({
                                    date: localDate,
                                    realDate: localDatePlain,
                                    contents: []
                                });
                                messageIndex = $scope.messages.length - 1;
                            }


                            if (responseMessages[obj].sender === $scope.sender) {
                                $scope.messages[messageIndex].contents.push({
                                    body: responseMessages[obj].body,
                                    sender: responseMessages[obj].sender,
                                    recipient: responseMessages[obj].recipient,
                                    date: localDatePlain,
                                    sent_at: responseMessages[obj].sent_at,
                                    left: true
                                });
                            } else {
                                $scope.messages[messageIndex].contents.push({
                                    body: responseMessages[obj].body,
                                    sender: responseMessages[obj].sender,
                                    recipient: responseMessages[obj].recipient,
                                    date: localDatePlain,
                                    sent_at: responseMessages[obj].sent_at,
                                    left: false
                                });
                            }
                            $scope.messages[messageIndex].contents = $filter('orderBy')($scope.messages[messageIndex].contents, 'sent_at', true);
                        }

                        $scope.messages = $filter('orderBy')($scope.messages, 'realDate');

                        $scope.status.loading = false;
                        $scope.status.loaded = true;
                        deferred.resolve();
                    }, function(response) {
                        deferred.reject();
                        $scope.status.loading = false;
                        var data = response.data,
                            status = response.status,
                            header = response.header,
                            config = response.config,
                            message = 'Error ' + status;
                        // error handler
                        $log.error(message);

                    });
                }, 400);



            } else {
                deferred.reject();
            }
            return deferred.promise;
        };



        $scope.getMessages = function() {
            $scope.messages = [];
            $scope.loadingMessages = true;
            $scope.status.loaded = false;
            MessagesFactory.query({
                user_id: $scope.friend.id,
                limit: 20,
                offset: 0
            }).$promise.then(function(response) {
                var responseMessages = response.objects;
                $scope.next = response.meta.next;
                $filter('orderBy')(responseMessages, 'sent_at', true);

                $scope.status.loaded = true;
                for (var obj in responseMessages) {
                    var localDate = $filter('amDateFormat')(responseMessages[obj].sent_at, 'dddd, MMMM D, YYYY');
                    var localDatePlain = $filter('amDateFormat')(responseMessages[obj].sent_at, 'L');

                    var messageIndex = $filter('getIndexByProperty')('date', localDate, $scope.messages);

                    if (messageIndex === null) {
                        $scope.messages.push({
                            date: localDate,
                            realDate: localDatePlain,
                            contents: []
                        });
                        messageIndex = $scope.messages.length - 1;
                    }


                    if (responseMessages[obj].sender === $scope.sender) {
                        $scope.messages[messageIndex].contents.push({
                            body: responseMessages[obj].body,
                            sender: responseMessages[obj].sender,
                            recipient: responseMessages[obj].recipient,
                            date: localDatePlain,
                            sent_at: responseMessages[obj].sent_at,
                            left: true
                        });
                    } else {
                        $scope.messages[messageIndex].contents.push({
                            body: responseMessages[obj].body,
                            sender: responseMessages[obj].sender,
                            recipient: responseMessages[obj].recipient,
                            date: localDatePlain,
                            sent_at: responseMessages[obj].sent_at,
                            left: false
                        });
                    }
                    $scope.messages[messageIndex].contents = $filter('orderBy')($scope.messages[messageIndex].contents, 'sent_at', true);
                }

                $scope.messages = $filter('orderBy')($scope.messages, 'realDate');


                if ($scope.messages.length > 0) {
                    $timeout(function() {
                        var height = angular.element('.conversation-content')[0].scrollHeight;
                        angular.element('.conversation-content').filter(':not(:animated)').animate({
                            scrollTop: height
                        }, 0);
                    }, 100);

                    //mark all messages in conversation as read
                    $http.get('/api/v1/inbox/reat_at/?sender_id=' + $scope.friend.id).
                    success(function(data, status, headers, config) {
                        //refresh counter of new messages
                        InboxRepository.getInboxMessages();

                        //refresh notification state
                        NotificationsRepository.refreshTotalInbox();

                    }).
                    error(function(data, status, headers, config) {

                    });
                }

                $scope.loadingMessages = false;


            }, function(response) {
                $scope.loadingMessages = false;
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                // error handler
                $log.error(message);

            });
        };

        $scope.getMessages();



        $scope.sendNewMessage = function() {

            if ($scope.newmessage === '') {
                $scope.sendingMessage = false;

            } else {

                $scope.sendingMessage = true;
                var newMessage = {};
                newMessage = {
                    sender: $scope.sender,
                    recipient: $scope.recipient,
                    body: $scope.newmessage
                };


                MessagesFactory.save({}, newMessage,
                    function(success) {
                        // myIoSocket.emit('notification', success);
                        newMessage.left = true;
                        newMessage.sent_at = success.sent_at;
                        newMessage.sender = success.sender;
                        newMessage.recipient = success.recipient;
                        var localDatePlain = $filter('amDateFormat')(newMessage.sent_at, 'L');
                        var localDate = $filter('amDateFormat')(newMessage.sent_at, 'dddd, MMMM D, YYYY');
                        var messageIndex = $filter('getIndexByProperty')('date', localDate, $scope.messages);
                        newMessage.date = localDatePlain;

                        if (messageIndex === null) {
                            $scope.messages.push({
                                date: localDate,
                                realDate: localDatePlain,
                                contents: []
                            });
                            messageIndex = $scope.messages.length - 1;
                        }

                        $scope.messages[messageIndex].contents.push(newMessage);
                        $scope.newmessage = '';
                        $log.info('New message saved.');
                        $scope.sendingMessage = false;
                        $scope.scrollConversations();

                    },
                    function(error) {
                        $scope.sendingMessage = false;
                        $log.info(error);
                    });

            }

        };


        // listen for the event when new message arrives
        $rootScope.$on('receivedMessage', function(event, data) {
            var jsonData = JSON.parse(data);

            if (jsonData.sender === $scope.recipient) {

                $log.info('new message');

                var localDate = $filter('amDateFormat')(jsonData.sent_at, 'dddd, MMMM D, YYYY');
                var localDatePlain = $filter('amDateFormat')(jsonData.sent_at, 'L');

                var messageIndex = $filter('getIndexByProperty')('date', localDate, $scope.messages);

                if (messageIndex === null) {
                    $scope.messages.push({
                        date: localDate,
                        realDate: localDatePlain,
                        contents: []
                    });
                    messageIndex = $scope.messages.length - 1;
                }



                $scope.messages[messageIndex].contents.push({
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

                $scope.messages[messageIndex].contents = $filter('orderBy')($scope.messages[messageIndex].contents, 'sent_at', true);
                $scope.messages = $filter('orderBy')($scope.messages, 'realDate');

                //mark all messages in conversation as read
                $http.get('/api/v1/inbox/reat_at/?sender_id=' + $scope.friend.id).
                success(function(data, status, headers, config) {
                    //refresh counter of new messages
                    InboxRepository.getInboxMessages();

                    //refresh notification state
                    NotificationsRepository.refreshTotalInbox();
                }).
                error(function(data, status, headers, config) {

                });

                $timeout(function() {
                    var height = angular.element('.conversation-content')[0].scrollHeight;
                    angular.element('.conversation-content').filter(':not(:animated)').animate({
                        scrollTop: height
                    }, 1500);
                }, 100);

                $timeout(function() {
                    angular.element('#desktop-conversation-content').filter(':not(:animated)').animate({
                        scrollTop: 0
                    }, 1500);
                }, 100);

            } else {
                //we received message fron other user - refresh counters
                //refresh counter of new messages
                InboxRepository.getInboxMessages();

                //refresh notification state
                NotificationsRepository.refreshTotalInbox();
            }

        });


        $scope.unFriend = function() {

            FriendsFactory.update({
                    friendId: $scope.friendshipId
                }, {
                    status: -1
                },
                function(success) {
                    InboxRepository.getInboxMessages();
                    $state.go('myconnections');
                },
                function(error) {

                });
        };


    }]);
'use strict';

angular.module('persice')
    .controller('BigMatchFeedCtrl', function() {

    });
(function() {
    'use strict';

    /**
     * @desc display for user profile
     * @example <user-profile></user-profile>
     */
    angular
        .module('persice')
        .directive('userProfile', userProfile);

    function userProfile() {
        var directive = {
            controller: UserProfileController,
            controllerAs: 'userprofile',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class',
                header: '@header',
                body: '@body',
                person: '=person',
                type: '@type'
            },
            link: link,
            templateUrl: 'components/userprofile/userprofile.template.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }

    /**
     * @desc controller for userProfile directive
     * @ngInject
     */
    function UserProfileController($scope, UsersFactory, InterestsFactory, ProfileFactory, MatchFeedFactory, MutualFriendsFactory, GoalsFactory, OffersFactory, LikesFactory, PhotosFactory, $log, lodash) {
        var vm = this;

        vm.userId = vm.person.id;
        vm.userPhoto = vm.person.photo;

        vm.getUser = getUser;
        vm.getUserInfo = getUserInfo;
        vm.getPhotos = getPhotos;
        vm.nextImage = nextImage;

        vm.showfullprofile = true;

        vm.social = {
            twitter: '',
            linkedin: '',
            facebook: ''
        };
        vm.user = {
            id: vm.person.id,
            first_name: '',
            last_name: '',
            age: '',
            about_me: '',
            photos: [],
            goals: [

            ],
            offers: [

            ],
            likes: [],
            interests: [],
            friends: [],
            facebookfriends: [],
            twitterfriends: [],
            twitterfollowers: [],
            linkedinconnections: [],
            distance: []
        };

        vm.photosSlider = [];


        vm.getUser();
        vm.getPhotos();


        function nextImage() {
            $('#photoSlider').flexslider('next');
        }


        function getUserInfo() {
            UsersFactory.get({
                format: 'json'
            }, {
                userId: vm.userId
            }).$promise.then(function(data) {

                vm.user.first_name = data.first_name;
                vm.user.last_name = data.last_name;
                vm.user.last_name = data.last_name;
                vm.user.about_me = data.about_me;
                vm.user.age = data.age;
                vm.user.facebookId = data.facebook_id;

                if (data.twitter_provider !== null) {
                    vm.social.twitter = data.twitter_username;
                }

                if (data.linkedin_provider !== null) {
                    vm.social.linkedin = data.linkedin_provider;
                }

                if (data.facebook_profile_url !== null) {
                    vm.social.facebook = data.facebook_profile_url;
                }

                vm.loadingUser = false;

            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                vm.loadingUser = false;
                $log.error(message);


            });
        }


        function getUser() {


            if (vm.type === 'loggedInUser') {
                vm.getUserInfo();
            }

            if (vm.type === 'loggedInUser') {

                GoalsFactory.query({
                    user_id: vm.userId,
                    format: 'json'
                }).$promise.then(function(data) {
                    if (data.meta.total_count > 0) {
                        vm.user.goals = data.objects;
                    }
                    vm.loadingGoals = false;

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    $log.error(message);


                });

                OffersFactory.query({
                    user_id: vm.userId,
                    format: 'json'
                }).$promise.then(function(data) {
                    if (data.meta.total_count > 0) {
                        vm.user.offers = data.objects;
                    }
                    vm.loadingOffers = false;

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    $log.error(message);


                });

                LikesFactory.query({
                    format: 'json'
                }).$promise.then(function(data) {
                    if (data.meta.total_count > 0) {
                        vm.user.likes = data.objects;
                    }
                    vm.loadingLikes = false;

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    $log.error(message);


                });


                InterestsFactory.query({
                    user_id: vm.userId,
                    format: 'json'
                }).$promise.then(function(data) {
                    if (data.meta.total_count > 0) {
                        vm.user.interests = data.objects;
                    }
                    vm.loadingInterests = false;

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    $log.error(message);


                });

            }

            if (vm.type === 'friend') {

                ProfileFactory.get({
                    user_id: vm.userId,
                    format: 'json'
                }).$promise.then(function(data) {
                    vm.user.first_name = data.objects[0].first_name;
                    vm.user.last_name = data.objects[0].last_name;
                    vm.user.last_name = data.objects[0].last_name;
                    vm.user.about_me = data.objects[0].about_me;
                    vm.user.age = data.objects[0].age;
                    vm.user.facebookId = data.objects[0].facebook_id;

                    if (data.objects[0].twitter_provider !== null) {
                        vm.social.twitter = data.objects[0].twitter_username;
                    }

                    if (data.objects[0].linkedin_provider !== null) {
                        vm.social.linkedin = data.objects[0].linkedin_provider;
                    }

                    if (data.objects[0].facebook_id !== null) {
                        vm.social.facebook = 'https://www.facebook.com/app_scoped_user_id' + data.objects[0].facebook_id + '/';
                    }

                    var goals = [];
                    vm.user.distance = data.objects[0].distance;
                    var matchedgoals = data.objects[0].goals[0];
                    for (var key in matchedgoals) {
                        var goal = {
                            value: key,
                            match: matchedgoals[key]
                        };
                        goals.push(goal);
                    }
                    vm.user.goals = goals;

                    var offers = [];
                    var matchedoffers = data.objects[0].offers[0];
                    for (var key in matchedoffers) {
                        var offer = {
                            value: key,
                            match: matchedoffers[key]
                        };
                        offers.push(offer);
                    }
                    vm.user.offers = offers;

                    var interests = [];
                    var matchedinterests = data.objects[0].interests[0];
                    for (var key in matchedinterests) {
                        var interest = {
                            value: key,
                            match: matchedinterests[key]
                        };
                        interests.push(interest);
                    }
                    vm.user.interests = interests;

                    var likes = [];
                    var matchedlikes = data.objects[0].likes[0];
                    for (var key in matchedlikes) {
                        var like = {
                            value: key,
                            match: matchedlikes[key]
                        };
                        likes.push(like);
                    }
                    vm.user.likes = likes;

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    // error handler
                    $log.error(message);


                });



                MutualFriendsFactory.query({
                    format: 'json',
                    user_id: vm.userId
                }).$promise.then(function(data) {
                    if (data.objects.length > 0) {
                        vm.user.friends = data.objects[0].mutual_bk_friends;
                        vm.user.facebookfriends = data.objects[0].mutual_fb_friends;
                        vm.user.linkedinconnections = data.objects[0].mutual_linkedin_connections;
                        vm.user.twitterfollowers = data.objects[0].mutual_twitter_followers;
                        vm.user.twitterfriends = data.objects[0].mutual_twitter_friends;

                    }

                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    // error handler
                    $log.error(message);


                });
            }



        }

        function getPhotos() {
            PhotosFactory.query({
                format: 'json',
                user_id: vm.userId
            }).$promise.then(function(response) {
                vm.user.photos = response.objects;

                if (vm.user.photos.length === 0) {
                    var newPhoto = {
                        photo: vm.userPhoto,
                        cropped_photo: '',
                        order: 0,
                        user: '/api/v1/auth/user/' + vm.userId + '/'
                    };

                    PhotosFactory.save({}, newPhoto, function(success) {
                        $log.info(success);
                        $log.info('New photo saved.');
                        vm.user.photos.push({
                            photo: vm.userPhoto,
                            cropped_photo: '',
                            order: 0
                        });
                        vm.photosSlider = vm.user.photos;

                    }, function(error) {
                        $log.info(error);
                    });
                } else {
                    vm.photosSlider = vm.user.photos;
                }
            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                $log.error(message);
            });
        }



    }
    UserProfileController.$inject = ["$scope", "UsersFactory", "InterestsFactory", "ProfileFactory", "MatchFeedFactory", "MutualFriendsFactory", "GoalsFactory", "OffersFactory", "LikesFactory", "PhotosFactory", "$log", "lodash"];



})();

(function() {
    'use strict';
    angular
        .module('persice')
        .factory('SettingsRepository', SettingsRepository);

    /**
     * class SettingsRepository
     * classDesc Service for Settings
     * @ngInject
     */
    function SettingsRepository(SettingsFactory, $log, $filter, $rootScope, USER_ID) {

        var defaultState = {
            distance_unit: 'miles',
            user: '/api/v1/auth/user/' + USER_ID + '/'
        };

        var service = {
            settingsState: {
                distance_unit: 'miles',
                user: '/api/v1/auth/user/' + USER_ID + '/'
            },
            settingId: null,
            getSettings: getSettings,
            saveSettings: saveSettings,
            createSettings: createSettings,
            getSettingState: getSettingsState
        };
        return service;



        function getSettings() {
            $log.info('fetching settings');
            return SettingsFactory.query({
                format: 'json'
            }).$promise.then(getSettingsComplete, getSettingsFailed);

            function getSettingsComplete(response) {
                if (response.objects.length === 0) {
                    service.createSettings(defaultState);
                    service.settingsState = defaultState;
                } else {
                    service.settingId = response.objects[0].id;
                    service.settingsState = response.objects[0];
                }
            }

            function getSettingsFailed(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
                service.settingsState = defaultState;
            }
        }

        function getSettingsState() {
            return service.settingsState;
        }


        function saveSettings(newSettings) {
            $log.info('saving settings');

            if (service.settingId === null) {
                return;
            }



            return SettingsFactory.update({
                settingId: service.settingId
            }, newSettings, saveSettingsSuccess, saveSettingsError);

            function saveSettingsSuccess(response) {
                service.settingsState = newSettings;
            }

            function saveSettingsError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);


            }

        }

        function createSettings(newSettings) {
            $log.info('creating settings');

            return SettingsFactory.save(newSettings, createSettingsSuccess, createSettingsError);

            function createSettingsSuccess(response) {
                $log.info('new settings created');
                service.settingId = response.id;
            }

            function createSettingsError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);


            }

        }



    }
    SettingsRepository.$inject = ["SettingsFactory", "$log", "$filter", "$rootScope", "USER_ID"];

})();
'use strict';
angular
    .module('persice')
    .factory('SettingsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/settings/:settingId/:param', {
            settingId: '@settingId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }]);
(function() {
    'use strict';
    angular
        .module('persice')
        .factory('NotificationsRepository', NotificationsRepository);

    /**
     * class NotificationsRepository
     * classDesc Service for all notifications
     * @ngInject
     */
    function NotificationsRepository($log, $filter, InboxUnreadCounterFactory, NewConnectionsFactory, $rootScope, $q) {

        var service = {
            total: 0,
            totalInbox: 0,
            totalConnections: 0,
            getTotal: getTotal,
            setTotalInbox: setTotalInbox,
            setTotalConnections: setTotalConnections,
            refreshTotalInbox: refreshTotalInbox,
            refreshTotalConnections: refreshTotalConnections,
            getTotalInbox: getTotalInbox,
            getTotalConnections: getTotalConnections,
        };
        return service;

        function refreshTotalInbox() {
            return InboxUnreadCounterFactory.query({
                format: 'json',
                limit: 1,
                offset: 0
            }).$promise.then(getInboxUnreadComplete, getInboxUnreadCounterFailed);


            function getInboxUnreadComplete(response) {

                var unreadCounter = 0;
                if (response.meta.total_count > 0) {
                    unreadCounter = response.objects[0].unread_counter;
                }

                service.setTotalInbox(unreadCounter);


            }

            function getInboxUnreadCounterFailed(error) {

                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
            }


        }

        function refreshTotalConnections() {
            return NewConnectionsFactory.query({
                format: 'json',
                limit: 1,
                offset: 0
            }).$promise.then(getNewConnectionsComplete, getNewConnectionsFailed);


            function getNewConnectionsComplete(response) {

                var unreadCounter = 0;
                if (response.meta.total_count > 0) {
                    unreadCounter = response.objects[0].new_connection_counter;
                }

                service.setTotalConnections(unreadCounter);


            }

            function getNewConnectionsFailed(error) {

                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
            }
        }

        function setTotalInbox(value) {
            service.totalInbox = value;
            service.total = service.totalInbox + service.totalConnections;
            $rootScope.$broadcast('refreshMessagesCounter');
            $rootScope.$broadcast('refreshStateNotificationCircle');

        }

        function setTotalConnections(value) {
            service.totalConnections = value;
            service.total = service.totalInbox + service.totalConnections;
            $rootScope.$broadcast('refreshConnectionsCounter');
            $rootScope.$broadcast('refreshStateNotificationCircle');
        }

        function getTotal() {
            return service.total;
        }

        function getTotalInbox() {
            return service.totalInbox;
        }

        function getTotalConnections() {
            return service.totalConnections;
        }



    }
    NotificationsRepository.$inject = ["$log", "$filter", "InboxUnreadCounterFactory", "NewConnectionsFactory", "$rootScope", "$q"];

})();
(function() {
    'use strict';

    /**
     * @desc display counter for new messages
     * @example <notification-cirle></notification-circle>
     */
    angular
        .module('persice')
        .directive('notificationCircle', notificationCircle);

    function notificationCircle() {
        var directive = {
            controller: NotificationCircleController,
            controllerAs: 'notificationcircle',
            bindToController: true,
            scope: {
                color: '@color'
            },
            link: link,
            template: '<mark class="notification {{notificationcircle.color}}"  ng-class="{\'hidden-notification\': notificationcircle.hideClass}"></mark>',
            restrict: 'E',
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {


        }



    }

    /**
     * @desc display/hide new notifications red circle
     * @ngInject
     */
    function NotificationCircleController($scope, $rootScope, NotificationsRepository) {
        var vm = this;
        vm.hideClass = true;
        vm.counter = NotificationsRepository.getTotal();


        $rootScope.$on('displayNotificationCircle', function(event, data) {
            vm.hideClass = false;
        });

        $rootScope.$on('hideNotificationCircle', function(event, data) {
            vm.hideClass = true;
        });

        $rootScope.$on('refreshStateNotificationCircle', function(event, data) {

            vm.counter = NotificationsRepository.getTotal();

            if (vm.counter > 0) {
                vm.hideClass = false;
            } else {
                vm.hideClass = true;
            }

        });



    }
    NotificationCircleController.$inject = ["$scope", "$rootScope", "NotificationsRepository"];



})();
(function() {
    'use strict';

    /**
     * @desc display modal
     * @example <ui-modal></ui-modal>
     */
    angular
        .module('frontend.semantic.modal', [])

    .directive('uiModal', uiModal);

    function uiModal() {
        var directive = {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: 'ngModel',
            template: '<div class="ui modal" ng-transclude></div>',
            controller: uiModalController,
            controllerAs: 'uimodal',
            bindToController: true,
            link: link,
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            console.log('pero');
            console.log(element);
            element.modal({
                onHide: function() {
                    ngModel.$setViewValue(false);
                }
            });
            scope.$watch(function() {
                return ngModel.$modelValue;
            }, function(modelValue) {
                element
                    .modal('setting', 'transition', 'scale')
                    .modal('setting', 'closable', false)
                    .modal(modelValue ? 'show' : 'hide');
            });

        }



    }

    /**
     * @desc controller for modal directive
     * @ngInject
     */
    function uiModalController($scope, $log) {
        var vm = this;

    }
    uiModalController.$inject = ["$scope", "$log"];



})();
(function() {
    'use strict';

    /**
     * @desc display modal
     * @example <ui-event-view-modal></ui-event-view-modal>
     */
    angular
        .module('frontend.semantic.modal.event.view', [])

    .directive('uiEventViewModal', uiEventViewModal);

    function uiEventViewModal($log) {
        var directive = {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: {
                show: '=show',
                eventid: '=eventid'
            },
            templateUrl: 'components/modal/modalview.html',
            controller: EventViewModalController,
            controllerAs: 'viewevent',
            bindToController: true,
            link: link,
        };
        return directive;

        function link(scope, element, attrs, viewevent) {
            element.modal({
                onHide: function() {
                    scope.viewevent.show = false;
                    scope.viewevent.selection = 'view';
                    scope.viewevent.eventNotFound = false;
                    scope.viewevent.header = 'Event Details';
                    scope.viewevent.modalId = 'viewEventsModal';
                },
                onHidden: function() {
                    scope.viewevent.show = false;
                    scope.viewevent.selection = 'view';
                    scope.viewevent.eventNotFound = false;
                    scope.viewevent.header = 'Event Details';
                    scope.viewevent.modalId = 'viewEventsModal';
                }
            });

            element.modal({
                onShow: function() {
                    scope.viewevent.selection = 'view';
                    scope.viewevent.eventNotFound = false;
                    scope.viewevent.header = 'Event Details';
                    scope.viewevent.modalId = 'viewEventsModal';
                    element.addClass('small');
                }
            });


            scope.viewevent.getActiveClass = function() {
                if (scope.viewevent.selection === 'invitations') {
                    return '';
                }
                return 'small';


            };

            scope.$watch('viewevent.show', function(modelValue) {
                element
                    .modal('setting', 'transition', 'scale')
                    .modal('setting', 'closable', false)
                    .modal('setting', 'allowMultiple', true)
                    .modal(modelValue ? 'show' : 'hide');

            });

        }



    }
    uiEventViewModal.$inject = ["$log"];

    /**
     * @desc controller for modal directive
     * @ngInject
     */
    function EventViewModalController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window, moment, angularMomentConfig, notify, MembersFactory, $geolocation, $filter, $timeout, EventsConnections, $q) {
        var vm = this;
        vm.showMobile = false;
        vm.loadingSave = false;
        vm.closeEventModal = closeEventModal;
        vm.getEvent = getEvent;
        vm.openMap = openMap;
        vm.deleteEvent = deleteEvent;
        vm.event = {};
        vm.invitationsMode = false;

        vm.header = 'Event Details';

        vm.showError = false;
        vm.showSuccess = false;
        vm.errorMessage = [];
        vm.endsTimeError = false;
        vm.startsTimeError = false;

        vm.modalId = 'viewEventsModal';

        vm.eventRsvp = {
            status: ''
        };

        vm.changeRsvpStatus = changeRsvpStatus;

        vm.extractFromAddress = extractFromAddress;
        vm.parseLocation = parseLocation;
        vm.combineDateTime = combineDateTime;
        vm.validateDates = validateDates;
        vm.saveEvent = saveEvent;
        vm.openInvitations = openInvitations;
        vm.closeInvitations = closeInvitations;
        vm.openAttendees = openAttendees;
        vm.closeAttendees = closeAttendees;

        vm.selection = 'view';

        vm.editEvent = editEvent;

        vm.isHost = false;

        vm.loadingEvent = false;

        vm.placeholder = {
            name: '',
            starts: 'Date',
            startsTime: 'Time',
            ends: 'Date',
            endsTime: 'Time',
            repeat: '',
            repeatUntil: 'Until date',
            description: '',
            location: '',
            costs: '',
            invitations: '',
            attachments: ''
        };

        vm.$geolocation = $geolocation;

        $geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 2
        }).then(function(location) {
            vm.autocompleteOptions = {
                location: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
                radius: 50000
            };
        });

        vm.autocompleteOptions = {
            location: '0,0',
            radius: 50000
        };


        vm.memberExists = false;

        $scope.$watch(angular.bind(this, function(show) {
            return vm.show;
        }), function(modelValue) {
            if (modelValue) {
                vm.getEvent();

            }
        });

        //START INVITES

        vm.loadingInvitesSave = false;
        vm.counterNewInvites = 0;
        vm.markSelected = markSelected;
        vm.removeInvite = removeInvite;
        vm.sendInvites = sendInvites;
        vm.getConnections = getConnections;

        vm.nextOffset = 10;
        vm.loadingConnections = false;
        vm.connectionFirstName = '';

        vm.invitationsOptions = {
            attendingPref: 'private',
            guestInvite: true
        };

        vm.friends = [];
        vm.connections = [];
        vm.invitedPeople = [];


        function markSelected(index) {
            if (!vm.connections[index].is_invited) {
                vm.connections[index].selected = !vm.connections[index].selected;

                if (vm.connections[index].selected) {
                    vm.counterNewInvites++;
                } else {
                    vm.counterNewInvites--;
                }
            }

        }

        function removeInvite(index) {
            //remove from invite list and refresh selected status
            var findIndex = $filter('getIndexByProperty')('friend_id', vm.invitedPeople[index].friend_id, vm.connections);



            if (vm.connections[findIndex].member_id !== undefined) {
                MembersFactory.delete({
                        memberId: vm.connections[findIndex].member_id
                    },
                    function(success) {
                        vm.connections[findIndex].is_invited = false;
                        vm.connections[findIndex].selected = false;
                        vm.invitedPeople.splice(index, 1);
                        if (vm.counterNewInvites > 0) {
                            vm.counterNewInvites--;
                        }
                    },
                    function(error) {
                        $log.info(error);
                    });

            }





        }

        function sendInvites() {
            if (vm.counterNewInvites > 0) {
                //return if already sending invites
                if (vm.loadingInvitesSave) {
                    return;
                }
                vm.loadingInvitesSave = true;
                //sending invites

                var promises = [];

                for (var i = vm.connections.length - 1; i >= 0; i--) {
                    if (vm.connections[i].selected && !vm.connections[i].is_invited) {
                        //prepare promises array
                        var member = {
                            event: '/api/v1/event/' + vm.eventid + '/',
                            is_invited: false,
                            user: '/api/v1/auth/user/' + vm.connections[i].friend_id + '/'
                        };

                        promises.push(MembersFactory.save({}, member).$promise);
                    }

                }


                $q.all(promises).then(function(result) {
                    angular.forEach(result, function(response) {
                        var findMemberIndex = $filter('getIndexByProperty')('user', response.user, vm.connections);
                        vm.connections[findMemberIndex].member_id = response.id;
                        vm.connections[findMemberIndex].is_invited = true;
                        vm.connections[findMemberIndex].rsvp = '';
                        vm.invitedPeople.push(vm.connections[findMemberIndex]);
                        $log.info(vm.invitedPeople);
                    });

                }).then(function(tmpResult) {
                    $log.info('Sending invites finished.');
                    vm.counterNewInvites = 0;
                    vm.loadingInvitesSave = false;
                    notify({
                        messageTemplate: '<div class="notify-info-header">Success</div>' +
                            '<p>All event invitations have been successfully sent.</p>',
                        classes: 'notify-info',
                        icon: 'check circle',
                        duration: 4000
                    });
                    $scope.$emit('invitesSent');
                });

            } else {
                notify({
                    messageTemplate: '<div class="notify-error-header">Warning</div>' +
                        '<p>Please select connections to invite.</p>',
                    classes: 'notify-error',
                    icon: 'remove circle',
                    duration: 4000
                });
            }


        }

        function getConnections() {
            vm.connections = [];
            vm.friends = [];
            vm.invitedPeople = [];
            vm.counterNewInvites = 0;

            vm.nextOffset = 10;
            vm.next = null;
            vm.loadingConnections = true;
            EventsConnections.query({
                format: 'json',
                first_name: vm.connectionFirstName,
                limit: 10,
                offset: 0
            }).$promise.then(getEventsConnectionsSuccess, getEventsConnectionsFailure);

        }

        function getEventsConnectionsSuccess(response) {
            vm.friends = response.objects;
            vm.next = response.meta.next;


            for (var i = vm.friends.length - 1; i >= 0; i--) {

                var mutual_friends = ((vm.friends[i].mutual_friends_count === null) ? 0 : vm.friends[i].mutual_friends_count);
                var common_goals = ((vm.friends[i].common_goals_offers_interests === null) ? 0 : vm.friends[i].common_goals_offers_interests);
                var friend = {
                    first_name: vm.friends[i].first_name,
                    age: vm.friends[i].age,
                    common_goals_offers_interests: common_goals,
                    mutual_friends_count: mutual_friends,
                    tagline: vm.friends[i].tagline,
                    facebook_id: vm.friends[i].facebook_id,
                    friend_id: vm.friends[i].friend_id,
                    user: '/api/v1/auth/user/' + vm.friends[i].friend_id + '/',
                    is_invited: false,
                    member_id: null,
                    rsvp: '',
                    selected: false,
                    event: parseInt(vm.eventid),
                    image: '//graph.facebook.com/' + vm.friends[i].facebook_id + '/picture?type=square'
                };


                for (var j = vm.friends[i].events.length - 1; j >= 0; j--) {

                    if (vm.friends[i].events[j].event === friend.event) {
                        friend.is_invited = true;
                        friend.rsvp = vm.friends[i].events[j].rsvp;
                        friend.selected = true;
                        friend.member_id = vm.friends[i].events[j].id;

                        vm.invitedPeople.push(friend);
                    }
                }

                vm.connections.push(friend);




            }

            vm.loadingConnections = false;

        }

        function getEventsConnectionsFailure(response) {

            var data = response.data,
                status = response.status,
                header = response.header,
                config = response.config,
                message = 'Error ' + status;
            $log.error(message);

            vm.loadingConnetions = false;


        }


        //END INVITES



        function openInvitations() {
            vm.selection = 'invitations';
            vm.header = 'Invitations';
            vm.getConnections();
        }

        function closeInvitations() {
            vm.selection = 'edit';
            vm.header = 'Event Details';
        }

        //START ATTENDEES

        vm.connectionsYes = [{
                id: 1,
                rsvp: '',
                first_name: 'Lena',
                age: 35,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Creative designer & hiker'
            }, {
                id: 3,
                rsvp: '',
                first_name: 'Charlie',
                age: 39,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Hacker, Guitaris, and veteran Burner'
            }

        ];


        vm.connectionsNo = [{
                id: 2,
                rsvp: 'YES',
                first_name: 'Brian',
                age: 31,
                invited: true,
                selected: true,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Engineer kiteboarding chess geek'
            },

        ];


        vm.connectionsMaybe = [

            {
                id: 4,
                rsvp: '',
                first_name: 'Daniel',
                age: 25,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Grad student from London'
            },

        ];

        function openAttendees() {
            vm.selection = 'attendees';
            vm.header = 'Attendees';
        }

        function closeAttendees() {
            vm.selection = 'view';
            vm.header = 'Event Details';
        }

        //END ATTENDEES


        function changeRsvpStatus(newStatus) {
            var member = {
                event: '/api/v1/event/' + vm.event.id + '/',
                rsvp: newStatus,
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            //change RSVP status if different than previous
            if (vm.eventRsvp.status !== newStatus) {
                //check if member is already created.
                if (vm.memberExists) {
                    vm.eventRsvp.status = newStatus;
                    //update rsvp status
                    MembersFactory.update({
                            memberId: vm.memberId
                        }, member,
                        function(success) {
                            for (var i = vm.event.members.length - 1; i >= 0; i--) {

                                if (vm.event.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {

                                    vm.event.members[i].rsvp = newStatus;
                                }

                            }
                        },
                        function(error) {


                        });

                } else {
                    vm.eventRsvp.status = newStatus;
                    // create new member first with new rsvp status
                    MembersFactory.save({}, member,
                        function(success) {
                            vm.memberExists = true;
                            vm.event.members.push(success);
                            vm.memberId = success.id;
                        },
                        function(error) {

                        });
                }

            }
        }

        function deleteEvent() {
            vm.showError = false;
            EventsFactory.delete({
                    eventId: vm.eventEdit.id
                },
                function(success) {
                    vm.showError = false;

                    notify({
                        messageTemplate: '<div class="notify-info-header">Success</div>' +
                            '<p>Event has been successfully deleted.</p>',
                        classes: 'notify-info',
                        icon: 'check circle',
                        duration: 4000
                    });

                    $rootScope.$broadcast('refreshEventFeed');

                    vm.closeEventModal();

                },
                function(error) {
                    vm.errorMessage = [];
                    vm.showError = true;
                    if (error.data.event) {
                        vm.errorMessage = ['Event could not be deleted.'];
                    }

                });
        }



        function getEvent() {

            vm.selection = 'view';
            vm.pok = 0;
            vm.loadingEvent = true;
            EventsFactory.query({
                format: 'json'
            }, {
                eventId: vm.eventid
            }).$promise.then(function(data) {
                vm.eventNotFound = false;
                vm.event = data;
                vm.eventLocation = '';
                vm.mapurlTrue = false;
                vm.mapurl = '';

                if (vm.event.location !== '0,0') {
                    if (vm.event.full_address !== '' && vm.event.full_address !== null) {
                        vm.eventLocation = vm.event.full_address;
                    } else {
                        vm.eventLocation = vm.event.street + ' ' + vm.event.city + ' ' + vm.event.zipcode + ' ' + vm.event.state;
                    }

                    vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation) + '/@' + vm.event.location + ',15z';
                    vm.mapurlTrue = true;

                } else {
                    vm.mapurlTrue = false;
                    vm.mapurl = '';
                    vm.eventLocation = vm.event.location_name;
                }

                vm.isHost = false;
                vm.eventRsvp = {
                    status: ''
                };
                vm.memberExists = false;
                vm.memberId = null;
                if (vm.event.members.length > 0) {
                    for (var i = vm.event.members.length - 1; i >= 0; i--) {
                        if (vm.event.members[i].is_organizer === true) {
                            if (vm.event.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {
                                vm.isHost = true;
                            }
                        } else {
                            if (vm.event.members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {
                                vm.memberId = vm.event.members[i].id;
                                if (vm.event.members[i].rsvp !== null) {
                                    vm.eventRsvp.status = vm.event.members[i].rsvp;
                                }

                                vm.memberExists = true;

                            }
                        }
                    }
                }

                //convert datetime to local timezone
                vm.starts_on_date = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('dddd, MMMM D, YYYY');
                vm.ends_on_date = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('dddd, MMMM D, YYYY');
                vm.starts_on_time = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('h:mm A');
                vm.ends_on_time = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('h:mm A ') + moment.tz(angularMomentConfig.timezone).format('z');


                if (vm.ends_on_date !== vm.starts_on_date) {
                    vm.firstrow = vm.starts_on_date + ' ' + vm.starts_on_time;
                    vm.secondrow = vm.ends_on_date + ' ' + vm.ends_on_time;
                } else {
                    vm.firstrow = vm.starts_on_date;
                    vm.secondrow = vm.starts_on_time + ' to ' + vm.ends_on_time;
                }

                vm.loadingEvent = false;


            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                vm.loadingEvent = false;

                vm.eventNotFound = true;



            });
        }

        function closeEventModal() {
            vm.loadingInvitesSave = false;
            vm.show = false;
        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }


        //editing event

        vm.eventEdit = {
            starts_on: '',
            ends_on: '',
            address: ''
        };
        //date and time combine

        $scope.$watch(angular.bind(this, function(starts_on_date) {
            return vm.starts_on_date;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });

        $scope.$watch(angular.bind(this, function(starts_on_time) {
            return vm.starts_on_time;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });
        $scope.$watch(angular.bind(this, function(ends_on_date) {
            return vm.ends_on_date;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });

        $scope.$watch(angular.bind(this, function(ends_on_time) {
            return vm.ends_on_time;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });



        $scope.$watch(angular.bind(this, function(eventLocation) {
            return vm.eventLocation;
        }), function(newVal) {
            vm.parseLocation();
        });

        function validateDates() {
            //validate dates
            vm.startsTimeError = false;
            vm.endsTimeError = false;
            if (moment(vm.eventEdit.starts_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select a Starts Date that is not set in past.'];
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
            }

            if (moment(vm.eventEdit.ends_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select an Ends Date that is not set in past.'];
                vm.endsTimeError = true;
                return;
            }

            if (moment(vm.eventEdit.ends_on).unix() > moment().unix() && moment(vm.eventEdit.starts_on).unix() > moment().unix() && moment(vm.eventEdit.starts_on).unix() > moment(vm.eventEdit.ends_on).unix()) {
                vm.showError = true;
                vm.errorMessage = ['Ends Date must be greater or equal to Starts Date.'];
                vm.endsTimeError = true;
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
                vm.endsTimeError = false;
            }
        }

        //extract address from google places result
        function extractFromAddress(components, type, type2) {
            for (var i = 0; i < components.length; i++) {
                for (var j = 0; j < components[i].types.length; j++) {
                    if (components[i].types[j] === type) {
                        return components[i][type2];
                    }
                }
            }
            return '';

        }

        vm.pok = 0;

        //parse location
        function parseLocation() {

            if (vm.eventLocation !== null && typeof vm.eventLocation === 'object' && vm.eventLocation.hasOwnProperty('address_components') && vm.eventLocation.hasOwnProperty('geometry')) {
                var location = vm.eventLocation.address_components;

                vm.eventEdit.street = vm.extractFromAddress(location, 'route', 'long_name') + ' ' + vm.extractFromAddress(location, 'street_number', 'long_name');
                vm.eventEdit.zipcode = vm.extractFromAddress(location, 'postal_code', 'long_name');
                if (vm.eventEdit.zipcode === '') {
                    vm.eventEdit.zipcode = null;
                }
                vm.eventEdit.location_name = vm.eventLocation.name;
                vm.eventEdit.full_address = vm.eventLocation.formatted_address;
                vm.eventEdit.state = vm.extractFromAddress(location, 'administrative_area_level_1', 'short_name');
                vm.eventEdit.country = vm.extractFromAddress(location, 'country', 'short_name');
                if (vm.eventEdit.state.length > 3) {
                    vm.eventEdit.state = vm.eventEdit.country;
                }
                vm.eventEdit.city = vm.extractFromAddress(location, 'locality', 'long_name');

                vm.eventEdit.location = vm.eventLocation.geometry.location['A'] + ',' + vm.eventLocation.geometry.location['F'];
                vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation.formatted_address) + '/@' + vm.eventEdit.location + ',15z';
                vm.mapurlTrue = true;
            } else {
                if (vm.pok > 2) {
                    vm.eventEdit.address = vm.eventLocation;
                    vm.eventEdit.full_address = '';
                    vm.eventEdit.location_name = vm.eventLocation;
                    vm.eventEdit.location = '0,0';
                } else {
                    vm.pok++;
                }
            }

        }


        //helper function for 12 to 24 hour time conversion
        function convertTo24Hour(time) {
            var hours = parseInt(time.substr(0, 2));
            if (time.indexOf('AM') != -1 && hours == 12) {
                time = time.replace('12', '0');
            }
            if (time.indexOf('PM') != -1 && hours < 12) {
                time = time.replace(hours, (hours + 12));
            }
            return time.replace(/(AM|PM)/, '');
        }

        function combineDateTime(type) {

            if (vm[type + '_date'] && vm[type + '_time']) {
                var dateParts = vm[type + '_date'].split('/');
                var datePartsSorted = [dateParts[2], dateParts[0], dateParts[1]];
                var timeParts = convertTo24Hour(vm[type + '_time']).split(':');
                var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                if (datePartsSorted && timeParts) {
                    datePartsSorted[1] -= 1;
                    vm.eventEdit[type] = moment(datePartsSorted.concat(timeParts)).toISOString();
                }
            }
        }

        function editEvent() {
            vm.showError = false;
            vm.showSuccess = false;
            vm.errorMessage = [];
            vm.endsTimeError = false;
            vm.startsTimeError = false;
            vm.eventEdit = angular.copy(vm.event);
            //convert datetime to local timezone
            vm.starts_on_date = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('MM/DD/YYYY');
            vm.ends_on_date = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('MM/DD/YYYY');
            vm.starts_on_time = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('h:mm A');
            vm.ends_on_time = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('h:mm A');

            vm.modalId = 'createEventsModal';
            vm.selection = 'edit';

        }

        function saveEvent() {
            vm.showError = false;
            vm.showSuccess = false;
            $('.ui.form')
                .form({
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Event name'
                            }]
                        },
                        location: {
                            identifier: 'location',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Location'
                            }]
                        },
                        repeat: {
                            identifier: 'repeat',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Repeat'
                            }]
                        },
                        description: {
                            identifier: 'description',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Description'
                            }]
                        },
                        starts_on_date: {
                            identifier: 'starts_on_date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Starts Date'
                            }]
                        },
                        starts_on_time: {
                            identifier: 'starts_on_time',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Starts Time'
                            }]
                        },
                        ends_on_date: {
                            identifier: 'ends_on_date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Ends Date'
                            }]
                        },
                        ends_on_time: {
                            identifier: 'ends_on_time',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Ends Time'
                            }]
                        },
                    }
                });
            $('.ui.form').form('validate form');

            if (vm.eventEdit.description === '' || vm.eventEdit.ends_on === '' || vm.eventEdit.location === '' || vm.eventEdit.name === '' || vm.eventEdit.starts_on === '' || vm.eventEdit.repeat === '') {
                if (vm.eventEdit.starts_on === '' || vm.eventEdit.starts_on === null) {
                    vm.startsTimeError = true;
                }
                if (vm.eventEdit.ends_on === '' || vm.eventEdit.ends_on === null) {
                    vm.endsTimeError = true;
                }

                vm.showError = true;
                vm.errorMessage = ['Please enter all required fields.'];
            } else {

                //validate dates

                vm.validateDates();

                vm.showSuccess = false;
                if (!vm.showError) {
                    vm.loadingSave = true;
                    EventsFactory.update({
                            eventId: vm.eventEdit.id
                        }, vm.eventEdit,
                        function(success) {
                            vm.showError = false;
                            vm.modalId = 'viewEventsModal';
                            vm.selection = 'view';
                            notify({
                                messageTemplate: '<div class="notify-info-header">Success</div>' +
                                    '<p>All changes have been saved.</p>',
                                classes: 'notify-info',
                                icon: 'check circle',
                                duration: 4000
                            });
                            $rootScope.$broadcast('refreshEventFeed');
                            vm.loadingSave = false;
                            vm.getEvent();
                        },
                        function(error) {
                            vm.errorMessage = [];
                            vm.showError = true;
                            if (error.data.event) {
                                vm.errorMessage = error.data.event.error;
                            }
                            vm.loadingSave = false;

                        });
                }
            }

        }



    }
    EventViewModalController.$inject = ["$scope", "USER_ID", "EventsFactory", "$state", "$rootScope", "$log", "$window", "moment", "angularMomentConfig", "notify", "MembersFactory", "$geolocation", "$filter", "$timeout", "EventsConnections", "$q"];



})();

(function() {
    'use strict';

    /**
     * @desc display modal
     * @example <ui-event-create-modal></ui-event-create-modal>
     */
    angular
        .module('frontend.semantic.modal.event.create', [])

    .directive('uiEventCreateModal', uiEventCreateModal);

    function uiEventCreateModal() {
        var directive = {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: {
                show: '=show'
            },
            templateUrl: 'components/modal/modalcreate.html',
            controller: EventModalController,
            controllerAs: 'singleevent',
            bindToController: true,
            link: link,
        };
        return directive;

        function link(scope, element, attrs, singleevent) {
            element.modal({
                onHide: function() {
                    scope.singleevent.show = false;
                    scope.singleevent.resetForm();
                }
            });


            scope.$watch('singleevent.show', function(modelValue) {
                element
                    .modal('setting', 'transition', 'scale')
                    .modal('setting', 'closable', false)
                    .modal(modelValue ? 'show' : 'hide');
            });

        }



    }

    /**
     * @desc controller for modal directive
     * @ngInject
     */
    function EventModalController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window, moment, $geolocation) {
        var vm = this;

        vm.mapurl = '';
        vm.mapurlTrue = false;
        vm.eventLocation = '';
        vm.showMobile = false;
        vm.endsTimeError = false;
        vm.startsTimeError = false;

        vm.placeholder = {
            name: '',
            starts: 'Date',
            startsTime: 'Time',
            ends: 'Date',
            endsTime: 'Time',
            repeat: '',
            repeatUntil: 'Until date',
            description: '',
            location: '',
            costs: '',
            invitations: '',
            attachments: ''
        };

        vm.$geolocation = $geolocation;

        $geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 2
        }).then(function(location) {
            vm.autocompleteOptions = {
                location: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
                radius: 50000
            };
        });

        vm.autocompleteOptions = {
            location: '0,0',
            radius: 50000
        };


        vm.starts_on_date = '';
        vm.starts_on_time = '';
        vm.ends_on_date = '';
        vm.ends_on_time = '';

        vm.showError = false;
        vm.showSuccess = false;
        vm.errorMessage = [];
        vm.event = {
            user: '/api/v1/auth/user/' + USER_ID + '/',
            description: '',
            ends_on: '',
            location: '',
            name: '',
            repeat: '',
            starts_on: '',
            street: '',
            city: '',
            zipcode: null,
            state: '',
            full_address: '',
            location_name: '',
            country: ''
        };

        vm.saveEvent = saveEvent;
        vm.openMap = openMap;
        vm.resetForm = resetForm;
        vm.extractFromAddress = extractFromAddress;
        vm.parseLocation = parseLocation;
        vm.combineDateTime = combineDateTime;
        vm.closeEventModal = closeEventModal;
        vm.validateDates = validateDates;

        function closeEventModal() {
            vm.show = false;
        }

        $rootScope.$on('saveEvent', function() {
            vm.saveEvent();
        });

        $scope.$watch(angular.bind(this, function(eventLocation) {
            return vm.eventLocation;
        }), function(newVal) {
            vm.parseLocation();
        });

        function validateDates() {
            //validate dates
            vm.startsTimeError = false;
            vm.endsTimeError = false;
            if (moment(vm.event.starts_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select a Starts Date that is not set in past.'];
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
            }

            if (moment(vm.event.ends_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select an Ends Date that is not set in past.'];
                vm.endsTimeError = true;
                return;
            }

            if (moment(vm.event.ends_on).unix() > moment().unix() && moment(vm.event.starts_on).unix() > moment().unix() && moment(vm.event.starts_on).unix() > moment(vm.event.ends_on).unix()) {
                vm.showError = true;
                vm.errorMessage = ['Ends Date must be greater or equal to Starts Date.'];
                vm.endsTimeError = true;
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
                vm.endsTimeError = false;
            }
        }

        function saveEvent() {
            vm.showError = false;
            vm.showSuccess = false;
            $('.ui.form')
                .form({
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Event name'
                                }]
                        },
                        location: {
                            identifier: 'location',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Location'
                                }]
                        },
                        repeat: {
                            identifier: 'repeat',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Repeat'
                                }]
                        },
                        description: {
                            identifier: 'description',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Description'
                                }]
                        },
                        starts_on_date: {
                            identifier: 'starts_on_date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Starts Date'
                                }]
                        },
                        starts_on_time: {
                            identifier: 'starts_on_time',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Starts Time'
                                }]
                        },
                        ends_on_date: {
                            identifier: 'ends_on_date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Ends Date'
                                }]
                        },
                        ends_on_time: {
                            identifier: 'ends_on_time',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Ends Time'
                                }]
                        },
                    }
                });
            $('.ui.form').form('validate form');

            if (vm.event.description === '' || vm.event.ends_on === '' || vm.event.location === '' || vm.event.name === '' || vm.event.starts_on === '' || vm.event.repeat === '') {
                if (vm.event.starts_on === '' || vm.event.starts_on === null) {
                    vm.startsTimeError = true;
                }
                if (vm.event.ends_on === '' || vm.event.ends_on === null) {
                    vm.endsTimeError = true;
                }

                vm.showError = true;
                vm.errorMessage = ['Please enter all required fields.'];
            } else {

                //validate dates

                vm.validateDates();

                vm.showSuccess = false;
                if (!vm.showError) {
                    EventsFactory.save({}, vm.event,
                        function(success) {
                            vm.showError = false;
                            $rootScope.$broadcast('closeModalCreateEvent');
                            vm.resetForm();
                        },
                        function(error) {
                            vm.errorMessage = [];
                            vm.showError = true;
                            if (error.data.event) {
                                vm.errorMessage = error.data.event.error;
                            }

                        });
                }
            }

        }

        //extract address from google places result
        function extractFromAddress(components, type, type2) {
            for (var i = 0; i < components.length; i++) {
                for (var j = 0; j < components[i].types.length; j++) {
                    if (components[i].types[j] === type) {
                        return components[i][type2];
                    }
                }
            }
            return '';

        }

        //parse location
        function parseLocation() {
            vm.mapurl = '';
            vm.mapurlTrue = false;
            if (vm.eventLocation !== null && typeof vm.eventLocation === 'object' && vm.eventLocation.hasOwnProperty('address_components') && vm.eventLocation.hasOwnProperty('geometry')) {
                var location = vm.eventLocation.address_components;

                vm.event.street = vm.extractFromAddress(location, 'route', 'long_name') + ' ' + vm.extractFromAddress(location, 'street_number', 'long_name');
                vm.event.zipcode = vm.extractFromAddress(location, 'postal_code', 'long_name');
                if (vm.event.zipcode === '') {
                    vm.event.zipcode = null;
                }
                vm.event.location_name = vm.eventLocation.name;
                vm.event.full_address = vm.eventLocation.formatted_address;
                vm.event.state = vm.extractFromAddress(location, 'administrative_area_level_1', 'short_name');
                vm.event.country = vm.extractFromAddress(location, 'country', 'short_name');
                if (vm.event.state.length > 3) {
                    vm.event.state = vm.event.country;
                }
                vm.event.city = vm.extractFromAddress(location, 'locality', 'long_name');

                vm.event.location = vm.eventLocation.geometry.location['A'] + ',' + vm.eventLocation.geometry.location['F'];
                vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation.formatted_address) + '/@' + vm.event.location + ',15z';
                vm.mapurlTrue = true;
            } else {
                vm.event.address = vm.eventLocation;
                vm.event.full_address = '';
                vm.event.location_name = vm.eventLocation;
                vm.event.location = '0,0';
            }

        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }



        function resetForm() {
            //Resets form error messages and field styles
            $('.ui.form').trigger('reset');
            $('.ui.form .field.error').removeClass('error');
            $('.ui.form.error').removeClass('error');
            vm.starts_on_date = null;
            vm.starts_on_time = null;
            vm.ends_on_date = null;
            vm.ends_on_time = null;
            vm.showError = false;
            vm.showSuccess = false;
            vm.errorMessage = [];
            vm.mapurl = '';
            vm.mapurlTrue = false;
            vm.eventLocation = '';
            vm.event = {
                user: '/api/v1/auth/user/' + USER_ID + '/',
                description: '',
                ends_on: '',
                location: '',
                name: '',
                repeat: '',
                starts_on: '',
                street: '',
                city: '',
                zipcode: null,
                state: '',
                full_address: '',
                location_name: '',
                country: ''
            };
        }



        //date and time combine
        //
        $scope.$watch(angular.bind(this, function(starts_on_date) {
            return vm.starts_on_date;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });

        $scope.$watch(angular.bind(this, function(starts_on_time) {
            return vm.starts_on_time;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });
        $scope.$watch(angular.bind(this, function(ends_on_date) {
            return vm.ends_on_date;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });

        $scope.$watch(angular.bind(this, function(ends_on_time) {
            return vm.ends_on_time;
        }), function(newVal) {
            vm.combineDateTime('starts_on');
            vm.combineDateTime('ends_on');
        });

        //helper function for 12 to 24 hour time conversion
        function convertTo24Hour(time) {
            var hours = parseInt(time.substr(0, 2));
            if (time.indexOf('AM') != -1 && hours == 12) {
                time = time.replace('12', '0');
            }
            if (time.indexOf('PM') != -1 && hours < 12) {
                time = time.replace(hours, (hours + 12));
            }
            return time.replace(/(AM|PM)/, '');
        }

        function combineDateTime(type) {

            if (vm[type + '_date'] && vm[type + '_time']) {
                var dateParts = vm[type + '_date'].split('/');
                var datePartsSorted = [dateParts[2], dateParts[0], dateParts[1]];
                var timeParts = convertTo24Hour(vm[type + '_time']).split(':');
                var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                if (datePartsSorted && timeParts) {
                    datePartsSorted[1] -= 1;
                    vm.event[type] = moment(datePartsSorted.concat(timeParts)).utc().format('YYYY-MM-DDTHH:mm:ss');
                }
            }
        }


    }
    EventModalController.$inject = ["$scope", "USER_ID", "EventsFactory", "$state", "$rootScope", "$log", "$window", "moment", "$geolocation"];



})();
(function() {
    'use strict';

    /**
     * @desc display counter for new messages
     * @example <div messages-counter></div>
     */
    angular
        .module('persice')
        .directive('messagesCounter', messagesCounter);

    function messagesCounter() {
        var directive = {
            controller: MessagesController,
            controllerAs: 'messages',
            bindToController: true,
            scope: {

            },
            link: link,
            template: '<div ng-class="{\'hiddencounter\': messages.hideClass}" class="ui label">{{messages.counter}}</div>',
            restrict: 'E',
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {


        }



    }

    /**
     * @desc count new messages
     * @ngInject
     */
    function MessagesController($scope, $rootScope, $log, NotificationsRepository) {
        var vm = this;
        vm.counter = 0;
        vm.hideClass = true;

        vm.refreshCounter = refreshCounter;

        $rootScope.$on('refreshMessagesCounter', function(event, data) {
            vm.refreshCounter();
        });

        vm.refreshCounter();

        function refreshCounter() {
            vm.counter = NotificationsRepository.getTotalInbox();

            if (vm.counter > 0) {
                vm.hideClass = false;
            } else {
                vm.hideClass = true;
            }
        }



    }
    MessagesController.$inject = ["$scope", "$rootScope", "$log", "NotificationsRepository"];



})();
(function() {
    'use strict';

    /**
     * @desc display for user profile
     * @example <user-profile></user-profile>
     */
    angular
        .module('persice')
        .directive('matchfeedProfile', matchfeedProfile);

    function matchfeedProfile() {
        var directive = {
            controller: MatchfeedProfileController,
            controllerAs: 'userprofile',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class',
                header: '@header',
                body: '@body',
                person: '=person',
                type: '@type'
            },
            link: link,
            templateUrl: 'components/matchfeedprofile/matchfeedprofile.template.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }

    /**
     * @desc controller for matchfeedProfile directive
     * @ngInject
     */
    function MatchfeedProfileController($scope, $timeout, $filter, $rootScope, USER_ID, FriendsFactory, MatchFeedFactory, MutualFriendsFactory, PhotosFactory, $log, lodash) {
        var vm = this;

        vm.social = {
            twitter: '',
            linkedin: '',
            facebook: ''
        };

        vm.user = [];
        vm.total = 0;
        vm.offset = 0;
        vm.previous = null;
        vm.next = null;

        vm.me = '/api/v1/auth/user/' + USER_ID + '/';
        vm.friendshipStatus = null;
        vm.friendshipId = null;

        vm.showfullprofile = false;


        $rootScope.$on('cancelMatchEvent', function() {
            vm.cancelMatch();
        });

        $rootScope.$on('confirmMatchEvent', function() {
            vm.confirmMatch();
        });

        $rootScope.$on('refreshMatchFeed', function() {
            vm.initloadMatches();
        });

        vm.nextImage = function() {
            $('#photoSlider').flexslider('next');
        };


        vm.photosSlider = [];

        vm.loadingFeed = false;


        vm.totalfriendscount = 0;
        vm.totalmatchingcount = 0;
        vm.initloadMatches = initloadMatches;
        vm.loadUser = loadUser;
        vm.getNextMatch = getNextMatch;
        vm.cancelMatch = cancelMatch;
        vm.cancelMatchDesktop = cancelMatchDesktop;
        vm.confirmMatch = confirmMatch;
        vm.confirmMatchDesktop = confirmMatchDesktop;
        vm.changeTopMenu = changeTopMenu;
        vm.getMutualFriends = getMutualFriends;
        vm.getPhotos = getPhotos;


        //load matchfeed initially;
        vm.initloadMatches();

        function initloadMatches() {

            vm.totalfriendscount = 0;
            vm.totalmatchingcount = 0;
            vm.showDimmer = true;
            vm.showfullprofile = false;
            $rootScope.hideTopMenu = true;
            $('#filtersMenu').sidebar('hide');
            vm.user = [];
            vm.total = 0;
            vm.social = {
                twitter: '',
                linkedin: '',
                facebook: ''
            };


            vm.loadUser();



        }


        function loadUser() {
            vm.loadingFeed = true;
            MatchFeedFactory.query({
                format: 'json',
                filter: true,
                offset: 0,
                limit: 1
            }).$promise.then(function(data) {
                vm.user = [];
                vm.total = 0;
                var result = data.objects;
                if (result.length > 0) {
                    vm.total = data.meta.total_count;
                    vm.user = data.objects[0];

                    if (vm.user.twitter_provider !== null) {
                        vm.social.twitter = vm.user.twitter_provider;
                    }

                    if (vm.user.linkedin_provider !== null) {
                        vm.social.linkedin = vm.user.linkedin_provider;
                    }

                    if (vm.user.facebook_id !== null) {
                        vm.social.facebook = 'https://www.facebook.com/app_scoped_user_id/' + vm.user.facebook_id;
                    }


                    var goals = [];
                    var matchedgoals = vm.user.goals[0];
                    for (var key in matchedgoals) {
                        var goal = {
                            value: key,
                            match: matchedgoals[key]
                        };
                        goals.push(goal);
                    }
                    vm.user.goals = goals;

                    var offers = [];
                    var matchedoffers = vm.user.offers[0];
                    for (var key in matchedoffers) {
                        var offer = {
                            value: key,
                            match: matchedoffers[key]
                        };
                        offers.push(offer);
                    }
                    vm.user.offers = offers;

                    var interests = [];
                    var matchedinterests = vm.user.interests[0];
                    for (var key in matchedinterests) {
                        var interest = {
                            value: key,
                            match: matchedinterests[key]
                        };
                        interests.push(interest);

                    }
                    vm.user.interests = interests;

                    var likes = [];
                    var matchedlikes = vm.user.likes[0];
                    for (var key in matchedlikes) {
                        var like = {
                            value: key,
                            match: matchedlikes[key]
                        };
                        likes.push(like);
                    }
                    vm.user.likes = likes;

                    vm.totalmatchingcount = vm.user.score;


                    vm.getMutualFriends();

                    vm.getPhotos();


                } else {
                    vm.user = [];
                    vm.total = 0;

                }
                vm.showDimmer = false;
                $rootScope.hideTopMenu = false;
                vm.loadingFeed = false;
            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                // error handler
                $log.error(message);
                vm.user = [];
                vm.showDimmer = false;
                $rootScope.hideTopMenu = false;
                vm.loadingFeed = false;
            });
        }

        function getPhotos() {
            //get default photo
            vm.defaultUserPhoto = '//graph.facebook.com/' + vm.user.facebook_id + '/picture?type=large';
            //save default photo if no photos

            PhotosFactory.query({
                format: 'json',
                user_id: vm.user.user_id
            }).$promise.then(function(response) {
                vm.user.photos = response.objects;
                if (vm.user.photos.length > 0) {
                    vm.photosSlider = vm.user.photos;
                } else {
                    var newPhoto = {
                        photo: vm.defaultUserPhoto,
                        order: 0,
                        user: '/api/v1/auth/user/' + vm.user.user_id + '/'
                    };


                    PhotosFactory.save({}, newPhoto,
                        function(success) {
                            $log.info(success);
                            $log.info('New photo saved.');
                            vm.user.photos.push(success);
                            vm.photosSlider = vm.user.photos;

                        },
                        function(error) {
                            $log.info(error);
                        });

                }

                vm.photosSlider = $filter('orderBy')(vm.photosSlider, 'order', false);

            });


        }

        function getMutualFriends() {
            //mutual friends
            MutualFriendsFactory.query({
                format: 'json',
                user_id: vm.user.id
            }).$promise.then(function(data) {
                if (data.objects.length > 0) {
                    vm.user.friends = data.objects[0].mutual_bk_friends;
                    vm.user.facebookfriends = data.objects[0].mutual_fb_friends;
                    vm.user.linkedinconnections = data.objects[0].mutual_linkedin_connections;
                    vm.user.twitterfollowers = data.objects[0].mutual_twitter_followers;
                    vm.user.twitterfriends = data.objects[0].mutual_twitter_friends;
                    vm.totalfriendscount += data.objects[0].mutual_bk_friends_count;
                    vm.totalfriendscount += data.objects[0].mutual_fb_friends_count;
                    vm.totalfriendscount += data.objects[0].mutual_linkedin_connections_count;
                    vm.totalfriendscount += data.objects[0].mutual_twitter_followers_count;
                    vm.totalfriendscount += data.objects[0].mutual_twitter_friends_count;
                }

            });
        }

        function getNextMatch() {

            vm.totalfriendscount = 0;
            vm.totalmatchingcount = 0;
            vm.showfullprofile = false;
            $rootScope.hideTopMenu = true;
            vm.loadingFeed = true;
            vm.loadUser();

        }

        function cancelMatch() {
            $log.info('cancel match');

            var friendship = {
                friend1: vm.me,
                friend2: '/api/v1/auth/user/' + vm.user.user_id + '/',
                status: -1
            };

            //deny friendship with status -1
            FriendsFactory.save(friendship,
                function(success) {
                    vm.getNextMatch();
                },
                function(error) {

                });

        }

        function cancelMatchDesktop() {
            $rootScope.hideTopMenu = false;
            vm.showfullprofile = false;
            vm.cancelMatch();
        }

        function confirmMatchDesktop() {
            $rootScope.hideTopMenu = false;
            vm.showfullprofile = false;
            vm.confirmMatch();
        }


        function confirmMatch() {
            var friendship = {
                friend1: vm.me,
                friend2: '/api/v1/auth/user/' + vm.user.user_id + '/',
                status: 0
            };

            //add to friends with status 0
            FriendsFactory.save(friendship,
                function(success) {
                    vm.getNextMatch();
                },
                function(error) {

                });


        }


        function changeTopMenu() {
            if (!vm.showfullprofile) {
                $rootScope.hideTopMenu = true;
                vm.showfullprofile = true;

                $('#MatchMenu')
                    .sidebar('toggle')
            }


        }

        $rootScope.$on('showFullProfile', function() {
            vm.showfullprofile = false;
        });



    }
    MatchfeedProfileController.$inject = ["$scope", "$timeout", "$filter", "$rootScope", "USER_ID", "FriendsFactory", "MatchFeedFactory", "MutualFriendsFactory", "PhotosFactory", "$log", "lodash"];



})();

'use strict';

angular.module('google.places', [])
    /**
     * DI wrapper around global google places library.
     *
     * Note: requires the Google Places API to already be loaded on the page.
     */
     .factory('googlePlacesApi', ['$window', function($window) {
        if (!$window.google) {
            throw 'Global `google` var missing. Did you forget to include the places API script?';
        }

        return $window.google;
    }])

/**
 * Autocomplete directive. Use like this:
 *
 * <input type="text" google-places-autocomplete ng-model="myScopeVar" />
 */
 .directive('googlePlacesAutocomplete', ['$parse', '$compile', '$timeout', '$document', 'googlePlacesApi',
    function($parse, $compile, $timeout, $document, google) {

        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                model: '=ngModel',
                options: '=?',
                forceSelection: '=?',
                attach: '=?',
                customPlaces: '=?',
                refreshLocation: '&refreshLocation'
            },
            controller: ['$scope', function($scope) {}],
            link: function($scope, element, attrs, controller) {
                var keymap = {
                    tab: 9,
                    enter: 13,
                    esc: 27,
                    up: 38,
                    down: 40
                },
                hotkeys = [keymap.tab, keymap.enter, keymap.esc, keymap.up, keymap.down],
                autocompleteService = new google.maps.places.AutocompleteService(),
                placesService = new google.maps.places.PlacesService(element[0]);

                (function init() {
                    $scope.query = '';
                    $scope.predictions = [];
                    $scope.input = element;
                    $scope.options = $scope.options || {};

                    initAutocompleteDrawer();
                    initEvents();
                    initNgModelController();
                }());

                function initEvents() {
                    element.bind('keydown', onKeydown);
                    element.bind('blur', onBlur);
                    element.bind('submit', onBlur);

                    $scope.$watch('selected', select);
                }

                function initAutocompleteDrawer() {
                    // Drawer element used to display predictions
                    var drawerElement = angular.element('<div class="gplacesautocomplete" g-places-autocomplete-drawer></div>'),
                    body = angular.element($document[0].body),
                    $drawer;

                    drawerElement.attr({
                        input: 'input',
                        query: 'query',
                        predictions: 'predictions',
                        active: 'active',
                        selected: 'selected'
                    });

                    $drawer = $compile(drawerElement)($scope);
                    $('#' + $scope.attach).append($drawer); // Append to DOM

                    $scope.$on('$destroy', function() {
                        $drawer.remove();
                    });
                }

                function initNgModelController() {
                    controller.$parsers.push(parse);
                    controller.$formatters.push(format);
                    controller.$render = render;
                }

                function onKeydown(event) {

                    if ($scope.predictions.length === 0 || indexOf(hotkeys, event.which) === -1) {
                        return;
                    }

                    event.preventDefault();

                    if (event.which === keymap.down) {
                        $scope.active = ($scope.active + 1) % $scope.predictions.length;
                        $scope.$digest();
                    } else if (event.which === keymap.up) {
                        $scope.active = ($scope.active ? $scope.active : $scope.predictions.length) - 1;
                        $scope.$digest();
                    } else if (event.which === 13 || event.which === 9) {
                        if ($scope.forceSelection) {
                            $scope.active = ($scope.active === -1) ? 0 : $scope.active;
                        }

                        $scope.$apply(function() {
                            $scope.selected = $scope.active;

                            if ($scope.selected === -1) {
                                clearPredictions();
                            }
                        });
                    } else if (event.which === 27) {
                        event.stopPropagation();
                        clearPredictions();
                        $scope.$digest();
                    }
                }

                function onBlur(event) {
                    if ($scope.predictions.length === 0) {
                        if ($scope.forceSelection) {
                            var phase = $scope.$root.$$phase;
                            var fn = function() {
                                $scope.model = '';
                            };
                            if (phase === '$apply' || phase === '$digest') {
                                fn();
                            } else {
                                $scope.$apply(fn);
                            }
                        }
                        return;
                    }

                    if ($scope.forceSelection) {
                        $scope.selected = ($scope.selected === -1) ? 0 : $scope.selected;
                    }

                    $scope.$digest();

                    $scope.$apply(function() {
                        if ($scope.selected === -1) {
                            clearPredictions();
                        }
                    });
                }

                function select() {
                    var prediction;

                    prediction = $scope.predictions[$scope.selected];
                    if (!prediction) return;

                    if (prediction.is_custom) {
                        $scope.model = prediction.place;
                        $scope.$emit('g-places-autocomplete:select', prediction.place);
                    } else {
                        placesService.getDetails({
                            placeId: prediction.place_id
                        }, function(place, status) {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                $scope.$apply(function() {
                                    $scope.model = place;
                                    $scope.$emit('g-places-autocomplete:select', place);
                                    $scope.refreshLocation();
                                });
                            }
                        });
                    }

                    clearPredictions();
                }

                function parse(viewValue) {
                    var request;

                    if (!(viewValue && isString(viewValue))) {
                        return viewValue;
                    }
                    $scope.query = viewValue;

                    request = angular.extend({
                        input: viewValue
                    }, $scope.options);
                    autocompleteService.getPlacePredictions(request, function(predictions, status) {
                        $scope.$apply(function() {
                            var customPlacePredictions;

                            clearPredictions();

                            if ($scope.customPlaces) {
                                customPlacePredictions = getCustomPlacePredictions($scope.query);
                                $scope.predictions.push.apply($scope.predictions, customPlacePredictions);
                            }

                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                $scope.predictions.push.apply($scope.predictions, predictions);
                            }

                            if ($scope.predictions.length > 5) {
                                $scope.predictions.length = 5; // trim predictions down to size
                            }
                        });
                    });

                    return viewValue;
                }

                function format(modelValue) {
                    var viewValue = '';

                    if (isString(modelValue)) {
                        viewValue = modelValue;
                    } else if (isObject(modelValue)) {
                        viewValue = modelValue.formatted_address;
                    }

                    return viewValue;
                }

                function render() {
                    return element.val(controller.$viewValue);
                }

                function clearPredictions() {
                    $scope.active = -1;
                    $scope.selected = -1;
                    $scope.predictions = [];
                }

                function getCustomPlacePredictions(query) {
                    var predictions = [],
                    place, match, i;

                    for (i = 0; i < $scope.customPlaces.length; i++) {
                        place = $scope.customPlaces[i];

                        match = getCustomPlaceMatches(query, place);
                        if (match.matched_substrings.length > 0) {
                            predictions.push({
                                is_custom: true,
                                custom_prediction_label: place.custom_prediction_label || '(Custom Non-Google Result)', // required by https://developers.google.com/maps/terms § 10.1.1 (d)
                                description: place.formatted_address,
                                place: place,
                                matched_substrings: match.matched_substrings,
                                terms: match.terms
                            });
                        }
                    }

                    return predictions;
                }

                function getCustomPlaceMatches(query, place) {
                    var q = query + '', // make a copy so we don't interfere with subsequent matches
                    terms = [],
                    matched_substrings = [],
                    fragment,
                    termFragments,
                    i;

                    termFragments = place.formatted_address.split(',');
                    for (i = 0; i < termFragments.length; i++) {
                        fragment = termFragments[i].trim();

                        if (q.length > 0) {
                            if (fragment.length >= q.length) {
                                if (startsWith(fragment, q)) {
                                    matched_substrings.push({
                                        length: q.length,
                                        offset: i
                                    });
                                }
                                q = ''; // no more matching to do
                            } else {
                                if (startsWith(q, fragment)) {
                                    matched_substrings.push({
                                        length: fragment.length,
                                        offset: i
                                    });
                                    q = q.replace(fragment, '').trim();
                                } else {
                                    q = ''; // no more matching to do
                                }
                            }
                        }

                        terms.push({
                            value: fragment,
                            offset: place.formatted_address.indexOf(fragment)
                        });
                    }

                    return {
                        matched_substrings: matched_substrings,
                        terms: terms
                    };
                }

                function isString(val) {
                    return Object.prototype.toString.call(val) === '[object String]';
                }

                function isObject(val) {
                    return Object.prototype.toString.call(val) === '[object Object]';
                }

                function indexOf(array, item) {
                    var i, length;

                    if (array === null) {
                        return -1;
                    }
                    length = array.length;
                    for (i = 0; i < length; i++) {
                        if (array[i] === item) {
                            return i;
                        }
                    }
                    return -1;
                }

                function startsWith(string1, string2) {
                    return toLower(string1).lastIndexOf(toLower(string2), 0) === 0;
                }

                function toLower(string) {
                    return (string === null) ? '' : string.toLowerCase();
                }
            }
        };
    }
    ])


.directive('gPlacesAutocompleteDrawer', ['$window', '$document', function($window, $document) {
    var TEMPLATE = [
    '<div class="pac-container" ng-if="isOpen()" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">',
    '  <div class="pac-item" g-places-autocomplete-prediction index="$index" prediction="prediction" query="query"',
    '       ng-repeat="prediction in predictions track by $index" ng-class="{\'pac-item-selected\': isActive($index) }"',
    '       ng-mouseenter="selectActive($index)" ng-click="selectPrediction($index)" role="option" id="{{prediction.id}}">',
    '  </div>',
    '</div>'
    ];

    return {
        restrict: 'A',
        scope: {
            input: '=',
            query: '=',
            predictions: '=',
            active: '=',
            selected: '='
        },
        template: TEMPLATE.join(''),
        link: function($scope, element) {
            element.bind('mousedown', function(event) {
                event.preventDefault(); // prevent blur event from firing when clicking selection
            });

            // $window.onresize = function() {
            //     $scope.$apply(function() {
            //         $scope.position = getDrawerPosition($scope.input);
            //     });
            // };

            $scope.isOpen = function() {
                return $scope.predictions.length > 0;
            };

            $scope.isActive = function(index) {
                return $scope.active === index;
            };

            $scope.selectActive = function(index) {
                $scope.active = index;
            };

            $scope.selectPrediction = function(index) {
                $scope.selected = index;
            };

            $scope.$watch('predictions', function() {
                $scope.position = getDrawerPosition($scope.input);
            }, true);

            function getDrawerPosition(element) {
                var domEl = element[0],
                rect = domEl.getBoundingClientRect(),
                docEl = $document[0].documentElement,
                body = $document[0].body,
                scrollTop = $window.pageYOffset || docEl.scrollTop || body.scrollTop,
                scrollLeft = $window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

                return {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top + rect.height + scrollTop,
                    left: rect.left + scrollLeft
                };
            }
        }
    };
}])

.directive('gPlacesAutocompletePrediction', [function() {
    var TEMPLATE = [
    '<span class="pac-icon pac-icon-marker"></span>',
    '<span class="pac-item-query" ng-bind-html="prediction | highlightMatched"></span>',
    '<span ng-repeat="term in prediction.terms | unmatchedTermsOnly:prediction">{{term.value | trailingComma:!$last}}&nbsp;</span>',
    '<span class="custom-prediction-label" ng-if="prediction.is_custom">&nbsp;{{prediction.custom_prediction_label}}</span>'
    ];

    return {
        restrict: 'A',
        scope: {
            index: '=',
            prediction: '=',
            query: '='
        },
        template: TEMPLATE.join('')
    };
}])

.filter('highlightMatched', ['$sce', function($sce) {
    return function(prediction) {
        var matchedPortion = '',
        unmatchedPortion = '',
        matched;

        if (prediction.matched_substrings.length > 0 && prediction.terms.length > 0) {
            matched = prediction.matched_substrings[0];
            matchedPortion = prediction.terms[0].value.substr(matched.offset, matched.length);
            unmatchedPortion = prediction.terms[0].value.substr(matched.offset + matched.length);
        }

        return $sce.trustAsHtml('<span class="pac-matched">' + matchedPortion + '</span>' + unmatchedPortion);
    };
}])

.filter('unmatchedTermsOnly', [function() {
    return function(terms, prediction) {
        var i, term, filtered = [];

        for (i = 0; i < terms.length; i++) {
            term = terms[i];
            if (prediction.matched_substrings.length > 0 && term.offset > prediction.matched_substrings[0].length) {
                filtered.push(term);
            }
        }

        return filtered;
    };
}])

.filter('trailingComma', [function() {
    return function(input, condition) {
        return (condition) ? input + ',' : input;
    };
}]);
(function() {
    'use strict';
    angular
        .module('persice')
        .factory('EventsFilterRepository', EventsFilterRepository);

    /**
     * class EventsFilterRepository
     * classDesc Service for Events Filter
     * @ngInject
     */
    function EventsFilterRepository(EventsFiltersFactory, $log, $filter, $rootScope, USER_ID, $q) {

        var defaultState = {
            distance: 10000,
            keyword: '',
            order_criteria: 'distance',
            user: '/api/v1/auth/user/' + USER_ID + '/'
        };

        var service = {
            filterState: null,
            filterId: null,
            filtersCreated: false,
            getFilters: getFilters,
            saveFilters: saveFilters,
            createFilters: createFilters,
            getFilterState: getFilterState,
        };
        return service;


        function getFilters() {
            var deferred2 = $q.defer();


            EventsFiltersFactory.query({
                format: 'json'
            }, getFiltersComplete, getFiltersFailed);

            return deferred2.promise;

            function getFiltersComplete(response) {
                if (response.objects.length === 0) {
                    if (!service.filtersCreated) {
                        service.filtersCreated = true;
                        service.createFilters(defaultState);
                    }
                    service.filterState = defaultState;
                    deferred2.resolve(defaultState);
                } else {
                    service.filterId = response.objects[0].id;
                    service.filterState = response.objects[0];
                    deferred2.resolve(response.objects[0]);
                }

            }

            function getFiltersFailed(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
                service.filterState = defaultState;
                deferred2.reject(message);

            }
        }

        function getFilterState() {
            return service.filterState;
        }


        function saveFilters(newFilters) {
            if (service.filterId === null) {
                return;
            }

            var deferred = $q.defer();



            EventsFiltersFactory.update({
                filterId: service.filterId
            }, newFilters, saveFiltersSuccess, saveFiltersError);

            return deferred.promise;

            function saveFiltersSuccess(response) {
                deferred.resolve();
                service.filterState = newFilters;

            }

            function saveFiltersError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
                deferred.reject();


            }

        }

        function createFilters(newFilters) {

            return EventsFiltersFactory.save(newFilters, createFiltersSuccess, createFiltersError);

            function createFiltersSuccess(response) {
                service.filterId = response.id;
                service.filtersCreated = true;
            }

            function createFiltersError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);


            }

        }



    }
    EventsFilterRepository.$inject = ["EventsFiltersFactory", "$log", "$filter", "$rootScope", "USER_ID", "$q"];

})();

'use strict';
angular
    .module('persice')
    .factory('EventsFiltersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/events/filter/state/:filterId/:param', {
            filterId: '@filterId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }]);
(function() {
    'use strict';

    /**
     * @desc display filter for matchfeed
     * @example <events-filter></events-filter>
     */
    angular
        .module('persice')
        .directive('eventsFilter', eventsFilter);

    function eventsFilter($rootScope) {
        var directive = {
            controller: EventsFilterController,
            controllerAs: 'filter',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class'
            },
            link: link,
            templateUrl: 'components/filterEvents/filterEvents.template.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }
    eventsFilter.$inject = ["$rootScope"];

    /**
     * @desc controller for Events Filter directive
     * @ngInject
     */
    function EventsFilterController($scope, $timeout, $rootScope, $window, SettingsRepository, EventsFiltersFactory, EventsFilterRepository, USER_ID, lodash, $log, $q) {
        var vm = this;

        vm.changed = false;

        $timeout(function() {
            vm.changed = false;
        }, 1000);
        vm.saveFilters = saveFilters;
        vm.getFilters = getFilters;
        vm.removeKeyword = removeKeyword;
        vm.addKeyword = addKeyword;
        vm.refreshEventsFeed = refreshEventsFeed;
        vm.hasChanges = hasChanges;

        vm.orderByValues = [{
            name: 'Match score',
            value: 'match_score'

        }, {
            name: 'Distance',
            value: 'distance'
        }];
        vm.orderBy = 'distance';

        vm.distanceValue = 10000;
        vm.distanceUnit = 'miles';

        vm.filtermessage = '';
        vm.currentFilters = null;
        vm.showFilterMessage = false;

        vm.myKeywords = [];

        function hasChanges() {
            vm.changed = true;
        }


        function refreshEventsFeed() {
            vm.saveFilters();
        }


        $rootScope.$on('distanceUnitChanged', function(event, value) {
            vm.distanceUnit = value;
        });

        $rootScope.$on('refreshEventFilters', function(event, value) {
            vm.getFilters();
        });


        $scope.$watch(angular.bind(this, function(distanceValue) {
            return vm.distanceValue;
        }), function(newVal) {
            vm.hasChanges();

        });

        vm.getFilters();

        function getFilters() {
            vm.changed = false;
            EventsFilterRepository.getFilters().then(function(data) {
                vm.currentFilters = data;
                vm.distanceValue = vm.currentFilters.distance;
                vm.orderBy = vm.currentFilters.order_criteria;
                vm.distanceUnit = $rootScope.distance_unit;
                if (vm.currentFilters.keyword !== '' && vm.currentFilters.keyword !== undefined) {
                    vm.myKeywords = vm.currentFilters.keyword.split(',');
                } else {
                    vm.myKeywords.splice(0, vm.myKeywords.length);
                }
                $scope.$broadcast('reCalcViewDimensions');
                $scope.$broadcast('rzSliderForceRender');
                vm.changed = false;

            }, function(error) {

            });



        }



        function saveFilters() {

            vm.newFilters = {
                distance: vm.distanceValue,
                order_criteria: vm.orderBy,
                keyword: vm.myKeywords.length === 0 ? '' : vm.myKeywords.join(),
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            EventsFilterRepository.saveFilters(vm.newFilters).then(function(data) {
                vm.changed = false;
                $rootScope.$emit('refreshEventFeed');
                $rootScope.$emit('refreshEventFilters');

            }, function(error) {

            });
            $scope.$broadcast('reCalcViewDimensions');
            $scope.$broadcast('rzSliderForceRender');
        }

        function removeKeyword(index) {
            vm.myKeywords.splice(index, 1);
            vm.hasChanges();
        }

        function addKeyword(item) {
            vm.filtermessage = '';
            if (item === '' || item === undefined) {
                vm.filtermessage = 'Keyword must have at least 3 letters';
                vm.showFilterMessage = true;
            } else {

                if (vm.myKeywords.length < 5) {
                    vm.existing = false;
                    for (var i = vm.myKeywords.length - 1; i >= 0; i--) {
                        if (vm.myKeywords[i] === item) {
                            vm.existing = true;
                        }
                    }


                    if (vm.existing === false) {
                        vm.myKeywords.push(item);
                        vm.hasChanges();
                        vm.newKeyword = '';
                        vm.showFilterMessage = false;
                    } else {
                        vm.filtermessage = 'Keyword already exists';
                        vm.showFilterMessage = true;
                    }
                } else {
                    vm.filtermessage = 'You cannot add more than 5 keywords';
                    vm.showFilterMessage = true;
                }
            }

        }

    }
    EventsFilterController.$inject = ["$scope", "$timeout", "$rootScope", "$window", "SettingsRepository", "EventsFiltersFactory", "EventsFilterRepository", "USER_ID", "lodash", "$log", "$q"];



})();

(function() {
    'use strict';
    angular
        .module('persice')
        .factory('FilterRepository', FilterRepository);

    /**
     * class FilterRepository
     * classDesc Service for Filter
     * @ngInject
     */
    function FilterRepository(FiltersFactory, $log, $filter, $rootScope, USER_ID, $q) {

        var defaultState = {
            distance: 10000,
            gender: 'm,f',
            min_age: 25,
            max_age: 60,
            keyword: '',
            distance_unit: 'miles',
            order_criteria: 'match_score',
            user: '/api/v1/auth/user/' + USER_ID + '/'
        };


        var service = {
            filterState: null,
            filterId: null,
            filtersCreated: false,
            getFilters: getFilters,
            saveFilters: saveFilters,
            createFilters: createFilters,
            getFilterState: getFilterState,
        };
        return service;

        function getFilters() {
            var deferred2 = $q.defer();


            FiltersFactory.query({
                format: 'json'
            }, getFiltersComplete, getFiltersFailed);

            return deferred2.promise;

            function getFiltersComplete(response) {
                if (response.objects.length === 0) {
                    if (!service.filtersCreated) {
                        service.filtersCreated = true;
                        service.createFilters(defaultState);
                    }
                    service.filterState = defaultState;
                    deferred2.resolve(defaultState);


                } else {
                    service.filterId = response.objects[0].id;
                    service.filterState = response.objects[0];
                    deferred2.resolve(response.objects[0]);
                }

            }

            function getFiltersFailed(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
                service.filterState = defaultState;
                deferred2.reject(message);

            }
        }

        function getFilterState() {
            return service.filterState;
        }


        function saveFilters(newFilters) {

            if (service.filterId === null) {
                return;
            }

            var deferred = $q.defer();

            FiltersFactory.update({
                filterId: service.filterId
            }, newFilters, saveFiltersSuccess, saveFiltersError);

            return deferred.promise;

            function saveFiltersSuccess(response) {
                deferred.resolve();
                service.filterState = newFilters;

            }

            function saveFiltersError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);
                deferred.reject();


            }

        }

        function createFilters(newFilters) {

            return FiltersFactory.save(newFilters, createFiltersSuccess, createFiltersError);


            function createFiltersSuccess(response) {
                service.filterId = response.id;
                service.filtersCreated = true;
            }

            function createFiltersError(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);


            }

        }



    }
    FilterRepository.$inject = ["FiltersFactory", "$log", "$filter", "$rootScope", "USER_ID", "$q"];

})();

'use strict';
angular
    .module('persice')
    .factory('FiltersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/filter/state/:filterId/:param', {
            filterId: '@filterId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }]);
(function() {
    'use strict';

    /**
     * @desc display filter for matchfeed
     * @example <matchfeed-filter></matchfeed-filter>
     */
    angular
        .module('persice')
        .directive('matchfeedFilter', matchfeedFilter);

    function matchfeedFilter($rootScope) {
        var directive = {
            controller: FilterController,
            controllerAs: 'filter',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class'
            },
            link: link,
            templateUrl: 'components/filter/matchfeedFilter.directive.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }
    matchfeedFilter.$inject = ["$rootScope"];

    /**
     * @desc controller for matchfeedFilter directive
     * @ngInject
     */
    function FilterController($scope, $timeout, $rootScope, $window, SettingsRepository, FiltersFactory, FilterRepository, USER_ID, lodash, $log) {
        var vm = this;

        vm.changed = false;
        $timeout(function() {
            vm.changed = false;
        }, 2000);


        vm.toggleGender = toggleGender;
        vm.saveFilters = saveFilters;
        vm.saveFiltersDebounce = lodash.debounce(saveFilters, 500);
        vm.getFilters = getFilters;
        vm.removeKeyword = removeKeyword;
        vm.addKeyword = addKeyword;
        vm.refreshMatchFeed = refreshMatchFeed;
        vm.hasChanges = hasChanges;

        vm.orderByValues = [{
            name: 'Match score',
            value: 'match_score'

        }, {
            name: 'Distance',
            value: 'distance'
        }, {
            name: 'Mutual friends',
            value: 'mutual_friends'
        }];
        vm.orderBy = 'match_score';
        vm.distanceValue = 10000;
        vm.distanceUnit = 'miles';

        vm.male = false;
        vm.female = false;


        vm.checkedmale = false;
        vm.checkedfemale = false;

        vm.genders = '';
        vm.filtermessage = '';

        vm.currentFilters = null;

        vm.showFilterMessage = false;

        vm.ageValues = [25, 60];

        // In your controller
        vm.ageSlider = {
            min: 25,
            max: 60,
            ceil: 115,
            floor: 18
        };

        function hasChanges() {
            vm.changed = true;
        }

        $scope.$watch(angular.bind(this, function(distanceValue) {
            return vm.distanceValue;
        }), function(newVal) {
            vm.hasChanges();
        });

        $scope.$watch(angular.bind(this, function(ageSlider) {
            return vm.ageSlider.min;
        }), function(newVal) {
            vm.hasChanges();
        });

        $scope.$watch(angular.bind(this, function(ageSlider) {
            return vm.ageSlider.max;
        }), function(newVal) {
            vm.hasChanges();
        });

        vm.myKeywords = [];
        vm.gendersArr = [];


        vm.getFilters();


        $rootScope.$on('refreshFilters', function() {
            vm.getFilters();
        });

        function refreshMatchFeed() {
            vm.saveFilters();
        }

        $rootScope.$on('distanceUnitChanged', function(event, value) {
            vm.distanceUnit = value;
        });

        function getFilters() {

            vm.changed = false;
            FilterRepository.getFilters().then(function(data) {
                vm.currentFilters = data;
                vm.distanceValue = vm.currentFilters.distance;
                vm.distanceUnit = vm.currentFilters.distance_unit;
                vm.ageSlider.min = vm.currentFilters.min_age;
                vm.ageSlider.max = vm.currentFilters.max_age;
                vm.orderBy = vm.currentFilters.order_criteria;

                if (vm.currentFilters.keyword !== '' && vm.currentFilters.keyword !== undefined) {
                    vm.myKeywords = vm.currentFilters.keyword.split(',');
                } else {
                    vm.myKeywords.splice(0, vm.myKeywords.length);
                }
                if (vm.currentFilters.gender === '') {
                    vm.male = false;
                    vm.female = false;
                }
                if (vm.currentFilters.gender === 'm,f') {
                    vm.male = true;
                    vm.female = true;
                }
                if (vm.currentFilters.gender === 'm') {
                    vm.male = true;
                    vm.female = false;
                }
                if (vm.currentFilters.gender === 'f') {
                    vm.male = false;
                    vm.female = true;
                }

                $scope.$broadcast('reCalcViewDimensions');
                $scope.$broadcast('rzSliderForceRender');
                vm.changed = false;

            }, function(error) {

            });


        }

        function toggleGender(value, checked) {
            if (checked === true) {
                vm.gendersArr.push(value);
            } else {
                var index = vm.gendersArr.indexOf(value);
                vm.gendersArr.splice(index, 1);
            }
            vm.gendersArr.sort().reverse();
            vm.genders = vm.gendersArr.join(',');
            vm.hasChanges();
        }

        function saveFilters() {

            vm.newFilters = {
                distance: vm.distanceValue,
                gender: vm.genders,
                order_criteria: vm.orderBy,
                min_age: vm.ageSlider.min,
                max_age: vm.ageSlider.max,
                keyword: vm.myKeywords.length === 0 ? '' : vm.myKeywords.join(),
                user: '/api/v1/auth/user/' + USER_ID + '/'
            };

            FilterRepository.saveFilters(vm.newFilters).then(function(data) {
                vm.changed = false;
                $rootScope.$emit('refreshMatchFeed');
                $rootScope.$emit('refreshFilters');

            }, function(error) {

            });


            $scope.$broadcast('reCalcViewDimensions');
            $scope.$broadcast('rzSliderForceRender');

        }

        function removeKeyword(index) {
            vm.myKeywords.splice(index, 1);
            vm.hasChanges();
        }

        function addKeyword(item) {
            vm.filtermessage = '';
            if (item === '' || item === undefined) {
                vm.filtermessage = 'Keyword must have at least 3 letters';
                vm.showFilterMessage = true;
            } else {

                if (vm.myKeywords.length < 5) {
                    vm.existing = false;
                    for (var i = vm.myKeywords.length - 1; i >= 0; i--) {
                        if (vm.myKeywords[i] === item) {
                            vm.existing = true;
                        }
                    }


                    if (vm.existing === false) {
                        vm.myKeywords.push(item);
                        vm.hasChanges();
                        vm.newKeyword = '';
                        vm.showFilterMessage = false;
                    } else {
                        vm.filtermessage = 'Keyword already exists';
                        vm.showFilterMessage = true;
                    }
                } else {
                    vm.filtermessage = 'You cannot add more than 5 keywords';
                    vm.showFilterMessage = true;
                }
            }

        }

    }
    FilterController.$inject = ["$scope", "$timeout", "$rootScope", "$window", "SettingsRepository", "FiltersFactory", "FilterRepository", "USER_ID", "lodash", "$log"];



})();

(function() {
    'use strict';

    /**
     * @desc display for user profile
     * @example <user-profile></user-profile>
     */
    angular
        .module('persice')
        .directive('eventsFeed', eventsFeed);

    function eventsFeed() {
        var directive = {
            controller: EventsFeedController,
            controllerAs: 'eventsfeed',
            bindToController: true,
            scope: {
                id: '@id',
                class: '@class',
                header: '@header',
                body: '@body',
                type: '@type'
            },
            link: link,
            templateUrl: 'components/eventsfeed/eventsfeed.directive.html',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {


        }



    }

    /**
     * @desc controller for eventsFeed directive
     * @ngInject
     */
    function EventsFeedController($scope, USER_ID, $rootScope, FeedEventsFriendsFactory, FeedEventsAllFactory, FeedEventsMyFactory, $resource, $log, $timeout, $q, $http, $filter, $state, moment, $window) {
        var vm = this;
        vm.noEvents = false;
        vm.pok = false;
        vm.noResults = false;
        vm.noEvents = false;
        vm.loading = false;
        vm.loadingMore = false;
        vm.nextOffset = 10;
        vm.next = null;

        vm.getEvents = getEvents;
        vm.loadMoreEvents = loadMoreEvents;
        vm.gotoEvent = gotoEvent;
        vm.events = [];

        vm.getEvents();


        $rootScope.$on('refreshEventFeed', function(event, data) {
            $('.right.sidebar.eventsfeedfilter').sidebar('hide');
            $log.info($state.current.name);
            if (vm.type === $state.current.name) {
                vm.getEvents();
            }

        });


        function getEvents() {
            vm.nextOffset = 10;
            vm.next = null;
            vm.loading = true;
            vm.noEvents = false;

            if (vm.type === 'events.mynetwork') {
                vm.EventsFeed = $resource('/api/v1/feed/events/friends/:eventId/:param', {
                    eventId: '@eventId'
                }, {
                    query: {
                        method: 'GET',
                        isArray: false,
                        cache: false
                    },
                    save: {
                        method: 'POST'
                    },
                    update: {
                        method: 'PATCH'
                    },
                    delete: {
                        method: 'DELETE'
                    }
                });
            }


            if (vm.type === 'events.allevents') {
                vm.EventsFeed = $resource('/api/v1/feed/events/all/:eventId/:param', {
                    eventId: '@eventId'
                }, {
                    query: {
                        method: 'GET',
                        isArray: false,
                        cache: false
                    },
                    save: {
                        method: 'POST'
                    },
                    update: {
                        method: 'PATCH'
                    },
                    delete: {
                        method: 'DELETE'
                    }
                });
            }

            if (vm.type === 'events.myevents') {
                vm.EventsFeed = $resource('/api/v1/feed/events/my/:eventId/:param', {
                    eventId: '@eventId'
                }, {
                    query: {
                        method: 'GET',
                        isArray: false,
                        cache: false
                    },
                    save: {
                        method: 'POST'
                    },
                    update: {
                        method: 'PATCH'
                    },
                    delete: {
                        method: 'DELETE'
                    }
                });
            }



            vm.EventsFeed.query({
                format: 'json',
                limit: 10,
                offset: 0,
                filter: true
            }).$promise.then(function(data) {
                    var responseEvents = data.objects;
                    vm.events = [];

                    $filter('orderBy')(responseEvents, 'starts_on', true);
                    vm.next = data.meta.next;

                    if (data.objects.length === 0) {

                        vm.noEvents = true;

                    }

                    for (var obj in responseEvents) {
                        var localDate = $filter('amDateFormat')(responseEvents[obj].starts_on, 'dddd, MMMM Do YYYY');
                        var today = moment().format('dddd, MMMM Do YYYY');
                        $log.info(today);
                        if (localDate === today) {
                            localDate = 'Today';
                        }
                        var localDatePlain = $filter('amDateFormat')(responseEvents[obj].starts_on, 'L');

                        var eventIndex = $filter('getIndexByProperty')('date', localDate, vm.events);

                        if (eventIndex === null) {
                            vm.events.push({
                                date: localDate,
                                realDate: localDatePlain,
                                items: []
                            });
                            eventIndex = vm.events.length - 1;
                        }

                        vm.events[eventIndex].items.push({
                            id: responseEvents[obj].id,
                            name: responseEvents[obj].name,
                            street: responseEvents[obj].street,
                            city: responseEvents[obj].city,
                            state: responseEvents[obj].state,
                            zipcode: responseEvents[obj].zipcode,
                            description: responseEvents[obj].description,
                            location: responseEvents[obj].location,
                            starts_on: responseEvents[obj].starts_on,
                            ends_on: responseEvents[obj].ends_on,
                            full_address: responseEvents[obj].full_address,
                            location_name: responseEvents[obj].location_name,
                            country: responseEvents[obj].country,
                            repeat: responseEvents[obj].repeat,
                            friend_attendees_count: responseEvents[obj].friend_attendees_count,
                            cumulative_match_score: responseEvents[obj].cumulative_match_score,
                            distance: responseEvents[obj].distance
                        });

                        vm.events[eventIndex].items = $filter('orderBy')(vm.events[eventIndex].items, 'starts_on', true);
                    }

                    vm.events = $filter('orderBy')(vm.events, 'starts_on', true);


                    vm.loading = false;


                },
                function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;

                    $log.error(message);

                    vm.noEvents = true;

                    vm.loading = false;

                });

        }

        function loadMoreEvents() {
            var deferred = $q.defer();



            if (vm.next === null) {
                deferred.reject();
                return deferred.promise;
            }

            if (!vm.loadingMore) {

                vm.loadingMore = true;
                vm.EventsFeed.query({
                    format: 'json',
                    limit: 10,
                    offset: vm.nextOffset
                }).$promise.then(function(data) {
                        var responseEvents = data.objects;
                        vm.nextOffset += 10;

                        $filter('orderBy')(responseEvents, 'starts_on', true);
                        vm.next = data.meta.next;

                        for (var obj in responseEvents) {
                            var localDate = $filter('amDateFormat')(responseEvents[obj].starts_on, 'dddd, MMMM Do YYYY');
                            var today = moment().format('dddd, MMMM Do YYYY');
                            $log.info(today);
                            if (localDate === today) {
                                localDate = 'Today';
                            }
                            var localDatePlain = $filter('amDateFormat')(responseEvents[obj].starts_on, 'L');

                            var eventIndex = $filter('getIndexByProperty')('date', localDate, vm.events);

                            if (eventIndex === null) {
                                vm.events.push({
                                    date: localDate,
                                    realDate: localDatePlain,
                                    items: []
                                });
                                eventIndex = vm.events.length - 1;
                            }

                            vm.events[eventIndex].items.push({
                                id: responseEvents[obj].id,
                                name: responseEvents[obj].name,
                                street: responseEvents[obj].street,
                                city: responseEvents[obj].city,
                                state: responseEvents[obj].state,
                                zipcode: responseEvents[obj].zipcode,
                                description: responseEvents[obj].description,
                                location: responseEvents[obj].location,
                                full_address: responseEvents[obj].full_address,
                                location_name: responseEvents[obj].location_name,
                                country: responseEvents[obj].country,
                                starts_on: responseEvents[obj].starts_on,
                                ends_on: responseEvents[obj].ends_on,
                                repeat: responseEvents[obj].repeat,
                                friend_attendees_count: responseEvents[obj].friend_attendees_count,
                                cumulative_match_score: responseEvents[obj].cumulative_match_score,
                                distance: responseEvents[obj].distance

                            });

                            vm.events[eventIndex].items = $filter('orderBy')(vm.events[eventIndex].items, 'starts_on', true);
                        }

                        vm.events = $filter('orderBy')(vm.events, 'starts_on', true);



                        vm.loadingMore = false;
                        deferred.resolve();


                    },
                    function(response) {
                        deferred.reject();
                        var data = response.data,
                            status = response.status,
                            header = response.header,
                            config = response.config,
                            message = 'Error ' + status;

                        $log.error(message);

                        vm.loadingMore = false;
                        deferred.reject();

                    });


            } else {
                deferred.reject();
            }


            return deferred.promise;
        }

        function gotoEvent(id) {
            var w = angular.element($window);

            if (w.width() > 767) {
                $rootScope.$broadcast('openViewEventModal', id);
            } else {
                $state.go('event.details', {
                    eventId: id
                });
            }



        }



    }
    EventsFeedController.$inject = ["$scope", "USER_ID", "$rootScope", "FeedEventsFriendsFactory", "FeedEventsAllFactory", "FeedEventsMyFactory", "$resource", "$log", "$timeout", "$q", "$http", "$filter", "$state", "moment", "$window"];



})();
'use strict';

angular
    .module('frontend.semantic.dropdown', [])
    .controller('DropDownController', ['$scope',
    function($scope) {
            $scope.items = [];

            this.add_item = function(scope) {
                $scope.items.push(scope);
                return $scope.items;
            };

            this.remove_item = function(scope) {
                var index = $scope.items.indexOf(scope);
                if (index !== -1)
                    $scope.items.splice(index, 1);
            };

            this.update_title = function(title) {
                for (var i in $scope.items) {
                    $scope.items[i].title = title;
                }
            };

    }
    ])

.directive('dropdown', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: 'DropDownController',
        scope: {
            title: '@',
            open: '@',
            model: '=ngModel'
        },
        template: '<div class="{{ dropdown_class }}">' +
            '<div class="default text">{{ title }}</div>' +
            '<i class="dropdown icon"></i>' +
            '<div class="{{ menu_class }}"  ng-transclude>' +
            '</div>' +
            '</div>',
        link: function(scope, element, attrs, DropDownController) {
            scope.dropdown_class = 'ui selection dropdown';
            scope.menu_class = 'menu transition hidden';
            scope.original_title = scope.title;

            if (scope.open === 'true') {
                scope.is_open = true;
                scope.dropdown_class = scope.dropdown_class + ' active visible';
                scope.menu_class = scope.menu_class + ' visible';
            } else {
                scope.is_open = false;
            }
            DropDownController.add_item(scope);

            /*
             * Watch for title changing
             */
            scope.$watch('title', function(val, oldVal) {
                if (val === undefined || val === oldVal || val === scope.original_title)
                    return;

                scope.model = val;
            });

            /*
             * Watch for ng-model changing
             */
            scope.$watch('model', function(val) {
                // update title or reset the original title if its empty
                scope.model = val;
                DropDownController.update_title(val || scope.original_title);
            });

            /*
             * Click handler
             */
            element.bind('click', function() {
                if (scope.is_open === false) {
                    scope.$apply(function() {
                        scope.dropdown_class = 'ui selection dropdown active visible';
                        scope.menu_class = 'menu transition visible';
                    });
                } else {
                    if (scope.title !== scope.original_title)
                        scope.model = scope.title;
                    scope.$apply(function() {
                        scope.dropdown_class = 'ui selection dropdown';
                        scope.menu_class = 'menu transition hidden';
                    });
                }
                scope.is_open = !scope.is_open;
            });
        }
    };
})

.directive('dropdownGroup', function() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        require: '^dropdown',
        scope: {
            title: '=title'
        },
        template: '<div class="item" ng-transclude >{{ item_title }}</div>',
        link: function(scope, element, attrs, DropDownController) {

            // Check if title= was set... if not take the contents of the dropdown-group tag
            // title= is for dynamic variables from something like ng-repeat {{variable}}
            if (scope.title === undefined) {
                scope.item_title = element.children()[0].innerHTML;
            } else {
                scope.item_title = scope.title;
            }

            //
            // Menu item click handler
            //
            element.bind('click', function() {
                DropDownController.update_title(scope.item_title);
            });
        }
    };
});
'use strict';
angular.module('frontend.semantic.dimmer', [])

.directive("pageDimmer", function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            show: "=?",
            model: '=ngModel'
        },
        template: "<div class=\"{{dimmer_class}}\" ng-click=\"click_on_dimmer()\">" +
            "<div class=\"content\">" +
            "<div class=\"center\" ng-transclude></div>" +
            "</div>" +
            "</div>",
        link: function(scope, element, attrs, ngModel) {

            if (scope.show == true) {
                scope.dimmer_class = 'ui page inverted active dimmer';
            } else {
                scope.show = false;
                scope.dimmer_class = 'ui page inverted disable dimmer';
            }

            //
            // Click on dimmer handler
            //
            scope.click_on_dimmer = function() {
                scope.model = true;
                scope.show = true;
                scope.dimmer_class = 'ui page inverted active dimmer';
            }

            //
            // Watch for the ng-model changing
            //
            scope.$watch('model', function(val) {
                if (val == false || val == undefined) {
                    scope.show = false;
                    scope.dimmer_class = 'ui page inverted disable dimmer';
                    return;
                } else
                    scope.dimmer_class = 'ui page inverted active dimmer';
            });
        }
    };
});
(function() {
    'use strict';

    /**
     * @desc display counter for new connections
     * @example <div connections-counter></div>
     */
    angular
        .module('persice')
        .directive('connectionsCounter', connectionsCounter);

    function connectionsCounter() {
        var directive = {
            controller: ConnectionsController,
            controllerAs: 'connections',
            bindToController: true,
            scope: {

            },
            link: link,
            template: '<div ng-class="{\'hiddencounter\': connections.hideClass}" class="ui label">{{connections.counter}}</div>',
            restrict: 'E',
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {


        }



    }

    /**
     * @desc count new connections
     * @ngInject
     */
    function ConnectionsController($scope, $rootScope, NotificationsRepository) {
        var vm = this;
        vm.counter = 0;
        vm.hideClass = true;

        vm.refreshCounter = refreshCounter;

        $rootScope.$on('refreshConnectionsCounter', function(event, data) {
            vm.refreshCounter();
        });

        vm.refreshCounter();

        function refreshCounter() {
            vm.counter = 0;
            vm.counter = NotificationsRepository.getTotalConnections();

            if (vm.counter > 0) {
                vm.hideClass = false;
            } else {
                vm.hideClass = true;
            }
        }



    }
    ConnectionsController.$inject = ["$scope", "$rootScope", "NotificationsRepository"];



})();
'use strict';

(function(root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory(require('angular'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['angular'], factory);
    } else {
        // Global Variables
        factory(root.angular);
    }
}(window, function(angular) {

    angular.module('frontend.ui.autocomplete', [])
        .directive('autocompleteUi', ['$q', '$parse', '$http', '$sce', '$timeout', '$templateCache', function($q, $parse, $http, $sce, $timeout, $templateCache) {
            // keyboard events
            var KEY_DW = 40;
            var KEY_RT = 39;
            var KEY_UP = 38;
            var KEY_LF = 37;
            var KEY_ES = 27;
            var KEY_EN = 13;
            var KEY_BS = 8;
            var KEY_DEL = 46;
            var KEY_TAB = 9;

            var MIN_LENGTH = 3;
            var MAX_LENGTH = 524288; // the default max length per the html maxlength attribute
            var PAUSE = 500;
            var BLUR_TIMEOUT = 200;

            // string constants
            var REQUIRED_CLASS = 'autocomplete-required';
            var TEXT_SEARCHING = 'Searching...';
            var TEXT_NORESULTS = 'No results found';
            var TEMPLATE_URL = '/autocomplete-alt/index.html';

            // Set the default template for this directive
            $templateCache.put(TEMPLATE_URL,
                '<div class="autocomplete-holder ui left icon input" ng-class="{\'autocomplete-dropdown-visible\': showDropdown, \'loading\': searching}">' +
                '  <input id="{{id}}_value" name={{inputName}} ng-class="{\'autocomplete-input-not-empty\': notEmpty}" ng-model="searchStr" ng-disabled="disableInput" type="{{inputType}}" placeholder="{{placeholder}}" maxlength="{{maxlength}}" ng-focus="onFocusHandler()" class="{{inputClass}}" ng-focus="resetHideResults()" ng-blur="hideResults($event)" autocapitalize="off" autocorrect="off" autocomplete="off" ng-change="inputChangeHandler(searchStr)"/>' +
                ' <i class="icon circular search" ng-show="!searching"></i> ' +
                '  <div id="{{id}}_dropdown" class="autocomplete-dropdown" ng-show="showDropdown">' +
                '    <div class="autocomplete-searching" ng-show="!searching && (!results || results.length == 0)" ng-bind="textNoResults"></div>' +
                '    <div class="autocomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseenter="hoverRow($index)" ng-class="{\'autocomplete-selected-row\': $index == currentIndex}">' +
                '      <div ng-if="imageField" class="autocomplete-image-holder">' +
                '        <img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="autocomplete-image"/>' +
                '        <div ng-if="!result.image && result.image != \'\'" class="autocomplete-image-default"></div>' +
                '      </div>' +
                '      <div class="autocomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div>' +
                '      <div class="autocomplete-title" ng-if="!matchClass">{{ result.title }}</div>' +
                '      <div ng-if="matchClass && result.description && result.description != \'\'" class="autocomplete-description" ng-bind-html="result.description"></div>' +
                '      <div ng-if="!matchClass && result.description && result.description != \'\'" class="autocomplete-description">{{result.description}}</div>' +
                '    </div>' +
                '  </div>' +
                '</div>'
            );

            return {
                restrict: 'EA',
                require: '^?form',
                scope: {
                    selectedObject: '=',
                    disableInput: '=',
                    initialValue: '=',
                    localData: '=',
                    remoteUrlRequestFormatter: '=',
                    remoteUrlRequestWithCredentials: '@',
                    remoteUrlResponseFormatter: '=',
                    remoteUrlErrorCallback: '=',
                    remoteApiHandler: '=',
                    id: '@',
                    type: '@',
                    placeholder: '@',
                    remoteUrl: '@',
                    remoteUrlDataField: '@',
                    titleField: '@',
                    descriptionField: '@',
                    imageField: '@',
                    inputClass: '@',
                    pause: '@',
                    searchFields: '@',
                    minlength: '@',
                    matchClass: '@',
                    clearSelected: '@',
                    overrideSuggestions: '@',
                    fieldRequired: '@',
                    fieldRequiredClass: '@',
                    inputChanged: '=',
                    autoMatch: '@',
                    focusOut: '&',
                    focusIn: '&',
                    inputName: '@'
                },
                templateUrl: function(element, attrs) {
                    return attrs.templateUrl || TEMPLATE_URL;
                },
                link: function(scope, elem, attrs, ctrl) {
                    var inputField = elem.find('input');
                    var minlength = MIN_LENGTH;
                    var searchTimer = null;
                    var hideTimer;
                    var requiredClassName = REQUIRED_CLASS;
                    var responseFormatter;
                    var validState = null;
                    var httpCanceller = null;
                    var dd = elem[0].querySelector('.autocomplete-dropdown');
                    var isScrollOn = false;
                    var mousedownOn = null;
                    var unbindInitialValue;

                    elem.on('mousedown', function(event) {
                        if (event.target.id) {
                            mousedownOn = event.target.id;
                            if (mousedownOn === scope.id + '_dropdown') {
                                document.body.addEventListener('click', clickoutHandlerForDropdown);
                            }
                        } else {
                            mousedownOn = event.target.className;
                        }
                    });

                    scope.currentIndex = null;
                    scope.searching = false;
                    unbindInitialValue = scope.$watch('initialValue', function(newval, oldval) {

                        if (newval) {
                            unbindInitialValue();

                            if (typeof newval === 'object') {
                                scope.searchStr = extractTitle(newval);
                                callOrAssign({
                                    originalObject: newval
                                });
                            } else if (typeof newval === 'string' && newval.length > 0) {
                                scope.searchStr = newval;
                            } else {
                                if (console && console.error) {
                                    console.error('Tried to set initial value of autocomplete to', newval, 'which is an invalid value');
                                }
                            }

                            handleRequired(true);
                        }
                    });

                    scope.$on('autocomplete-alt:clearInput', function(event, elementId) {
                        if (!elementId || elementId === scope.id) {
                            scope.searchStr = null;
                            callOrAssign();
                            handleRequired(false);
                            clearResults();
                        }
                    });

                    // #194 dropdown list not consistent in collapsing (bug).
                    function clickoutHandlerForDropdown(event) {
                        mousedownOn = null;
                        scope.hideResults(event);
                        document.body.removeEventListener('click', clickoutHandlerForDropdown);
                    }

                    // for IE8 quirkiness about event.which
                    function ie8EventNormalizer(event) {
                        return event.which ? event.which : event.keyCode;
                    }

                    function callOrAssign(value) {
                        if (typeof scope.selectedObject === 'function') {
                            scope.selectedObject(value);
                        } else {
                            scope.selectedObject = value;
                        }

                        if (value) {
                            handleRequired(true);
                        } else {
                            handleRequired(false);
                        }
                    }

                    function callFunctionOrIdentity(fn) {
                        return function(data) {
                            return scope[fn] ? scope[fn](data) : data;
                        };
                    }

                    function setInputString(str) {
                        callOrAssign({
                            originalObject: str
                        });

                        if (scope.clearSelected) {
                            scope.searchStr = null;
                        }
                        clearResults();
                    }

                    function extractTitle(data) {
                        // split title fields and run extractValue for each and join with ' '
                        return scope.titleField.split(',')
                            .map(function(field) {
                                return extractValue(data, field);
                            })
                            .join(' ');
                    }

                    function extractValue(obj, key) {
                        var keys, result;
                        if (key) {
                            keys = key.split('.');
                            result = obj;
                            for (var i = 0; i < keys.length; i++) {
                                result = result[keys[i]];
                            }
                        } else {
                            result = obj;
                        }
                        return result;
                    }

                    function findMatchString(target, str) {
                        var result, matches, re;
                        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
                        // Escape user input to be treated as a literal string within a regular expression
                        re = new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                        if (!target) {
                            return;
                        }
                        matches = target.match(re);
                        if (matches) {
                            result = target.replace(re,
                                '<span class="' + scope.matchClass + '">' + matches[0] + '</span>');
                        } else {
                            result = target;
                        }
                        return $sce.trustAsHtml(result);
                    }

                    function handleRequired(valid) {
                        scope.notEmpty = valid;
                        validState = scope.searchStr;
                        if (scope.fieldRequired && ctrl) {
                            ctrl.$setValidity(requiredClassName, valid);
                        }
                    }

                    function keyupHandler(event) {
                        var which = ie8EventNormalizer(event);
                        if (which === KEY_LF || which === KEY_RT) {
                            // do nothing
                            return;
                        }

                        if (which === KEY_UP || which === KEY_EN) {
                            event.preventDefault();
                        } else if (which === KEY_DW) {
                            event.preventDefault();
                            if (!scope.showDropdown && scope.searchStr && scope.searchStr.length >= minlength) {
                                initResults();
                                scope.searching = true;
                                searchTimerComplete(scope.searchStr);
                            }
                        } else if (which === KEY_ES) {
                            clearResults();
                            scope.$apply(function() {
                                inputField.val(scope.searchStr);
                            });
                        } else {
                            if (minlength === 0 && !scope.searchStr) {
                                return;
                            }

                            if (!scope.searchStr || scope.searchStr === '') {
                                scope.showDropdown = false;
                            } else if (scope.searchStr.length >= minlength) {
                                initResults();

                                if (searchTimer) {
                                    $timeout.cancel(searchTimer);
                                }

                                scope.searching = true;

                                searchTimer = $timeout(function() {
                                    searchTimerComplete(scope.searchStr);
                                }, scope.pause);
                            }

                            if (validState && validState !== scope.searchStr && !scope.clearSelected) {
                                scope.$apply(function() {
                                    callOrAssign();
                                });
                            }
                        }
                    }

                    function handleOverrideSuggestions(event) {
                        if (scope.overrideSuggestions &&
                            !(scope.selectedObject && scope.selectedObject.originalObject === scope.searchStr)) {
                            if (event) {
                                event.preventDefault();
                            }
                            setInputString(scope.searchStr);
                        }
                    }

                    function dropdownRowOffsetHeight(row) {
                        var css = getComputedStyle(row);
                        return row.offsetHeight +
                            parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
                    }

                    function dropdownHeight() {
                        return dd.getBoundingClientRect().top +
                            parseInt(getComputedStyle(dd).maxHeight, 10);
                    }

                    function dropdownRow() {
                        return elem[0].querySelectorAll('.autocomplete-row')[scope.currentIndex];
                    }

                    function dropdownRowTop() {
                        return dropdownRow().getBoundingClientRect().top -
                            (dd.getBoundingClientRect().top +
                                parseInt(getComputedStyle(dd).paddingTop, 10));
                    }

                    function dropdownScrollTopTo(offset) {
                        dd.scrollTop = dd.scrollTop + offset;
                    }

                    function updateInputField() {
                        var current = scope.results[scope.currentIndex];
                        if (scope.matchClass) {
                            inputField.val(extractTitle(current.originalObject));
                        } else {
                            inputField.val(current.title);
                        }
                    }

                    function keydownHandler(event) {
                        var which = ie8EventNormalizer(event);
                        var row = null;
                        var rowTop = null;

                        if (which === KEY_EN && scope.results) {
                            if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
                                event.preventDefault();
                                scope.selectResult(scope.results[scope.currentIndex]);
                            } else {
                                handleOverrideSuggestions(event);
                                clearResults();
                            }
                            scope.$apply();
                        } else if (which === KEY_DW && scope.results) {
                            event.preventDefault();
                            if ((scope.currentIndex + 1) < scope.results.length && scope.showDropdown) {
                                scope.$apply(function() {
                                    scope.currentIndex++;
                                    updateInputField();
                                });

                                if (isScrollOn) {
                                    row = dropdownRow();
                                    if (dropdownHeight() < row.getBoundingClientRect().bottom) {
                                        dropdownScrollTopTo(dropdownRowOffsetHeight(row));
                                    }
                                }
                            }
                        } else if (which === KEY_UP && scope.results) {
                            event.preventDefault();
                            if (scope.currentIndex >= 1) {
                                scope.$apply(function() {
                                    scope.currentIndex--;
                                    updateInputField();
                                });

                                if (isScrollOn) {
                                    rowTop = dropdownRowTop();
                                    if (rowTop < 0) {
                                        dropdownScrollTopTo(rowTop - 1);
                                    }
                                }
                            } else if (scope.currentIndex === 0) {
                                scope.$apply(function() {
                                    scope.currentIndex = -1;
                                    inputField.val(scope.searchStr);
                                });
                            }
                        } else if (which === KEY_TAB) {
                            if (scope.results && scope.results.length > 0 && scope.showDropdown) {
                                if (scope.currentIndex === -1 && scope.overrideSuggestions) {
                                    // intentionally not sending event so that it does not
                                    // prevent default tab behavior
                                    handleOverrideSuggestions();
                                } else {
                                    if (scope.currentIndex === -1) {
                                        scope.currentIndex = 0;
                                    }
                                    scope.selectResult(scope.results[scope.currentIndex]);
                                    scope.$digest();
                                }
                            } else {
                                // no results
                                // intentionally not sending event so that it does not
                                // prevent default tab behavior
                                if (scope.searchStr && scope.searchStr.length > 0) {
                                    handleOverrideSuggestions();
                                }
                            }
                        }
                    }

                    function httpSuccessCallbackGen(str) {
                        return function(responseData, status, headers, config) {
                            // normalize return obejct from promise
                            if (!status && !headers && !config) {
                                responseData = responseData.data;
                            }
                            scope.searching = false;
                            processResults(
                                extractValue(responseFormatter(responseData), scope.remoteUrlDataField),
                                str);
                        };
                    }

                    function httpErrorCallback(errorRes, status, headers, config) {
                        // normalize return obejct from promise
                        if (!status && !headers && !config) {
                            status = errorRes.status;
                        }
                        if (status !== 0) {
                            if (scope.remoteUrlErrorCallback) {
                                scope.remoteUrlErrorCallback(errorRes, status, headers, config);
                            } else {
                                if (console && console.error) {
                                    console.error('http error');
                                }
                            }
                        }
                    }

                    function cancelHttpRequest() {
                        if (httpCanceller) {
                            httpCanceller.resolve();
                        }
                    }

                    function getRemoteResults(str) {
                        var params = {},
                            url = scope.remoteUrl + encodeURIComponent(str);
                        if (scope.remoteUrlRequestFormatter) {
                            params = {
                                params: scope.remoteUrlRequestFormatter(str)
                            };
                            url = scope.remoteUrl;
                        }
                        if (!!scope.remoteUrlRequestWithCredentials) {
                            params.withCredentials = true;
                        }
                        cancelHttpRequest();
                        httpCanceller = $q.defer();
                        params.timeout = httpCanceller.promise;
                        $http.get(url, params)
                            .success(httpSuccessCallbackGen(str))
                            .error(httpErrorCallback);
                    }

                    function getRemoteResultsWithCustomHandler(str) {
                        cancelHttpRequest();

                        httpCanceller = $q.defer();

                        scope.remoteApiHandler(str, httpCanceller.promise)
                            .then(httpSuccessCallbackGen(str))
                            .catch(httpErrorCallback);
                    }

                    function clearResults() {
                        scope.showDropdown = false;
                        scope.results = [];
                        if (dd) {
                            dd.scrollTop = 0;
                        }
                    }

                    function initResults() {
                        scope.showDropdown = true;
                        scope.currentIndex = -1;
                        scope.results = [];
                    }

                    function getLocalResults(str) {
                        var i, match, s, value,
                            searchFields = scope.searchFields.split(','),
                            matches = [];

                        for (i = 0; i < scope.localData.length; i++) {
                            match = false;

                            for (s = 0; s < searchFields.length; s++) {
                                value = extractValue(scope.localData[i], searchFields[s]) || '';
                                match = match || (value.toLowerCase().indexOf(str.toLowerCase()) >= 0);
                            }

                            if (match) {
                                matches[matches.length] = scope.localData[i];
                            }
                        }

                        scope.searching = false;
                        processResults(matches, str);
                    }

                    function checkExactMatch(result, obj, str) {
                        if (!str) {
                            return;
                        }
                        for (var key in obj) {
                            if (obj[key].toLowerCase() === str.toLowerCase()) {
                                scope.selectResult(result);
                                return;
                            }
                        }
                    }

                    function searchTimerComplete(str) {
                        // Begin the search
                        if (!str || str.length < minlength) {
                            return;
                        }
                        if (scope.localData) {
                            scope.$apply(function() {
                                getLocalResults(str);
                            });
                        } else if (scope.remoteApiHandler) {
                            getRemoteResultsWithCustomHandler(str);
                        } else {
                            getRemoteResults(str);
                        }
                    }

                    function processResults(responseData, str) {
                        var i, description, image, text, formattedText, formattedDesc;

                        if (responseData && responseData.length > 0) {
                            scope.results = [];

                            for (i = 0; i < responseData.length; i++) {
                                if (scope.titleField && scope.titleField !== '') {
                                    text = formattedText = extractTitle(responseData[i]);
                                }

                                description = '';
                                if (scope.descriptionField) {
                                    description = formattedDesc = extractValue(responseData[i], scope.descriptionField);
                                }

                                image = '';
                                if (scope.imageField) {
                                    image = extractValue(responseData[i], scope.imageField);
                                }

                                if (scope.matchClass) {
                                    formattedText = findMatchString(text, str);
                                    formattedDesc = findMatchString(description, str);
                                }

                                scope.results[scope.results.length] = {
                                    title: formattedText,
                                    description: formattedDesc,
                                    image: image,
                                    originalObject: responseData[i]
                                };

                                if (scope.autoMatch) {
                                    checkExactMatch(scope.results[scope.results.length - 1], {
                                        title: text,
                                        desc: description || ''
                                    }, scope.searchStr);
                                }
                            }

                        } else {
                            scope.results = [];
                        }
                    }

                    function showAll() {
                        if (scope.localData) {
                            processResults(scope.localData, '');
                        } else if (scope.remoteApiHandler) {
                            getRemoteResultsWithCustomHandler('');
                        } else {
                            getRemoteResults('');
                        }
                    }

                    scope.onFocusHandler = function() {
                        if (scope.focusIn) {
                            scope.focusIn();
                        }
                        if (minlength === 0 && (!scope.searchStr || scope.searchStr.length === 0)) {
                            scope.showDropdown = true;
                            showAll();
                        }
                    };

                    scope.hideResults = function(event) {
                        if (mousedownOn &&
                            (mousedownOn === scope.id + '_dropdown' ||
                                mousedownOn.indexOf('autocomplete') >= 0)) {
                            mousedownOn = null;
                        } else {
                            hideTimer = $timeout(function() {
                                clearResults();
                                scope.$apply(function() {
                                    if (scope.searchStr && scope.searchStr.length > 0) {
                                        inputField.val(scope.searchStr);
                                    }
                                });
                            }, BLUR_TIMEOUT);
                            cancelHttpRequest();

                            if (scope.focusOut) {
                                scope.focusOut();
                            }

                            if (scope.overrideSuggestions) {
                                if (scope.searchStr && scope.searchStr.length > 0 && scope.currentIndex === -1) {
                                    handleOverrideSuggestions();
                                }
                            }
                        }
                    };

                    scope.resetHideResults = function() {
                        if (hideTimer) {
                            $timeout.cancel(hideTimer);
                        }
                    };

                    scope.hoverRow = function(index) {
                        scope.currentIndex = index;
                    };

                    scope.selectResult = function(result) {
                        // Restore original values
                        if (scope.matchClass) {
                            result.title = extractTitle(result.originalObject);
                            result.description = extractValue(result.originalObject, scope.descriptionField);
                        }

                        if (scope.clearSelected) {
                            scope.searchStr = null;
                        } else {
                            scope.searchStr = result.title;
                        }
                        callOrAssign(result);
                        clearResults();
                    };

                    scope.inputChangeHandler = function(str) {
                        if (str.length < minlength) {
                            clearResults();
                        } else if (str.length === 0 && minlength === 0) {
                            scope.searching = false;
                            showAll();
                        }

                        if (scope.inputChanged) {
                            str = scope.inputChanged(str);
                        }
                        return str;
                    };

                    // check required
                    if (scope.fieldRequiredClass && scope.fieldRequiredClass !== '') {
                        requiredClassName = scope.fieldRequiredClass;
                    }

                    // check min length
                    if (scope.minlength && scope.minlength !== '') {
                        minlength = parseInt(scope.minlength, 10);
                    }

                    // check pause time
                    if (!scope.pause) {
                        scope.pause = PAUSE;
                    }

                    // check clearSelected
                    if (!scope.clearSelected) {
                        scope.clearSelected = false;
                    }

                    // check override suggestions
                    if (!scope.overrideSuggestions) {
                        scope.overrideSuggestions = false;
                    }

                    // check required field
                    if (scope.fieldRequired && ctrl) {
                        // check initial value, if given, set validitity to true
                        if (scope.initialValue) {
                            handleRequired(true);
                        } else {
                            handleRequired(false);
                        }
                    }

                    scope.inputType = attrs.type ? attrs.type : 'text';

                    // set strings for "Searching..." and "No results"
                    scope.textSearching = attrs.textSearching ? attrs.textSearching : TEXT_SEARCHING;
                    scope.textNoResults = attrs.textNoResults ? attrs.textNoResults : TEXT_NORESULTS;

                    // set max length (default to maxlength deault from html
                    scope.maxlength = attrs.maxlength ? attrs.maxlength : MAX_LENGTH;

                    // register events
                    inputField.on('keydown', keydownHandler);
                    inputField.on('keyup', keyupHandler);

                    // set response formatter
                    responseFormatter = callFunctionOrIdentity('remoteUrlResponseFormatter');

                    scope.$on('$destroy', function() {
                        // take care of required validity when it gets destroyed
                        handleRequired(true);
                    });

                    // set isScrollOn
                    $timeout(function() {
                        var css = getComputedStyle(dd);
                        isScrollOn = css.maxHeight && css.overflowY === 'auto';
                    });
                }
            };
        }]);

}));

'use strict';
angular
    .module('persice')
    .factory('GoalsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/goal/:goalId/:param', {
            goalId: '@goalId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('NewConnectionsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/new_connections/counter/:newConnectionId/:param', {
            goalId: '@newConnectionId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('LikesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/likes/:likeId/:param', {
            likeId: '@likeId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('ProfileFactory', ['$resource', function($resource) {
        return $resource('/api/v1/profile/:profileId/:param', {
            profileId: '@profileId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('LocationFactory', ['$resource', function($resource) {
        return $resource('/api/v1/location/:locationId/:param', {
            locationId: '@locationId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('ConnectionsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/connections/:connectionId/:param', {
            connectionId: '@connectionId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('FriendsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/friends/:friendId/:param', {
            friendId: '@friendId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('MutualFriendsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/mutual/friends/:friendId/:param', {
            friendId: '@friendId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('SubjectsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/subject/:subjectId/:param', {
            subjectId: '@subjectId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('OffersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/offer/:offerId/:param', {
            offerId: '@offerId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('InterestsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/interest/:interestId/:param', {
            interestId: '@interestId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('InterestSubjectFactory', ['$resource', function($resource) {
        return $resource('/api/v1/interest_subject/:interestId/:param', {
            interestId: '@interestId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('UsersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/auth/user/:userId/:param', {
            userId: '@userId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('MessagesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/messages/:messageId/:param', {
            messageId: '@messageId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('InboxFactory', ['$resource', function($resource) {
        return $resource('/api/v1/inbox/last/:inboxId/:param', {
            inboxId: '@inboxId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('FiltersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/filter/state/:filterId/:param', {
            filterId: '@filterId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('PhotosFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photo/:photoId/:param', {
            photoId: '@photoId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('InboxUnreadCounterFactory', ['$resource', function($resource) {
        return $resource('/api/v1/inbox/unread_counter/:unreadId/:param', {
            unreadId: '@unreadId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('EventsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/event/:eventId/:param', {
            eventId: '@eventId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('MembersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/member/:memberId/:param', {
            memberId: '@memberId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('FeedEventsFriendsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/feed/events/friends/:eventId/:param', {
            eventId: '@eventId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('FeedEventsMyFactory', ['$resource', function($resource) {
        return $resource('/api/v1/feed/events/my/:eventId/:param', {
            eventId: '@eventId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('FeedEventsAllFactory', ['$resource', function($resource) {
        return $resource('/api/v1/feed/events/all/:eventId/:param', {
            eventId: '@eventId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('EventsConnections', ['$resource', function($resource) {
        return $resource('/api/v1/events/connections/:connectionId/:param', {
            connectionId: '@connectionId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            }
        });
    }])
    .factory('EventsAttendees', ['$resource', function($resource) {
        return $resource('/api/v1/attendees/:attendeeId/:param', {
            attendeeId: '@attendeeId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            }
        });
    }]);

'use strict';

angular.module('persice')
    .controller('AppCtrl', ["$rootScope", "APP_ID", "USER_PHOTO_SMALL", "NotificationsRepository", "FilterRepository", "$http", "LocationFactory", "$geolocation", "ezfb", "$scope", "USER_ID", "USER_FIRSTNAME", "USER_PHOTO", "$timeout", "$state", "$window", "myIoSocket", "$filter", "$log", "notify", "$resource", "$cookies", "InboxRepository", "moment", "angularMomentConfig", function($rootScope, APP_ID, USER_PHOTO_SMALL, NotificationsRepository, FilterRepository, $http, LocationFactory, $geolocation, ezfb, $scope, USER_ID, USER_FIRSTNAME, USER_PHOTO, $timeout, $state, $window, myIoSocket, $filter, $log, notify, $resource, $cookies, InboxRepository, moment, angularMomentConfig) {
        $rootScope.hideTopMenu = false;

        $rootScope.distance_unit = 'miles';

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



        });



    }]);

angular.module("persice").run(["$templateCache", function($templateCache) {$templateCache.put("app/bigmatchfeed/bigmatchfeed.html","<div style=\"float: right;\"><div class=\"ui text main menu\"><div class=\"text item\" style=\"margin-right: 0px;\">15 Results &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Sort By</div><div class=\"ui pointing dropdown link item\" style=\"padding-left: 0px;margin-left: 0px;\"><span class=\"text\">Most Relevant</span> <i class=\"dropdown icon\"></i><div class=\"menu\"><div class=\"header\">Categories</div><div class=\"item\"><i class=\"dropdown icon\"></i> <span class=\"text\">Clothing</span><div class=\"menu\"><div class=\"header\">Mens</div><div class=\"item\">Shirts</div><div class=\"item\">Pants</div><div class=\"item\">Jeans</div><div class=\"item\">Shoes</div><div class=\"divider\"></div><div class=\"header\">Womens</div><div class=\"item\">Dresses</div><div class=\"item\">Shoes</div><div class=\"item\">Bags</div></div></div><div class=\"item\">Home Goods</div><div class=\"item\">Bedroom</div><div class=\"divider\"></div><div class=\"header\">Order</div><div class=\"item\">Status</div><div class=\"item\">Cancellations</div></div></div></div></div><div class=\"ui grid\"><div class=\"row\"><div class=\"column\"><div class=\"ui fluid card matchedperson\"><div class=\"content heading\"><div class=\"ui tiny image\"><img src=\"http://lorempixel.com/200/200\"></div><div class=\"header-container\"><div class=\"header\">Daniel Louise</div><div class=\"meta\">5 miles away</div></div><div class=\"description-container\"><div class=\"description\">Hi. I just moved to New York City from France and I’m looking to meet new friends and colleagues. I work in finance, but I’d like to join a tech startup. I like to travel and I’m an avid snowboarder. My parents own a winery, so I’m also quite familiar with French wine.</div></div><div class=\"extra\"><div class=\"ui right floated bottom\">7 hours ago</div></div></div><div class=\"content middle\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><div>2 Matched Goals</div></div><div class=\"five wide column\">Jacques wants to meet new people.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to meet new people.</div></div><div class=\"row\"><div class=\"column\"><div></div></div><div class=\"five wide column\">Jacques is wiling to help people learn French.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to learn French.</div></div></div></div><div class=\"ui divider fitted inverted\"></div><div class=\"content bottom\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><br><br><div>9 things in common</div></div><div class=\"three wide column\"><div>4 people</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Adam Smith</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div></div></div><div class=\"three wide column\"><div>2 Likes &amp; Interests</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Burgundy Wine</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Motorcycles</div><div class=\"description\">Pinterest</div></div></div></div></div><div class=\"three wide column\"><div>3 places</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Le Petit MAisonk</div><div class=\"description\">Nice, France</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">The Meatball Shop</div><div class=\"description\">New York, NY</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Sydney Opera House</div><div class=\"description\">Sydney, Australia</div></div></div></div></div></div></div></div><div class=\"extra content\">Interested?&nbsp;&nbsp;&nbsp; <i class=\"check icon\"></i>Yes&nbsp;&nbsp;&nbsp; <i class=\"cancel icon\"></i>No&nbsp;&nbsp;&nbsp; <i class=\"star icon\"></i>Maybe Later&nbsp;&nbsp;&nbsp;<div class=\"ui right floated\"><i class=\"flag icon\"></i> Flag</div></div></div></div></div><div class=\"row\"><div class=\"column\"><div class=\"ui fluid card matchedperson\"><div class=\"content heading\"><div class=\"ui tiny image\"><img src=\"http://lorempixel.com/200/200\"></div><div class=\"header-container\"><div class=\"header\">John Stevens</div><div class=\"meta\">5 miles away</div></div><div class=\"description-container\"><div class=\"description\">I am a 55 year old doctor and I’m supposed to give a presentation at a local university in 3 weeks, but I don’t know how to use PowerPoint. I need someone to show me how to use the software, and to help cre- ate the content of my slides (i.e. copy, images, video).</div></div><div class=\"extra\"><div class=\"ui right floated bottom\">7 hours ago</div></div></div><div class=\"content middle\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><div>2 Matched Goals</div></div><div class=\"five wide column\">Jacques wants to meet new people.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to meet new people.</div></div><div class=\"row\"><div class=\"column\"><div></div></div><div class=\"five wide column\">Jacques is wiling to help people learn French.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to learn French.</div></div></div></div><div class=\"ui divider fitted inverted\"></div><div class=\"content bottom\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><br><br><div>9 things in common</div></div><div class=\"three wide column\"><div>4 people</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Adam Smith</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div></div></div><div class=\"three wide column\"><div>2 Likes &amp; Interests</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Burgundy Wine</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Motorcycles</div><div class=\"description\">Pinterest</div></div></div></div></div><div class=\"three wide column\"><div>3 places</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Le Petit MAisonk</div><div class=\"description\">Nice, France</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">The Meatball Shop</div><div class=\"description\">New York, NY</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Sydney Opera House</div><div class=\"description\">Sydney, Australia</div></div></div></div></div></div></div></div><div class=\"extra content\">Interested?&nbsp;&nbsp;&nbsp; <i class=\"check icon\"></i>Yes&nbsp;&nbsp;&nbsp; <i class=\"cancel icon\"></i>No&nbsp;&nbsp;&nbsp; <i class=\"star icon\"></i>Maybe Later&nbsp;&nbsp;&nbsp;<div class=\"ui right floated\"><i class=\"flag icon\"></i> Flag</div></div></div></div></div><div class=\"row\"><div class=\"column\"><div class=\"ui fluid card matchedperson\"><div class=\"content heading\"><div class=\"ui tiny image\"><img src=\"http://lorempixel.com/200/200\"></div><div class=\"header-container\"><div class=\"header\">Daniel Louise</div><div class=\"meta\">5 miles away</div></div><div class=\"description-container\"><div class=\"description\">Hi. I just moved to New York City from France and I’m looking to meet new friends and colleagues. I work in finance, but I’d like to join a tech startup. I like to travel and I’m an avid snowboarder. My parents own a winery, so I’m also quite familiar with French wine.</div></div><div class=\"extra\"><div class=\"ui right floated bottom\">7 hours ago</div></div></div><div class=\"content middle\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><div>2 Matched Goals</div></div><div class=\"five wide column\">Jacques wants to meet new people.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to meet new people.</div></div><div class=\"row\"><div class=\"column\"><div></div></div><div class=\"five wide column\">Jacques is wiling to help people learn French.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to learn French.</div></div></div></div><div class=\"ui divider fitted inverted\"></div><div class=\"content bottom\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><br><br><div>9 things in common</div></div><div class=\"three wide column\"><div>4 people</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Adam Smith</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div></div></div><div class=\"three wide column\"><div>2 Likes &amp; Interests</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Burgundy Wine</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Motorcycles</div><div class=\"description\">Pinterest</div></div></div></div></div><div class=\"three wide column\"><div>3 places</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Le Petit MAisonk</div><div class=\"description\">Nice, France</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">The Meatball Shop</div><div class=\"description\">New York, NY</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Sydney Opera House</div><div class=\"description\">Sydney, Australia</div></div></div></div></div></div></div></div><div class=\"extra content\">Interested?&nbsp;&nbsp;&nbsp; <i class=\"check icon\"></i>Yes&nbsp;&nbsp;&nbsp; <i class=\"cancel icon\"></i>No&nbsp;&nbsp;&nbsp; <i class=\"star icon\"></i>Maybe Later&nbsp;&nbsp;&nbsp;<div class=\"ui right floated\"><i class=\"flag icon\"></i> Flag</div></div></div></div></div><div class=\"row\"><div class=\"column\"><div class=\"ui fluid card matchedperson\"><div class=\"content heading\"><div class=\"ui tiny image\"><img src=\"http://lorempixel.com/200/200\"></div><div class=\"header-container\"><div class=\"header\">Daniel Louise</div><div class=\"meta\">5 miles away</div></div><div class=\"description-container\"><div class=\"description\">Hi. I just moved to New York City from France and I’m looking to meet new friends and colleagues. I work in finance, but I’d like to join a tech startup. I like to travel and I’m an avid snowboarder. My parents own a winery, so I’m also quite familiar with French wine.</div></div><div class=\"extra\"><div class=\"ui right floated bottom\">7 hours ago</div></div></div><div class=\"content middle\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><div>2 Matched Goals</div></div><div class=\"five wide column\">Jacques wants to meet new people.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to meet new people.</div></div><div class=\"row\"><div class=\"column\"><div></div></div><div class=\"five wide column\">Jacques is wiling to help people learn French.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to learn French.</div></div></div></div><div class=\"ui divider fitted inverted\"></div><div class=\"content bottom\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><br><br><div>9 things in common</div></div><div class=\"three wide column\"><div>4 people</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Adam Smith</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div></div></div><div class=\"three wide column\"><div>2 Likes &amp; Interests</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Burgundy Wine</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Motorcycles</div><div class=\"description\">Pinterest</div></div></div></div></div><div class=\"three wide column\"><div>3 places</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Le Petit MAisonk</div><div class=\"description\">Nice, France</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">The Meatball Shop</div><div class=\"description\">New York, NY</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Sydney Opera House</div><div class=\"description\">Sydney, Australia</div></div></div></div></div></div></div></div><div class=\"extra content\">Interested?&nbsp;&nbsp;&nbsp; <i class=\"check icon\"></i>Yes&nbsp;&nbsp;&nbsp; <i class=\"cancel icon\"></i>No&nbsp;&nbsp;&nbsp; <i class=\"star icon\"></i>Maybe Later&nbsp;&nbsp;&nbsp;<div class=\"ui right floated\"><i class=\"flag icon\"></i> Flag</div></div></div></div></div><div class=\"row\"><div class=\"column\"><div class=\"ui fluid card matchedperson\"><div class=\"content heading\"><div class=\"ui tiny image\"><img src=\"http://lorempixel.com/200/200\"></div><div class=\"header-container\"><div class=\"header\">Daniel Louise</div><div class=\"meta\">5 miles away</div></div><div class=\"description-container\"><div class=\"description\">Hi. I just moved to New York City from France and I’m looking to meet new friends and colleagues. I work in finance, but I’d like to join a tech startup. I like to travel and I’m an avid snowboarder. My parents own a winery, so I’m also quite familiar with French wine.</div></div><div class=\"extra\"><div class=\"ui right floated bottom\">7 hours ago</div></div></div><div class=\"content middle\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><div>2 Matched Goals</div></div><div class=\"five wide column\">Jacques wants to meet new people.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to meet new people.</div></div><div class=\"row\"><div class=\"column\"><div></div></div><div class=\"five wide column\">Jacques is wiling to help people learn French.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to learn French.</div></div></div></div><div class=\"ui divider fitted inverted\"></div><div class=\"content bottom\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><br><br><div>9 things in common</div></div><div class=\"three wide column\"><div>4 people</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Adam Smith</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div></div></div><div class=\"three wide column\"><div>2 Likes &amp; Interests</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Burgundy Wine</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Motorcycles</div><div class=\"description\">Pinterest</div></div></div></div></div><div class=\"three wide column\"><div>3 places</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Le Petit MAisonk</div><div class=\"description\">Nice, France</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">The Meatball Shop</div><div class=\"description\">New York, NY</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Sydney Opera House</div><div class=\"description\">Sydney, Australia</div></div></div></div></div></div></div></div><div class=\"extra content\">Interested?&nbsp;&nbsp;&nbsp; <i class=\"check icon\"></i>Yes&nbsp;&nbsp;&nbsp; <i class=\"cancel icon\"></i>No&nbsp;&nbsp;&nbsp; <i class=\"star icon\"></i>Maybe Later&nbsp;&nbsp;&nbsp;<div class=\"ui right floated\"><i class=\"flag icon\"></i> Flag</div></div></div></div></div><div class=\"row\"><div class=\"column\"><div class=\"ui fluid card matchedperson\"><div class=\"content heading\"><div class=\"ui tiny image\"><img src=\"http://lorempixel.com/200/200\"></div><div class=\"header-container\"><div class=\"header\">Daniel Louise</div><div class=\"meta\">5 miles away</div></div><div class=\"description-container\"><div class=\"description\">Hi. I just moved to New York City from France and I’m looking to meet new friends and colleagues. I work in finance, but I’d like to join a tech startup. I like to travel and I’m an avid snowboarder. My parents own a winery, so I’m also quite familiar with French wine.</div></div><div class=\"extra\"><div class=\"ui right floated bottom\">7 hours ago</div></div></div><div class=\"content middle\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><div>2 Matched Goals</div></div><div class=\"five wide column\">Jacques wants to meet new people.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to meet new people.</div></div><div class=\"row\"><div class=\"column\"><div></div></div><div class=\"five wide column\">Jacques is wiling to help people learn French.</div><div class=\"column wide center aligned\"><i class=\"exchange icon\"></i></div><div class=\"five wide column\">You want to learn French.</div></div></div></div><div class=\"ui divider fitted inverted\"></div><div class=\"content bottom\"><div class=\"ui equal width grid\"><div class=\"row\"><div class=\"column\"><br><br><div>9 things in common</div></div><div class=\"three wide column\"><div>4 people</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Adam Smith</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">David Ricardo</div><div class=\"description\">Facebook</div></div></div></div></div><div class=\"three wide column\"><div>2 Likes &amp; Interests</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Burgundy Wine</div><div class=\"description\">Facebook</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Motorcycles</div><div class=\"description\">Pinterest</div></div></div></div></div><div class=\"three wide column\"><div>3 places</div><div class=\"ui link items\"><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Le Petit MAisonk</div><div class=\"description\">Nice, France</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">The Meatball Shop</div><div class=\"description\">New York, NY</div></div></div><div class=\"item\"><div class=\"ui avatar-tiny image\"><img src=\"http://lorempixel.com/50/50\"></div><div class=\"content\"><div class=\"header\">Sydney Opera House</div><div class=\"description\">Sydney, Australia</div></div></div></div></div></div></div></div><div class=\"extra content\">Interested?&nbsp;&nbsp;&nbsp; <i class=\"check icon\"></i>Yes&nbsp;&nbsp;&nbsp; <i class=\"cancel icon\"></i>No&nbsp;&nbsp;&nbsp; <i class=\"star icon\"></i>Maybe Later&nbsp;&nbsp;&nbsp;<div class=\"ui right floated\"><i class=\"flag icon\"></i> Flag</div></div></div></div></div></div><script>\n\'use strict\';\n\n$(\'.ui.dropdown\')\n    .dropdown();\n</script>");
$templateCache.put("app/conversations/conversations.html","<div id=\"mycontroller\"><div class=\"ui fixed borderless menu\" id=\"headermenu\"><a class=\"icon item\" ui-sref=\"inbox\"><i class=\"left chevron icon\"></i></a><h3 class=\"ui center aligned header\">{{friend.first_name}}</h3></div><div class=\"ui fixed menu\" id=\"submenu\"><div class=\"3 fluid large ui buttons\"><a ui-sref=\"conversations({ userId: friend.id })\" ng-class=\"{\'active\': leftActive}\" class=\"ui leftalign button\"><i class=\"fa fa-comment-o icon\"></i></a> <a ui-sref=\"friendprofile({ userId: friend.id })\" class=\"ui button\"><i class=\"fa fa-user icon\"></i></a> <a class=\"ui button rightalign dropdown\"><i class=\"fa fa-ellipsis-h icon\"></i><div class=\"menu\" id=\"friendmenu\"><div class=\"item\">Get Introduced</div><div class=\"item\">Add to Group</div><div class=\"item\">Arrange Meetup</div><div class=\"item\">Flag as Inappropriate</div><div class=\"item deleteconnection\">Remove Connection</div></div></a></div></div><div id=\"desktop-conversation-header\" class=\"ui dividing header large\"><div class=\"content\">Conversation with <a ui-sref=\"friendprofile({ userId: friend.id })\">{{friend.first_name}}</a></div></div><div id=\"desktop-conversation-reply\"><div class=\"ui form\"><div class=\"field\"><label></label> <textarea ng-enter=\"sendNewMessage()\" placeholder=\"Add your message here.\" ng-model=\"newmessage\"></textarea></div><div ng-click=\"sendNewMessage()\" ng-class=\"{\'loading\': sendingMessage}\" class=\"ui submit green button\">Send Message</div></div></div><div id=\"desktop-conversation-content\" class=\"basic ui segment\" ng-class=\"{\'loading\': loadingMessages}\" when-scroll-ends=\"loadMore()\"><h3 class=\"ui center aligned header\" ng-if=\"messages.length === 0\">There are no any messages</h3><div class=\"repeat-animation\" ng-repeat=\"message in messages | orderBy:\'-realDate\' track by $index\"><div ng-style=\"\" class=\"repeat-animation quote\" ng-class=\"{\'left\': msg.left, \'right\': !msg.left, \'lastMessage\': $last}\" ng-repeat=\"msg in message.contents | orderBy:\'-sent_at\' track by $index\"><img class=\"round-avatar\" ng-src=\"{{ msg.left && userImg || !msg.left && friendImage}}\"><div class=\"speech-bubble\"><blockquote>{{msg.body}}</blockquote></div><span class=\"time-ago\">{{message.date}} {{msg.sent_at | amDateFormat:\'h:mm a\'}}</span></div></div><three-bounce-spinner class=\"page-spinner-bar\" ng-show=\"status.loading\"></three-bounce-spinner></div><div id=\"mobile-conversation-content\" class=\"conversation-content basic ui segment\" ng-class=\"{\'loading\': loadingMessages}\" when-scrolled=\"loadMore()\" scroll-bottom-on=\"status.loaded\"><three-bounce-spinner class=\"page-spinner-bar\" ng-show=\"status.loading\"></three-bounce-spinner><div class=\"repeat-animation\" ng-repeat=\"message in messages track by $index\"><h6>{{message.date}}</h6><div ng-style=\"\" class=\"repeat-animation\" ng-class=\"{\'bubbledLeft\': msg.left, \'bubbledRight\': !msg.left, \'lastMessage\': $last}\" ng-repeat=\"msg in message.contents | orderBy:\'sent_at\' track by $index\"><p>{{msg.body}}</p><span class=\"conversation-time\">{{msg.sent_at | amDateFormat:\'h:mm a\'}}</span></div></div></div><div id=\"mobile-no-messages\" class=\"conversation-content ui segment\" ng-if=\"messages.length === 0\"><h3>There are no any messages</h3></div><div id=\"mobile-conversation-reply\" class=\"message-reply\"><div class=\"ui fluid action input\"><input ng-enter=\"sendNewMessage()\" type=\"text\" placeholder=\"\" ng-model=\"newmessage\"><div ng-click=\"sendNewMessage()\" class=\"ui button\" ng-class=\"{\'loading\': sendingMessage}\">Send</div></div></div><script>\n    \'use strict\';\n\n    $(\'.ui.dropdown\')\n        .dropdown({\n            onShow: function() {\n\n\n                var scope = angular.element($(\"#submenu\")).scope();\n                scope.$apply(function() {\n                    scope.leftActive = false;\n                });\n            },\n            onHide: function() {\n\n                var scope = angular.element($(\"#submenu\")).scope();\n                setTimeout(function() {\n                    scope.$apply(function() {\n                        scope.leftActive = true;\n                    });\n                }, 100);\n            }\n        });\n\n    $(\'.basic.delete.modal\')\n        .modal({\n            onDeny: function() {\n                console.log(\'cancel\');\n            },\n            onApprove: function() {\n                console.log(\'deleting user\');\n\n                angular.element(document.getElementById(\'mycontroller\')).scope().unFriend();\n\n            }\n        })\n        .modal(\'attach events\', \'.deleteconnection\', \'show\');\n    </script><div class=\"ui basic delete modal\"><i class=\"close icon\"></i><div class=\"header\">Please Confirm</div><div class=\"content\"><div class=\"description\"><p>Are you sure you want remove this connection?</p></div></div><div class=\"actions\"><div class=\"two fluid ui inverted buttons\"><div class=\"ui red negative basic inverted button\"><i class=\"remove icon\"></i> No</div><a class=\"ui green basic inverted button ok\"><i class=\"checkmark icon\"></i> Yes</a></div></div></div></div>");
$templateCache.put("app/editmyprofile/editmyprofile.html","<div class=\"ui fixed borderless menu center\" id=\"edittopmenu\"><div class=\"main container\"><div class=\"left menu\"><a class=\"ui item\" ui-sref=\"myprofile\" ng-hide=\"showModal\">Cancel</a></div><div class=\"header item\">Edit Profile</div><div class=\"right menu\"><a class=\"ui item\" ng-click=\"startSavingChanges()\" ng-hide=\"showModal\" ng-class=\"{\'loading\': savingAllChanges}\">Save</a></div></div></div><div class=\"segment\" id=\"my-profile-header-edit\" ng-hide=\"showModal || editInterest\"><div class=\"ui segment\"><div id=\"tiles\" ng-cloak=\"\"><div class=\"ui image tile\" ng-class=\"{\'left floated medium tile-big\': $index === 0, \'left floated small tile-small\': $index === 1 || $index === 2 || $index === 4 || $index === 5, \'small tile-small\': $index === 3 }\" ng-repeat=\"photo in user.photos track by $index\" end-repeat-photos=\"\" ng-drop=\"true\" ng-drop-success=\"onDropComplete($index, $data,$event)\"><a href=\"\" ng-click=\"$parent.userPhotoDelete = photo; $parent.userPhotoDeleteIndex = $index;\" class=\"ui right corner delete_photo label\" ng-show=\"photo.photo !== \'\'\"><i class=\"close icon\"></i></a><div class=\"tile-content\" ng-show=\"photo.photo === \'\'\"><div class=\"content\"><div class=\"center\"><a href=\"\" ng-click=\"$parent.newPhotoIndex = $index; getFBAlbums();\" class=\"ui compact icon button add_photo\"><i class=\"circle add icon\"></i> Add Photo</a></div></div></div><div style=\"background-image: url(\'{{photo.photo}}\')\" ng-if=\"photo.cropped_photo === \'\'\" ng-drag=\"true\" ng-drag-data=\"photo\" class=\"img-bounding-box\"></div><div style=\"background-image: url(\'{{photo.cropped_photo}}\')\" ng-if=\"photo.cropped_photo !== \'\'\" ng-drag=\"true\" ng-drag-data=\"photo\" class=\"img-bounding-box\"></div></div></div></div></div><div class=\"body segment edit\" id=\"my-profile-body\" ng-hide=\"showModal || editInterest\"><div class=\"ui attached segment\" id=\"my-profile-title\"><h3 class=\"ui left floated header\">{{ user.firstName }}<span ng-hide=\"user.firstName === \'\'\">,</span> {{ user.age }}</h3></div><div class=\"ui attached segment\" ng-class=\"{loading: loadingGoals || loadingOffers || loadingUser || loadingLikes || loadingInterests }\"><h4 class=\"ui header\">Goals</h4><div class=\"ui large list\"><div class=\"item\" end-repeat=\"\" ng-repeat=\"goal in user.goals track by $index\"><div class=\"content\"><div class=\"description\"><div class=\"ui fluid search goals\" rel=\"{{$index}}\" ng-class=\"{\'loading\': goal.loading }\"><div class=\"ui fluid leftright action input\" ng-class=\"{\'error\': goal.error}\"><div class=\"ui removebutton icon circular button\" ng-click=\"removeGoal($index)\"><i class=\"remove icon\"></i></div><input type=\"text\" class=\"prompt\" ng-model=\"goal.subject\" ng-change=\"goalNeedSaving($index)\"></div><div class=\"results\"></div></div><div class=\"ui red pointing fluid label visible transition\" ng-if=\"goal.error\">{{goal.errorMessage}}</div></div></div></div></div><div class=\"ui fluid labeled blue button\" ng-click=\"createNewGoal()\"><i class=\"plus icon\"></i> Create new Goal</div><h4 class=\"ui header\">Offers</h4><div class=\"ui large list\"><div class=\"item\" end-repeat=\"\" ng-repeat=\"offer in user.offers track by $index\"><div class=\"content\"><div class=\"description\"><div class=\"ui fluid search offers\" rel=\"{{$index}}\" ng-class=\"{\'loading\': offer.loading }\"><div class=\"ui fluid leftright action input\" ng-class=\"{\'error\': offer.error}\"><div class=\"ui removebutton icon circular button\" ng-click=\"removeOffer($index)\"><i class=\"remove icon\"></i></div><input type=\"text\" class=\"prompt\" ng-model=\"offer.subject\" ng-change=\"offerNeedSaving($index)\"></div><div class=\"results\"></div></div><div class=\"ui red pointing fluid label visible transition\" ng-if=\"offer.error\">{{offer.errorMessage}}</div></div></div></div></div><div class=\"ui fluid labeled blue button\" ng-click=\"createNewOffer()\"><i class=\"plus icon\"></i> Create new Offer</div><h4 class=\"ui header\">About</h4><form class=\"ui form\" ng-class=\"{loading: loadingAbout}\"><div class=\"field\"><label></label> <textarea rows=\"3\" ng-model=\"user.about_me\" ng-blur=\"saveAbout()\"></textarea></div></form><h4 class=\"ui header\">Activities &amp; Interests</h4><div class=\"ui large list\"><div class=\"item\" end-repeat=\"\" ng-repeat=\"interest in user.interests track by $index\"><div class=\"content\"><div class=\"description\"><div class=\"ui fluid search interests\" rel=\"{{$index}}\" ng-class=\"{\'loading\': interest.loading }\"><div class=\"ui fluid leftright action input\" ng-class=\"{\'error\': interest.error}\"><div class=\"ui removebutton icon circular button\" ng-click=\"removeInterest($index)\"><i class=\"remove icon\"></i></div><input type=\"text\" class=\"prompt\" ng-model=\"interest.interest_subject\" ng-change=\"interestNeedSaving($index)\"></div><div class=\"results\"></div></div><div class=\"ui red pointing fluid label visible transition\" ng-if=\"interest.error\">{{interest.errorMessage}}</div></div></div></div></div><div class=\"ui fluid labeled blue button\" ng-click=\"createNewInterest()\"><i class=\"plus icon\"></i> Create new Interest</div><h4 class=\"ui header\">Likes</h4><div class=\"ui list likes\"><div class=\"item\" ng-repeat=\"like in user.likes | limitTo:5 track by $index\"><div class=\"content\"><div class=\"description\">{{ like.name }}</div></div></div></div></div><div class=\"ui attached segment\" id=\"socialaccounts\"><h4 class=\"ui header\">Social Accounts</h4><br><a ng-click=\"link(\'linkedin\')\" class=\"ui icon linkedin labeled fluid button notconnected\" ng-if=\"social.linkedin.length === 0\"><i class=\"linkedin icon\"></i> Connect</a><div class=\"ui fluid buttons socialbuttons\" ng-if=\"social.linkedin.length > 0\"><a href=\"{{ social.linkedin }}\" target=\"_new\" class=\"ui social icon twitter labeled button\"><i class=\"linkedin icon\"></i> {{user.firstName}} <i class=\"check circle icon right\"></i></a> <a ng-click=\"unlink(\'linkedin\')\" class=\"ui right icon circular button disconnect\"><i class=\"remove icon\"></i></a></div><br><a ng-click=\"link(\'twitter\')\" class=\"ui icon twitter labeled fluid button notconnected\" ng-if=\"social.twitter.length === 0\"><i class=\"twitter icon\"></i> Connect</a><div class=\"ui fluid buttons socialbuttons\" ng-if=\"social.twitter.length > 0\"><a href=\"https://twitter.com/{{ social.twitter }}\" target=\"_new\" class=\"ui social icon twitter labeled button\"><i class=\"twitter icon\"></i> {{social.twitter}} <i class=\"check circle icon right\"></i></a> <a ng-click=\"unlink(\'twitter\')\" class=\"ui right icon circular button disconnect\"><i class=\"remove icon\"></i></a></div><br><a href=\"{{ user.facebookProfile }}\" target=\"_new\" class=\"ui social icon facebook labeled fluid button\" ng-if=\"user.facebookProfile !== \'\'\"><i class=\"facebook icon\"></i> {{user.firstName}} <i class=\"lock icon right\"></i></a></div></div><div class=\"ui basic modal\" id=\"deletePhotoModal\"><i class=\"close icon\"></i><div class=\"header\">Please Confirm</div><div class=\"content\" ng-cloak=\"\"><img ng-src=\"{{userPhotoDelete.photo}}\" class=\"ui image small\" alt=\"\"><div class=\"description\"><p>Are you sure you want to delete your photo?</p></div></div><div class=\"actions\"><div class=\"two fluid ui inverted buttons\"><div class=\"ui red basic inverted button\"><i class=\"remove icon\"></i> No</div><div ng-click=\"deletePhoto()\" class=\"ui green basic inverted button\"><i class=\"checkmark icon\"></i> Yes</div></div></div></div><div class=\"body basic segment edit\" id=\"my-profile-photos\" ng-if=\"showModal\" ng-cloak=\"\"><div class=\"ui attached segment\" ng-class=\"{loading: albumsLoading}\"><div class=\"ui dividing header\"><span ng-show=\"currentAlbum != \'\' && showPhotos\">Choose Photo</span> <span ng-show=\"currentAlbum == \'\'\">Choose Facebook Album</span> <span ng-show=\"currentAlbum != \'\' && !showPhotos\">Crop Photo</span></div><div class=\"ui selection list\" ng-hide=\"hideAlbums\"><div class=\"item\" ng-click=\"getFBPhotos(fbAlbum.id, fbAlbum.name)\" ng-repeat=\"fbAlbum in facebookAlbums track by $index\"><img class=\"ui tiny image\" ng-src=\"{{fbAlbum.picture.data.url}}\"><div class=\"content\"><div class=\"header\">{{fbAlbum.name}}</div></div></div></div><div ng-show=\"hideAlbums\" class=\"ui basic segment\" ng-class=\"{loading: photosLoading}\"><button class=\"ui labeled fluid button backButton\" ng-click=\"backToAlbums()\"><i class=\"angle left big icon\"></i>Back to Albums</button><h3 ng-show=\"showPhotos\" class=\"ui header\">{{currentAlbum}}</h3><div class=\"ui selection list\" ng-show=\"showPhotos\"><div ng-click=\"showCrop($index)\" class=\"item button ok\" ng-repeat=\"fbPhoto in facebookPhotos track by $index\"><img class=\"ui small image\" ng-src=\"{{fbPhoto.source}}\"><div class=\"content\"><div class=\"header\"></div></div></div></div><div ng-hide=\"showPhotos\"><div class=\"ui vertically divided centered relaxed grid\"><div class=\"sixteen wide column\"><div class=\"cropArea\"><img-crop image=\"myImage\" result-image=\"myCroppedImage\" area-type=\"square\"></img-crop></div></div><div class=\"center aligned one column row\"><div class=\"sixteen wide column\"><div class=\"ui segment basic center aligned\"><button class=\"ui button\" ng-click=\"closeModal()\">Cancel</button> <button class=\"ui primary button\" ng-click=\"createPhoto(myCroppedImage)\">Save Photo</button></div></div></div></div></div></div></div></div><script type=\"text/javascript\">\n    \'use strict\';\n\n    function refreshConnect() {\n        angular.element($(\'#socialaccounts\')).scope().refreshUser();\n    }\n</script>");
$templateCache.put("app/events/event.html","<div class=\"ui fixed borderless menu center\" id=\"edittopmenu\"><div class=\"left menu\"><a class=\"ui item\" ng-click=\"eventpage.gotoPreviousState();\"><i class=\"left chevron icon\"></i></a></div><div class=\"header item\">{{eventpage.header}}</div><div class=\"right menu\"><a class=\"ui item\" ng-click=\"eventpage.makeactionEvent();\"><span ng-show=\"isState(\'event.create\') || (isState(\'event.edit\') && eventpage.isHost.option)\">Save<div ng-if=\"eventpage.loadingSave\" class=\"ui active mini inline loader\"></div></span> <span ng-show=\"isState(\'event.details\') && eventpage.isHost.option\">Edit</span> <span ng-show=\"isState(\'event.invitations\')\">Done</span></a></div></div><div ui-view=\"\"></div>");
$templateCache.put("app/events/event_attendees.html","<div class=\"ui grid\" ng-cloak=\"\"><div class=\"row\"><div class=\"wide column\"><ng-include src=\"\'components/event/eventattendees.tpl.html\'\"></ng-include></div></div></div>");
$templateCache.put("app/events/event_create.html","<div class=\"ui grid\" ng-cloak=\"\"><div class=\"row\"><div class=\"wide column\"><ng-include src=\"\'components/event/event.tpl.html\'\"></ng-include></div></div></div>");
$templateCache.put("app/events/event_edit.html","<div class=\"ui grid\" ng-cloak=\"\"><div class=\"row\"><div class=\"wide column\"><ng-include src=\"\'components/event/eventedit.tpl.html\'\"></ng-include></div></div></div>");
$templateCache.put("app/events/event_invitations.html","<div class=\"ui grid\" ng-cloak=\"\"><div class=\"row\"><div class=\"wide column\"><ng-include src=\"\'components/event/eventinvitations.tpl.html\'\"></ng-include></div></div></div>");
$templateCache.put("app/events/event_view.html","<div class=\"ui grid\" ng-cloak=\"\"><div class=\"row\"><div class=\"wide column\"><ng-include src=\"\'components/event/eventview.tpl.html\'\"></ng-include></div></div></div>");
$templateCache.put("app/events/events_allevents.html","<events-feed type=\"events.allevents\"></events-feed>");
$templateCache.put("app/events/events_map.html","Map");
$templateCache.put("app/events/events_myevents.html","<events-feed type=\"events.myevents\"></events-feed>");
$templateCache.put("app/events/events_mynetwork.html","<events-feed type=\"events.mynetwork\"></events-feed>");
$templateCache.put("app/events/events_page.html","<div class=\"ui grid\"><div class=\"row\"><div class=\"wide column\"><div class=\"ui fluid secondary menu center-aligned\" id=\"eventsMobileNav\"><a class=\"item\" ui-sref=\"events.myevents\" ng-class=\"{\'active\': isState(\'events.myevents\')}\">MY EVENTS</a> <a class=\"item\" ui-sref=\"events.mynetwork\" ng-class=\"{\'active\': isState(\'events.mynetwork\')}\">MY NETWORK</a> <a class=\"item\" ui-sref=\"events.allevents\" ng-class=\"{\'active\': isState(\'events.allevents\')}\">ALL EVENTS</a></div><div class=\"ui secondary pointing menu\" id=\"eventsDesktopNav\"><a class=\"item\" ui-sref=\"events.myevents\" ng-class=\"{\'active\': isState(\'events.myevents\')}\">MY EVENTS</a> <a class=\"item\" ui-sref=\"events.mynetwork\" ng-class=\"{\'active\': isState(\'events.mynetwork\')}\">MY NETWORK</a> <a class=\"item\" ui-sref=\"events.allevents\" ng-class=\"{\'active\': isState(\'events.allevents\')}\">ALL EVENTS</a><div class=\"right menu\"><a class=\"ui button small labeled green icon\" ng-click=\"eventspage.showEventModal()\"><i class=\"fa fa-plus-circle icon\"></i> Create</a></div></div><div class=\"ui secondary pointing menu\" id=\"eventsDesktopSubNav\"><div class=\"item\"></div><div class=\"right menu\"><a class=\"item icon active\" ng-class=\"{\'active\': isState(\'events.myevents\') || isState(\'events.mynetwork\') || isState(\'events.allevents\')}\"><i class=\"fa large fa-list icon\"></i></a> <a class=\"item icon\"><i class=\"fa large fa-calendar icon\"></i></a> <a class=\"item\" ui-sref=\"events.map\" ng-class=\"{\'active\': isState(\'events.map\')}\"><i class=\"fa large fa-map-marker icon\"></i></a></div></div></div></div></div><div ui-view=\"\"></div><ui-event-create-modal show=\"eventspage.showModal\"></ui-event-create-modal><ui-event-view-modal show=\"eventspage.showViewModal\" eventid=\"eventspage.viewEvent\"></ui-event-view-modal>");
$templateCache.put("app/finalstep/finalstep.html","<div id=\"finalstep\"><div class=\"ui fixed borderless menu center\" id=\"mainheadermenu\"><div class=\"header item\"><span class=\"fa-stack\"><i class=\"fa fa-circle fa-stack-2x\"></i> <i class=\"fa fa-stack-1x fa-inverse\">4</i></span> Final Step</div><div class=\"right menu\"><div class=\"ui item\" id=\"nextButton\"><a ui-sref=\"matchfeed\" class=\"ui button small green\"><span ng-if=\"finalstep.twitter === \'\' && finalstep.linkedin === \'\'\">Skip</span><span ng-if=\"finalstep.twitter !== \'\' || finalstep.linkedin !== \'\'\">Next</span> &raquo;</a></div></div></div><div class=\"ui grid fullheight\"><div class=\"row\"><div class=\"wide column\"><div class=\"body segment\"><h2 class=\"ui header dividing center aligned desktopview\"><span class=\"fa-stack\"><i class=\"fa fa-circle fa-stack-2x\"></i> <i class=\"fa fa-stack-1x fa-inverse\">4</i></span><div class=\"content\">Final Step</div><a ui-sref=\"matchfeed\" id=\"nextButtonDesktop\" class=\"ui button small green\"><span ng-if=\"finalstep.twitter === \'\' && finalstep.linkedin === \'\'\">Skip</span><span ng-if=\"finalstep.twitter !== \'\' || finalstep.linkedin !== \'\'\">Next</span> &raquo;</a></h2><h2 class=\"ui center aligned header withborder\"><hr>Connect your LinkedIn and<br>Twitter accounts<hr></h2><div class=\"ui basic segment\"><div class=\"ui center aligned grid\"><div class=\"row\"><div class=\"column\"><div class=\"ui segment basic center alligend\"><p>This will improve your match results within the persice community.</p><p><i class=\"icon lock\"></i> persice will never share your information or post on your behalf.</p></div></div></div><div class=\"row\"><div class=\"column\"><div class=\"ui segment basic center alligend\" ng-class=\"{\'loading\': finalstep.loading}\"><a class=\"ui linkedin big button\" ng-click=\"finalstep.link(\'linkedin\')\" ng-show=\"finalstep.linkedin === \'\'\"><i class=\"linkedin icon\"></i> Connect</a> <a href=\"{{ finalstep.linkedin }}\" target=\"_new\" class=\"ui social icon linkedin big labeled button\" ng-show=\"finalstep.linkedin !== \'\'\"><i class=\"linkedin icon\"></i> {{finalstep.firstName}} <i class=\"check circle icon right\"></i></a><br><br><a class=\"ui twitter big button\" ng-click=\"finalstep.link(\'twitter\')\" ng-show=\"finalstep.twitter === \'\'\"><i class=\"twitter icon\"></i> Connect</a> <a href=\"https://twitter.com/{{ finalstep.twitter }}\" target=\"_new\" class=\"ui social icon twitter labeled big button\" ng-show=\"finalstep.twitter !== \'\'\"><i class=\"twitter icon\"></i> {{finalstep.twitter}} <i class=\"check circle icon right\"></i></a></div></div></div></div></div></div></div></div></div><script type=\"text/javascript\">\n    \'use strict\';\n\n    function refreshConnect() {\n        angular.element($(\'#finalstep\')).scope().finalstep.refreshUser();\n    }\n    </script></div>");
$templateCache.put("app/friendprofile/friendprofile.html","<div id=\"connectionPage\" ng-cloak=\"\"><div class=\"ui fixed borderless menu\" id=\"headermenu\"><a class=\"icon item\" ui-sref=\"myconnections\"><i class=\"left chevron icon\"></i></a><h3 class=\"ui center aligned header\">{{ friendprofile.userInfo.first_name }}</h3></div><div class=\"ui fixed menu friendsubmenu\" id=\"submenu\"><div class=\"3 fluid large ui buttons\"><a ui-sref=\"conversations({ userId: friendprofile.userInfo.id })\" class=\"ui leftalign button\"><i class=\"fa fa-comment-o icon\"></i></a> <a ui-sref=\"friendprofile({ userId: friendprofile.userInfo.id })\" ng-class=\"{\'active\': friendprofile.middleActive}\" class=\"ui button\"><i class=\"fa fa-user icon\"></i></a> <a class=\"ui button rightalign dropdown\"><i class=\"fa fa-ellipsis-h icon\"></i><div class=\"menu\" id=\"friendmenu\"><div class=\"item\">Get Introduced</div><div class=\"item\">Add to Group</div><div class=\"item\">Arrange Meetup</div><div class=\"item\">Flag as Inappropriate</div><div class=\"item deleteconnection\">Remove Connection</div></div></a></div></div><div class=\"3 fluid large ui buttons friendsubmenu\" id=\"desktopsubmenu\"><a ui-sref=\"conversations({ userId: friendprofile.userInfo.id })\" class=\"ui leftalign button\"><i class=\"fa fa-comment-o icon\"></i></a> <a ui-sref=\"friendprofile({ userId: friendprofile.userInfo.id })\" ng-class=\"{\'active\': friendprofile.middleActive}\" class=\"ui middle button\"><i class=\"fa fa-user icon\"></i></a> <a class=\"ui button rightalign dropdown\"><i class=\"fa fa-ellipsis-h icon\"></i><div class=\"menu\" id=\"friendmenu\"><div class=\"item\">Get Introduced</div><div class=\"item\">Add to Group</div><div class=\"item\">Arrange Meetup</div><div class=\"item\">Flag as Inappropriate</div><div class=\"item deleteconnection\">Remove Connection</div></div></a></div><user-profile person=\"friendprofile.userInfo\" type=\"friend\" header=\"friendprofileheader\" body=\"matched-profile-body\"></user-profile></div><script>\n    \'use strict\';\n    $(\'.ui.dropdown\')\n    .dropdown({\n        onShow:  function(){\n            var scope = angular.element($(\".friendsubmenu\")).scope();\n            scope.$apply(function(){\n                scope.friendprofile.middleActive = false;\n            });\n        },\n        onHide: function(){\n            var scope = angular.element($(\".friendsubmenu\")).scope();\n            setTimeout(function() {\n                scope.$apply(function(){\n                    scope.friendprofile.middleActive = true;\n                });\n            }, 100);\n        }\n    })\n    ;\n\n</script><div class=\"ui basic delete modal\"><i class=\"close icon\"></i><div class=\"header\">Please Confirm</div><div class=\"content\"><div class=\"description\"><p>Are you sure you want remove this connection?</p></div></div><div class=\"actions\"><div class=\"two fluid ui inverted buttons\"><div class=\"ui red negative basic inverted button\"><i class=\"remove icon\"></i> No</div><a class=\"ui green basic inverted button ok\"><i class=\"checkmark icon\"></i> Yes</a></div></div></div><script>\n  \'use strict\';\n  $(\'.basic.delete.modal\')\n  .modal({\n    onDeny    : function(){\n      console.log(\'cancel\');\n  },\n  onApprove : function() {\n      console.log(\'deleting user\');\n      angular.element(document.getElementById(\'connectionPage\')).scope().friendprofile.unFriend();\n  }\n})\n  .modal(\'attach events\', \'.deleteconnection\', \'show\');\n\n\n</script>");
$templateCache.put("app/goalcreate/goalcreate.html","<div class=\"ui fixed borderless menu center\" id=\"mainheadermenu\"><div class=\"header item\"><span class=\"fa-stack\"><i class=\"fa fa-circle fa-stack-2x\"></i> <i class=\"fa fa-stack-1x fa-inverse\">2</i></span> Create a goal</div><div class=\"right menu\"><div class=\"ui item\" id=\"nextButton\"><div ng-click=\"createGoal()\" ng-class=\"{\'disabled\': subject === \'\'}\" class=\"ui button green small\">Next &raquo;</div></div></div></div><div class=\"ui grid fullheight\"><div class=\"row\"><div class=\"wide column\"><div class=\"body segment\"><h2 class=\"ui header dividing center aligned desktopview\"><span class=\"fa-stack\"><i class=\"fa fa-circle fa-stack-2x\"></i> <i class=\"fa fa-stack-1x fa-inverse\">2</i></span><div class=\"content\">Create a goal</div><div ng-click=\"createGoal()\" id=\"nextButtonDesktop\" ng-class=\"{\'disabled\': subject === \'\'}\" class=\"ui button green small\">Next &raquo;</div></h2><h2 class=\"ui center aligned header withborder\">My goal is to...<hr></h2><div class=\"ui attached warning message\" id=\"warningmessage\" ng-show=\"messageShow\"><div class=\"header\">Warning</div><p>{{message}}</p></div><div class=\"ui basic segment\"><div class=\"ui center aligned grid\"><div class=\"row\"><div class=\"search-wrapper\"><div field-required=\"false\" autocomplete-ui=\"\" input-class=\"ui input fluid\" text-no-results=\"No existing goal found. Create new goal &raquo;\" minlength=\"3\" input-changed=\"inputChanged\" match-class=\"highlight\" selected-object=\"selectResult\" description-field=\"description[3]\" title-field=\"description\" remote-url=\"/api/v1/subject/?format=json&description__icontains=\" remote-url-data-field=\"objects\" type=\"text\" input-name=\"description\" id=\"id_description\" placeholder=\"enter your goal here\"></div></div></div></div></div><div class=\"ui secondary segment\" id=\"instructions\" ng-hide=\"subject !== \'\'\"><h4>This should be something you want other people to help you with.</h4><br><h4>For example:</h4><p><ul class=\"unstyled\"><li>&quot;Learn to play tennis&quot;</li><li>&quot;Find a running partner&quot;</li><li>&quot;Hire a cat sitter&quot;</li><li>&quot;Move my sofa upstairs&quot;</li></ul></p></div></div></div></div></div>");
$templateCache.put("app/inbox/inbox.html","<div id=\"search-header\"><div class=\"ui left icon input\"><input type=\"text\" ng-model=\"inbox.q\" name=\"q\" placeholder=\"Search\"> <i class=\"circular search icon\"></i></div></div><div id=\"inbox-body\" class=\"basic ui segment\" ng-class=\"{\'loading\': inbox.loadingMessages}\" when-scroll-ends=\"inbox.loadMore()\"><div class=\"ui selection divided list\"><a ng-class=\"{\'unread\': message.readAt === null}\" ui-sref=\"conversations({ userId: message.friendId })\" class=\"item repeat-animation\" ng-if=\"message.body !== null\" ng-repeat=\"message in inbox.allMessages | filter:{firstName: inbox.q} track by message.id\"><div class=\"ui circular tiny image img-bounding-box\" ng-style=\"{\'background-image\': \'url(//graph.facebook.com/{{ message.facebookId }}/picture?type=large)\'}\"></div><span class=\"message-time\">{{message.sentAt}}</span><div class=\"content\"><div class=\"header\">{{message.firstName}}</div><div class=\"description\">{{message.body | words: 8}}</div></div></a></div><three-bounce-spinner class=\"page-spinner-bar\" ng-show=\"inbox.loadingMore\"></three-bounce-spinner></div>");
$templateCache.put("app/interests/interests.html","<div class=\"ui top fixed borderless menu center\" id=\"mainheadermenu\"><div class=\"header item\"><span class=\"fa-stack\"><i class=\"fa fa-circle fa-stack-2x\"></i> <i class=\"fa fa-stack-1x fa-inverse\">1</i></span> What interests you?</div><div class=\"right menu\"><div class=\"ui item\" id=\"nextButton\"><div ng-click=\"interest.nextStep()\" ng-class=\"{\'disabled\': interest.counter === 0}\" class=\"ui button green\">Next &raquo;</div></div></div></div><div id=\"interests-header\"><h2 class=\"ui header dividing center aligned desktopview\"><span class=\"fa-stack\"><i class=\"fa fa-circle fa-stack-2x\"></i> <i class=\"fa fa-stack-1x fa-inverse\">1</i></span><div class=\"content\">What interests you?</div><div ng-click=\"interest.nextStep()\" id=\"nextButtonDesktopInterests\" ng-class=\"{\'disabled\': interest.counter === 0}\" class=\"ui small button green\">Next &raquo;</div></h2><div class=\"ui left icon input\"><input type=\"text\" ng-model=\"interest.searchQuery\" ng-change=\"interest.getAllInterests()\" ng-model-options=\"{debounce:300}\" placeholder=\"Search\"> <i class=\"circular search icon\"></i></div></div><div id=\"interests\" class=\"basic ui segment\" ng-class=\"{\'loading\': interest.loadingInterests}\" when-scroll-ends=\"interest.loadMoreInterests()\"><div ng-click=\"interest.useInterest($index)\" class=\"ui button toggle compact repeat-animation\" ng-repeat=\"inter in interest.allInterests track by $index\" ng-class=\"{\'active\': inter.active, \'loading\': interest.inter.loading}\">{{inter.description}}</div><div class=\"ui info message\" ng-show=\"interest.noResults && !interest.loadingInterests\"><p>No interests found.</p><p>Try with another search term or <a href=\"\" ng-click=\"interest.reset()\">reset your search</a>.</p></div><three-bounce-spinner class=\"page-spinner-bar\" ng-show=\"interest.loadingMore\"></three-bounce-spinner></div>");
$templateCache.put("app/main/main.html","<div class=\"ui center aligned grid fullheight\" id=\"homepage\"><div class=\"row\"><div class=\"wide column\"><div class=\"ui huge header aligned center\">{{greetingMessage}} Persice</div></div></div><div class=\"row\"><div class=\"wide column\"><div class=\"ui small header\" id=\"main-info\">Persice connects people with similar goals<br>and interests.</div><br><p><a ui-sref=\"selectinterests\" class=\"ui green button huge\">Start</a></p></div></div></div>");
$templateCache.put("app/matchfeed/matchfeed.html","<matchfeed-profile type=\"matchfeed\"></matchfeed-profile>");
$templateCache.put("app/myconnections/myconnections.html","<div id=\"search-header\"><div class=\"ui left icon input\"><input type=\"text\" ng-model=\"myconnections.q\" ng-change=\"myconnections.getFriends()\" placeholder=\"Search\" ng-model-options=\"{debounce:300}\"> <i class=\"circular search icon\"></i></div></div><div id=\"friends-list-body\" class=\"basic ui segment\" ng-class=\"{\'loading\': myconnections.loading}\" when-scroll-ends=\"myconnections.loadMoreFriends()\"><div class=\"ui basic segment notice\" ng-if=\"myconnections.noConnections\"><div class=\"ui info message\"><p>You don\'t have any connections. Go to your Match Feed to find people with similar goals and interests.</p><p><a class=\"ui icon button blue\" ui-sref=\"matchfeed\">Match Feed</a></p></div></div><div class=\"ui divided selection list\"><div class=\"ui info message\" ng-show=\"myconnections.noResults && !myconnections.loading && !myconnections.noConnections\"><p>No connections found.</p><p>Try with another search term or <a href=\"\" ng-click=\"myconnections.reset()\">reset your search</a>.</p></div><div ng-click=\"myconnections.gotoConnection($index)\" ng-class=\"{\'unread\': friend.updated_at === null}\" class=\"item repeat-animation\" ng-repeat=\"friend in myconnections.friends track by $index\"><div class=\"ui circular tiny image img-bounding-box\" ng-style=\"{\'background-image\': \'url(//graph.facebook.com/{{ friend.facebook_id }}/picture?type=large)\'}\"></div><div class=\"content\"><div class=\"header\">{{friend.first_name}}</div><div class=\"description\"><div class=\"ui mini statistics\"><div class=\"statistic\" tooltips=\"\" tooltip-speed=\"fast\" tooltip-title=\"Match score\"><div class=\"value\"><i class=\"intersecticon icon\"></i></div><div class=\"label\">{{friend.common_goals_offers_interests}}</div></div><div class=\"statistic\" tooltips=\"\" tooltip-speed=\"fast\" tooltip-title=\"Mutual friends\"><div class=\"value\"><i class=\"empty user usericon icon\"></i></div><div class=\"label\">{{friend.totalFriends}}</div></div></div></div></div></div></div><three-bounce-spinner class=\"page-spinner-bar\" ng-show=\"myconnections.loadingMore\"></three-bounce-spinner></div>");
$templateCache.put("app/myprofile/myprofile.html","<user-profile person=\"myprofile.user\" type=\"loggedInUser\" header=\"my-profile-header\" body=\"matched-profile-body\"></user-profile>");
$templateCache.put("app/offercreate/offercreate.html","<div class=\"ui top menu fixed borderless\" id=\"mainheadermenu\"><div class=\"header item\"><span class=\"fa-stack\"><i class=\"fa fa-circle fa-stack-2x\"></i> <i class=\"fa fa-stack-1x fa-inverse\">3</i></span> Post an offer</div><div class=\"right menu\"><div class=\"ui item\" id=\"nextButton\"><div ng-click=\"createOffer()\" ng-class=\"{\'disabled\': subject === \'\'}\" class=\"ui button green small\">Next &raquo;</div></div></div></div><div class=\"ui grid fullheight\"><div class=\"row\"><div class=\"wide column\"><div class=\"body segment\"><h2 class=\"ui header dividing center aligned desktopview\"><span class=\"fa-stack\"><i class=\"fa fa-circle fa-stack-2x\"></i> <i class=\"fa fa-stack-1x fa-inverse\">3</i></span><div class=\"content\">Post an offer</div><div ng-click=\"createOffer()\" id=\"nextButtonDesktop\" ng-class=\"{\'disabled\': subject === \'\'}\" class=\"ui button green small\">Next &raquo;</div></h2><h2 class=\"ui center aligned header withborder\">I can help people...<hr></h2><div class=\"ui attached warning message\" id=\"warningmessage\" ng-show=\"messageShow\"><div class=\"header\">Warning</div><p>{{message}}</p></div><div class=\"ui basic segment\"><div class=\"ui form\"><div class=\"ui center aligned grid\"><div class=\"row\"><div class=\"search-wrapper\"><div field-required=\"false\" autocomplete-ui=\"\" minlength=\"3\" input-class=\"ui input\" text-no-results=\"No existing offer found. Create new offer &raquo;\" input-changed=\"inputChanged\" match-class=\"highlight\" selected-object=\"selectResult\" description-field=\"description[3]\" title-field=\"description\" remote-url=\"/api/v1/subject/?format=json&description__icontains=\" remote-url-data-field=\"objects\" type=\"text\" input-name=\"description\" id=\"id_description\" placeholder=\"enter your offer here\"></div></div></div></div></div></div><div class=\"ui secondary segment\" id=\"instructions\" ng-hide=\"subject !== \'\'\"><h4>This should be something you\'re willing to help other people achieve.</h4><br><h4>For example:</h4><p><ul class=\"unstyled\"><li>&quot;Learn to play the banjo&quot;</li><li>&quot;Find a great restaurant&quot;</li><li>&quot;Take care of their pets&quot;</li><li>&quot;Move their 500 lb sofa&quot;</li></ul></p></div></div></div></div></div>");
$templateCache.put("app/settings/settings.html","<div class=\"ui grid fullheight\" id=\"settingsPage\"><div class=\"row\"><div class=\"wide column\"><div class=\"ui basic segment\"><h4 class=\"ui header dividing\">Settings</h4><form class=\"ui form\"><div class=\"inline fields\"><label for=\"fruit\">Distance units:</label><div class=\"field\"><div class=\"customradio\"><input type=\"radio\" ng-model=\"settings.distanceUnit\" value=\"miles\"> <label ng-click=\"settings.setUnit(\'miles\')\">miles</label></div></div><div class=\"field\"><div class=\"customradio\"><input type=\"radio\" ng-model=\"settings.distanceUnit\" value=\"km\"> <label ng-click=\"settings.setUnit(\'km\')\">km</label></div></div></div><div class=\"ui divider\"></div><div ng-click=\"settings.saveSettings()\" class=\"ui green button\" ng-class=\"{\'disabled\': !settings.changed, \'loading\': settings.loadingSave}\">Save</div></form></div><br><br><div class=\"ui basic segment\"><h4 class=\"ui header dividing\">Manage Account</h4><a class=\"ui icon labeled button\" ui-sref-ignore=\"\" href=\"accounts/logout\"><i class=\"sign out icon\"></i> Sign out</a></div><br><br><br><br><br><br><div class=\"ui basic segment\"><h4 class=\"ui header dividing\"></h4><div class=\"ui deleteitem red icon labeled button\" id=\"deleteAccountButton\"><i class=\"remove circle icon\"></i> Delete Account</div></div></div></div></div><div class=\"ui basic delete modal\"><i class=\"close icon\"></i><div class=\"header\">Please Confirm</div><div class=\"content\"><div class=\"description\"><p>Are you sure you want to delete your account?</p></div></div><div class=\"actions\"><div class=\"two fluid ui inverted buttons\"><div class=\"ui red negative basic inverted button\"><i class=\"remove icon\"></i> No</div><a class=\"ui green basic inverted button ok\"><i class=\"checkmark icon\"></i> Yes</a></div></div></div><script>\n\'use strict\';\n$(\'.basic.delete.modal\')\n    .modal({\n        onDeny: function() {},\n        onApprove: function() {\n            angular.element($(\'#settingsPage\')).scope().settings.deleteUser();\n        }\n    })\n    .modal(\'attach events\', \'.deleteitem\', \'show\');\n</script>");
$templateCache.put("components/event/event.tpl.html","<div class=\"ui basic segment\"><form class=\"ui form\"><div class=\"ui positive message\" ng-show=\"singleevent.showSuccess\"><div class=\"header\">New event was successfully created.</div></div><div class=\"ui negative message\" ng-show=\"singleevent.showError\"><div class=\"header\">Warning</div><p ng-repeat=\"errormsg in singleevent.errorMessage track by $index\">{{errormsg}}</p></div><div class=\"ui large form segment first\" id=\"FirstSegment\"><div class=\"field\"><label>Event Name</label> <input autocomplete=\"off\" class=\"border-bottom\" ng-model=\"singleevent.event.name\" placeholder=\"{{::singleevent.placeholder.name}}\" type=\"text\" name=\"name\"></div><div class=\"field\"><label>Location</label><div class=\"ui action input\" id=\"locationInput\"><input autocomplete=\"off\" name=\"location\" attach=\"\'locationInput\'\" google-places-autocomplete=\"\" options=\"singleevent.autocompleteOptions\" placeholder=\"{{::singleevent.placeholder.location}}\" ng-model=\"singleevent.eventLocation\" type=\"text\"> <button ng-class=\"{\'active\': singleevent.mapurlTrue, \'disabled\': !singleevent.mapurlTrue}\" ng-click=\"singleevent.openMap()\" class=\"ui right icon button location\"><i class=\"marker large icon\"></i></button></div></div></div><div class=\"ui large form segment\" id=\"datePair\"><div class=\"field\" ng-class=\"{\'error\': singleevent.startsTimeError}\"><label>Starts</label><div class=\"ui icon input\" id=\"desktopStartsAt\"><input autocomplete=\"off\" class=\"date start\" ng-model=\"singleevent.starts_on_date\" placeholder=\"{{::singleevent.placeholder.starts}}\" type=\"text\" name=\"starts_on_date\"> <i class=\"calendar icon\"></i></div><input name=\"starts_on\" autocomplete=\"off\" ng-change=\"singleevent.checkDatesStarts()\" ng-class=\"{\'fulldisplay\': singleevent.event.starts_on !== \'\' && singleevent.event.starts_on !== null}\" ng-if=\"singleevent.showMobile\" id=\"startsAtDate\" class=\"border-bottom\" placeholder=\"Starts\" step=\"7200\" type=\"datetime-local\" ng-model=\"singleevent.event.starts_on\"> <input autocomplete=\"off\" id=\"startsAtTime\" class=\"time start\" placeholder=\"{{::singleevent.placeholder.startsTime}}\" type=\"text\" ng-model=\"singleevent.starts_on_time\" name=\"starts_on_time\"></div><div class=\"field\" ng-class=\"{\'error\': singleevent.endsTimeError}\"><label>Ends</label><div class=\"ui icon input\" id=\"desktopEndsAt\"><input autocomplete=\"off\" class=\"date end\" ng-model=\"singleevent.ends_on_date\" placeholder=\"{{::singleevent.placeholder.ends}}\" type=\"text\" name=\"ends_on_date\"> <i class=\"calendar icon\"></i></div><input name=\"ends_on\" autocomplete=\"off\" ng-change=\"singleevent.checkDatesEnds()\" ng-class=\"{\'fulldisplay\': singleevent.event.ends_on !== \'\' && singleevent.event.ends_on !== null}\" ng-if=\"singleevent.showMobile\" id=\"endsAtDate\" class=\"ui border-bottom\" placeholder=\"Ends\" step=\"7200\" type=\"datetime-local\" ng-model=\"singleevent.event.ends_on\"> <input autocomplete=\"off\" id=\"endsAtTime\" class=\"time end\" placeholder=\"{{::singleevent.placeholder.endsTime}}\" type=\"text\" ng-model=\"singleevent.ends_on_time\" name=\"ends_on_time\"></div><div class=\"field\"><label>Repeat</label> <input autocomplete=\"off\" name=\"repeat\" id=\"repeat\" placeholder=\"{{::singleevent.placeholder.repeat}}\" type=\"text\" ng-model=\"singleevent.event.repeat\"><div class=\"ui icon input\" id=\"desktopRepeatUntil\"><input autocomplete=\"off\" class=\"simpledate\" ng-model=\"singleevent.event.repeatUntil\" placeholder=\"{{::singleevent.placeholder.repeatUntil}}\" type=\"text\"> <i class=\"calendar icon\"></i></div></div></div><div class=\"ui large form segment icon-segment\"><div class=\"field button\"><label>Costs</label><div class=\"fluid ui right labeled icon button\"><i class=\"fa-angle-right fa icon large\"></i> {{::singleevent.placeholder.costs}}</div></div></div><div class=\"ui large form segment icon-segment\"><div class=\"field button\"><label>Invitations</label><div class=\"fluid ui right labeled icon button\"><i class=\"fa-angle-right fa icon large\"></i> {{::singleevent.placeholder.invitations}}</div></div></div><div class=\"ui large form segment icon-segment\"><div class=\"field\" id=\"attachmentsDesc\"><label>Attachments</label><div class=\"fluid ui right labeled icon button with-left-icon\"><i class=\"fa-paperclip fa icon large left-icon\"></i> <i class=\"fa-angle-right fa icon large\"></i> {{::singleevent.placeholder.attachments}}</div></div><div class=\"ui divider\" id=\"last-section\"></div><div class=\"field\"><label>Description</label> <textarea autocomplete=\"off\" name=\"description\" rows=\"4\" class=\"border-bottom\" placeholder=\"{{::singleevent.placeholder.description}}\" ng-model=\"singleevent.event.description\"></textarea></div></div></form></div><script>\n\'use strict\';\n\n\n// initialize input widgets first\n$(\'#datePair .time\').timepicker({\n    \'showDuration\': true,\n    \'timeFormat\': \'h:i A\',\n    \'scrollDefaultNow\': true\n});\n\n$(\'#datePair .date\').datepicker({\n    \'format\': \'mm/dd/yyyy\',\n    \'autoclose\': true,\n    \'startDate\': moment().format(\'MM/DD/YYYY\'),\n    \'todayHighlight\': true,\n});\n\n$(\'#datePair .simpledate\').datepicker({\n    \'format\': \'mm/dd/yyyy\',\n    \'autoclose\': true,\n    \'startDate\': moment().format(\'MM/DD/YYYY\'),\n    \'todayHighlight\': true,\n});\n\n\n// initialize datepair\n$(\'#datePair\').datepair({\n    defaultTimeDelta: 3600000,\n});\n</script>");
$templateCache.put("components/event/eventattendees.tpl.html","<div class=\"ui basic segment\" id=\"event-attendees\"><form class=\"ui form\"><div class=\"fields\"><div class=\"eight wide field attendees\"><div class=\"field-section\"><div class=\"label\">Open to: <span class=\"label number\">Public (all Persice users)</span></div><div class=\"ui divider\"></div><div class=\"label\">Guest can invite friends <span class=\"label number\">YES</span></div></div></div><div class=\"eight wide field attendees\"><div class=\"field-section\"><div class=\"label\">Max. attendees <span class=\"label number\">10</span></div><div class=\"ui divider\"></div><div class=\"label\">Spots remaining <span class=\"label number\">2</span></div></div></div></div></form><br><div class=\"ui header\">Attending:</div><div class=\"ui top attached tabular menu\" id=\"attendeesTabsMenu\"><a class=\"item active withicons\" data-tab=\"first\">Yes <span class=\"ui circular label\">2</span></a> <a class=\"item withicons\" data-tab=\"second\">Maybe <span class=\"ui circular label\">1</span></a> <a class=\"item withicons\" data-tab=\"third\">No <span class=\"ui circular label\">1</span></a></div><div class=\"ui bottom attached tab segment active\" data-tab=\"first\"><table class=\"ui very basic unstackable table attendees-people\"><thead><tr><th colspan=\"2\" class=\"search-header-container\"><div class=\"ui transparent left icon input searchbox\"><input type=\"text\" placeholder=\"\"> <i class=\"search large icon\"></i></div></th><th class=\"desktopview\"><i class=\"intersecticon icon\"></i></th><th class=\"desktopview\"><i class=\"empty user large usericon icon\"></i></th></tr></thead><tbody><tr ng-repeat=\"connection in viewevent.connectionsYes track by connection.id\"><td><h4 class=\"ui image header\"><img src=\"http://lorempixel.com/32/32\" class=\"ui circular image\"><div class=\"content\">{{::connection.first_name}}, {{::connection.age}}</div></h4></td><td class=\"desktopview\"><div class=\"tagline\">{{::connection.tagline}}</div></td><td class=\"desktopview\">{{::connection.match_score}}</td><td class=\"desktopview\">{{::connection.mutual_friends}}</td></tr></tbody></table></div><div class=\"ui bottom attached tab segment\" data-tab=\"second\"><table class=\"ui very basic unstackable table attendees-people\"><thead><tr><th colspan=\"2\" class=\"search-header-container\"><div class=\"ui transparent left icon input searchbox\"><input type=\"text\" placeholder=\"\"> <i class=\"search large icon\"></i></div></th><th class=\"desktopview\"><i class=\"intersecticon icon\"></i></th><th class=\"desktopview\"><i class=\"empty user large usericon icon\"></i></th></tr></thead><tbody><tr ng-repeat=\"connection in viewevent.connectionsNo track by connection.id\"><td><h4 class=\"ui image header\"><img src=\"http://lorempixel.com/32/32\" class=\"ui circular image\"><div class=\"content\">{{::connection.first_name}}, {{::connection.age}}</div></h4></td><td class=\"desktopview\"><div class=\"tagline\">{{::connection.tagline}}</div></td><td class=\"desktopview\">{{::connection.match_score}}</td><td class=\"desktopview\">{{::connection.mutual_friends}}</td></tr></tbody></table></div><div class=\"ui bottom attached tab segment\" data-tab=\"third\"><table class=\"ui very basic unstackable table attendees-people\"><thead><tr><th colspan=\"2\" class=\"search-header-container\"><div class=\"ui transparent left icon input searchbox\"><input type=\"text\" placeholder=\"\"> <i class=\"search large icon\"></i></div></th><th class=\"desktopview\"><i class=\"intersecticon icon\"></i></th><th class=\"desktopview\"><i class=\"empty user large usericon icon\"></i></th></tr></thead><tbody><tr ng-repeat=\"connection in viewevent.connectionsMaybe track by connection.id\"><td><h4 class=\"ui image header\"><img src=\"http://lorempixel.com/32/32\" class=\"ui circular image\"><div class=\"content\">{{::connection.first_name}}, {{::connection.age}}</div></h4></td><td class=\"desktopview\"><div class=\"tagline\">{{::connection.tagline}}</div></td><td class=\"desktopview\">{{::connection.match_score}}</td><td class=\"desktopview\">{{::connection.mutual_friends}}</td></tr></tbody></table></div><br></div><script>\n    \'use strict\';\n    $(\'.menu .item\')\n    .tab();\n</script>");
$templateCache.put("components/event/eventedit.tpl.html","<div class=\"ui basic segment\"><form class=\"ui form\" ng-class=\"{\'loading\': viewevent.loadingEvent}\"><div class=\"ui positive message\" ng-show=\"viewevent.showSuccess\"><div class=\"header\">New event was successfully created.</div></div><div class=\"ui negative message\" ng-show=\"viewevent.showError\"><div class=\"header\">Warning</div><p ng-repeat=\"errormsg in viewevent.errorMessage track by $index\">{{errormsg}}</p></div><div class=\"ui large form segment first\" id=\"FirstSegment\"><div class=\"field\"><label>Event Name</label> <input autocomplete=\"off\" class=\"border-bottom\" ng-model=\"viewevent.eventEdit.name\" placeholder=\"{{::viewevent.placeholder.name}}\" type=\"text\" name=\"name\"></div><div class=\"field\"><label>Location</label><div class=\"ui action input\" id=\"locationInput2\"><input autocomplete=\"off\" name=\"location\" attach=\"\'locationInput2\'\" google-places-autocomplete=\"\" options=\"viewevent.autocompleteOptions\" placeholder=\"{{::viewevent.placeholder.location}}\" ng-model=\"viewevent.eventLocation\" type=\"text\"> <button ng-class=\"{\'active\': viewevent.mapurlTrue, \'disabled\': !viewevent.mapurlTrue}\" ng-click=\"viewevent.openMap()\" class=\"ui right icon button location\"><i class=\"marker large icon\"></i></button></div></div></div><div class=\"ui large form segment\" id=\"datePairEdit\"><div class=\"field\" ng-class=\"{\'error\': viewevent.startsTimeError}\"><label>Starts</label><div class=\"ui icon input\" id=\"desktopStartsAt\"><input autocomplete=\"off\" class=\"date start\" ng-model=\"viewevent.starts_on_date\" placeholder=\"{{::viewevent.placeholder.starts}}\" type=\"text\" name=\"starts_on_date\"> <i class=\"calendar icon\"></i></div><input name=\"starts_on\" autocomplete=\"off\" ng-change=\"viewevent.checkDatesStarts()\" ng-class=\"{\'fulldisplay\': viewevent.eventEdit.starts_on !== \'\' && viewevent.eventEdit.starts_on !== null}\" ng-if=\"viewevent.showMobile\" id=\"startsAtDate\" class=\"border-bottom\" placeholder=\"Starts\" type=\"datetime-local\" ng-model=\"viewevent.eventEdit.starts_on\"> <input autocomplete=\"off\" id=\"startsAtTime\" class=\"time start\" placeholder=\"{{::viewevent.placeholder.startsTime}}\" type=\"text\" ng-model=\"viewevent.starts_on_time\" name=\"starts_on_time\"></div><div class=\"field\" ng-class=\"{\'error\': viewevent.endsTimeError}\"><label>Ends</label><div class=\"ui icon input\" id=\"desktopEndsAt\"><input autocomplete=\"off\" class=\"date end\" ng-model=\"viewevent.ends_on_date\" placeholder=\"{{::viewevent.placeholder.ends}}\" type=\"text\" name=\"ends_on_date\"> <i class=\"calendar icon\"></i></div><input name=\"ends_on\" autocomplete=\"off\" ng-change=\"viewevent.checkDatesEnds()\" ng-class=\"{\'fulldisplay\': viewevent.eventEdit.ends_on !== \'\' && viewevent.eventEdit.ends_on !== null}\" ng-if=\"viewevent.showMobile\" id=\"endsAtDate\" class=\"ui border-bottom\" placeholder=\"Ends\" type=\"datetime-local\" ng-model=\"viewevent.eventEdit.ends_on\"> <input autocomplete=\"off\" id=\"endsAtTime\" class=\"time end\" placeholder=\"{{::viewevent.placeholder.endsTime}}\" type=\"text\" ng-model=\"viewevent.ends_on_time\" name=\"ends_on_time\"></div><div class=\"field\"><label>Repeat</label> <input autocomplete=\"off\" name=\"repeat\" id=\"repeat\" placeholder=\"{{::viewevent.placeholder.repeat}}\" type=\"text\" ng-model=\"viewevent.eventEdit.repeat\"><div class=\"ui icon input\" id=\"desktopRepeatUntil\"><input autocomplete=\"off\" class=\"simpledate\" ng-model=\"viewevent.eventEdit.repeatUntil\" placeholder=\"{{::viewevent.placeholder.repeatUntil}}\" type=\"text\"> <i class=\"calendar icon\"></i></div></div></div><div class=\"ui large form segment icon-segment\"><div class=\"field\"><label>Costs</label><div class=\"fluid ui right labeled icon button\"><i class=\"fa-angle-right fa icon large\"></i> {{::viewevent.placeholder.costs}}</div></div></div><div class=\"ui large form segment icon-segment\"><div class=\"field button\"><label>Invitations</label><div class=\"fluid ui right labeled icon button\" ng-click=\"viewevent.openInvitations()\"><i class=\"fa-angle-right fa icon large\"></i> {{::viewevent.placeholder.invitations}}</div></div></div><div class=\"ui large form segment icon-segment\"><div class=\"field button\" id=\"attachmentsDesc\"><label>Attachments</label><div class=\"fluid ui right labeled icon button with-left-icon\"><i class=\"fa-paperclip fa icon large left-icon\"></i> <i class=\"fa-angle-right fa icon large\"></i> {{::viewevent.placeholder.attachments}}</div></div><div class=\"ui divider\" id=\"last-section\"></div><div class=\"field\"><label>Description</label> <textarea autocomplete=\"off\" name=\"description\" rows=\"4\" class=\"border-bottom\" placeholder=\"{{::viewevent.placeholder.description}}\" ng-model=\"viewevent.eventEdit.description\"></textarea></div></div></form></div><div class=\"ui small modal deletemodal\" id=\"deleteEventModal\"><i class=\"close icon\"></i><div class=\"header\">Please Confirm</div><div class=\"content\"><p>Are you sure you want to delete this event?</p></div><div class=\"actions\"><div class=\"ui negative basic icon labeled button\"><i class=\"remove icon\"></i> No</div><a class=\"ui positive right button icon labeled\"><i class=\"checkmark icon\"></i> Yes</a></div></div><script>\n    \'use strict\';\n    $(\'#deleteEventModal\')\n    .modal({\n        onDeny: function() {},\n        onApprove: function() {\n            angular.element($(\'#deleteEventButton\')).scope().viewevent.deleteEvent();\n        }\n    })\n    .modal(\'attach events\', \'#deleteEventButton\', \'show\')\n    .modal(\'setting\', \'allowMultiple\', true);\n</script><script>\n    \'use strict\';\n\n\n// initialize input widgets first\n$(\'#datePairEdit .time\').timepicker({\n    \'showDuration\': true,\n    \'timeFormat\': \'h:i A\',\n    \'scrollDefaultNow\': true\n});\n\n$(\'#datePairEdit .date\').datepicker({\n    \'format\': \'mm/dd/yyyy\',\n    \'autoclose\': true,\n    \'startDate\': moment().format(\'MM/DD/YYYY\'),\n    \'todayHighlight\': true,\n});\n\n$(\'#datePairEdit .simpledate\').datepicker({\n    \'format\': \'mm/dd/yyyy\',\n    \'autoclose\': true,\n    \'startDate\': moment().format(\'MM/DD/YYYY\'),\n    \'todayHighlight\': true,\n});\n\n\n// initialize datepair\n$(\'#datePairEdit\').datepair({\n    defaultTimeDelta: 3600000,\n});\n\n\n$(\".ui.form\").scroll(function () {\n  $(\"input[type=\'text\']:focus\").blur();\n});\n\n\n</script>");
$templateCache.put("components/event/eventinvitations.tpl.html","<div class=\"ui basic segment\" id=\"event-invitations\"><div class=\"ui active inverted dimmer\" ng-if=\"viewevent.loadingInvitesSave\"><div class=\"ui text loader\">Please wait while invitations are being sent...</div></div><form class=\"ui form\"><div class=\"ui header\">Who can attend this event?</div><div class=\"fields\"><div class=\"eight wide field invitations\"><div class=\"field-section\"><div class=\"radio-vertical\"><input type=\"radio\" ng-model=\"viewevent.invitationsOptions.attendingPref\" value=\"myconnections\"> <span class=\"label\">Only my connections (default)</span></div><div class=\"radio-vertical\"><input type=\"radio\" ng-model=\"viewevent.invitationsOptions.attendingPref\" value=\"public\"> <span class=\"label\">Public (all Persice users)</span></div><div class=\"radio-vertical\"><input type=\"radio\" ng-model=\"viewevent.invitationsOptions.attendingPref\" value=\"private\"> <span class=\"label\">Private (only select users)</span></div></div></div><div class=\"eight wide field invitations\"><div class=\"field-section\"><div class=\"label\">Max. attendees <span class=\"label number\">10</span></div><div class=\"ui divider\"></div><div class=\"checkbox-vertical\"><input type=\"checkbox\" ng-model=\"viewevent.invitationsOptions.guestInvite\" value=\"private\"> <span class=\"label\">Guests can invite friends</span></div></div></div></div></form><br><div class=\"ui top attached tabular menu\" id=\"invitationsTabsMenu\"><a class=\"item active\" data-tab=\"first\">My Connections</a> <a class=\"item withicons\" data-tab=\"second\"><i class=\"check large circle icon\"></i> Invite List <span class=\"ui circular label\">{{viewevent.invitedPeople.length}}</span></a></div><div class=\"ui bottom attached tab segment active\" data-tab=\"first\" ng-class=\"{\'loading\': viewevent.loadingConnections}\"><table class=\"ui very basic unstackable table invitations-people\" ng-cloak=\"\"><thead><tr><th colspan=\"2\" class=\"search-header-container\"><div class=\"ui transparent left icon input searchbox\"><input type=\"text\" placeholder=\"\" ng-model=\"viewevent.connectionFirstName\"> <i class=\"search large icon\"></i></div></th><th class=\"desktopview\"><i class=\"intersecticon icon\"></i></th><th class=\"desktopview\"><i class=\"empty user large usericon icon\"></i></th><th class=\"desktopview\"></th></tr></thead><tbody><tr ng-repeat=\"connection in viewevent.connections track by connection.friend_id\" ng-class=\"{\'active\': connection.selected}\" ng-click=\"viewevent.markSelected($index)\"><td><h4 class=\"ui image header\"><img ng-src=\"{{::connection.image}}\" class=\"ui circular image\"><div class=\"content\">{{::connection.first_name}}, {{::connection.age}}</div></h4></td><td class=\"desktopview\"><div class=\"tagline\">{{::connection.tagline}}</div></td><td class=\"desktopview\">{{::connection.common_goals_offers_interests}}</td><td class=\"desktopview\">{{::connection.mutual_friends_count}}</td><td class=\"selected\"><i ng-if=\"connection.selected\" class=\"check fade icon big circle invite outline\" ng-class=\"{\'green\': !connection.is_invited && connection.selected}\"></i></td></tr></tbody></table></div><div class=\"ui bottom attached tab segment\" data-tab=\"second\"><table class=\"ui very basic unstackable table invitations-people\" ng-cloak=\"\"><thead><tr><th class=\"search-header-container\"><div class=\"ui transparent left icon input searchbox\"><input type=\"text\" placeholder=\"\"> <i class=\"search large icon\"></i></div></th><th class=\"desktopview\"></th><th class=\"desktopview\"><i class=\"intersecticon icon\"></i></th><th class=\"desktopview\"><i class=\"empty user large usericon icon\"></i></th><th>RSVP</th><th></th></tr></thead><tbody><tr ng-repeat=\"connection in viewevent.invitedPeople track by connection.friend_id\"><td><h4 class=\"ui image header\"><img ng-src=\"{{::connection.image}}\" class=\"ui circular image\"><div class=\"content\">{{::connection.first_name}}, {{::connection.age}}</div></h4></td><td class=\"desktopview\"><div class=\"tagline\">{{::connection.tagline}}</div></td><td class=\"desktopview\">{{::connection.common_goals_offers_interests}}</td><td class=\"desktopview\">{{::connection.mutual_friends_count}}</td><td>{{::connection.rsvp | uppercase}}</td><td class=\"selected\"><i ng-click=\"viewevent.removeInvite($index)\" class=\"remove fade icon big circle outline red\"></i></td></tr></tbody></table></div><br></div><script>\n\'use strict\';\n$(\'.menu .item\')\n    .tab();\n</script>");
$templateCache.put("components/event/eventview.tpl.html","<div class=\"ui center aligned header\" ng-show=\"viewevent.isHost === true && !viewevent.loadingEvent && !viewevent.eventNotFound\">You are the host of this event.</div><div class=\"row\" ng-show=\"viewevent.isHost === false && !viewevent.loadingEvent && !viewevent.eventNotFound\"><div class=\"wide column\"><div class=\"ui fluid secondary menu\" id=\"event-going-menu\"><div class=\"header item\">GOING?</div><a class=\"item\" ng-click=\"viewevent.changeRsvpStatus(\'yes\')\" ng-class=\"{active: viewevent.eventRsvp.status === \'yes\'}\">YES</a> <a class=\"item\" ng-click=\"viewevent.changeRsvpStatus(\'no\')\" ng-class=\"{active: viewevent.eventRsvp.status === \'no\'}\">NO</a> <a class=\"item\" ng-click=\"viewevent.changeRsvpStatus(\'maybe\')\" ng-class=\"{active: viewevent.eventRsvp.status === \'maybe\'}\">MAYBE</a></div></div></div><div class=\"ui negative message\" ng-show=\"viewevent.eventNotFound && !viewevent.loadingEvent\"><div class=\"header\">Warning</div><p>This event doesn\'t exist anymore.</p></div><div class=\"ui basic segment\" ng-class=\"{\'hidevisibility\': viewevent.eventNotFound}\"><form class=\"ui form\" ng-class=\"{\'loading\': viewevent.loadingEvent}\"><div class=\"ui large form segment first editable\" id=\"FirstSegment\"><div class=\"field\"><label class=\"specialpadding\">Event Name</label><div class=\"eventcontent\"><span id=\"eventName\">{{viewevent.event.name}}</span></div></div><div class=\"ui divider\" id=\"last-section\"></div><div class=\"field\" id=\"locationField\"><label class=\"specialpadding\">Location</label><div class=\"eventcontent\" ng-class=\"{\'urlexists\': viewevent.mapurlTrue}\"><i ng-click=\"viewevent.openMap()\" class=\"marker large icon\"></i> <span class=\"locationContent\"><span ng-if=\"viewevent.event.location_name.trim() !== viewevent.event.city.trim()\">{{viewevent.event.location_name}}</span> <span><br ng-if=\"viewevent.event.location_name.trim() !== viewevent.event.city.trim() && viewevent.event.location_name !== null && viewevent.event.location_name.trim() !== \'\' && viewevent.event.location_name.trim() !== viewevent.event.street.trim()\"><span ng-if=\"viewevent.event.street !== null && viewevent.event.street.trim() !== \'\' && viewevent.event.location_name.trim() !== viewevent.event.street.trim()\">{{viewevent.event.street}}<br></span> <span ng-if=\"viewevent.event.city !== null && viewevent.event.city.trim() !== \'\'\">{{viewevent.event.city}} {{viewevent.event.zipcode}} {{viewevent.event.state}}</span></span></span></div></div></div><div class=\"ui large form segment\" id=\"DatesSection\" ng-if=\"viewevent.showMobile\"><div class=\"field\"><span>{{viewevent.firstrow}}</span></div><div class=\"ui divider\" id=\"last-section\"></div><div class=\"field\"><span class=\"timeslot\">{{viewevent.secondrow}}</span> <span class=\"repeats\">repeats weekly</span><div class=\"cleardiv\"></div></div><div class=\"ui divider\" id=\"last-section\"></div><div class=\"field\"><span class=\"cost\"><strong>Cost:</strong> $25 (in advance)</span> <span class=\"paid\"><i class=\"fa fa-check icon\"></i><strong>PAID</strong></span><div class=\"cleardiv\"></div></div></div><div class=\"ui large form segment\" id=\"DatesSection\" ng-if=\"!viewevent.showMobile\"><div class=\"field\"><label class=\"specialpadding\">Starts</label><div class=\"eventcontent\"><span>{{viewevent.firstrow}}</span></div></div><div class=\"ui divider\" id=\"last-section\"></div><div class=\"field\"><label class=\"specialpadding\">Ends</label><div class=\"eventcontent\"><span class=\"timeslot\">{{viewevent.secondrow}}</span> <span class=\"repeats\">repeats weekly</span><div class=\"cleardiv\"></div></div></div><div class=\"ui divider\" id=\"last-section\"></div><div class=\"field\"><label class=\"specialpadding\">Cost</label><div class=\"eventcontent\"><span class=\"cost\">$25 (in advance)</span> <span class=\"paid\"><i class=\"fa fa-check icon\"></i><strong>PAID</strong></span><div class=\"cleardiv\"></div></div></div></div><div class=\"ui large form segment\" id=\"HostedSection\" ng-if=\"!viewevent.showMobile\"><div class=\"field\"><label class=\"specialpadding\">Hosted By</label><div class=\"eventcontent\"><span>{{viewevent.event.hosted_by}}</span></div></div><div class=\"ui divider\" id=\"last-section\"></div><div class=\"field\"><label class=\"specialpadding\">Attending</label><div class=\"ui right labeled icon button widthFull\" ng-click=\"viewevent.openAttendees();\"><span class=\"total-people\">{{viewevent.event.total_attendees}} people total</span> <span class=\"connections-people\">{{viewevent.event.friend_attendees_count}} connections</span> <span class=\"remaining-spots\">{{viewevent.event.spots_remaining}} spots remaining</span><div class=\"cleardiv\"></div><i class=\"fa-angle-right fa icon large\"></i></div></div></div><div class=\"ui large form segment\" id=\"HostedSection\" ng-if=\"viewevent.showMobile\"><div class=\"field\">Host: <span>{{viewevent.event.hosted_by}}</span></div><div class=\"ui divider\" id=\"last-section\"></div><div class=\"field attendees-view\" ng-click=\"viewevent.openAttendees();\"><span class=\"label\">Attendees:</span><div class=\"attendees-values\"><span class=\"total-people\">{{viewevent.event.total_attendees}} people total</span> <span class=\"connections-people\">{{viewevent.event.friend_attendees_count}} connections</span> <span class=\"remaining-spots\">{{viewevent.event.spots_remaining}} spots remaining</span></div><i class=\"fa-angle-right fa icon large\"></i></div></div><div class=\"ui large form segment icon-segment\"><div class=\"field\"><label class=\"specialpadding\">Group Chat</label><div class=\"fluid ui right labeled icon button\"><i class=\"fa-angle-right fa icon large\"></i> 15 messages</div></div></div><div class=\"ui large form segment\" id=\"eventDescription\"><div class=\"field\" ng-if=\"viewevent.showMobile\"><span>Event Description:</span></div><div class=\"ui divider\" id=\"last-section\" ng-if=\"viewevent.showMobile\"></div><div class=\"field\"><label class=\"specialpadding\">Description</label><div class=\"eventcontent\"><span>{{viewevent.event.description}}</span></div></div></div></form></div>");
$templateCache.put("components/eventsfeed/eventsfeed.directive.html","<ng-include src=\"\'components/eventsfeed/eventsfeed.tpl.html\'\"></ng-include>");
$templateCache.put("components/eventsfeed/eventsfeed.tpl.html","<div id=\"eventsfeed-list-body\" class=\"basic ui segment\" ng-class=\"{\'loading\': eventsfeed.loading}\" when-scroll-ends=\"eventsfeed.loadMoreEvents()\"><div class=\"ui basic segment notice\" ng-if=\"eventsfeed.noEvents\"><div class=\"ui info message\"><p>You don\'t have any events.</p></div></div><div class=\"eventgroup\" ng-repeat=\"eventcontent in eventsfeed.events track by $index\"><div class=\"eventdate\">{{eventcontent.date}}</div><a class=\"ui fluid card\" ng-click=\"eventsfeed.gotoEvent(event.id)\" ng-repeat=\"event in eventcontent.items track by $index\"><div class=\"image\"><img src=\"/static/img/placeholder-image.jpg\"></div><div class=\"content\"><div class=\"header\">{{event.name}}</div><div class=\"meta\"><span ng-if=\"event.location_name.trim() !== event.city.trim()\">{{event.location_name}}</span> <span><br ng-if=\"event.location_name.trim() !== event.city.trim() && event.location_name !== null && event.location_name.trim() !== \'\' && event.location_name.trim() !== event.street.trim()\"><span ng-if=\"event.street !== null && event.street.trim() !== \'\' && event.location_name.trim() !== event.street.trim()\">{{event.street}}<br></span> <span ng-if=\"event.city !== null && event.city.trim() !== \'\'\">{{event.city}} {{event.zipcode}} {{event.state}}</span></span><div class=\"description\"><div class=\"ui mini statistics\"><div class=\"statistic\" data-tooltip=\"Match Score\"><div class=\"value\"><i class=\"intersecticon icon\"></i></div><div class=\"label\">{{event.cumulative_match_score}}</div></div><div class=\"statistic\" data-tooltip=\"Total Friends\"><div class=\"value\"><i class=\"empty user usericon icon\"></i></div><div class=\"label\">{{event.friend_attendees_count}}</div></div></div></div></div><div class=\"extra content distance\">{{event.distance[0]}} {{event.distance[1]}} away</div></div></a></div><three-bounce-spinner class=\"page-spinner-bar\" ng-show=\"eventsfeed.loadingMore\"></three-bounce-spinner></div>");
$templateCache.put("components/filter/matchfeedFilter.directive.html","<div id=\"FilterController\" class=\"{{filter.class}}\" ng-cloak=\"\"><h4 class=\"ui header\" ng-show=\"filter.class === \'desktopview\'\">FILTERS</h4><div class=\"ui fitted divider\" ng-show=\"filter.class === \'desktopview\'\"></div><div id=\"{{filter.id}}\" class=\"ui form\"><form name=\"filterForm\" id=\"filterForm\"><div class=\"field\"><label>Distance <span class=\"range\">{{filter.distanceValue}} {{filter.distanceUnit}}</span></label><rzslider rz-slider-always-show-bar=\"true\" rz-slider-hide-limit-labels=\"false\" rz-slider-model=\"filter.distanceValue\" rz-slider-floor=\"1\" rz-slider-ceil=\"10000\"></rzslider></div><div class=\"field\"><label>Age <span class=\"range\">{{filter.ageSlider.min}} &ndash; {{filter.ageSlider.max}}</span></label><rzslider rz-slider-hide-limit-labels=\"false\" rz-slider-floor=\"filter.ageSlider.floor\" rz-slider-ceil=\"filter.ageSlider.ceil\" rz-slider-model=\"filter.ageSlider.min\" rz-slider-high=\"filter.ageSlider.max\"></rzslider></div><div class=\"field\"><label class=\"\">Show</label></div><div class=\"field field-checkbox\"><uicheckbox value=\"m\" change=\"filter.toggleGender(value, checked)\" checked=\"{{filter.checkedmale}}\" type=\"toggle\" ng-model=\"filter.male\">Men</uicheckbox></div><div class=\"field field-checkbox\"><uicheckbox value=\"f\" change=\"filter.toggleGender(value, checked)\" checked=\"{{filter.checkedfemale}}\" type=\"toggle\" ng-model=\"filter.female\">Women</uicheckbox></div><div class=\"field\"><label class=\"\">Order By</label></div><div class=\"field\"><select class=\"persiceselect\" ng-change=\"filter.hasChanges()\" ng-options=\"item.value as item.name for item in filter.orderByValues\" ng-model=\"filter.orderBy\"></select></div><div class=\"field keywords-label\"><label class=\"\">Keywords</label></div><div class=\"field\" ng-show=\"filter.showFilterMessage\"><label><div class=\"ui small negative message\"><p>{{filter.filtermessage}}</p></div></label></div><div class=\"field\"><div class=\"ui action input\"><input ng-minlength=\"3\" type=\"text\" placeholder=\"Enter keyword\" ng-enter=\"filter.addKeyword(filter.newKeyword)\" ng-model=\"filter.newKeyword\"> <button ng-click=\"filter.addKeyword(filter.newKeyword)\" class=\"ui icon button\"><i class=\"plus icon\"></i></button></div></div><a ng-click=\"filter.removeKeyword($index)\" href=\"\" class=\"item\" ng-repeat=\"keyword in filter.myKeywords track by $index\"><div class=\"content\"><div class=\"header\"><i class=\"circle remove icon\"></i> {{keyword}}</div></div></a><div class=\"ui divider\"></div><a href=\"\" class=\"button ui submit green\" ng-class=\"{\'disabled\': !filter.changed}\" ng-click=\"filter.refreshMatchFeed()\" role=\"button\">Update</a></form></div></div>");
$templateCache.put("components/filterEvents/filterEvents.template.html","<div id=\"FilterController\" class=\"{{filter.class}}\" ng-cloak=\"\"><h4 class=\"ui header\" ng-show=\"filter.class === \'desktopview\'\">FILTERS</h4><div class=\"ui fitted divider\" ng-show=\"filter.class === \'desktopview\'\"></div><div id=\"{{filter.id}}\" class=\"ui form\"><form name=\"filterForm\" id=\"filterForm\"><div class=\"field\"><label>Distance <span class=\"range\">{{filter.distanceValue}} {{filter.distanceUnit}}</span></label><rzslider rz-slider-always-show-bar=\"true\" rz-slider-hide-limit-labels=\"false\" rz-slider-model=\"filter.distanceValue\" rz-slider-floor=\"1\" rz-slider-ceil=\"10000\"></rzslider></div><div class=\"field\"><label class=\"\">Order By</label></div><div class=\"field\"><select class=\"persiceselect\" ng-change=\"filter.hasChanges()\" ng-options=\"item.value as item.name for item in filter.orderByValues\" ng-model=\"filter.orderBy\"></select></div><div class=\"field keywords-label\"><label class=\"\">Keywords</label></div><div class=\"field\" ng-show=\"filter.showFilterMessage\"><label><div class=\"ui small negative message\"><p>{{filter.filtermessage}}</p></div></label></div><div class=\"field\"><div class=\"ui action input\"><input ng-minlength=\"3\" type=\"text\" placeholder=\"Enter keyword\" ng-enter=\"filter.addKeyword(filter.newKeyword)\" ng-model=\"filter.newKeyword\"> <button ng-click=\"filter.addKeyword(filter.newKeyword)\" class=\"ui icon button\"><i class=\"plus icon\"></i></button></div></div><a ng-click=\"filter.removeKeyword($index)\" href=\"\" class=\"item\" ng-repeat=\"keyword in filter.myKeywords track by $index\"><div class=\"content\"><div class=\"header\"><i class=\"circle remove icon\"></i> {{keyword}}</div></div></a><div class=\"ui divider\"></div><a href=\"\" class=\"button ui submit green\" ng-class=\"{\'disabled\': !filter.changed}\" ng-click=\"filter.refreshEventsFeed()\" role=\"button\">Update</a></form></div></div>");
$templateCache.put("components/matchfeedprofile/matchfeedprofile.template.html","<div class=\"ui grid\" ng-cloak=\"\"><div class=\"row\"><div class=\"wide column\"><div ng-if=\"userprofile.total > 0\"><three-bounce-spinner ng-show=\"userprofile.loadingFeed\" class=\"ui inverted dimmer transition visible active\"></three-bounce-spinner><div ng-show=\"!showDimmer\"><div class=\"dimmable\"><h2 class=\"ui dividing header\" id=\"desktopmatchheader\" ng-if=\"userprofile.showfullprofile\">{{ userprofile.user.first_name }}, {{ userprofile.user.age }}<div class=\"action-header\"><div ng-click=\"userprofile.cancelMatchDesktop()\" class=\"ui circular icon negative button\"><i class=\"remove icon\"></i></div><div ng-click=\"userprofile.confirmMatchDesktop()\" class=\"ui circular icon positive button\"><i class=\"check icon\"></i></div></div><div class=\"sub header\">{{userprofile.user.distance[0]}} {{userprofile.user.distance[1]}}<ng-include src=\"\'components/profile/statistics-horizontal.tpl.html\'\"></ng-include></div></h2><div class=\"ui basic segment\" id=\"matchfeedheader-slider\" ng-if=\"userprofile.showfullprofile\"><ng-include src=\"\'components/profile/headerphotoslider.tpl.html\'\"></ng-include></div><div class=\"header segment\" id=\"matched-profile-header\" ng-hide=\"userprofile.showfullprofile\"><div class=\"ui basic segment\"><div ng-click=\"userprofile.changeTopMenu()\" ng-show=\"userprofile.photosSlider[0].cropped_photo === \'\'\" class=\"ui circular middle aligned left floated small image img-bounding-box\" style=\"background-image: url(\'{{userprofile.photosSlider[0].photo}}\');\"></div><div ng-click=\"userprofile.changeTopMenu()\" ng-show=\"userprofile.photosSlider[0].cropped_photo !== \'\'\" class=\"ui circular middle aligned left floated small image img-bounding-box\" style=\"background-image: url(\'{{userprofile.photosSlider[0].cropped_photo}}\');\"></div><h2 ng-click=\"userprofile.changeTopMenu()\" class=\"ui header\">{{ userprofile.user.first_name }}, {{ userprofile.user.age }}<div class=\"sub header\">{{userprofile.user.distance[0]}} {{userprofile.user.distance[1]}}</div></h2><ng-include src=\"\'components/profile/statistics.tpl.html\'\"></ng-include></div></div><div class=\"body segment\" id=\"matched-profile-body\" ng-click=\"userprofile.changeTopMenu()\"><div class=\"ui attached segment\" ng-show=\"userprofile.showfullprofile\" id=\"mobilematchheader\"><h3 class=\"ui left floated header\">{{ userprofile.user.first_name }}, {{ userprofile.user.age }}</h3><h5 class=\"ui right floated header\">{{userprofile.user.distance[0]}} {{userprofile.user.distance[1]}}</h5><br><ng-include src=\"\'components/profile/statistics-horizontal.tpl.html\'\"></ng-include></div><div class=\"ui attached segment\"><ng-include src=\"\'components/profile/profilebody.tpl.html\'\"></ng-include></div></div><div class=\"footer segment\" id=\"matched-profile-footer\" ng-hide=\"userprofile.showfullprofile || userprofile.total === 0\"><div class=\"ui grid one column aligned center\"><div class=\"row\"><div class=\"column\"><div class=\"ui labeled icon menu\"><a href=\"\" ng-click=\"userprofile.cancelMatch()\" class=\"item\" id=\"left_button\"><i class=\"remove red circle icon\"></i></a> <a href=\"\" ng-click=\"userprofile.confirmMatch()\" class=\"item\" id=\"accept_button\"><i class=\"check green circle icon\"></i></a></div></div></div></div><br></div></div></div></div><div class=\"body segment\" ng-show=\"userprofile.total === 0 && !userprofile.loadingFeed\"><div class=\"ui info message\"><div class=\"header\">Sorry. Currently you don\'t have any matches.</div><p>Add more information to your profile. <a class=\"ui icon mini button blue\" ui-sref=\"myprofile\"><i class=\"angle double right icon\"></i></a></p><p>Adjust your match filter to be less restrictive. <a class=\"ui icon mini button blue\" id=\"showFilter\" href=\"\"><i class=\"angle double right icon\"></i></a></p></div></div></div></div></div><page-dimmer ng-model=\"userprofile.showDimmer\" show=\"true\"><h1 class=\"ui header\"><img src=\"/static/appFrontend/dist/assets/images/logo/app-logo-big.png\" class=\"ui medium image centered\" alt=\"\"></h1><h2 class=\"ui header\">Locating people with similar goals...</h2><fading-circle-spinner></fading-circle-spinner></page-dimmer><script>\n\'use strict\';\n\n$(\'.right.sidebar.matchfeedfilter\')\n    .sidebar(\'attach events\', \'#showFilter\', \'show\');\n$(\'#showFilter\')\n    .removeClass(\'disabled\');\n</script>");
$templateCache.put("components/modal/modalcreate.html","<div class=\"ui modal small centeraligned\" id=\"createEventsModal\"><div class=\"header\">Create Event <i class=\"close icon\" ng-click=\"singleevent.closeEventModal()\"></i></div><div class=\"content\"><ng-include src=\"\'components/event/event.tpl.html\'\"></ng-include></div><div class=\"actions\"><div class=\"ui green labeled icon right button\" ng-click=\"singleevent.saveEvent()\">Create <i class=\"plus circle icon\"></i></div></div></div>");
$templateCache.put("components/modal/modalview.html","<div class=\"ui modal centeraligned\" ng-class=\"viewevent.getActiveClass()\" id=\"{{viewevent.modalId}}\"><div class=\"header\" ng-class=\"{\'leftalign\': viewevent.selection === \'invitations\' || viewevent.selection === \'attendees\'}\">{{viewevent.header}} <i class=\"close icon\" ng-click=\"viewevent.closeEventModal()\"></i> <i ng-if=\"viewevent.selection === \'invitations\'\" class=\"left chevron icon\" ng-click=\"viewevent.closeInvitations()\"></i> <i ng-if=\"viewevent.selection === \'attendees\'\" class=\"left chevron icon\" ng-click=\"viewevent.closeAttendees()\"></i></div><div class=\"content\"><div class=\"switch-content\" ng-switch=\"\" on=\"viewevent.selection\"><div ng-switch-when=\"view\"><ng-include src=\"\'components/event/eventview.tpl.html\'\"></ng-include></div><div ng-switch-when=\"edit\"><ng-include src=\"\'components/event/eventedit.tpl.html\'\"></ng-include></div><div ng-switch-when=\"invitations\"><ng-include src=\"\'components/event/eventinvitations.tpl.html\'\"></ng-include></div><div ng-switch-when=\"attendees\"><ng-include src=\"\'components/event/eventattendees.tpl.html\'\"></ng-include></div></div></div><div class=\"actions\"><div ng-if=\"viewevent.isHost && viewevent.selection === \'view\'\" class=\"ui green labeled icon right button\" ng-click=\"viewevent.editEvent()\">Edit <i class=\"edit icon\"></i></div><div ng-class=\"{\'loading\': viewevent.loadingSave}\" ng-if=\"viewevent.selection === \'edit\'\" class=\"ui green labeled icon right button\" ng-click=\"viewevent.saveEvent()\">Save <i class=\"save icon\"></i></div><div id=\"deleteEventButton\" ng-if=\"viewevent.selection === \'edit\'\" class=\"ui red icon labeled left button\" ng-click=\"viewevent.editEvent()\">Delete <i class=\"remove icon\"></i></div><div ng-if=\"viewevent.selection === \'invitations\'\" class=\"ui green right labeled button\" ng-class=\"{\'disabled\': viewevent.counterNewInvites === 0}\" ng-click=\"viewevent.sendInvites()\">Done</div></div></div>");
$templateCache.put("components/profile/headerphotoslider.tpl.html","<div class=\"pagination-container\"><div id=\"PhotoSlider\" ng-if=\"userprofile.photosSlider.length > 0\"><flex-slider slider-id=\"photoSlider\" touch=\"true\" slideshow=\"false\" slide=\"item in userprofile.photosSlider | orderBy:\'order\' track by $index\"><li><img ng-click=\"userprofile.nextImage()\" ng-show=\"item.cropped_photo === \'\'\" class=\"ui image\" ng-src=\"{{item.photo}}\"> <img ng-click=\"userprofile.nextImage()\" ng-show=\"item.cropped_photo !== \'\'\" class=\"ui image\" ng-src=\"{{item.cropped_photo}}\"></li></flex-slider></div></div>");
$templateCache.put("components/profile/profilebody.tpl.html","<h4 class=\"ui header\" ng-if=\"userprofile.user.goals.length > 0 || userprofile.type === \'loggedInUser\'\">Goals</h4><div class=\"ui list\" ng-if=\"userprofile.type === \'matchfeed\'\"><div ng-hide=\"!userprofile.showfullprofile && $index > 2\" class=\"item\" ng-repeat=\"goal in userprofile.user.goals | orderBy:[\'-match\'] track by $index\"><i class=\"icon\" ng-class=\"{\'stop smallicon\': goal.match === 1, \'empty smallicon\': goal.match === 0 }\"></i><div class=\"content\"><div class=\"description\">{{ goal.value }}</div></div></div></div><div class=\"ui list\" ng-if=\"userprofile.type === \'friend\'\"><div ng-hide=\"!userprofile.showfullprofile\" class=\"item\" ng-repeat=\"goal in userprofile.user.goals | orderBy:[\'-match\'] track by $index\"><i class=\"icon\" ng-class=\"{\'stop smallicon\': goal.match === 1, \'empty smallicon\': goal.match === 0 }\"></i><div class=\"content\"><div class=\"description\">{{ goal.value }}</div></div></div></div><div class=\"ui list\" ng-if=\"userprofile.type === \'loggedInUser\'\"><div class=\"item\" ng-repeat=\"goal in userprofile.user.goals track by $index\"><i class=\"icon empty\"></i><div class=\"content\"><div class=\"description\">{{ goal.subject }}</div></div></div><p ng-if=\"userprofile.user.goals.length === 0\">No goals yet.</p></div><h4 class=\"ui header\" ng-if=\"userprofile.user.offers.length > 0 || userprofile.type === \'loggedInUser\'\">Offers</h4><div class=\"ui list\" ng-if=\"userprofile.type === \'matchfeed\'\"><div ng-hide=\"!userprofile.showfullprofile && $index > 2\" class=\"item\" ng-repeat=\"offer in userprofile.user.offers | orderBy:[\'-match\'] track by $index\"><i class=\"icon\" ng-class=\"{\'stop smallicon\': offer.match === 1, \'empty smallicon\': offer.match === 0 }\"></i><div class=\"content\"><div class=\"description\">{{ offer.value }}</div></div></div></div><div class=\"ui list\" ng-if=\"userprofile.type === \'friend\'\"><div ng-hide=\"!userprofile.showfullprofile\" class=\"item\" ng-repeat=\"offer in userprofile.user.offers | orderBy:[\'-match\'] track by $index\"><i class=\"icon\" ng-class=\"{\'stop smallicon\': offer.match === 1, \'empty smallicon\': offer.match === 0 }\"></i><div class=\"content\"><div class=\"description\">{{ offer.value }}</div></div></div></div><div class=\"ui list\" ng-show=\"userprofile.type === \'loggedInUser\'\"><div class=\"item\" ng-repeat=\"offer in userprofile.user.offers track by $index\"><i class=\"icon empty\"></i><div class=\"content\"><div class=\"description\">{{ offer.subject }}</div></div></div><p ng-if=\"userprofile.user.offers.length === 0\">No offers yet.</p></div><h4 class=\"ui header\" ng-if=\"userprofile.user.about_me.length > 0 && userprofile.showfullprofile\">About</h4><div class=\"ui list\" ng-if=\"userprofile.user.about_me.length > 0 && userprofile.showfullprofile\"><div class=\"item\"><i class=\"empty icon\"></i><div class=\"content\"><div class=\"description\"><span>{{userprofile.user.about_me}}</span></div></div></div></div><h4 class=\"ui header\" ng-if=\"userprofile.user.interests.length > 0 || userprofile.type === \'loggedInUser\'\">Activities &amp; Interests</h4><div class=\"ui list\" ng-if=\"userprofile.type === \'matchfeed\'\"><div class=\"item\" ng-hide=\"!userprofile.showfullprofile && $index > 2\" ng-repeat=\"interest in userprofile.user.interests | orderBy:[\'-match\'] track by $index\"><i class=\"icon\" ng-class=\"{\'stop smallicon\': interest.match === 1, \'empty smallicon\': interest.match === 0 }\"></i><div class=\"content\"><div class=\"description\">{{ interest.value }}</div></div></div></div><div class=\"ui list\" ng-if=\"userprofile.type === \'friend\'\"><div class=\"item\" ng-hide=\"!userprofile.showfullprofile\" ng-repeat=\"interest in userprofile.user.interests | orderBy:[\'-match\'] track by $index\"><i class=\"icon\" ng-class=\"{\'stop smallicon\': interest.match === 1, \'empty smallicon\': interest.match === 0 }\"></i><div class=\"content\"><div class=\"description\">{{ interest.value }}</div></div></div></div><div class=\"ui list\" ng-show=\"userprofile.type === \'loggedInUser\'\"><div class=\"item\" ng-repeat=\"interest in userprofile.user.interests | limitTo:5 track by $index\"><i class=\"icon empty\"></i><div class=\"content\"><div class=\"description\">{{ interest.interest_subject }}</div></div></div><p ng-if=\"userprofile.user.interests.length === 0\">No interests yet.</p></div><h4 ng-if=\"userprofile.showfullprofile && userprofile.user.friends.length > 0\" class=\"ui header\">Mutual Friends</h4><div ng-if=\"userprofile.showfullprofile && userprofile.user.friends.length > 0\" class=\"ui selection list\"><a ui-sref=\"friendprofile({ userId: userprofile.friend.user_id })\" class=\"item\" ng-repeat=\"friend in userprofile.user.friends track by $index\"><img class=\"ui avatar image\" ng-src=\"http://graph.facebook.com/{{ friend.facebook_id }}/picture\"><div class=\"content\"><div class=\"header\">{{ friend.first_name }}</div></div></a></div><h4 ng-if=\"userprofile.showfullprofile && userprofile.user.facebookfriends.length > 0\" class=\"ui header\">Mutual Facebook Friends ({{ userprofile.user.facebookfriends.length }})</h4><div ng-if=\"userprofile.showfullprofile && userprofile.user.facebookfriends.length > 0\" class=\"ui selection list\"><div class=\"item\" ng-repeat=\"friend in userprofile.user.facebookfriends track by $index\"><img class=\"ui avatar image\" ng-src=\"http://graph.facebook.com/{{ friend.facebook_id }}/picture\"><div class=\"content\"><div class=\"header\">{{ friend.first_name }}</div></div></div></div><h4 ng-if=\"showfullprofile && userprofile.user.twitterfriends.length > 0\" class=\"ui header\">Mutual Twitter Friends ({{ userprofile.user.twitterfriends.length }})</h4><div ng-if=\"showfullprofile && userprofile.user.twitterfriends.length > 0\" class=\"ui selection list\"><div class=\"item\" ng-repeat=\"friend in userprofile.user.twitterfriends track by $index\"><img class=\"ui avatar image\" ng-src=\"{{friend.profile_image_url}}\"><div class=\"content\"><div class=\"header\">{{ friend.name }}</div></div></div></div><h4 ng-if=\"showfullprofile && userprofile.user.twitterfollowers.length > 0\" class=\"ui header\">Mutual Twitter Followers ({{ userprofile.user.twitterfollowers.length }})</h4><div ng-if=\"showfullprofile && userprofile.user.twitterfollowers.length > 0\" class=\"ui selection list\"><div class=\"item\" ng-repeat=\"friend in userprofile.user.twitterfollowers track by $index\"><img class=\"ui avatar image\" ng-src=\"{{friend.profile_image_url}}\"><div class=\"content\"><div class=\"header\">{{ friend.name }}</div></div></div></div><h4 ng-if=\"showfullprofile && userprofile.user.linkedinconnections.length > 0\" class=\"ui header\">Mutual LinkedIn Connections ({{ userprofile.user.linkedinconnections.length }})</h4><div ng-if=\"showfullprofile && userprofile.user.linkedinconnections.length > 0\" class=\"ui selection list\"><div class=\"item\" ng-repeat=\"friend in userprofile.user.linkedinconnections track by $index\"><img class=\"ui avatar image\" ng-src=\"{{friend.pictureUrls.values[0]}}\"><div class=\"content\"><div class=\"header\">{{ friend.firstName }}</div></div></div></div><h4 class=\"ui header\" ng-if=\"userprofile.user.likes.length > 0 || userprofile.type === \'loggedInUser\'\">Likes</h4><div class=\"ui list likes\" ng-if=\"userprofile.type === \'matchfeed\'\"><div class=\"item\" ng-hide=\"!userprofile.showfullprofile && $index > 2\" ng-repeat=\"like in userprofile.user.likes | orderBy:[\'-match\'] track by $index\"><i class=\"icon\" ng-class=\"{\'stop smallicon\': like.match === 1, \'empty smallicon\': like.match === 0 }\"></i><div class=\"content\"><div class=\"description\">{{ like.value }}</div></div></div></div><div class=\"ui list likes\" ng-if=\"userprofile.type === \'friend\'\"><div class=\"item\" ng-hide=\"!userprofile.showfullprofile\" ng-repeat=\"like in userprofile.user.likes | orderBy:[\'-match\'] track by $index\"><i class=\"icon\" ng-class=\"{\'stop smallicon\': like.match === 1, \'empty smallicon\': like.match === 0 }\"></i><div class=\"content\"><div class=\"description\">{{ like.value }}</div></div></div></div><div class=\"ui list likes\" ng-show=\"userprofile.type === \'loggedInUser\'\"><div class=\"item\" ng-repeat=\"like in userprofile.user.likes | limitTo:5 track by $index\"><i class=\"icon empty\"></i><div class=\"content\"><div class=\"description\">{{ like.name }}</div></div></div><p ng-if=\"userprofile.user.likes.length == 0\">No likes yet.</p></div><h4 class=\"ui header socialprofileheader\" ng-if=\"(userprofile.social.linkedin !== \'\' || userprofile.social.twitter !== \'\' || userprofile.social.facebook !== \'\') && userprofile.showfullprofile\">Social Accounts</h4><br ng-if=\"userprofile.social.linkedin.length > 0\"><a href=\"{{ userprofile.social.linkedin }}\" target=\"_new\" class=\"ui social icon fluid linkedin labeled button\" ng-if=\"userprofile.social.linkedin.length > 0 && userprofile.showfullprofile\"><i class=\"linkedin icon\"></i> {{userprofile.user.first_name}} <i class=\"check circle icon right\"></i></a><br ng-if=\"userprofile.social.twitter.length > 0\"><a href=\"https://twitter.com/{{ userprofile.social.twitter }}\" target=\"_new\" class=\"ui social fluid icon twitter labeled button\" ng-if=\"userprofile.social.twitter.length > 0 && userprofile.showfullprofile\"><i class=\"twitter icon\"></i> {{userprofile.social.twitter}} <i class=\"check circle icon right\"></i></a><br ng-if=\"userprofile.social.facebook.length > 0\"><a href=\"{{ userprofile.social.facebook }}\" class=\"ui social icon facebook labeled fluid button\" ng-if=\"userprofile.social.facebook.length > 0 && userprofile.showfullprofile\"><i class=\"facebook icon\"></i> {{userprofile.user.first_name}} <i class=\"lock icon right\"></i></a>");
$templateCache.put("components/profile/statistics-horizontal.tpl.html","<div class=\"ui mini horizontal statistics\"><div class=\"statistic\" tooltips=\"\" tooltip-speed=\"fast\" tooltip-title=\"Match score\"><div class=\"value\"><i class=\"intersecticon icon\"></i></div><div class=\"label\">{{userprofile.totalmatchingcount}}</div></div><div class=\"statistic\" tooltips=\"\" tooltip-speed=\"fast\" tooltip-title=\"Mutual friends\"><div class=\"value\"><i class=\"empty user usericon icon\"></i></div><div class=\"label\">{{userprofile.totalfriendscount}}</div></div></div>");
$templateCache.put("components/profile/statistics.tpl.html","<div class=\"ui mini statistics\"><div class=\"statistic\" tooltips=\"\" tooltip-speed=\"fast\" tooltip-title=\"Match score\"><div class=\"value\"><i class=\"intersecticon icon\"></i></div><div class=\"label\">{{userprofile.totalmatchingcount}}</div></div><div class=\"statistic\" tooltips=\"\" tooltip-speed=\"fast\" tooltip-title=\"Mutual friends\"><div class=\"value\"><i class=\"empty user usericon icon\"></i></div><div class=\"label\">{{userprofile.totalfriendscount}}</div></div></div>");
$templateCache.put("components/userprofile/userprofile.template.html","<div class=\"ui grid\" ng-cloak=\"\"><div class=\"row\"><div class=\"wide column\"><div class=\"header segment with-menu\" id=\"{{userprofile.header}}\"><ng-include src=\"\'components/profile/headerphotoslider.tpl.html\'\"></ng-include></div><div class=\"body segment\" id=\"{{userprofile.body}}\"><div class=\"ui top attached segment\" id=\"userProfileName\"><h3 class=\"ui left floated header\">{{ userprofile.user.first_name }}<span ng-hide=\"userprofile.user.first_name === \'\'\">,</span> {{ userprofile.user.age }}</h3><h5 id=\"editbutton\" ng-if=\"userprofile.type === \'loggedInUser\'\" class=\"ui right floated header\"><a ui-sref=\"editmyprofile\" class=\"ui tiny button blue\">Edit</a></h5><h5 id=\"editbutton\" ng-if=\"userprofile.type === \'friend\'\" class=\"ui right floated header\">{{ userprofile.user.distance[0] }} {{ userprofile.user.distance[1] }}</h5></div><div class=\"ui attached segment\"><ng-include src=\"\'components/profile/profilebody.tpl.html\'\"></ng-include></div></div></div></div></div>");}]);