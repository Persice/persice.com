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
    function EventChatController($scope, USER_ID, eventId, USER_FACEBOOK_ID, EventChatFactory, $state, $rootScope, $log, $window, $q, moment, $filter, $sce, $timeout, $resource) {
        var vm = this;


        vm.newmessage = '';

        vm.messages = [];

        vm.noMessages = false;

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
            if (vm.sendingMessage) {
                return;
            }

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
                        vm.noMessages = false;
                        newMessage.left = true;
                        newMessage.sender = success.sender;
                        newMessage.photo = userPhoto;
                        newMessage.first_name = success.first_name;
                        var localDate = $filter('amDateFormat')(success.sent_at, 'dddd, MMMM D, YYYY h:mm a');
                        newMessage.sent_at = localDate;

                        vm.messages.unshift(newMessage);
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
            vm.noMessages = false;
            vm.loadingMessages = true;
            vm.status.loaded = false;
            EventChatFactory.query({
                event: eventId,
                limit: 20,
                offset: 0
            }).$promise.then(function(response) {
                var responseMessages = response.objects;
                vm.next = response.meta.next;
                vm.status.loaded = true;

                if (responseMessages.length === 0) {
                    vm.noMessages = true;
                }

                for (var obj in responseMessages) {
                    var localDate = $filter('amDateFormat')(responseMessages[obj].sent_at, 'dddd, MMMM D, YYYY h:mm a');

                    if (responseMessages[obj].sender === vm.sender) {
                        vm.messages.push({
                            body: $sce.trustAsHtml(responseMessages[obj].body),
                            sender: responseMessages[obj].sender,
                            photo: '//graph.facebook.com/' + responseMessages[obj].facebook_id + '/picture?type=square',
                            first_name: responseMessages[obj].first_name,
                            sent_at: localDate,
                            left: true
                        });
                    } else {
                        vm.messages.push({
                            body: $sce.trustAsHtml(responseMessages[obj].body),
                            sender: responseMessages[obj].sender,
                            photo: '//graph.facebook.com/' + responseMessages[obj].facebook_id + '/picture?type=square',
                            first_name: responseMessages[obj].first_name,
                            sent_at: localDate,
                            left: false
                        });
                    }
                }


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

            var deferred = $q.defer();

            if (vm.next === null) {
                deferred.reject();
                return deferred.promise;
            }

            if (!vm.status.loading) {
                vm.status.loading = true;
                $timeout(function() {
                    EventChatFactory.query({
                        event: eventId,
                        offset: vm.nextOffset,
                        limit: 10
                    }).$promise.then(function(response) {
                        var responseMessages = response.objects;
                        vm.next = response.meta.next;
                        vm.nextOffset += 10;

                        for (var obj in responseMessages) {
                            var localDate = $filter('amDateFormat')(responseMessages[obj].sent_at, 'dddd, MMMM D, YYYY h:mm a');

                            if (responseMessages[obj].sender === vm.sender) {
                                vm.messages.push({
                                    body: $sce.trustAsHtml(responseMessages[obj].body),
                                    sender: responseMessages[obj].sender,
                                    photo: '//graph.facebook.com/' + responseMessages[obj].facebook_id + '/picture?type=square',
                                    first_name: responseMessages[obj].first_name,
                                    sent_at: localDate,
                                    left: true
                                });
                            } else {
                                vm.messages.push({
                                    body: $sce.trustAsHtml(responseMessages[obj].body),
                                    sender: responseMessages[obj].sender,
                                    photo: '//graph.facebook.com/' + responseMessages[obj].facebook_id + '/picture?type=square',
                                    first_name: responseMessages[obj].first_name,
                                    sent_at: localDate,
                                    left: false
                                });
                            }
                        }
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

        // listen for the event when new message arrives
        $rootScope.$on('receivedEventChatMessage', function(event, data) {
            var jsonData = JSON.parse(data);
            if (jsonData.sender !== vm.sender && vm.event === jsonData.event && $state.is('event.chat')) {

                $log.info('new event chat message via websocket');

                var localDate = $filter('amDateFormat')(jsonData.sent_at, 'dddd, MMMM D, YYYY h:mm a');
                vm.receivedMessage = {
                    body: $sce.trustAsHtml(jsonData.body),
                    sender: jsonData.sender,
                    photo: '',
                    sent_at: localDate,
                    first_name: '',
                    left: false
                };

                var Sender = $resource(jsonData.sender);

                Sender.get().$promise.then(function(response) {
                    vm.receivedMessage.photo = '//graph.facebook.com/' + response.facebook_id + '/picture?type=square';
                    vm.receivedMessage.first_name = response.first_name;
                    vm.messages.unshift(vm.receivedMessage);

                });


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
