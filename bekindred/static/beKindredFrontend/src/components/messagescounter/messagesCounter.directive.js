(function() {
  'use strict';

  /**
   * @desc display counter for new messages
   * @example <div messages-counter></div>
   */
  angular
    .module('beKindred')
    .directive('messagesCounter', messagesCounter);

  function messagesCounter() {
    var directive = {
      controller: MessagesController,
      controllerAs: 'messages',
      bindToController: true,
      scope: {

      },
      link: link,
      template: '{{messages.counter}}',
      restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {


    }



  }

  /**
   * @desc count new messages
   * @ngInject
   */
  function MessagesController($scope, InboxFactory, $rootScope, $log) {
    var vm = this;
    vm.counter = 0;

    vm.countNewMessages = countNewMessages;

    $rootScope.$on('refreshUnreadMessages', function(event, data) {
      vm.countNewMessages();
    });

    vm.countNewMessages();

    function countNewMessages() {
      InboxFactory.query({
        format: 'json'
      }).$promise.then(function(data) {
        var receivedMessages = data.objects;
        var i = 0;
        for (var obj in receivedMessages) {
          if (receivedMessages[obj].read_at === null && receivedMessages[obj].last_message_body !== null) {
            i++;
          }
        }
        vm.counter = i;
        // $log.info('Messages counter: ' + vm.counter);
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



})();