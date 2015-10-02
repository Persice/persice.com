(function() {
    'use strict';

    /**
     * @desc display modal
     * @example <ui-event-create-modal></ui-event-create-modal>
     */
    angular
        .module('frontend.semantic.modal.event.create', [])

    .directive('uiEventCreateModal', uiEventCreateModal);

    function uiEventCreateModal() {
        var directive = {
            restrict: 'E',
            replace: true,
            transclude: false,
            scope: {
                show: '=show'
            },
            templateUrl: 'components/modal/modalcreate.html',
            controller: EventModalController,
            controllerAs: 'singleevent',
            bindToController: true,
            link: link,
        };
        return directive;

        function link(scope, element, attrs, singleevent) {
            element.modal({
                onHide: function() {
                    scope.singleevent.show = false;
                    scope.singleevent.selection = 'create';
                    scope.singleevent.header = 'Create Event';
                    scope.singleevent.resetForm();
                },
                onShow: function() {
                    scope.singleevent.selection = 'create';
                    scope.singleevent.header = 'Create Event';
                    scope.singleevent.resetForm();
                }
            });


            scope.$watch('singleevent.show', function(modelValue) {
                element
                    .modal('setting', 'transition', 'scale')
                    .modal('setting', 'closable', false)
                    .modal(modelValue ? 'show' : 'hide');
            });

        }



    }

    /**
     * @desc controller for modal directive
     * @ngInject
     */
    function EventModalController($scope, USER_ID, EventsFactory, $state, $rootScope, $log, $window, moment, $geolocation, $q, EventsConnections, MembersFactory, $filter, notify, lodash) {
        var vm = this;

        vm.mapurl = '';
        vm.mapurlTrue = false;
        vm.eventLocation = '';
        vm.showMobile = false;
        vm.endsTimeError = false;
        vm.startsTimeError = false;
        vm.loadingSave = false;

        vm.header = 'Create Event';

        vm.loadingInvitesSave = false;
        vm.counterNewInvites = 0;
        vm.markSelected = markSelected;
        vm.getConnections = getConnections;
        vm.sendInvites = sendInvites;

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

        vm.friends = [];
        vm.connections = [];
        vm.invitedPeople = [];

        vm.placeholder = {
            name: '',
            starts: 'Date',
            startsTime: 'Time',
            ends: 'Date',
            endsTime: 'Time',
            repeat: '',
            repeatUntil: 'Until date',
            description: '',
            location: '',
            costs: '',
            invitations: '',
            attachments: '',
            max_attendees: '',
            event_photo: 'Event Photo'

        };

        vm.$geolocation = $geolocation;

        $geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 2
        }).then(function(location) {
            vm.autocompleteOptions = {
                location: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
                radius: 50000
            };
        });

        vm.autocompleteOptions = {};

        vm.image = '';
        vm.starts_on_date = '';
        vm.starts_on_time = '';
        vm.ends_on_date = '';
        vm.ends_on_time = '';

        vm.showError = false;
        vm.showSuccess = false;
        vm.errorMessage = [];
        vm.event = {
            user: '/api/v1/auth/user/' + USER_ID + '/',
            description: '',
            ends_on: '',
            location: '',
            name: '',
            repeat: '',
            starts_on: '',
            street: '',
            city: '',
            zipcode: null,
            state: '',
            full_address: '',
            location_name: '',
            country: '',
            max_attendees: '',
            event_photo: '',
            access_level: '',
            access_user_list: []
        };

        vm.saveEvent = saveEvent;
        vm.openMap = openMap;
        vm.resetForm = resetForm;
        vm.extractFromAddress = extractFromAddress;
        vm.parseLocation = parseLocation;
        vm.combineDateTime = combineDateTime;
        vm.closeEventModal = closeEventModal;
        vm.validateDates = validateDates;

        vm.openInvitations = openInvitations;
        vm.closeInvitations = closeInvitations;


        function openInvitations() {
            vm.selection = 'invitations';
            vm.header = 'Invitations';
            vm.invitedPeopleAlreadyLoaded = false;
            vm.counterNewInvites = 0;
            vm.invitedPeopleCount = 0;
            vm.invitedPeopleFirstName = '';
            vm.connectionFirstName = '';
            vm.getConnections();
        }

        function closeInvitations() {
            vm.selection = 'create';
            vm.header = 'Create Event';
        }


        function closeEventModal() {
            vm.show = false;
        }

        $rootScope.$on('saveEvent', function() {
            vm.saveEvent();
        });

        $scope.$watch(angular.bind(this, function(eventLocation) {
            return vm.eventLocation;
        }), function(newVal) {
            vm.parseLocation();
        });

        function validateDates() {
            //validate dates
            vm.startsTimeError = false;
            vm.endsTimeError = false;
            if (moment(vm.event.starts_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select a Starts Date that is not set in past.'];
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
            }

            if (moment(vm.event.ends_on).unix() < moment().unix()) {
                vm.showError = true;
                vm.errorMessage = ['Please select an Ends Date that is not set in past.'];
                vm.endsTimeError = true;
                return;
            }

            if (moment(vm.event.ends_on).unix() > moment().unix() && moment(vm.event.starts_on).unix() > moment().unix() && moment(vm.event.starts_on).unix() > moment(vm.event.ends_on).unix()) {
                vm.showError = true;
                vm.errorMessage = ['Ends Date must be greater or equal to Starts Date.'];
                vm.endsTimeError = true;
                vm.startsTimeError = true;
                return;
            } else {
                vm.showError = false;
                vm.errorMessage = [];
                vm.startsTimeError = false;
                vm.endsTimeError = false;
            }
        }

        function saveEvent() {
            if (vm.loadingSave) {
                return;
            }
            vm.showError = false;
            vm.showSuccess = false;
            $('.ui.form')
                .form({
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Event name'
                            }]
                        },
                        location: {
                            identifier: 'location',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Location'
                            }]
                        },
                        // repeat: {
                        //     identifier: 'repeat',
                        //     rules: [{
                        //         type: 'empty',
                        //         prompt: 'Please enter Repeat'
                        //     }]
                        // },
                        description: {
                            identifier: 'description',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Description'
                            }]
                        },
                        max_attendees: {
                            identifier: 'max_attendees',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Max. attendees'
                            }, {
                                type: 'integer[1..99999]',
                                prompt: 'Please enter Max. attendees as numeric value'
                            }]
                        },
                        starts_on_date: {
                            identifier: 'starts_on_date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Starts Date'
                            }]
                        },
                        starts_on_time: {
                            identifier: 'starts_on_time',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Starts Time'
                            }]
                        },
                        ends_on_date: {
                            identifier: 'ends_on_date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Ends Date'
                            }]
                        },
                        ends_on_time: {
                            identifier: 'ends_on_time',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter Ends Time'
                            }]
                        },
                    }
                });

            $('.ui.form').form('validate form');

            if (vm.event.description === '' || vm.event.max_attendees === '' || vm.event.ends_on === '' || vm.event.location === '' || vm.event.name === '' || vm.event.starts_on === '') {
                if (vm.event.starts_on === '' || vm.event.starts_on === null) {
                    vm.startsTimeError = true;
                }
                if (vm.event.ends_on === '' || vm.event.ends_on === null) {
                    vm.endsTimeError = true;
                }

                vm.showError = true;
                vm.errorMessage = ['Please enter all required fields.'];

                if (vm.selection === 'invitations') {
                    vm.closeInvitations();
                }
            } else {

                //validate dates

                vm.validateDates();

                vm.showSuccess = false;
                if (!vm.showError) {
                    vm.loadingSave = true;
                    vm.event.access_level = vm.invitationsOptions.attendingPref;
                    if (vm.invitationsOptions.attendingPref !== 'private') {
                        delete vm.event.access_user_list;
                    } else {
                        vm.event.access_user_list = vm.selectedPeople;
                    }


                    EventsFactory.save({}, vm.event,
                        function(success) {
                            vm.sendInvites(success.id);
                        },
                        function(error) {
                            vm.loadingSave = false;
                            vm.errorMessage = [];
                            vm.showError = true;
                            if (error.data.event) {
                                vm.errorMessage = error.data.event.error;
                            }

                        });
                }
            }

        }

        //extract address from google places result
        function extractFromAddress(components, type, type2) {
            for (var i = 0; i < components.length; i++) {
                for (var j = 0; j < components[i].types.length; j++) {
                    if (components[i].types[j] === type) {
                        return components[i][type2];
                    }
                }
            }
            return '';

        }

        //parse location
        function parseLocation() {
            vm.mapurl = '';
            vm.mapurlTrue = false;
            if (vm.eventLocation !== null && typeof vm.eventLocation === 'object' && vm.eventLocation.hasOwnProperty('address_components') && vm.eventLocation.hasOwnProperty('geometry')) {
                var location = vm.eventLocation.address_components;

                vm.event.street = vm.extractFromAddress(location, 'route', 'long_name') + ' ' + vm.extractFromAddress(location, 'street_number', 'long_name');
                vm.event.zipcode = vm.extractFromAddress(location, 'postal_code', 'long_name');
                if (vm.event.zipcode === '') {
                    vm.event.zipcode = null;
                }
                vm.event.location_name = vm.eventLocation.name;
                vm.event.full_address = vm.eventLocation.formatted_address;
                vm.event.state = vm.extractFromAddress(location, 'administrative_area_level_1', 'short_name');
                vm.event.country = vm.extractFromAddress(location, 'country', 'short_name');
                if (vm.event.state.length > 3) {
                    vm.event.state = vm.event.country;
                }
                vm.event.city = vm.extractFromAddress(location, 'locality', 'long_name');

                vm.event.location = vm.eventLocation.geometry.location.lat() + ',' + vm.eventLocation.geometry.location.lng();
                vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation.formatted_address) + '/@' + vm.event.location + ',15z';
                vm.mapurlTrue = true;
            } else {
                vm.event.address = vm.eventLocation;
                vm.event.full_address = '';
                vm.event.location_name = vm.eventLocation;
                vm.event.location = '0,0';
            }

        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }



        function resetForm() {
            //Resets form error messages and field styles
            $('.ui.form').trigger('reset');
            $('.ui.form .field.error').removeClass('error');
            $('.ui.form.error').removeClass('error');
            vm.starts_on_date = null;
            vm.starts_on_time = null;
            vm.ends_on_date = null;
            vm.ends_on_time = null;
            vm.showError = false;
            vm.showSuccess = false;
            vm.errorMessage = [];
            vm.mapurl = '';
            vm.mapurlTrue = false;
            vm.eventLocation = '';
            vm.image = '';
            vm.event = {
                user: '/api/v1/auth/user/' + USER_ID + '/',
                description: '',
                ends_on: '',
                location: '',
                name: '',
                repeat: '',
                starts_on: '',
                street: '',
                city: '',
                zipcode: null,
                state: '',
                full_address: '',
                location_name: '',
                country: '',
                max_attendees: '',
                event_photo: '',
                access_level: '',
                access_user_list: []
            };

            //reset invitations page
            vm.invitedPeopleAlreadyLoaded = false;
            vm.counterNewInvites = 0;
            vm.invitedPeopleCount = 0;
            vm.invitedPeopleFirstName = '';
            vm.connectionFirstName = '';
            vm.selectedPeople = [];
        }



        //date and time combine
        //
        $scope.$watch(angular.bind(this, function(starts_on_date) {
            return vm.starts_on_date;
        }), function(newVal) {
            if (newVal !== null) {
                vm.combineDateTime('starts_on');
                vm.combineDateTime('ends_on');
            }
        });

        $scope.$watch(angular.bind(this, function(starts_on_time) {
            return vm.starts_on_time;
        }), function(newVal) {
            if (newVal !== null) {
                vm.combineDateTime('starts_on');
                vm.combineDateTime('ends_on');
            }
        });
        $scope.$watch(angular.bind(this, function(ends_on_date) {
            return vm.ends_on_date;
        }), function(newVal) {
            if (newVal !== null) {
                vm.combineDateTime('starts_on');
                vm.combineDateTime('ends_on');
            }
        });

        $scope.$watch(angular.bind(this, function(ends_on_time) {
            return vm.ends_on_time;
        }), function(newVal) {
            if (newVal !== null) {
                vm.combineDateTime('starts_on');
                vm.combineDateTime('ends_on');
            }
        });

        //helper function for 12 to 24 hour time conversion
        function convertTo24Hour(time) {
            var hours = parseInt(time.substr(0, 2));
            if (time.indexOf('AM') != -1 && hours == 12) {
                time = time.replace('12', '0');
            }
            if (time.indexOf('PM') != -1 && hours < 12) {
                time = time.replace(hours, (hours + 12));
            }
            return time.replace(/(AM|PM)/, '');
        }

        function combineDateTime(type) {
            if (vm[type + '_date'] && vm[type + '_time']) {
                var dateParts = vm[type + '_date'].split('/');
                var datePartsSorted = [dateParts[2], dateParts[0], dateParts[1]];
                var timeParts = convertTo24Hour(vm[type + '_time']).split(':');
                var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                if (datePartsSorted && timeParts) {
                    datePartsSorted[1] -= 1;
                    vm.event[type] = moment(datePartsSorted.concat(timeParts)).utc().format('YYYY-MM-DDTHH:mm:ss');
                }
            }
        }

        //invitations

    function markSelected(index, id) {
      if (!vm.connections[index].is_invited) {
        vm.connections[index].selected = !vm.connections[index].selected;

        if (vm.connections[index].selected && vm.selectedPeople.indexOf(id) === -1) {
          vm.selectedPeople.push(id);
        }
        if (!vm.connections[index].selected && vm.selectedPeople.indexOf(id) !== -1) {
          vm.selectedPeople = lodash.without(vm.selectedPeople, id);

        }
        vm.counterNewInvites = vm.selectedPeople.length;
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
                if (lodash.includes(vm.selectedPeople, friend.friend_id)) {
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

        function sendInvites(eventId) {
            if (vm.selectedPeople.length > 0) {

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

                }).then(function(tmpResult) {
                    $log.info('Sending invites finished.');

                    notify({
                        messageTemplate: '<div class="notify-info-header">Success</div>' +
                            '<p>New event has been created and all invitations have been successfully sent.</p>',
                        classes: 'notify-info',
                        icon: 'check circle',
                        duration: 4000
                    });

                    vm.showError = false;
                    vm.loadingSave = false;
                    vm.resetForm();
                    $rootScope.$broadcast('closeModalCreateEvent');
                });

            } else {
                vm.showError = false;
                vm.loadingSave = false;
                vm.resetForm();
                notify({
                    messageTemplate: '<div class="notify-info-header">Success</div>' +
                        '<p>New event has been created.</p>',
                    classes: 'notify-info',
                    icon: 'check circle',
                    duration: 4000
                });

                $rootScope.$broadcast('closeModalCreateEvent');

            }


        }


    }



})();
