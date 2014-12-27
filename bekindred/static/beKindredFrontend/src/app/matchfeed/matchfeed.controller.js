'use strict';

angular.module('beKindred')
.controller('MatchFeedCtrl', function ($rootScope, $scope, $timeout, MatchFeedFactory) {

    $scope.matchedUser = [];
    $scope.total = 0;
    $scope.offset = 0;
    $scope.previous = null;
    $scope.next = null;

    // $scope.photosSlider = $scope.matchedUser.photos;
    $scope.photosSlider =  [
    {photo: 'static/img/profile/photo0.jpg', order: 0},
    {photo: 'static/img/profile/photo1.jpg', order: 1},
    {photo: 'static/img/profile/photo2.jpg', order: 2},
    {photo: 'static/img/profile/photo3.jpg', order: 3},
    {photo: 'static/img/profile/photo4.jpg', order: 4},
    {photo: 'static/img/profile/photo5.jpg', order: 5}
    ];

    $scope.loadingFeed = false;

    var pok = 0;

    if (pok === 0) {
        $scope.showDimmer = true;
        $rootScope.hideTopMenu = true;

        //load matchfeed initially;

        MatchFeedFactory.query({format: 'json'}).$promise.then(function(data) {

            $scope.total = data.meta.total_count;

            if ( $scope.total > 0) {

                $scope.matchedUser = data.objects[0];
                $scope.matchedUser.goals = [];
                $scope.matchedUser.offers = [];
                $scope.offset = data.meta.offset;
                $scope.total = data.meta.total_count;
                $scope.previous = data.meta.previous;
                $scope.next = data.meta.next;

            }
            $scope.showDimmer = false;
            $rootScope.hideTopMenu = false;
        });
        pok = 1;

    }
    else {
        $scope.showDimmer = false;
        $rootScope.hideTopMenu = false;
    }


    $rootScope.showfullprofile = false;


    $rootScope.$on('cancelMatchEvent', function() {
        $scope.cancelMatch();
    });

    $rootScope.$on('confirmMatchEvent', function() {
        $scope.confirmMatch();
    });

    $scope.getNextMatch = function() {

        $scope.loadingFeed = true;
        var newOffset = $scope.offset;
        newOffset++;

        if (newOffset === $scope.total) newOffset = 0;


        MatchFeedFactory.query({format: 'json', offset: newOffset, limit: 1}).$promise.then(function(data) {
            $scope.matchedUser = data.objects[0];
            $scope.matchedUser.goals = [];
            $scope.offset = data.meta.offset;
            $scope.matchedUser.offers = [];
            $scope.total = data.meta.total_count;
            $scope.previous = data.meta.previous;
            $scope.next = data.meta.next;
            $scope.loadingFeed = false;
        });

    };


    $scope.cancelMatch = function () {
        $scope.getNextMatch();

    };


    $scope.confirmMatch = function () {
        $scope.getNextMatch();
    };


    $scope.changeTopMenu = function() {
        $rootScope.hideTopMenu = true;
        $rootScope.showfullprofile = true;

        $('.horizontal.top.sidebar')
        .sidebar('show')
        ;
    };

});
