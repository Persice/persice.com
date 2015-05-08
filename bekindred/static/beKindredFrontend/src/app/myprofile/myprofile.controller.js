'use strict';

angular.module('icebrak')
  .controller('MyProfileCtrl', function($scope, USER_ID, UsersFactory, InterestsFactory, GoalsFactory, OffersFactory, LikesFactory, PhotosFactory, USER_PHOTO, $log) {
    $scope.social = {
      twitter: '',
      linkedin: ''
    };
    $scope.user = {
      id: 1,
      firstName: '',
      lastName: '',
      age: '',
      about_me: '',
      photos: [],
      goals: [

    ],
      offers: [

    ],
      likes: [],
      interests: [],
      mutual: {
        friends: [],
        facebookfriends: [],
        twitterfriends: [],
        twitterfollowers: [],
        linkedinconnections: [],
      }
    };

    $scope.loadingUser = false;
    $scope.loadingGoals = false;
    $scope.loadingOffers = false;
    $scope.loadingLikes = false;
    $scope.loadingInterests = false;

    $scope.getUser = function() {

      $scope.loadingUser = true;
      $scope.loadingGoals = true;
      $scope.loadingOffers = true;
      $scope.loadingLikes = true;

      GoalsFactory.query({
        user_id: USER_ID,
        format: 'json'
      }).$promise.then(function(data) {
        if (data.meta.total_count > 0) {
          $scope.user.goals = data.objects;
        }
        $scope.loadingGoals = false;

      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        $log.error(message);


      });

      OffersFactory.query({
        user_id: USER_ID,
        format: 'json'
      }).$promise.then(function(data) {
        if (data.meta.total_count > 0) {
          $scope.user.offers = data.objects;
        }
        $scope.loadingOffers = false;

      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        $log.error(message);


      });

      LikesFactory.query({
        format: 'json'
      }).$promise.then(function(data) {
        if (data.meta.total_count > 0) {
          $scope.user.likes = data.objects;
        }
        $scope.loadingLikes = false;

      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        $log.error(message);


      });


      InterestsFactory.query({
        user_id: USER_ID,
        format: 'json'
      }).$promise.then(function(data) {
        if (data.meta.total_count > 0) {
          $scope.user.interests = data.objects;
        }
        $scope.loadingInterests = false;

      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        $log.error(message);


      });


      UsersFactory.get({
        format: 'json'
      }, {
        userId: USER_ID
      }).$promise.then(function(data) {

        $scope.user.firstName = data.first_name;
        $scope.user.lastName = data.last_name;
        $scope.user.about_me = data.about_me;
        $scope.user.age = data.age;
        $scope.user.facebookId = data.facebook_id;
        $scope.user.facebookProfile = data.facebook_profile_url;


        if (data.twitter_provider !== null) {
          $scope.social.twitter = data.twitter_provider;
        }

        if (data.linkedin_provider !== null) {
          $scope.social.linkedin = data.linkedin_provider;
        }

        $scope.loadingUser = false;

      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        $scope.loadingUser = false;
        $log.error(message);


      });
    };

    $scope.getUser();

    $scope.photosSlider = [];


    $scope.getPhotos = function() {
      PhotosFactory.query({
        format: 'json'
      }).$promise.then(function(response) {
        $scope.user.photos = response.objects;

        if ($scope.user.photos.length === 0) {
          var newPhoto = {
            photo: USER_PHOTO,
            cropped_photo: '',
            order: 0,
            user: '/api/v1/auth/user/' + USER_ID + '/'
          };

          PhotosFactory.save({}, newPhoto, function(success) {
            $log.info(success);
            $log.info('New photo saved.');
            $scope.user.photos.push({
              photo: USER_PHOTO,
              cropped_photo: '',
              order: 0
            });
            $scope.photosSlider = $scope.user.photos;

          }, function(error) {
            $log.info(error);
          });
        } else {
          $scope.photosSlider = $scope.user.photos;
        }
      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        $log.error(message);
      });
    };

    $scope.getPhotos();


  });