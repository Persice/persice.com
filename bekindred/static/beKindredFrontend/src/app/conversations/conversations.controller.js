'use strict';

angular.module('icebrak')
    .controller('ConversationsCtrl', function($rootScope, notify, $resource, $window, $state, InboxRepository, myIoSocket, Connection, $q, $http, $scope, USER_ID, $log, $timeout, FRIEND, MessagesFactory, $filter, FriendsFactory) {

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
                        InboxRepository.getInboxMessages();

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
                    InboxRepository.getInboxMessages();
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


    });