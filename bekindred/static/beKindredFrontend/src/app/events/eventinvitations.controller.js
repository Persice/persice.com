(function() {
    'use strict';

    /**
     * class EventInvitationsController
     * classDesc event invitations
     * @ngInject
     */
     function EventInvitationsController($scope, USER_ID, EventsFactory, $state, eventId, $rootScope, $log, $filter) {
        var vm = this;

        vm.inviteConnection = inviteConnection;
        vm.removeInvite = removeInvite;

        vm.invitationsOptions = {
            attendingPref: 'private',
            guestInvite: true
        };

        vm.invite = false;

        vm.connections = [{
            id: 1,
            first_name: 'Lena',
            age: 35,
            invited: false,
            mutual_friends: 10,
            match_score: 4,
            tagline: 'Creative designer & hiker'
        },

        {
            id: 2,
            first_name: 'Brian',
            age: 31,
            invited: false,
            mutual_friends: 10,
            match_score: 4,
            tagline: 'Engineer kiteboarding chess geek'
        },

        {
            id: 3,
            first_name: 'Charlie',
            age: 39,
            invited: false,
            mutual_friends: 10,
            match_score: 4,
            tagline: 'Hacker, Guitaris, and veteran Burner'
        },

        {
            id: 4,
            first_name: 'Daniel',
            age: 25,
            invited: false,
            mutual_friends: 10,
            match_score: 4,
            tagline: 'Grad student from London'
        },

        ];

        vm.invitedPeople = [];

        function inviteConnection(index) {

            if (vm.connections[index].invited === false) {

                vm.invitedPeople.push(vm.connections[index]);
                vm.connections[index].invited = true;
            }

        }

        function removeInvite(index) {
            var findIndex = $filter('getIndexByProperty')('id', vm.invitedPeople[index].id, vm.connections);
            vm.connections[findIndex].invited = false;
            vm.invitedPeople.splice(index, 1);

        }


    }



    angular
    .module('icebrak')
    .controller('EventInvitationsController', EventInvitationsController);

})();
