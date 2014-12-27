'use strict';

angular.module('beKindred')
.controller('MatchFeedCtrl', function ($rootScope, $scope, $timeout, MatchFeedService, MatchedUser, MatchFeedFactory) {

    $scope.matchedUser = MatchedUser.match;
    $scope.total = MatchedUser.total;
    $scope.next = MatchedUser.next;
    $scope.photosSlider = $scope.matchedUser.photos;
    $scope.loadingFeed = false;




    // $scope.showDimmer = true;
    // $rootScope.hideTopMenu = true;
    $rootScope.showfullprofile = false;


    // $timeout(function(){
    //     $scope.showDimmer = false;
    //     $rootScope.hideTopMenu = false;
    // }, 2000);





    $scope.showDimmer = false;
    $rootScope.hideTopMenu = false;



    $rootScope.$on('cancelMatchEvent', function(e) {
        $scope.cancelMatch();
    });

    $rootScope.$on('confirmMatchEvent', function(e) {
        $scope.confirmMatch();
    });

    $scope.$on('ngRepeatFinished', function () {

        // $('#PhotoSlider').owlCarousel({items: 1, nav: false, dots: true});
    });


    $scope.cancelMatch = function () {
        $scope.loadingFeed = true;

        //TODO: Confirm match save to backend



        //Get next matched user
        $timeout(function(){
            var nextMatch = MatchFeedService.findNextMatch($scope.next);
            $scope.matchedUser = nextMatch.match;
            $scope.total = nextMatch.total;
            $scope.next = nextMatch.next;
            $scope.photosSlider = $scope.matchedUser.photos;
            $scope.loadingFeed = false;

        }, 300);


    };

    $scope.confirmMatch = function () {
        $scope.loadingFeed = true;

        //TODO: Confirm match save to backend



        //Get next matched user
        $timeout(function(){
            var nextMatch = MatchFeedService.findNextMatch($scope.next);
            $scope.matchedUser = nextMatch.match;
            $scope.total = nextMatch.total;
            $scope.next = nextMatch.next;
            $scope.photosSlider = $scope.matchedUser.photos;
            $scope.loadingFeed = false;
        }, 300);



    };


    $scope.changeTopMenu = function() {
        $rootScope.hideTopMenu = true;
        $rootScope.showfullprofile = true;

        $('.horizontal.top.sidebar')
        .sidebar('show')
        ;
    };

});
