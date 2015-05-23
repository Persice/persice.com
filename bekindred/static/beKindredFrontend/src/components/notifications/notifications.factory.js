(function() {
    'use strict';
    angular
        .module('icebrak')
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

})();