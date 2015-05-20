(function() {
    'use strict';

    angular
        .module('icebrak')
        .controller('InterestsController', InterestsController);

    /**
     * class InterestsController
     * classDesc Select interests and activities during onboard user flow
     * @ngInject
     */
    function InterestsController(InterestsFactory, $rootScope, $http, APP_ID, InterestSubjectFactory, $log, notify, USER_ID, $filter, $timeout, $resource, $state, $q, lodash, $scope, $window) {
        var vm = this;

        vm.useInterest = useInterest;
        vm.getAllInterests = getAllInterests;
        vm.nextStep = nextStep;
        vm.searchQuery = '';
        vm.userUri = '/api/v1/auth/user/' + USER_ID + '/';

        vm.next = null;
        vm.nextOffset = 100;
        vm.loadingMore = false;
        vm.noResults = false;
        vm.reset = reset;
        vm.loadMoreInterests = loadMoreInterests;

        vm.allInterests = [];
        vm.counter = 0;

        vm.loadingInterests = false;

        vm.userInterests = [];

        var w = angular.element($window);

        vm.limit = 100;


        vm.getAllInterests();



        function nextStep() {
            if (vm.counter > 0) {
                //post event to facebook analytics
                var url = 'https://graph.facebook.com/v2.3/' + APP_ID + '/activities?access_token=' + $rootScope.fbAuth.accessToken;
                var timestamp = Math.round(+new Date() / 1000);
                var activity = {
                    'event': 'CUSTOM_APP_EVENTS',
                    'application_tracking_enabled': 1,
                    'advertiser_tracking_enabled': 0,
                    'custom_events': [{
                        '_eventName': 'Onboarding flow user created interests',
                        '_appVersion': '0.0.1',
                        '_logTime': timestamp,
                        'fb_content_type': 'Onboarding flow',
            }]
                };
                $http.post(url, activity).
                success(function(data, status, headers, config) {
                    $log.info('FB activity post success');
                }).
                error(function(data, status, headers, config) {
                    $log.error('FB activity post failure');
                });
                $state.go('goalcreate');

            } else {
                notify({
                    messageTemplate: '<div class="notify-info-header">Warning</div>' +
                        '<p>To continue please select at least one interest.</p>',
                    scope: $scope,
                    classes: 'notify-info',
                    icon: 'warning circle',
                    duration: 4000
                });
            }
        }

        function reset() {
            vm.searchQuery = '';
            vm.getAllInterests();
            vm.noResults = false;
        }

        function getAllInterests() {
            vm.userInterests = [];
            if (w.width() > 400) {
                vm.limit = 400;
            }


            vm.nextOffset = 100;
            vm.next = null;
            vm.noResults = false;
            vm.loadingInterests = true;
            vm.allInterests.splice(0, vm.allInterests.length);

            InterestsFactory.query({
                user_id: USER_ID,
                format: 'json',
                limit: 200,
                offset: 0
            }).$promise.then(function(data) {

                vm.counter = data.meta.total_count;

                if (data.objects.length > 0) {
                    vm.userInterests = data.objects;
                }

                InterestSubjectFactory.query({
                    format: 'json',
                    limit: vm.limit,
                    description__icontains: vm.searchQuery,
                    offset: 0
                }).$promise.then(function(data) {
                    vm.next = data.meta.next;

                    var results = data.objects;

                    if (results.length > 0) {

                        //preselect already created interests
                        for (var j = results.length - 1; j >= 0; j--) {
                            results[j].active = false;
                            results[j].interest_resource = null;
                            for (var i = vm.userInterests.length - 1; i >= 0; i--) {
                                if (results[j].resource_uri === vm.userInterests[i].interest) {
                                    results[j].interest_resource = vm.userInterests[i].resource_uri;
                                    results[j].active = true;
                                }
                            }
                            vm.allInterests.push(results[j]);
                        }

                    } else {
                        vm.allInterests.splice(0, vm.allInterests.length);
                        vm.noResults = true;
                    }



                    vm.loadingInterests = false;
                }, function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;
                    $log.error(message);
                    vm.loadingInterests = false;

                });



            }, function(response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config,
                    message = 'Error ' + status;
                $log.error(message);
                vm.loadingInterests = false;

            });


        }

        function loadMoreInterests() {
            var deferred = $q.defer();
            if (!vm.loadingMore) {
                if (vm.next !== null) {

                    vm.loadingMore = true;
                    $timeout(function() {
                        InterestsFactory.query({
                            user_id: USER_ID,
                            format: 'json',
                            limit: 200,
                            offset: 0
                        }).$promise.then(function(data) {
                            vm.counter = data.meta.total_count;
                            if (data.objects.length > 0) {
                                vm.userInterests = data.objects;
                            }

                            InterestSubjectFactory.query({
                                format: 'json',
                                description__icontains: vm.searchQuery,
                                offset: vm.nextOffset,
                                limit: 30
                            }).$promise.then(function(data) {
                                var responseData = data.objects;
                                vm.next = data.meta.next;
                                vm.nextOffset += 30;


                                if (data.objects.length > 0) {
                                    responseData = data.objects;

                                }



                                for (var j = responseData.length - 1; j >= 0; j--) {
                                    responseData[j].active = false;
                                    responseData[j].interest_resource = null;
                                    for (var i = vm.userInterests.length - 1; i >= 0; i--) {
                                        if (responseData[j].resource_uri === vm.userInterests[i].interest) {
                                            responseData[j].interest_resource = vm.userInterests[i].resource_id;

                                            responseData[j].active = true;
                                        }
                                    }
                                    vm.allInterests.push(responseData[j]);
                                }
                                vm.loadingMore = false;
                                deferred.resolve();
                            }, function(response) {
                                var data = response.data,
                                    status = response.status,
                                    header = response.header,
                                    config = response.config,
                                    message = 'Error ' + status;
                                $log.error(message);
                                vm.loadingMore = false;
                                deferred.reject();

                            });


                        }, function(response) {
                            var data = response.data,
                                status = response.status,
                                header = response.header,
                                config = response.config,
                                message = 'Error ' + status;
                            $log.error(message);
                            deferred.reject();


                        });

                    }, 400);

                } else {
                    deferred.reject();
                }

            } else {

                deferred.reject();
            }

            return deferred.promise;
        }


        function useInterest(index) {
            var selected = vm.allInterests[index];

            if (selected) {


                if (selected.active) {

                    //deselect interest and delete from database
                    var Interest = $resource(selected.interest_resource);
                    selected.loading = true;
                    Interest.delete().$promise.then(function(data) {
                        selected.active = false;
                        selected.interest_resource = null;
                        vm.counter--;
                        selected.loading = false;
                    }, function(response) {
                        var data = response.data,
                            status = response.status,
                            header = response.header,
                            config = response.config,
                            message = 'Error ' + status;
                        $log.error(message);
                        selected.loading = false;
                        selected.error = true;
                    });



                } else {
                    if (vm.counter >= 10) {


                        notify({
                            messageTemplate: '<div class="notify-info-header">Warning</div>' +
                                '<p>Please select up to 10 interests.</p>',
                            scope: $scope,
                            classes: 'notify-info',
                            icon: 'warning circle'
                        });
                    } else {

                        //select and save new interest
                        var newInterest = {
                            interest_subject: selected.description,
                            user: vm.userUri
                        };
                        selected.loading = true;
                        InterestsFactory.save({}, newInterest,
                            function(success) {
                                // $log.info(selected);
                                selected.loading = false;
                                selected.error = false;
                                selected.interest_resource = success.resource_uri;
                                selected.active = true;
                                vm.counter++;
                            },
                            function(error) {
                                selected.errorMessage = error.data.interest.error[0];

                                notify({
                                    messageTemplate: '<div class="notify-info-header">Error</div>' +
                                        '<p>' + selected.errorMessage + '</p>',
                                    scope: $scope,
                                    classes: 'notify-info',
                                    icon: 'warning circle'
                                });

                                selected.loading = false;
                                selected.error = true;

                            });

                    }
                }



            }


        }
    }



})();