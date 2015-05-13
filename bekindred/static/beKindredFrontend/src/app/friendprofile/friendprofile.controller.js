(function() {
  'use strict';

  angular
    .module('icebrak')
    .controller('FriendProfileController', FriendProfileController);

  /**
   * class FriendProfileController
   * classDesc Connect with LinkedIn and Twitter or skip to mathcfeed
   * @ngInject
   */
  function FriendProfileController($scope, User, UserProfile, UsersFactory, MutualFriendsFactory, InboxRepository, InterestsFactory, GoalsFactory, Connection, OffersFactory, LikesFactory, PhotosFactory, $log, $state, FriendsFactory) {
    var vm = this;

    vm.matchingInfo = User;
    vm.nextImage = nextImage;

    vm.middleActive = true;
    vm.friendshipId = Connection.objects[0].id;

    vm.user = {
      id: UserProfile.id,
      facebook_id: UserProfile.facebook_id,
      firstName: UserProfile.first_name,
      lastName: UserProfile.last_name,
      age: UserProfile.age,
      about_me: UserProfile.about_me,
      photos: [],
      goals: [],
      offers: [],
      likes: [],
      interests: [],
      friends: [],
      facebookfriends: [],
      twitterfriends: [],
      twitterfollowers: [],
      linkedinconnections: [],
      linkedin_provider: User.objects[0].linkedin_provider,
      twitter_provider: User.objects[0].twitter_provider
    };

    vm.defaultUserPhoto = '//graph.facebook.com/' + vm.user.facebook_id + '/picture?type=large';

    vm.loadingUser = false;
    vm.loadingGoals = false;
    vm.loadingOffers = false;
    vm.loadingLikes = false;
    vm.loadingInterests = false;

    vm.photosSlider = [];

    vm.getUser = getUser;
    vm.getPhotos = getPhotos;
    vm.unFriend = unFriend;


    vm.getUser();
    vm.getPhotos();


    function nextImage() {
      $('#photoSlider').flexslider('next');
    }

    function getUser() {

      if (vm.matchingInfo.meta.total_count > 0) {
        vm.loadingUser = true;
        vm.loadingGoals = true;
        vm.loadingOffers = true;
        vm.loadingLikes = true;

        var goals = [];
        var matchedgoals = User.objects[0].goals[0];
        for (var key in matchedgoals) {
          var goal = {
            value: key,
            match: matchedgoals[key]
          };
          goals.push(goal);
        }
        vm.user.goals = goals;

        var offers = [];
        var matchedoffers = User.objects[0].offers[0];
        for (var key in matchedoffers) {
          var offer = {
            value: key,
            match: matchedoffers[key]
          };
          offers.push(offer);
        }
        vm.user.offers = offers;

        var interests = [];
        var matchedinterests = User.objects[0].interests[0];
        for (var key in matchedinterests) {
          var interest = {
            value: key,
            match: matchedinterests[key]
          };
          interests.push(interest);
        }
        vm.user.interests = interests;

        var likes = [];
        var matchedlikes = User.objects[0].likes[0];
        for (var key in matchedlikes) {
          var like = {
            value: key,
            match: matchedlikes[key]
          };
          likes.push(like);
        }
        vm.user.likes = likes;

      }

      //mutual friends
      MutualFriendsFactory.query({
        format: 'json',
        user_id: vm.user.id
      }).$promise.then(function(data) {
        if (data.objects.length > 0) {
          vm.user.friends = data.objects[0].mutual_bk_friends;
          vm.user.facebookfriends = data.objects[0].mutual_fb_friends;
          vm.user.linkedinconnections = data.objects[0].mutual_linkedin_connections;
          vm.user.twitterfollowers = data.objects[0].mutual_twitter_followers;
          vm.user.twitterfriends = data.objects[0].mutual_twitter_friends;

          vm.loadingUser = false;
          vm.loadingGoals = false;
          vm.loadingOffers = false;
          vm.loadingLikes = false;
          vm.loadingInterests = false;
        }

      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        // error handler
        $log.error(message);
        vm.loadingUser = false;
        vm.loadingGoals = false;
        vm.loadingOffers = false;
        vm.loadingLikes = false;

      });
    }



    function getPhotos() {
      PhotosFactory.query({
        format: 'json',
        user_id: vm.user.id
      }).$promise.then(function(response) {
        vm.user.photos = response.objects;



        if (vm.user.photos.length === 0) {
          var newPhoto = {
            photo: vm.defaultUserPhoto,
            order: 0,
            user: '/api/v1/auth/user/' + vm.user.id + '/'
          };

          PhotosFactory.save({}, newPhoto,
            function(success) {
              $log.info(success);
              $log.info('New photo saved.');
              vm.user.photos.push({
                photo: vm.defaultUserPhoto,
                cropped_photo: '',
                order: 0
              });
              vm.photosSlider = vm.user.photos;

            },
            function(error) {
              $log.info(error);
            });
        } else {
          vm.photosSlider = vm.user.photos;
        }
      }, function(response) {
        var data = response.data,
          status = response.status,
          header = response.header,
          config = response.config,
          message = 'Error ' + status;
        // error handler
        $log.error(message);

      });
    }


    function unFriend() {

      FriendsFactory.update({
          friendId: vm.friendshipId
        }, {
          status: -1
        },
        function(success) {
          InboxRepository.getInboxMessages();
          $state.go('myconnections');
        },
        function(error) {

        });
    }

  }



})();