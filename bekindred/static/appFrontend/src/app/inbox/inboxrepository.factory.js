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

})();