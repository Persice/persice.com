(function() {
    'use strict';

    angular
        .module('persice')
        .controller('EventChatController', EventChatController);

    /**
     * class EventChatController
     * classDesc chat for event
     * @ngInject
     */
    function EventChatController($scope, USER_ID, eventId, USER_FACEBOOK_ID, EventChatFactory, $state, $rootScope, $log, $window, $q, moment, $filter, $sce, $timeout) {
        var vm = this;


        vm.newmessage = '';

        vm.messages = [];

        vm.loadingMessages = false;
        vm.loadingOlderMessages = false;
        vm.sendingMessage = false;

        vm.sender = '/api/v1/auth/user/' + USER_ID + '/';
        vm.event = '/api/v1/event/' + eventId + '/';

        var userPhoto = '//graph.facebook.com/' + USER_FACEBOOK_ID + '/picture?type=square';

        vm.status = {
            loading: false,
            loaded: false
        };

        vm.nextOffset = 20;
        vm.next = null;

        vm.sendMessage = sendMessage;
        vm.getMessages = getMessages;
        vm.loadMoreChat = loadMoreChat;

        $scope.eventpage.header = 'Event Chat';

        $scope.$on('goBackEvents', function() {
            $state.go('event.details', {
                eventId: eventId
            });

        });

        vm.getMessages();


        function sendMessage() {

            if (vm.newmessage === '') {
                vm.sendingMessage = false;

            } else {

                vm.sendingMessage = true;
                var newMessage = {};
                newMessage = {
                    sender: vm.sender,
                    event: vm.event,
                    body: vm.newmessage
                };


                EventChatFactory.save({}, newMessage,
                    function(success) {
                        newMessage.left = true;
                        newMessage.sent_at = success.sent_at;
                        newMessage.sender = success.sender;
                        newMessage.photo = userPhoto;
                        var localDatePlain = $filter('amDateFormat')(newMessage.sent_at, 'L');
                        var localDate = $filter('amDateFormat')(newMessage.sent_at, 'dddd, MMMM D, YYYY');
                        var messageIndex = $filter('getIndexByProperty')('date', localDate, vm.messages);
                        newMessage.date = localDatePlain;

                        if (messageIndex === null) {
                            vm.messages.push({
                                date: localDate,
                                realDate: localDatePlain,
                                contents: []
                            });
                            messageIndex = vm.messages.length - 1;
                        }

                        vm.messages[messageIndex].contents.push(newMessage);
                        vm.newmessage = '';
                        $log.info('New chat message sent.');
                        vm.sendingMessage = false;
                        //scroll chat to top
                        $timeout(function() {
                            angular.element('#chat-conversation-content').filter(':not(:animated)').animate({
                                scrollTop: 0
                            }, 1500);
                        }, 100);

                    },
                    function(error) {
                        vm.sendingMessage = false;
                        $log.info(error);
                    });

            }

        }

        function getMessages() {
            vm.messages = [];
            vm.loadingMessages = true;
            vm.status.loaded = false;
            EventChatFactory.query({
                event_id: eventId,
                limit: 20,
                offset: 0
            }).$promise.then(function(response) {
                var responseMessages = response.objects;
                vm.next = response.meta.next;
                $filter('orderBy')(responseMessages, 'sent_at', true);

                vm.status.loaded = true;
                for (var obj in responseMessages) {
                    var localDate = $filter('amDateFormat')(responseMessages[obj].sent_at, 'dddd, MMMM D, YYYY');
                    var localDatePlain = $filter('amDateFormat')(responseMessages[obj].sent_at, 'L');

                    var messageIndex = $filter('getIndexByProperty')('date', localDate, vm.messages);

                    if (messageIndex === null) {
                        vm.messages.push({
                            date: localDate,
                            realDate: localDatePlain,
                            contents: []
                        });
                        messageIndex = vm.messages.length - 1;
                    }

                    //TODO put photo url from facebook_id

                    if (responseMessages[obj].sender === vm.sender) {
                        vm.messages[messageIndex].contents.push({
                            body: $sce.trustAsHtml(responseMessages[obj].body),
                            sender: responseMessages[obj].sender,
                            date: localDatePlain,
                            photo: userPhoto,
                            sent_at: responseMessages[obj].sent_at,
                            left: true
                        });
                    } else {
                        vm.messages[messageIndex].contents.push({
                            body: $sce.trustAsHtml(responseMessages[obj].body),
                            sender: responseMessages[obj].sender,
                            date: localDatePlain,
                            photo: userPhoto,
                            sent_at: responseMessages[obj].sent_at,
                            left: false
                        });
                    }
                    vm.messages[messageIndex].contents = $filter('orderBy')(vm.messages[messageIndex].contents, 'sent_at', true);
                }

                vm.messages = $filter('orderBy')(vm.messages, 'realDate');


                vm.loadingMessages = false;


            }, function(response) {
                vm.loadingMessages = false;
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                // error handler
                $log.error(message);

            });
        }

        function loadMoreChat() {

            $log.info('Loading more messages in chat');
            var deferred = $q.defer();

            if (vm.next === null) {
                deferred.reject();
                return deferred.promise;
            }

            if (!vm.status.loading) {
                vm.status.loading = true;
                $timeout(function() {
                    EventChatFactory.query({
                        event_id: eventId,
                        offset: vm.nextOffset,
                        limit: 10
                    }).$promise.then(function(response) {
                        var responseMessages = response.objects;
                        vm.next = response.meta.next;
                        $filter('orderBy')(responseMessages, 'sent_at', true);
                        vm.nextOffset += 10;

                        for (var obj in responseMessages) {
                            var localDate = $filter('amDateFormat')(responseMessages[obj].sent_at, 'dddd, MMMM D, YYYY');
                            var localDatePlain = $filter('amDateFormat')(responseMessages[obj].sent_at, 'L');

                            var messageIndex = $filter('getIndexByProperty')('date', localDate, vm.messages);

                            if (messageIndex === null) {
                                vm.messages.push({
                                    date: localDate,
                                    realDate: localDatePlain,
                                    contents: []
                                });
                                messageIndex = vm.messages.length - 1;
                            }


                            //TODO put photo url from facebook_id

                            if (responseMessages[obj].sender === vm.sender) {
                                vm.messages[messageIndex].contents.push({
                                    body: $sce.trustAsHtml(responseMessages[obj].body),
                                    sender: responseMessages[obj].sender,
                                    date: localDatePlain,
                                    photo: userPhoto,
                                    sent_at: responseMessages[obj].sent_at,
                                    left: true
                                });
                            } else {
                                vm.messages[messageIndex].contents.push({
                                    body: $sce.trustAsHtml(responseMessages[obj].body),
                                    sender: responseMessages[obj].sender,
                                    date: localDatePlain,
                                    photo: userPhoto,
                                    sent_at: responseMessages[obj].sent_at,
                                    left: false
                                });
                            }
                            vm.messages[messageIndex].contents = $filter('orderBy')(vm.messages[messageIndex].contents, 'sent_at', true);
                        }

                        vm.messages = $filter('orderBy')(vm.messages, 'realDate');

                        vm.status.loading = false;
                        vm.status.loaded = true;
                        deferred.resolve();
                    }, function(response) {
                        deferred.reject();
                        vm.status.loading = false;
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
        }

        //TODO
        // listen for the event when new message arrives
        $rootScope.$on('receivedEventChatMessage', function(event, data) {
            var jsonData = JSON.parse(data);

            if (jsonData.sender !== vm.sender) {

                $log.info('new event chat message via websocket');

                var localDate = $filter('amDateFormat')(jsonData.sent_at, 'dddd, MMMM D, YYYY');
                var localDatePlain = $filter('amDateFormat')(jsonData.sent_at, 'L');

                var messageIndex = $filter('getIndexByProperty')('date', localDate, $scope.messages);

                if (messageIndex === null) {
                    vm.messages.push({
                        date: localDate,
                        realDate: localDatePlain,
                        contents: []
                    });
                    messageIndex = vm.messages.length - 1;
                }



                vm.messages[messageIndex].contents.push({
                    body: $sce.trustAsHtml(jsonData.body),
                    sender: jsonData.sender,
                    photo: userPhoto,
                    date: localDatePlain,
                    sent_at: jsonData.sent_at,
                    left: false
                });


                vm.messages[messageIndex].contents = $filter('orderBy')(vm.messages[messageIndex].contents, 'sent_at', true);
                vm.messages = $filter('orderBy')(vm.messages, 'realDate');


                //scroll chat to top
                $timeout(function() {
                    angular.element('#chat-conversation-content').filter(':not(:animated)').animate({
                        scrollTop: 0
                    }, 1500);
                }, 100);

            }

        });



    }



})();
