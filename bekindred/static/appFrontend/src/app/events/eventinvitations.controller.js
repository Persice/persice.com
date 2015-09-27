(function() {
  'use strict';

  /**
   * class EventInvitationsController
   * classDesc event invitations
   * @ngInject
   */
  function EventInvitationsController($scope, USER_ID, EventsFactory, EventsAttendees, MembersFactory, $q, EventsConnections, $state, $timeout, eventId, $rootScope, $log, $filter, notify, lodash) {
    var vm = this;

    vm.loadingInvitesSave = false;
    vm.counterNewInvites = 0;
    vm.markSelected = markSelected;
    vm.removeInvite = removeInvite;
    vm.sendInvites = sendInvites;
    vm.getConnections = getConnections;
    vm.getInvitedPeople = getInvitedPeople;
    vm.getEvent = getEvent;
    vm.updateEvent = updateEvent;

    vm.private_access_user_list = [];

    vm.nextOffset = 10;
    vm.loadingConnections = false;
    vm.connectionFirstName = '';

    vm.invitedPeopleLoading = false;
    vm.invitedPeopleCount = 0;
    vm.invitedPeopleFirstName = '';
    vm.invitedPeopleNext = null;
    vm.invitedPeopleAlreadyLoaded = false;

    vm.invitationsOptions = {
      attendingPref: '',
      guestInvite: true
    };

    $scope.eventpage.header = 'Invitations';

    $scope.$on('goBackEvents', function() {
      $state.go('event.edit', {
        eventId: eventId
      });

    });

    vm.loadingEvent = false;

    vm.event = {};

    vm.friends = [];
    vm.connections = [];
    vm.invitedPeople = [];
    vm.selectedPeople = [];

    vm.getConnections();
    vm.getEvent();
    vm.getInvitedPeople();


    $scope.$watch(angular.bind(this, function(invitationsOptions) {
      return vm.invitationsOptions.attendingPref;
    }), function(newVal, oldVal) {
      if (oldVal !== '') {
        vm.updateEvent(newVal, vm.private_access_user_list);
      }

    });


    function updateEvent(level, list) {
      var updateData = {
        access_level: level
      };

      updateData.access_user_list = list;

      EventsFactory.update({
          eventId: vm.event.id
        }, updateData,
        function(success) {},
        function(error) {


        });
    }



    function getEvent() {
      vm.loadingEvent = true;
      EventsFactory.query({
        format: 'json'
      }, {
        eventId: eventId
      }).$promise.then(function(data) {
        vm.event = data;
        vm.invitationsOptions.attendingPref = vm.event.access_level;
        vm.loadingEvent = false;

      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        vm.loadingEvent = false;
      });
    }



    function markSelected(index) {
      if (!vm.connections[index].is_invited) {
        vm.connections[index].selected = !vm.connections[index].selected;

        if (vm.connections[index].selected) {
          vm.counterNewInvites++;
          vm.selectedPeople.push(vm.connections[index].friend_id);
        } else {
          var idx = lodash.findIndex(vm.selectedPeople, vm.connections[index].friend_id);
          vm.selectedPeople.splice(idx, 1);
          vm.counterNewInvites--;
        }
      }

    }

    function removeInvite(index) {
      //remove from invite list and refresh selected status

      MembersFactory.delete({
          memberId: vm.invitedPeople[index].id
        },
        function(success) {
          var list = lodash.union(vm.private_access_user_list, vm.selectedPeople);
          var numberPattern = /\d+/g;
          var newList = lodash.remove(list, function(n) {
            return n !== parseInt(vm.invitedPeople[index].user.match(numberPattern)[1]);
          });
          vm.updateEvent(vm.invitationsOptions.attendingPref, newList);

          vm.connectionFirstName = '';
          vm.getConnections();
          vm.invitedPeople.splice(index, 1);
          vm.counterNewInvites = 0;
          if (vm.invitedPeopleCount > 0) {
            vm.invitedPeopleCount--;
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
      var list = lodash.union(vm.private_access_user_list, vm.selectedPeople);

      vm.updateEvent(vm.invitationsOptions.attendingPref, list);

      if (vm.selectedPeople.length > 0) {
        //return if already sending invites
        if (vm.loadingInvitesSave) {
          return;
        }
        vm.loadingInvitesSave = true;
        //sending invites

        var promises = [];

        for (var i = vm.selectedPeople.length - 1; i >= 0; i--) {

          //prepare promises array
          var member = {
            event: '/api/v1/event/' + eventId + '/',
            is_invited: false,
            user: '/api/v1/auth/user/' + vm.selectedPeople[i] + '/'
          };

          promises.push(MembersFactory.save({}, member).$promise);
        }


        $q.all(promises).then(function(result) {
          angular.forEach(result, function(response) {
            var findMemberIndex = $filter('getIndexByProperty')('user', response.user, vm.connections);
            if (findMemberIndex !== null) {
              vm.connections[findMemberIndex].member_id = response.id;
              vm.connections[findMemberIndex].is_invited = true;
              vm.connections[findMemberIndex].rsvp = '';

            }
          });



        }).then(function(tmpResult) {
          $log.info('Sending invites finished.');
          vm.counterNewInvites = 0;
          vm.loadingInvitesSave = false;
          vm.selectedPeople = [];
          vm.invitedPeopleAlreadyLoaded = false;
          vm.invitedPeopleFirstName = '';
          vm.connectionFirstName = '';
          vm.getConnections();
          vm.getInvitedPeople();
          notify({
            messageTemplate: '<div class="notify-info-header">Success</div>' +
              '<p>All event invitations have been successfully sent.</p>',
            classes: 'notify-info',
            icon: 'check circle',
            duration: 4000
          });
          $scope.$emit('invitesSent');
        });

      }


    }

    function getConnections() {

      vm.friends = [];
      vm.private_access_user_list = [];
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
          event: parseInt(eventId),
          image: vm.friends[i].image
        };


        for (var j = vm.friends[i].events.length - 1; j >= 0; j--) {

          if (vm.friends[i].events[j].event === friend.event) {
            friend.is_invited = true;
            friend.rsvp = vm.friends[i].events[j].rsvp;
            friend.selected = true;
            friend.member_id = vm.friends[i].events[j].id;
            vm.private_access_user_list.push(friend.friend_id);
          }
        }

        //check if connection was selected already
        if (lodash.includes(vm.selectedPeople, friend.friend_id)) {
          console.log('bla');
          friend.selected = true;


        }

        vm.connections.push(friend);




      }
      vm.counterNewInvites = vm.selectedPeople.length;
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

    function getInvitedPeople() {
      vm.invitedPeopleLoading = true;

      EventsAttendees.query({
        format: 'json',
        limit: 1000,
        offset: 0,
        event: eventId,
        is_organizer: false,
        user__first_name__icontains: vm.invitedPeopleFirstName
      }).$promise.then(getInvitedPeopleSuccess, getInvitedPeopleFailure);

      function getInvitedPeopleSuccess(response) {
        vm.invitedPeopleLoading = false;

        if (!vm.invitedPeopleAlreadyLoaded) {
          vm.invitedPeopleCount = response.meta.total_count;
        }

        vm.invitedPeopleAlreadyLoaded = true;



        if (response.objects.length === 0) {
          vm.invitedPeople = [];
        } else {
          vm.invitedPeople = response.objects;
          vm.invitedPeopleNext = response.meta.next;
        }

      }

      function getInvitedPeopleFailure(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;

        $log.error(message);
        vm.invitedPeopleLoading = false;


      }
    }






  }



  angular
    .module('persice')
    .controller('EventInvitationsController', EventInvitationsController);

})();
