(function() {
    'use strict';

    /**
     * class EventInvitationsController
     * classDesc event invitations
     * @ngInject
     */
     function EventInvitationsController($scope, USER_ID, EventsFactory, MembersFactory, $q, EventsConnections, $state, $timeout, eventId, $rootScope, $log, $filter, notify) {
        var vm = this;

        vm.loadingInvitesSave = false;
        vm.counterNewInvites = 0;
        vm.markSelected = markSelected;
        vm.removeInvite = removeInvite;
        vm.sendInvites = sendInvites;
        vm.getConnections = getConnections;

        vm.nextOffset = 10;
        vm.loadingConnections = false;
        vm.connectionFirstName = '';

        vm.invitationsOptions = {
            attendingPref: 'private',
            guestInvite: true
        };

        $scope.eventpage.header = 'Invitations';

        $scope.$on('goBackEvents', function() {
            $state.go('event.edit', {
                eventId: eventId
            });

        });

        vm.friends = [];
        vm.connections = [];
        vm.invitedPeople = [];

        vm.getConnections();


        function markSelected(index) {
            if (!vm.connections[index].is_invited) {
                vm.connections[index].selected = !vm.connections[index].selected;

                if (vm.connections[index].selected) {
                    vm.counterNewInvites++;
                }
                else {
                    vm.counterNewInvites--;
                }
            }

        }

        function removeInvite(index) {
            //remove from invite list and refresh selected status
            var findIndex = $filter('getIndexByProperty')('friend_id', vm.invitedPeople[index].friend_id, vm.connections);


            MembersFactory.delete({
                memberId: vm.connections[findIndex].member_id
            },
            function(success) {
                vm.connections[findIndex].is_invited = false;
                vm.connections[findIndex].selected = false;
                vm.invitedPeople.splice(index, 1);
                if (vm.counterNewInvites > 0) {
                    vm.counterNewInvites--;
                }
            },
            function(error) {
                $log.info(error);
            });





        }

        $scope.$on('sendInvites', function() {
            $log.info('sendInvites Event');
            vm.sendInvites();
        });

        function sendInvites() {
            if (vm.counterNewInvites > 0) {
                //return if already sending invites
                if (vm.loadingInvitesSave) {
                    return;
                }
                vm.loadingInvitesSave = true;
                //sending invites

                var promises = [];

                for (var i = vm.connections.length - 1; i >= 0; i--) {
                    if (vm.connections[i].selected && !vm.connections[i].is_invited) {
                        //prepare promises array
                        var member = {
                            event: '/api/v1/event/' + eventId + '/',
                            is_invited: false,
                            user: '/api/v1/auth/user/' + vm.connections[i].friend_id + '/'
                        };

                        promises.push(MembersFactory.save({}, member));
                    }

                }


                $q.all(promises).then(function(result) {
                    angular.forEach(result, function(response) {
                        $log.info(response);
                        var findMemberIndex = $filter('getIndexByProperty')('user', response.user, vm.connections);
                        vm.connections[findMemberIndex].member_id = response.id;
                        vm.connections[findMemberIndex].is_invited = true;
                        vm.connections[findMemberIndex].rsvp = '';
                        vm.invitedPeople.push(vm.connections[findMemberIndex]);
                    });

                }).then(function(tmpResult) {
                    $log.info('Sending invites finished.');
                    vm.counterNewInvites = 0;
                    vm.loadingInvitesSave = false;
                    notify({
                        messageTemplate: '<div class="notify-info-header">Success</div>' +
                        '<p>All event invitations have been successfully sent.</p>',
                        classes: 'notify-info',
                        icon: 'check circle',
                        duration: 4000
                    });
                    $scope.$emit('invitesSent');
                });

            } else {
                notify({
                    messageTemplate: '<div class="notify-error-header">Warning</div>' +
                    '<p>Please select connections to invite.</p>',
                    classes: 'notify-error',
                    icon: 'remove circle',
                    duration: 4000
                });
            }


        }

        function getConnections() {
            vm.connections = [];
            vm.friends = [];
            vm.invitedPeople = [];
            vm.counterNewInvites = 0;

            vm.nextOffset = 10;
            vm.next = null;
            vm.loadingConnections = true;
            EventsConnections.query({
                format: 'json',
                first_name: vm.connectionFirstName,
                limit: 10,
                offset: 0
            }).$promise.then(getEventsConnectionsSuccess, getEventsConnectionsFailure);

        }

        function getEventsConnectionsSuccess(response) {
            vm.friends = response.objects;
            vm.next = response.meta.next;


            for (var i = vm.friends.length - 1; i >= 0; i--) {

                var mutual_friends = ((vm.friends[i].mutual_friends_count === null) ? 0 : vm.friends[i].mutual_friends_count);
                var common_goals = ((vm.friends[i].common_goals_offers_interests === null) ? 0 : vm.friends[i].common_goals_offers_interests);
                var friend = {
                    first_name: vm.friends[i].first_name,
                    age: vm.friends[i].age,
                    common_goals_offers_interests: common_goals,
                    mutual_friends_count: mutual_friends,
                    tagline: vm.friends[i].tagline,
                    facebook_id: vm.friends[i].facebook_id,
                    friend_id: vm.friends[i].friend_id,
                    user: '/api/v1/auth/user/' + vm.friends[i].friend_id + '/',
                    is_invited: false,
                    member_id: null,
                    rsvp: '',
                    selected: false,
                    event: parseInt(eventId),
                    image: '//graph.facebook.com/' + vm.friends[i].facebook_id + '/picture?type=square'
                };


                for (var j = vm.friends[i].events.length - 1; j >= 0; j--) {

                    if (vm.friends[i].events[j].event === friend.event) {
                        friend.is_invited = true;
                        friend.rsvp = vm.friends[i].events[j].rsvp;
                        friend.selected = true;
                        friend.member_id = vm.friends[i].events[j].id;

                        vm.invitedPeople.push(friend);
                    }
                }

                vm.connections.push(friend);




            }

            vm.loadingConnections = false;

        }

        function getEventsConnectionsFailure(response) {

            var data = response.data,
            status = response.status,
            header = response.header,
            config = response.config,
            message = 'Error ' + status;
            $log.error(message);

            vm.loadingConnetions = false;


        }


    }



    angular
    .module('persice')
    .controller('EventInvitationsController', EventInvitationsController);

})();
