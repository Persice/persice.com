(function() {
    'use strict';

    angular
        .module('persice')
        .controller('InboxController', InboxController);

    /**
     * class InboxController
     * classDesc Controller for Inbox view
     * @ngInject
     */
    function InboxController($scope, $rootScope, $log, InboxRepository, $q, EventsFactory, EventChatFactory, USER_ID, $filter) {
        var vm = this;

        vm.allMessages = [];
        vm.eventMessages = [];
        vm.loadInbox = loadInbox;
        vm.loadMore = loadMore;
        vm.refresh = refresh;
        vm.getEventMessages = getEventMessages;
        vm.loadingMessages = false;
        vm.loadingMore = false;
        vm.q = '';

        vm.refresh();
        vm.getEventMessages();

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

        function getEventMessages() {
            vm.eventMessages = [];
            EventsFactory.query({
                format: 'json',
                limit: 1000,
                offset: 0
            }).$promise.then(getEventsComplete, getEventsFailed);

            function getEventsComplete(response) {

                vm.events = response.objects;


                var receivedMessages = response.objects;
                var i = 0;
                for (var obj in vm.events) {
                    var resEvent = vm.events[obj];
                    var rsvpYes = false;
                    for (var i in vm.events[obj].members) {
                        if (vm.events[obj].members[i].rsvp === 'yes' && vm.events[obj].members[i].user === '/api/v1/auth/user/' + USER_ID + '/') {
                            rsvpYes = true;
                        }
                    };

                    if (rsvpYes) {
                        EventChatFactory.query({
                            format: 'json',
                            limit: 1,
                            offset: 0,
                            event: vm.events[obj].id
                        }).$promise.then(
                            function(res) {
                                if (res.objects.length === 1) {


                                    for (var j in vm.events) {

                                        if (vm.events[j].resource_uri === res.objects[0].event) {
                                            var newEventMessage = {
                                                eventName: vm.events[j].name,
                                                event: vm.events[j].id,
                                                photo: '/static/img/placeholder-image.jpg',
                                                sentAt: $filter('amDateFormat')(res.objects[0].sent_at, 'h:mm a'),
                                                body: res.objects[0].body
                                            };

                                            vm.eventMessages.push(newEventMessage);
                                        }
                                    }

                                }


                            },
                            function(error) {
                                var data = error.data,
                                    status = error.status,
                                    header = error.header,
                                    config = error.config,
                                    message = 'Error ' + status;
                                $log.error(message);
                            }
                        );
                    }

                }

            }

            function getEventsFailed(error) {
                var data = error.data,
                    status = error.status,
                    header = error.header,
                    config = error.config,
                    message = 'Error ' + status;
                $log.error(message);



            }
        }



    }


})();
