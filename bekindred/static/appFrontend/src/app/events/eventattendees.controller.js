(function() {
    'use strict';

    angular
        .module('persice')
        .controller('EventAttendeesController', EventAttendeesController);

    /**
     * class EventAttendeesController
     * classDesc view event attendees
     * @ngInject
     */
    function EventAttendeesController($scope, USER_ID, EventsFactory, $state, eventId, $rootScope, $log, $window, angularMomentConfig, MembersFactory) {
        var vm = this;


        vm.connectionsYes = [{
                id: 1,
                rsvp: '',
                first_name: 'Lena',
                age: 35,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Creative designer & hiker'
            }, {
                id: 3,
                rsvp: '',
                first_name: 'Charlie',
                age: 39,
                invited: false,
                selected: false,
                mutual_friends: 10,
                match_score: 4,
                tagline: 'Hacker, Guitaris, and veteran Burner'
            }

        ];


        vm.connectionsNo = [{
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

        ];


        vm.connectionsMaybe = [

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


        $scope.eventpage.header = 'Attendees';

        $scope.$on('goBackEvents', function() {
            $state.go('event.details', {
                eventId: eventId
            });

        });

    }



})();
