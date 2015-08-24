(function() {
    'use strict';

    angular
        .module('persice')
        .controller('CrowdController', CrowdController);

    /**
     * class CrowdController
     * classDesc view match feed crowd
     * @ngInject
     */
    function CrowdController($scope, $log, $timeout, $q, MatchFeedFactory, $rootScope, $state) {
        var vm = this;

        vm.people = [];
        vm.options = {
            animate: {
                duration: 1500,
                enabled: true
            },
            size: 70,
            barColor: '#FA8072',
            scaleColor: false,
            lineWidth: 3,
            lineCap: 'circle',
            rotate: 180,
            trackColor: '#C0C0C0'
        };


        vm.loading = false;
        vm.loadingMore = false;
        vm.noResults = false;


        vm.nextOffset = 12;
        vm.next = null;


        vm.getCrowd = getCrowd;
        vm.loadMore = loadMore;

        vm.getCrowd();

        $rootScope.$on('refreshMatchFeed', function() {
            if ($state.is('matchfeed2')) {
                vm.getCrowd();
            }
        });

        function getCrowd() {
            vm.nextOffset = 12;
            vm.next = null;
            vm.loading = true;
            vm.noResults = false;

            MatchFeedFactory.query({
                format: 'json',
                limit: 12,
                offset: 0,
                filter: true
            }).$promise.then(function(data) {
                    var results = data.objects;
                    vm.people = [];

                    vm.next = data.meta.next;

                    if (data.objects.length === 0) {

                        vm.noResults = true;

                    } else {
                        for (var obj in results) {
                            vm.people.push(results[obj]);
                        }
                    }


                    vm.loading = false;


                },
                function(response) {
                    var data = response.data,
                        status = response.status,
                        header = response.header,
                        config = response.config,
                        message = 'Error ' + status;

                    $log.error(message);

                    vm.noResults = true;

                    vm.loading = false;

                });


        }

        function loadMore() {
            var deferred = $q.defer();
            if (vm.next === null) {
                deferred.reject();
                return deferred.promise;
            }

            if (!vm.loadingMore) {

                vm.loadingMore = true;
                MatchFeedFactory.query({
                    format: 'json',
                    limit: 6,
                    offset: vm.nextOffset
                }).$promise.then(function(data) {
                        var results = data.objects;
                        vm.nextOffset += 6;
                        vm.next = data.meta.next;

                        for (var obj in results) {
                            vm.people.push(results[obj]);
                        }
                        vm.loadingMore = false;
                        deferred.resolve();


                    },
                    function(response) {
                        deferred.reject();
                        var data = response.data,
                            status = response.status,
                            header = response.header,
                            config = response.config,
                            message = 'Error ' + status;

                        $log.error(message);

                        vm.loadingMore = false;
                        deferred.reject();

                    });


            } else {
                deferred.reject();
            }


            return deferred.promise;
        }


    }

})();
