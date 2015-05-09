'use strict';

angular.module('icebrak')
  .controller('MatchFeedCtrl', function($rootScope, $scope, $timeout, $filter, USER_ID, MatchFeedFactory, PhotosFactory, FriendsFactory, $log, MutualFriendsFactory) {

    $scope.matchedUser = [];
    $scope.total = 0;
    $scope.offset = 0;
    $scope.previous = null;
    $scope.next = null;

    $scope.me = '/api/v1/auth/user/' + USER_ID + '/';
    $scope.friendshipStatus = null;
    $scope.friendshipId = null;

    $rootScope.$emit('triggerRefreshFilters');
    $scope.filtering = true;


    // $scope.photosSlider = $scope.matchedUser.photos;
    $scope.photosSlider = [];

    $scope.loadingFeed = false;

    var pok = 0;


    $scope.totalfriendscount = 0;
    $scope.totalmatchingcount = 0;


    $scope.loadMatches = function() {

      $scope.totalfriendscount = 0;
      $scope.totalmatchingcount = 0;

      if (pok === 0) {
        $scope.showDimmer = true;
        $rootScope.showfullprofile = false;
        $rootScope.hideTopMenu = true;
        $('#filtersMenu').sidebar('hide');
        $scope.matchedUser = [];

        MatchFeedFactory.query({
          format: 'json',
          filter: $scope.filtering,
          order: $rootScope.orderBy
        }).$promise.then(function(data) {
          $scope.matchedUser = [];
          $scope.total = 0;
          $scope.offset = 0;
          $scope.previous = null;
          $scope.next = null;
          var result = data.objects;
          if (result.length > 0) {
            $scope.total = data.meta.total_count;
            $scope.matchedUser = data.objects[0];
            $scope.offset = data.meta.offset;
            $scope.total = data.meta.total_count;
            $scope.previous = data.meta.previous;
            $scope.next = data.meta.next;

            var goals = [];
            var matchedgoals = $scope.matchedUser.goals[0];
            for (var key in matchedgoals) {
              var goal = {
                value: key,
                match: matchedgoals[key]
              };
              goals.push(goal);
              if (goal.match === 1) {
                $scope.totalmatchingcount++;
              }
            }
            $scope.matchedUser.goals = goals;

            var offers = [];
            var matchedoffers = $scope.matchedUser.offers[0];
            for (var key in matchedoffers) {
              var offer = {
                value: key,
                match: matchedoffers[key]
              };
              offers.push(offer);
              if (offer.match === 1) {
                $scope.totalmatchingcount++;
              }
            }
            $scope.matchedUser.offers = offers;

            var interests = [];
            var matchedinterests = $scope.matchedUser.interests[0];
            for (var key in matchedinterests) {
              var interest = {
                value: key,
                match: matchedinterests[key]
              };
              interests.push(interest);
              if (interest.match === 1) {
                $scope.totalmatchingcount++;
              }
            }
            $scope.matchedUser.interests = interests;

            var likes = [];
            var matchedlikes = $scope.matchedUser.likes[0];
            for (var key in matchedlikes) {
              var like = {
                value: key,
                match: matchedlikes[key]
              };
              likes.push(like);
              if (like.match === 1) {
                $scope.totalmatchingcount++;
              }
            }
            $scope.matchedUser.likes = likes;


            //mutual friends
            MutualFriendsFactory.query({
              format: 'json',
              user_id: $scope.matchedUser.id
            }).$promise.then(function(data) {
              if (data.objects.length > 0) {
                $scope.matchedUser.friends = data.objects[0].mutual_bk_friends;
                $scope.matchedUser.facebookfriends = data.objects[0].mutual_fb_friends;
                $scope.matchedUser.linkedinconnections = data.objects[0].mutual_linkedin_connections;
                $scope.matchedUser.twitterfollowers = data.objects[0].mutual_twitter_followers;
                $scope.matchedUser.twitterfriends = data.objects[0].mutual_twitter_friends;
                $scope.totalfriendscount += data.objects[0].mutual_bk_friends_count;
                $scope.totalfriendscount += data.objects[0].mutual_fb_friends_count;
                $scope.totalfriendscount += data.objects[0].mutual_linkedin_connections_count;
                $scope.totalfriendscount += data.objects[0].mutual_twitter_followers_count;
                $scope.totalfriendscount += data.objects[0].mutual_twitter_friends_count;
              }

            });

            //get default photo
            $scope.defaultUserPhoto = '//graph.facebook.com/' + $scope.matchedUser.facebook_id + '/picture?type=large';
            //save default photo if no photos

            PhotosFactory.query({
              format: 'json',
              user_id: $scope.matchedUser.user_id
            }).$promise.then(function(response) {
              $scope.matchedUser.photos = response.objects;
              if ($scope.matchedUser.photos.length > 0) {
                $scope.photosSlider = $scope.matchedUser.photos;
              } else {
                var newPhoto = {
                  photo: $scope.defaultUserPhoto,
                  order: 0,
                  user: '/api/v1/auth/user/' + $scope.matchedUser.user_id + '/'
                };


                PhotosFactory.save({}, newPhoto,
                  function(success) {
                    $log.info(success);
                    $log.info('New photo saved.');
                    $scope.matchedUser.photos.push(success);
                    $scope.photosSlider = $scope.matchedUser.photos;

                  },
                  function(error) {
                    $log.info(error);
                  });

              }

              $scope.photosSlider = $filter('orderBy')($scope.photosSlider, 'order', false);

            });



          } else {
            $scope.matchedUser = [];
            $scope.total = 0;
            $scope.offset = 0;
            $scope.previous = null;
            $scope.next = null;
          }
          $scope.showDimmer = false;
          $rootScope.hideTopMenu = false;
          $scope.filtering = true;
        }, function(response) {
          $scope.filtering = true;
          var data = response.data,
            status = response.status,
            header = response.header,
            config = response.config,
            message = 'Error ' + status;
          // error handler
          $log.error(message);
          $scope.matchedUser = [];
          $scope.total = 0;
          $scope.offset = 0;
          $scope.previous = null;
          $scope.next = null;
          $scope.showDimmer = false;
          $rootScope.hideTopMenu = false;
        });

        pok = 1;

      } else {
        $scope.showDimmer = false;
        $rootScope.hideTopMenu = false;
      }



    };



    //load matchfeed initially;
    $scope.loadMatches();



    $rootScope.showfullprofile = false;


    $rootScope.$on('cancelMatchEvent', function() {
      $scope.cancelMatch();
    });

    $rootScope.$on('confirmMatchEvent', function() {
      $scope.confirmMatch();
    });

    $rootScope.$on('refreshMatchFeed', function() {
      pok = 0;
      $scope.filtering = true;
      $scope.loadMatches();
    });

    $scope.getNextMatch = function() {

      $scope.totalfriendscount = 0;
      $scope.totalmatchingcount = 0;

      $scope.loadingFeed = true;
      var newOffset = $scope.offset;
      newOffset++;

      if (newOffset === $scope.total) newOffset = 0;

      $log.info($scope.total);


      MatchFeedFactory.query({
        format: 'json',
        offset: 0,
        limit: 1,
        filter: $scope.filtering,
        order: $rootScope.orderBy
      }).$promise.then(function(data) {
        var result = data.objects;
        if (result.length > 0) {
          $log.info('more results');
          $log.info(result.length);
          $scope.matchedUser = data.objects[0];
          $scope.offset = data.meta.offset;
          $scope.total = data.meta.total_count;
          $scope.previous = data.meta.previous;
          $scope.next = data.meta.next;

          var goals = [];
          var matchedgoals = $scope.matchedUser.goals[0];
          for (var key in matchedgoals) {
            var goal = {
              value: key,
              match: matchedgoals[key]
            };
            goals.push(goal);
            if (goal.match === 1) {
              $scope.totalmatchingcount++;
            }
          }
          $scope.matchedUser.goals = goals;

          var offers = [];
          var matchedoffers = $scope.matchedUser.offers[0];
          for (var key in matchedoffers) {
            var offer = {
              value: key,
              match: matchedoffers[key]
            };
            offers.push(offer);
            if (offer.match === 1) {
              $scope.totalmatchingcount++;
            }
          }
          $scope.matchedUser.offers = offers;

          var interests = [];
          var matchedinterests = $scope.matchedUser.interests[0];
          for (var key in matchedinterests) {
            var interest = {
              value: key,
              match: matchedinterests[key]
            };
            interests.push(interest);
            if (interest.match === 1) {
              $scope.totalmatchingcount++;
            }
          }
          $scope.matchedUser.interests = interests;

          var likes = [];
          var matchedlikes = $scope.matchedUser.likes[0];
          for (var key in matchedlikes) {
            var like = {
              value: key,
              match: matchedlikes[key]
            };
            likes.push(like);
            if (like.match === 1) {
              $scope.totalmatchingcount++;
            }
          }
          $scope.matchedUser.likes = likes;

          //mutual friends
          MutualFriendsFactory.query({
            format: 'json',
            user_id: $scope.matchedUser.id
          }).$promise.then(function(data) {
            if (data.objects.length > 0) {
              $scope.matchedUser.friends = data.objects[0].mutual_bk_friends;
              $scope.matchedUser.facebookfriends = data.objects[0].mutual_fb_friends;
              $scope.matchedUser.linkedinconnections = data.objects[0].mutual_linkedin_connections;
              $scope.matchedUser.twitterfollowers = data.objects[0].mutual_twitter_followers;
              $scope.matchedUser.twitterfriends = data.objects[0].mutual_twitter_friends;
              $scope.totalfriendscount += data.objects[0].mutual_bk_friends_count;
              $scope.totalfriendscount += data.objects[0].mutual_fb_friends_count;
              $scope.totalfriendscount += data.objects[0].mutual_linkedin_connections_count;
              $scope.totalfriendscount += data.objects[0].mutual_twitter_followers_count;
              $scope.totalfriendscount += data.objects[0].mutual_twitter_friends_count;
            }

          });

          //get default photo
          $scope.defaultUserPhoto = '//graph.facebook.com/' + $scope.matchedUser.facebook_id + '/picture?type=large';
          //save default photo if no photos
          PhotosFactory.query({
            format: 'json',
            user_id: $scope.matchedUser.user_id
          }).$promise.then(function(response) {
            $scope.matchedUser.photos = response.objects;
            if ($scope.matchedUser.photos.length > 0) {
              $scope.photosSlider = $scope.matchedUser.photos;
            } else {
              var newPhoto = {
                photo: $scope.defaultUserPhoto,
                order: 0,
                user: '/api/v1/auth/user/' + $scope.matchedUser.user_id + '/'
              };


              PhotosFactory.save({}, newPhoto,
                function(success) {
                  $log.info(success);
                  $log.info('New photo saved.');
                  $scope.matchedUser.photos.push(success);
                  $scope.photosSlider = $scope.matchedUser.photos;

                },
                function(error) {
                  $log.info(error);
                });

            }

            $scope.photosSlider = $filter('orderBy')($scope.photosSlider, 'order', false);

          });
        } else {
          $scope.matchedUser = [];
          $scope.total = 0;
          $scope.offset = 0;
          $scope.previous = null;
          $scope.next = null;
        }


        $scope.loadingFeed = false;
      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        // error handler
        $log.error(message);
        $scope.matchedUser = [];
        $scope.total = 0;
        $scope.offset = 0;
        $scope.previous = null;
        $scope.next = null;
        $scope.showDimmer = false;
        $rootScope.hideTopMenu = false;
      });

    };


    $scope.cancelMatch = function() {
      $log.info('cancel match');

      var friendship = {
        friend1: $scope.me,
        friend2: '/api/v1/auth/user/' + $scope.matchedUser.user_id + '/',
        status: -1
      };

      //deny friendship with status -1
      FriendsFactory.save(friendship,
        function(success) {
          $scope.getNextMatch();
        },
        function(error) {

        });

    };

    $scope.cancelMatchDesktop = function() {
      $rootScope.hideTopMenu = false;
      $rootScope.showfullprofile = false;
      $scope.cancelMatch();
    }

    $scope.confirmMatchDesktop = function() {
      $rootScope.hideTopMenu = false;
      $rootScope.showfullprofile = false;
      $scope.confirmMatch();
    }


    $scope.confirmMatch = function() {

      $log.info('accept match');
      var friendship = {
        friend1: $scope.me,
        friend2: '/api/v1/auth/user/' + $scope.matchedUser.user_id + '/',
        status: 0
      };

      //add to friends with status 0
      FriendsFactory.save(friendship,
        function(success) {
          $scope.getNextMatch();
        },
        function(error) {

        });


    };


    $scope.changeTopMenu = function() {
      $rootScope.hideTopMenu = true;
      $rootScope.showfullprofile = true;

      $('#MatchMenu')
        .sidebar('toggle');
    };

  });