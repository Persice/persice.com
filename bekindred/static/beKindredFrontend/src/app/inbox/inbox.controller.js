(function() {
  'use strict';

  angular
    .module('beKindred')
    .controller('InboxController', InboxController);

  /**
   * class InboxController
   * classDesc Controller for Inbox view
   * @ngInject
   */
  function InboxController($scope, $rootScope, $log, InboxRepository) {
    var vm = this;

    vm.allMessages = [];
    vm.loadInbox = loadInbox;
    vm.loadMore = loadMore;
    vm.loadingMessages = false;
    vm.loadingMore = false;
    vm.q = '';

    vm.loadInbox();

    $rootScope.$on('refreshInboxMessages', function() {
      vm.loadInbox();
    });

    function loadInbox() {
      vm.allMessages = InboxRepository.getAllMessages();
    }

    function loadMore() {
      // vm.allMessages = InboxRepository.getMoreMessages();
    }



  }


})();