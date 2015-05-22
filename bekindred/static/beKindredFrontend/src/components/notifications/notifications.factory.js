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
    function NotificationsRepository($log, $filter, $rootScope, $q) {

        var service = {
            total: 0,
            totalInbox: 0,
            totalConnections: 0,
            getTotal: getTotal,
            setTotalInbox: setTotalInbox,
            setTotalConnections: setTotalConnections,
        };
        return service;

        function setTotalConnections(value) {
            service.totalConnections = value;
            service.total = service.totalInbox + service.totalConnections;
        }

        function setTotalInbox(value) {
            service.totalInbox = value;
            service.total = service.totalInbox + service.totalConnections;
        }

        function getTotal() {
            return service.total;
        }



    }

})();