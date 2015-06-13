(function() {
    'use strict';

    angular
        .module('icebrak')
        .controller('EventViewController', EventViewController);

    /**
     * class EventViewController
     * classDesc Create event
     * @ngInject
     */
    function EventViewController($scope, USER_ID, EventsFactory, $state, eventId, $rootScope, $log, $window) {
        var vm = this;
        vm.showMobile = true;
        vm.mapurl = '';
        vm.mapurlTrue = false;
        vm.event = {};



        vm.eventLocation = '';

        vm.placeholder = {
            name: 'Event Name',
            starts: 'Starts',
            ends: 'Ends',
            repeat: 'Repeat',
            location: 'Location',
            description: 'Description',
            costs: 'Costs',
            invitations: 'Invitations',
            attachments: 'Attachments'
        };


        vm.openMap = openMap;
        vm.getEvent = getEvent;

        vm.getEvent();

        function getEvent() {
            $log.info('getting event: ' + eventId);


            //mock get event


            // vm.event = {
            //     city: 'Zagreb',
            //     description: 'asas',
            //     ends_on: '2015-06-15T06:30:00',
            //     id: 3,
            //     location: '45.8275963,15.92102090000003',
            //     name: 'sa',
            //     repeat: 'w',
            //     resource_uri: '/api/v1/event/3/',
            //     starts_on: '2015-06-15T03:00:00',
            //     state: 'HR',
            //     street: 'Grgićev put ',
            //     zipcode: 10000
            // };


            // vm.eventLocation = vm.event.street + ', ' + vm.event.city + ', ' + vm.event.zipcode + ' ' + vm.event.state;

            // if (vm.event.location !== '0,0') {
            //     vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation) + '/@' + vm.event.location + ',15z';
            //     vm.mapurlTrue = true;
            // } else {
            //     vm.mapurlTrue = false;
            // }



            vm.loadingEvent = true;
            EventsFactory.query({
                format: 'json'
            }, {
                eventId: eventId
            }).$promise.then(function(data) {

                vm.event = data;
                vm.eventLocation = vm.event.street + ', ' + vm.event.city + ', ' + vm.event.zipcode + ' ' + vm.event.state;

                if (vm.event.location !== '0,0') {
                    vm.mapurl = 'https://www.google.com/maps/search/' + encodeURIComponent(vm.eventLocation) + '/@' + vm.event.location + ',15z';
                    vm.mapurlTrue = true;
                } else {
                    vm.mapurlTrue = false;
                }

                //convert datetime to local timezone
                vm.starts_on_date = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('dddd, MMMM D, YYYY');
                vm.ends_on_date = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('dddd, MMMM D, YYYY');
                vm.starts_on_time = moment.utc(vm.event.starts_on, moment.ISO_8601).local().format('H:mm A');
                vm.ends_on_time = moment.utc(vm.event.ends_on, moment.ISO_8601).local().format('H:mm A  UTCZ');


                if (vm.ends_on_date !== vm.starts_on_date) {
                    vm.firstrow = vm.starts_on_date + ' ' + vm.starts_on_time;
                    vm.secondrow = vm.ends_on_date + ' ' + vm.ends_on_time;
                } else {
                    vm.firstrow = vm.starts_on_date;
                    vm.secondrow = vm.starts_on_time + ' to ' + vm.ends_on_time;
                }


                vm.loadingEvent = false;

            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                vm.loadingEvent = false;
                $log.error(message);


            });
        }

        function openMap() {
            if (vm.mapurl !== '') {
                $window.open(vm.mapurl);
            }

        }



    }



})();