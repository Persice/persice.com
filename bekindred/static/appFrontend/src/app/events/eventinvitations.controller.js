(function() {
    'use strict';

    /**
     * class EventInvitationsController
     * classDesc event invitations
     * @ngInject
     */
    function EventInvitationsController($scope, USER_ID, EventsFactory, $state, $timeout, eventId, $rootScope, $log, $filter, notify) {
        var vm = this;

        vm.loadingInvitesSave = false;
        vm.counterNewInvites = 0;
        vm.inviteConnection = inviteConnection;
        vm.removeInvite = removeInvite;
        vm.sendInvites = sendInvites;

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

        vm.connections = [{
                id: 1,
                rsvp: '',
                first_name: 'Lena',
                age: 35,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Creative designer & hiker'
        },

            {
                id: 2,
                rsvp: 'YES',
                first_name: 'Brian',
                age: 31,
                invited: true,
                selected: true,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Engineer kiteboarding chess geek'
        },

            {
                id: 3,
                rsvp: '',
                first_name: 'Charlie',
                age: 39,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Hacker, Guitaris, and veteran Burner'
        },

            {
                id: 4,
                rsvp: '',
                first_name: 'Daniel',
                age: 25,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Grad student from London'
        },

        ];

        vm.invitedPeople = [{
            id: 2,
            rsvp: 'YES',
            first_name: 'Brian',
            age: 31,
            invited: true,
            selected: true,
            mutual_friends: 10,
            match_score: 4,
            tagline: 'Engineer kiteboarding chess geek'
        }];


        function inviteConnection(index) {
            if (!vm.connections[index].invited) {
                vm.connections[index].selected = !vm.connections[index].selected;
                if (vm.connections[index].selected) {
                    //select user
                    vm.invitedPeople.push(vm.connections[index]);
                    vm.counterNewInvites++;
                } else {
                    //remove from invite list if not selected
                    var findIndex = $filter('getIndexByProperty')('id', vm.connections[index].id, vm.invitedPeople);
                    vm.invitedPeople.splice(findIndex, 1);
                    if (vm.counterNewInvites > 0) {
                        vm.counterNewInvites--;
                    }
                }
            }

        }

        function removeInvite(index) {
            //remove from invite list and refresh selected status
            var findIndex = $filter('getIndexByProperty')('id', vm.invitedPeople[index].id, vm.connections);
            vm.connections[findIndex].invited = false;
            vm.connections[findIndex].selected = false;
            vm.invitedPeople.splice(index, 1);
            if (vm.counterNewInvites > 0) {
                vm.counterNewInvites--;
            }


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
                //simulate sending invites
                $timeout(function() {
                    for (var i = vm.connections.length - 1; i >= 0; i--) {
                        if (vm.connections[i].selected && !vm.connections[i].invited) {
                            //send invites
                            vm.connections[i].invited = true;
                        }

                    }
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
                }, 2000);
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


    }



    angular
        .module('persice')
        .controller('EventInvitationsController', EventInvitationsController);

})();