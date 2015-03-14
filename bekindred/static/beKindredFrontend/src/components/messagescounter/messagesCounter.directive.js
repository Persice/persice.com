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
  function MessagesController($scope, InboxRepository, $rootScope, $log) {
    var vm = this;
    vm.counter = 0;

    vm.refreshCounter = refreshCounter;

    $rootScope.$on('refreshInboxMessages', function(event, data) {
      vm.refreshCounter();
    });

    vm.refreshCounter();

    function refreshCounter() {
      vm.counter = InboxRepository.getUnreadMessagesCounter();
    }



  }



})();