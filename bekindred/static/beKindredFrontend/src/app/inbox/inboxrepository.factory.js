(function() {
  'use strict';
  angular
    .module('beKindred')
    .factory('InboxRepository', InboxRepository);

  /**
   * class InboxRepository
   * classDesc Service for Inbox: messages and counter for unread messages
   * @ngInject
   */
  function InboxRepository(InboxFactory, $log, $filter, $rootScope) {


    var service = {
      getInboxMessages: getInboxMessages,
      getUnreadMessagesCounter: getUnreadMessagesCounter,
      getAllMessages: getAllMessages,
      unreadMessagesCounter: 0,
      inboxMessages: []
    };
    return service;

    function getInboxMessages() {
      $log.info('fetching inbox');
      return InboxFactory.query({
        format: 'json'
      }).$promise.then(getInboxMessagesComplete, getInboxMessagesFailed);

      function getInboxMessagesComplete(response) {
        service.inboxMessages.splice(0, service.inboxMessages.length);
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
        $rootScope.$broadcast('refreshInboxMessages');
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

  }

})();