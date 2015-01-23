'use strict';

angular.module('beKindred')
.controller('EditMyProfileCtrl', function ($scope, $timeout, USER_ID, USER_TWITTER, USER_LINKEDIN_NAME, USER_LINKEDIN_URL, UsersFactory, GoalsFactory, LikesFactory, SubjectsFactory, OffersFactory, InterestsFactory, PhotosFactory, $log, $filter, $cookies, $http, FB_TOKEN, $location, $anchorScroll, $window, $resource, $document) {
  $scope.twitter = USER_TWITTER;
  $scope.linkedin = USER_LINKEDIN_NAME;
  $scope.linkedinUrl = USER_LINKEDIN_URL;
  $scope.user = {
    id: USER_ID,
    firstName: '',
    lastName: '',
    age: '',
    about_me: '',
    photos: [
    {id: 0, order: 0, photo: ''},
    {id: 0, order: 1, photo: ''},
    {id: 0, order: 2, photo: ''},
    {id: 0, order: 3, photo: ''},
    {id: 0, order: 4, photo: ''},
    {id: 0, order: 5, photo: ''}
    ],
    goals: [

    ],
    offers: [

    ],
    likes: [
    ],
    interests: [
    ],
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

  $scope.getUser = function () {

    $scope.loadingUser = true;
    $scope.loadingGoals = true;
    $scope.loadingOffers = true;
    $scope.loadingLikes = true;
    $scope.loadingInterests = true;

    GoalsFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
      if (data.meta.total_count > 0) {
        $scope.user.goals = data.objects;
      }
      $scope.loadingGoals = false;

    });

    OffersFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
      if (data.meta.total_count > 0) {
        $scope.user.offers = data.objects;
      }
      $scope.loadingOffers = false;

    });

    LikesFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
      if (data.meta.total_count > 0) {
        $scope.user.likes = data.objects;
      }
      $scope.loadingLikes = false;

    });


    InterestsFactory.query({user_id: USER_ID, format: 'json'}).$promise.then(function(data) {
      if (data.meta.total_count > 0) {
        $scope.user.interests = data.objects;
      }
      $scope.loadingInterests = false;

    });



    UsersFactory.get({format: 'json'}, {userId: USER_ID}).$promise.then(function(data) {

      $scope.user.firstName = data.first_name;
      $scope.user.lastName = data.last_name;
      $scope.user.about_me = data.about_me;
      $scope.user.age = data.age;
      $scope.user.facebookId = data.facebook_id;

      $scope.loadingUser = false;

    });
  };

  $scope.getUser();


    //about_me
    $scope.loadingAbout = false;
    $scope.saveAbout = function() {
      $scope.loadingAbout = true;
      UsersFactory.update({userId: USER_ID}, {about_me:  $scope.user.about_me },
        function(success) {
          $log.info('About changes saved');
          $scope.loadingAbout = false;
        }, function(error) {
          $log.info(error);
        });
    };

    $scope.loadingCreatingNew = false;
    //interests
    $scope.editInterest = false;
    $scope.interest = '';
    $scope.messageShow = false;
    $scope.message = '';

    $scope.interestChanged = function (str) {
      $scope.interest = str;
    };

    $scope.selectInterest = function (object) {
      if (object !== undefined) {
        $scope.interest = object.originalObject.description;
      }
      else {
      }

    };

    $scope.createNewInterest = function() {
      $log.info('creating interest');
      $scope.editInterest = true;
    };

    $scope.closeEditInterest = function() {
      $scope.interest = '';
      $scope.messageShow = false;
      $scope.message = '';
      $scope.editInterest = false;
    };

    $scope.removeInterest = function(index) {

      var Interest = $resource($scope.user.interests[index].resource_uri);

      Interest.delete().$promise.then(function(data) {
        $scope.user.interests.splice(index, 1);
      });
    };

    $scope.saveCurrentInterest = function(index) {

    };

    $scope.saveInterest = function() {
      $scope.loadingCreatingNew = false;
    //if subject is empty warn user to enter subject
    if ($scope.interest === '') {
      $scope.message = 'Interest cannot be empty';
      $scope.messageShow = true;
      return false;
    }

    var newInterest = {
      user: $scope.userUri,
      description: $scope.interest
    };

    //check if user already has created this interest
    InterestsFactory.query({format: 'json', description: $scope.interest, user_id: USER_ID}).$promise.then(function(data) {
      var userInterests = data.objects;
      var findInterest = null;
      findInterest = $filter('getByProperty')('description', $scope.interest, userInterests);
      if (findInterest !== null) {
        $scope.message = 'You have already created this interest.';
        $scope.messageShow = true;
      }
      else {
        $scope.loadingCreatingNew = true;
        InterestsFactory.save({}, newInterest,
          function(success){
            $scope.loadingCreatingNew = false;
            $scope.user.interests.push(success);
            $scope.closeEditInterest();

          },
          function(error) {
            $scope.loadingCreatingNew = false;

          });
      }
    });


  };


    //photos

    $scope.apiPhotos = [];
    $scope.facebookPhotos = [];

    $scope.onDropComplete = function (index, obj, evt) {
      var otherObj = $scope.user.photos[index];
      var otherIndex = $scope.user.photos.indexOf(obj);

      $scope.user.photos[index] = obj;
      $scope.user.photos[index].order = index;
      $scope.user.photos[otherIndex] = otherObj;
      $scope.user.photos[otherIndex].order = otherIndex;


      if ($scope.user.photos[index].id !== 0) {
            //API update photo - patch method
            PhotosFactory.update({photoId: $scope.user.photos[index].id}, {order:  $scope.user.photos[index].order },
              function(success) {
                $log.info('Photo order saved');
              }, function(error) {
                $log.info(error);
              });

          }


          if ($scope.user.photos[otherIndex].id !== 0) {
            //API update photo - patch method
            PhotosFactory.update({photoId: $scope.user.photos[otherIndex].id}, {order:  $scope.user.photos[otherIndex].order },
              function(success) {
                $log.info('Photo order saved');
              }, function(error) {
                $log.info(error);
              });

          }

        };

        $scope.getPhotos = function() {
          PhotosFactory.query( {
            format: 'json'
          }).$promise.then(function(response) {
            $scope.apiPhotos = response.objects;
            $log.info($scope.apiPhotos);
            for(var obj in $scope.apiPhotos) {
              for(var p in $scope.user.photos) {
                if ($scope.user.photos[p].order === $scope.apiPhotos[obj].order) {
                  $scope.user.photos[p].id = $scope.apiPhotos[obj].id;
                  $scope.user.photos[p].photo = $scope.apiPhotos[obj].photo;
                }
              }
            }
          });
        };

        $scope.getPhotos();

        $scope.currentAlbum = '';


        $scope.getFBPhotos = function(id, name) {

          $scope.hideAlbums = true;
          $scope.currentAlbum = name;
          $scope.photosLoading = true;

          $http.get('https://graph.facebook.com/' + id + '?fields=photos{id,height,width,source}&access_token=' + FB_TOKEN).
          success(function(data, status, headers, config) {
            $log.info(data);

            $scope.photosLoading = false;

            $scope.facebookPhotos = data.photos.data;
          }).
          error(function(data, status, headers, config) {
            $log.info(data);
            $scope.photosLoading = false;
          });



        };

        $scope.backToAlbums = function () {
          $scope.currentAlbum = '';
          $scope.hideAlbums = !$scope.hideAlbums;
          $scope.getFBAlbums();

        };

        $scope.facebookAlbums = [];
        $scope.hideAlbums = false;


        $scope.getFBAlbums = function() {
          $scope.showModal = true;
          $scope.albumsLoading = true;
          $http.get('https://graph.facebook.com/me/albums?fields=picture,name&access_token=' + FB_TOKEN).
          success(function(data, status, headers, config) {
            $log.info(data);
            $scope.facebookAlbums = data.data;
            $scope.albumsLoading = false;

          }).
          error(function(data, status, headers, config) {
            $log.info(data);
            $scope.albumsLoading = false;
          });



        };




        $scope.deletePhoto = function() {
          var deleteIndex = $scope.userPhotoDeleteIndex;
        //API delete call
        PhotosFactory.delete({photoId: $scope.user.photos[deleteIndex].id},
          function(success) {
            $scope.user.photos[deleteIndex].photo = '';
            $scope.user.photos[deleteIndex].id = 0;
            $log.info('Photo deleted');

          },
          function(error) {
            $log.info(error);
          });

      };

      $scope.closeModal = function() {
        $log.info('scroll to top');
        $scope.showModal = false;


        $timeout(function(){
          $location.hash('my-profile-header-edit');
          $anchorScroll();
        }, 600);

      };

      $scope.showModal = false;
      $scope.albumsLoading = false;
      $scope.photosLoading = false;

      $scope.createPhoto = function(indexFbPhoto) {

        $log.info('Creating photo');


        var newFbPhoto = $scope.facebookPhotos[indexFbPhoto];

        //API create photo

        var newPhoto = {
          photo:  newFbPhoto.source,
          order: $scope.newPhotoIndex,
          user: '/api/v1/auth/user/' + USER_ID + '/'
        };

        PhotosFactory.save({}, newPhoto,
          function(success){
            $log.info('New photo saved.');
            var index = $scope.newPhotoIndex;
            $scope.user.photos[index].photo =  success.photo;
            $scope.user.photos[index].id =  success.id;
            $scope.closeModal();


          },
          function(error) {
          });






      };

      $scope.$on('ngRepeatFinished', function () {
        $('#deletePhotoModal').modal('attach events', '.delete_photo', 'show');
      });


    //Goals

    $scope.editGoal = false;

    $scope.subject = '';
    $scope.resourceUri = null;
    $scope.messageShow = false;
    $scope.message = '';

    $scope.userUri = '/api/v1/auth/user/' + USER_ID + '/';

    $scope.inputChanged = function (str) {
      $scope.subject = str;
    };

    $scope.selectResult = function (object) {
      if (object !== undefined) {
        $scope.subject = object.originalObject.description;
        $scope.resourceUri = object.originalObject.resource_uri;
      }
      else {
        $scope.resourceUri = null;
      }

    };


    $scope.createNewGoal = function() {
      $log.info('creating goal');
      $scope.editGoal = true;
    };

    $scope.closeEditGoal = function() {
      $scope.subject = '';
      $scope.resourceUri = null;
      $scope.messageShow = false;
      $scope.message = '';
      $scope.editGoal = false;
    };

    $scope.removeGoal = function(index) {

      var Goal = $resource($scope.user.goals[index].resource_uri);

      Goal.delete().$promise.then(function(data) {
        $scope.user.goals.splice(index, 1);
      });
    };



    $scope.saveGoal = function() {
      var newGoal = {
        goal: $scope.resourceUri,
        user: $scope.userUri
      };
      $scope.loadingCreatingNew = true;
      GoalsFactory.save({}, newGoal,
        function(success){
          $scope.loadingCreatingNew = false;
          $scope.editGoal = !$scope.editGoal;
          $scope.user.goals.push(success);

          $scope.subject = '';
          $scope.resourceUri = null;
          $scope.messageShow = false;
          $scope.message = '';


        },
        function(error) {
          $scope.resourceUri = null;
          $scope.messageShow = true;
          $scope.message = error.data.goal.error[0];
          $scope.loadingCreatingNew = false;

        });
    };

    $scope.createGoal = function() {
      $scope.messageShow = false;
      $scope.message = '';
      $scope.loadingCreatingNew = false;


        //if subject is empty warn user to enter subject
        if ($scope.subject === '') {
          $scope.message = 'Entering your goal is required to continue.';
          $scope.messageShow = true;
          return false;
        }

        //check if subject already exists
        if ($scope.resourceUri !== null) {

          $scope.saveGoal();

        }
        else {
          SubjectsFactory.query({format: 'json', description: $scope.subject}).$promise.then(function(data) {
            if (data.meta.total_count === 0) {
                    //create new subject
                    var newSubject = {
                      description: $scope.subject,
                    };

                    SubjectsFactory.save({}, newSubject,
                      function(success){
                        $scope.resourceUri = success.resource_uri;
                        $scope.saveGoal();
                      },
                      function(error) {
                        $scope.message = 'You have already created this goal.';
                        $scope.messageShow = true;
                      });
                  }
                  else {
                    $scope.resourceUri = data.objects[0].resource_uri;
                    $scope.saveGoal();
                  }



                });

        }

      };


    //Offers

    $scope.editOffer = false;

    $scope.createNewOffer = function() {
      $log.info('creating offer');
      $scope.editOffer = true;
    };

    $scope.closeEditOffer = function() {
      $scope.editOffer = false;
      $scope.subject = '';
      $scope.resourceUri = null;
      $scope.messageShow = false;
      $scope.message = '';
      $scope.editOffer = false;
    };

    $scope.removeOffer = function(index) {

      var Offer = $resource($scope.user.offers[index].resource_uri);

      Offer.delete().$promise.then(function(data) {
        $scope.user.offers.splice(index, 1);
      });
    };



    $scope.saveOffer = function() {
      var newOffer = {
        offer: $scope.resourceUri,
        user: $scope.userUri
      };

      $scope.loadingCreatingNew = true;

      OffersFactory.save({}, newOffer,
        function(success){
          $scope.loadingCreatingNew = false;
          $scope.editOffer = !$scope.editOffer;
          $scope.user.offers.push(success);

          $scope.subject = '';
          $scope.resourceUri = null;
          $scope.messageShow = false;
          $scope.message = '';

        },
        function(error) {
          $scope.resourceUri = null;
          $scope.messageShow = true;
          $scope.message = error.data.offer.error[0];
          $scope.loadingCreatingNew = false;

        });
    };



    $scope.createOffer = function() {
      $scope.messageShow = false;
      $scope.message = '';


        //if subject is empty warn user to enter subject
        if ($scope.subject === '') {
          $scope.message = 'Entering your offer is required to continue.';
          $scope.messageShow = true;
          return false;
        }

        //check if subject already exists
        if ($scope.resourceUri !== null) {
          $scope.saveOffer();
        }
        else {
          SubjectsFactory.query({format: 'json', description: $scope.subject}).$promise.then(function(data) {

            if (data.meta.total_count === 0) {
              //create new subject
              var newSubject = {
                description: $scope.subject,
              };

              SubjectsFactory.save({}, newSubject,
                function(success){
                  $scope.resourceUri = success.resource_uri;
                  $scope.saveOffer();

                },
                function(error) {
                  $scope.message = 'You have already created this offer.';
                  $scope.messageShow = true;
                });
            }
            else {

              $scope.resourceUri = data.objects[0].resource_uri;
              $scope.saveOffer();
            }

          });

        }

      };


    //Edit About


    $scope.editAbout = false;





  });