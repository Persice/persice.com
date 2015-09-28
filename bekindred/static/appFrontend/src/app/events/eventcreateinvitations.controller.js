(function() {
    'use strict';

    /**
     * class EventCreateInvitationsController
     * classDesc event invitations
     * @ngInject
     */
     function EventCreateInvitationsController($scope, USER_ID, EventsFactory, EventsAttendees, MembersFactory, $q, EventsConnections, $state, $timeout, $rootScope, $log, $filter, notify, lodash) {
        var vm = this;

        vm.loadingInvitesSave = false;
        vm.counterNewInvites = 0;
        vm.markSelected = markSelected;
        vm.getConnections = getConnections;

        vm.nextOffset = 10;
        vm.loadingConnections = false;
        vm.connectionFirstName = '';

        vm.invitedPeopleLoading = false;
        vm.invitedPeopleCount = 0;
        vm.invitedPeopleFirstName = '';
        vm.invitedPeopleNext = null;
        vm.invitedPeopleAlreadyLoaded = false;

        vm.invitationsOptions = {
            attendingPref: 'public',
            guestInvite: true
        };

        $scope.$watch(angular.bind(this, function(invitationsOptions) {
            return vm.invitationsOptions.attendingPref;
        }), function(newVal) {
            $scope.singleevent.access_level = newVal;
        });

        $scope.eventpage.header = 'Invitations';

        $scope.$on('goBackEvents', function() {
            $scope.eventpage.header = 'Event Details';
            $state.go('event.create');
        });

        vm.loadingEvent = false;

        vm.friends = [];
        vm.connections = [];
        vm.invitedPeople = [];

        vm.getConnections();

        function markSelected(index) {
            if (!vm.connections[index].is_invited) {
                vm.connections[index].selected = !vm.connections[index].selected;

                if (vm.connections[index].selected) {
                    vm.counterNewInvites++;
                    $scope.singleevent.selectedPeople.push(vm.connections[index].friend_id);
                } else {
                    var idx = lodash.findIndex($scope.singleevent.selectedPeople, vm.connections[index].friend_id);
                    $scope.singleevent.selectedPeople.splice(idx, 1);
                    vm.counterNewInvites--;
                }
            }

        }




        function getConnections() {

            vm.friends = [];
            vm.counterNewInvites = 0;

            vm.nextOffset = 10;
            vm.next = null;
            vm.loadingConnections = true;
            EventsConnections.query({
                format: 'json',
                first_name: vm.connectionFirstName.toLowerCase(),
                limit: 1000,
                offset: 0
            }).$promise.then(getEventsConnectionsSuccess, getEventsConnectionsFailure);

        }

        function getEventsConnectionsSuccess(response) {
            vm.friends = response.objects;
            vm.next = response.meta.next;
            vm.connections = [];
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
                    image: vm.friends[i].image
                };


                for (var j = vm.friends[i].events.length - 1; j >= 0; j--) {

                    if (vm.friends[i].events[j].event === friend.event) {
                        friend.is_invited = true;
                        friend.rsvp = vm.friends[i].events[j].rsvp;
                        friend.selected = true;
                        friend.member_id = vm.friends[i].events[j].id;
                    }
                }

                //check if connection was selected already
                if (lodash.includes($scope.singleevent.selectedPeople, friend.friend_id)) {
                    friend.selected = true;
                }

                vm.connections.push(friend);

            }
            vm.counterNewInvites = $scope.singleevent.selectedPeople.length;
            vm.loadingConnections = false;

        }

        function getEventsConnectionsFailure(response) {

            var data = response.data,
            status = response.status,
            header = response.header,
            config = response.config,
            message = 'Error ' + status;
            $log.error(message);

            vm.loadingConnections = false;


        }





    }



    angular
    .module('persice')
    .controller('EventCreateInvitationsController', EventCreateInvitationsController);

})();
