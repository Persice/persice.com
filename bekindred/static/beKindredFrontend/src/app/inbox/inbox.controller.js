(function() {
    'use strict';

    angular
        .module('icebrak')
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


})();