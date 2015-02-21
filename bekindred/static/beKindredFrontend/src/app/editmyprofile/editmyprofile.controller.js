'use strict';

angular.module('beKindred')
.controller('EditMyProfileCtrl', function ($scope, $timeout, USER_ID, USER_TWITTER, USER_LINKEDIN_NAME, USER_LINKEDIN_URL, UsersFactory, GoalsFactory, LikesFactory, SubjectsFactory, OffersFactory, InterestsFactory, PhotosFactory, $log, $filter, $cookies, $http, FB_TOKEN, $location, $anchorScroll, $window, $resource) {
  $scope.twitter = USER_TWITTER;
  $scope.linkedin = USER_LINKEDIN_NAME;

  $scope.userUri = '/api/v1/auth/user/' + USER_ID + '/';
  $scope.linkedinUrl = USER_LINKEDIN_URL;
  $scope.user = {
    id: USER_ID,
    firstName: '',
    lastName: '',
    age: '',
    about_me: '',
    photos: [
    {id: 0, order: 0, photo: '', cropped_photo: ''},
    {id: 0, order: 1, photo: '', cropped_photo: ''},
    {id: 0, order: 2, photo: '', cropped_photo: ''},
    {id: 0, order: 3, photo: '', cropped_photo: ''},
    {id: 0, order: 4, photo: '', cropped_photo: ''},
    {id: 0, order: 5, photo: '', cropped_photo: ''}
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

      if ($scope.user.interests[index].description === '') {
        $scope.user.interests[index].error = true;
        $scope.user.interests[index].errorMessage = 'Entering your interest is required.';
      }
      else {
        $scope.user.interests[index].loading = true;
        InterestsFactory.update({interestId: $scope.user.interests[index].id}, {description: $scope.user.interests[index].description},
          function(success){
            $log.info('Interest updated');
            $scope.user.interests[index].loading = false;
            $scope.user.interests[index].error = false;
          },
          function(error) {
            $scope.user.interests[index].loading = false;
            $scope.user.interests[index].error = true;
            $scope.user.interests[index].errorMessage = 'Interest already exists.';

          });
      }


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
                // $log.info('Photo order saved');
              }, function(error) {
                $log.info(error);
              });

          }


          if ($scope.user.photos[otherIndex].id !== 0) {
            //API update photo - patch method
            PhotosFactory.update({photoId: $scope.user.photos[otherIndex].id}, {order:  $scope.user.photos[otherIndex].order },
              function(success) {
                // $log.info('Photo order saved');
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
            // $log.info($scope.apiPhotos);
            for(var obj in $scope.apiPhotos) {
              for(var p in $scope.user.photos) {
                if ($scope.user.photos[p].order === $scope.apiPhotos[obj].order) {
                  $scope.user.photos[p].id = $scope.apiPhotos[obj].id;
                  $scope.user.photos[p].photo = $scope.apiPhotos[obj].photo;
                  $scope.user.photos[p].cropped_photo = $scope.apiPhotos[obj].cropped_photo;
                }
              }
            }
          });
        };

        $scope.getPhotos();

        $scope.currentAlbum = '';


        $scope.getFBPhotos = function(id, name) {
          $scope.showPhotos = true;
          $scope.myImage = null;
          $scope.photoIndex = null;
          $scope.hideAlbums = true;
          $scope.currentAlbum = name;
          $scope.photosLoading = true;

          $http.get('https://graph.facebook.com/' + id + '?fields=photos{id,height,width,source}&access_token=' + FB_TOKEN).
          success(function(data, status, headers, config) {
            // $log.info(data);

            $scope.photosLoading = false;

            $scope.facebookPhotos = data.photos.data;
          }).
          error(function(data, status, headers, config) {
            // $log.info(data);
            $scope.photosLoading = false;
          });



        };

        $scope.backToAlbums = function () {
          $scope.showPhotos = true;
          $scope.myImage = null;
          $scope.photoIndex = null;
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
            // $log.info(data);
            $scope.facebookAlbums = data.data;
            $scope.albumsLoading = false;

          }).
          error(function(data, status, headers, config) {
            // $log.info(data);
            $scope.albumsLoading = false;
          });



        };




        $scope.deletePhoto = function() {
          var deleteIndex = $scope.userPhotoDeleteIndex;
        //API delete call
        PhotosFactory.delete({photoId: $scope.user.photos[deleteIndex].id},
          function(success) {
            $scope.user.photos[deleteIndex].photo = '';
            $scope.user.photos[deleteIndex].cropped_photo = '';
            $scope.user.photos[deleteIndex].id = 0;
            // $log.info('Photo deleted');

          },
          function(error) {
            $log.info(error);
          });

      };

      $scope.closeModal = function() {
        $log.info('scroll to top');
        $scope.showModal = false;

        $scope.showPhotos = true;
        $scope.myImage = null;
        $scope.photoIndex = null;

        $timeout(function(){
          $location.hash('my-profile-header-edit');
          $anchorScroll();
        }, 600);

      };

      $scope.showModal = false;
      $scope.albumsLoading = false;
      $scope.photosLoading = false;

      $scope.showPhotos = true;
      $scope.myImage = null;
      $scope.photoIndex = null;
      $scope.myCroppedImage = null;

      $scope.showCrop = function(index) {
        $scope.photoIndex = index;
        $scope.myImage = $scope.facebookPhotos[index].source;
        $scope.showPhotos = false;
      };

      $scope.myCroppedImage='';

      $scope.createPhoto = function(croppedPhoto) {

        var indexFbPhoto = $scope.photoIndex;
        $log.info('Creating photo');


        var newFbPhoto = $scope.facebookPhotos[indexFbPhoto];

        //API create photo

        var newPhoto = {
          cropped_photo: croppedPhoto,
          photo:  newFbPhoto.source,
          order: $scope.newPhotoIndex,
          user: '/api/v1/auth/user/' + USER_ID + '/'
        };

        PhotosFactory.save({}, newPhoto,
          function(success){
            $log.info('New photo saved.');
            var index = $scope.newPhotoIndex;
            $scope.user.photos[index].photo =  success.photo;
            $scope.user.photos[index].cropped_photo =  success.cropped_photo;
            $scope.user.photos[index].id =  success.id;
            $scope.closeModal();


          },
          function(error) {
          });






      };

      $scope.$on('ngRepeatFinishedPhotos', function () {
        $('#deletePhotoModal').modal('attach events', '.delete_photo', 'show');

      });

      $scope.$on('ngRepeatFinished', function () {
        $('.ui.search.goals')
        .search({
          apiSettings: {
            url: 'api/v1/subject/?format=json&description__icontains={query}',
          },
          minCharacters: 3,
          searchDelay: 400,
          type: 'standard',
          cache: false,
          onSelect: function(result, response) {
            var idx = $(this).attr('rel');
            $log.info(result);
            if (result !== undefined) {
              $scope.user.goals[idx].subject = result.description;

            }

          }


        });


        $('.ui.search.offers')
        .search({
          apiSettings: {
            url: 'api/v1/subject/?format=json&description__icontains={query}',
          },
          minCharacters: 3,
          searchDelay: 400,
          type: 'standard',
          cache: false,
          onSelect: function(result, response) {
            var idx = $(this).attr('rel');
            $log.info(result);
            if (result !== undefined) {
              $scope.user.offers[idx].subject = result.description;

            }

          }


        });

      });


$scope.goalNeedSaving = function(index) {
  $scope.user.goals[index].changed = true;
};


$scope.subject = '';
$scope.resourceUri = null;
$scope.messageShow = false;
$scope.message = '';

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

  var newGoal = {
    id: 0,
    subject: '',
    user: $scope.userUri,
    changed: true
  };

  $scope.user.goals.push(newGoal);

};


$scope.removeGoal = function(index) {

  var Goal = $resource($scope.user.goals[index].resource_uri);

  if ($scope.user.goals[index].id === 0) {
    $scope.user.goals.splice(index, 1);
  }
  else {
    Goal.delete().$promise.then(function(data) {
      $scope.user.goals.splice(index, 1);
    });
  }

};


$scope.saveCurrentGoal = function(index) {

  $scope.user.goals[index].errorMessage = '';
  $scope.user.goals[index].error = false;

  if ($scope.user.goals[index].subject === '') {
    $scope.user.goals[index].error = true;
    $scope.user.goals[index].errorMessage = 'Entering your goal is required.';
  }
  else {
    if ($scope.user.goals[index].id === 0) {
          //create new goal
          var newGoal = {
            goal_subject: $scope.user.goals[index].subject,
            user: $scope.userUri
          };
          $scope.user.goals[index].loading = true;
          $scope.user.goals[index].error = false;
          GoalsFactory.save({}, newGoal,
            function(success){
              $scope.user.goals[index].loading = false;
              $scope.user.goals[index].error = false;
              $scope.user.goals[index].id = success.id;
              $scope.user.goals[index].goal = success.goal;
              $scope.user.goals[index].goal_subject = success.goal_subject;
              $scope.user.goals[index].resource_uri = success.resource_uri;
              $scope.user.goals[index].user = success.user;

              $scope.user.goals[index].changed = false;
            },
            function(error) {
              $scope.user.goals[index].errorMessage = error.data.goal.error[0];
              $scope.user.goals[index].loading = false;
              $scope.user.goals[index].error = true;

            });
        }
        else {
          //edit goal
          $scope.user.goals[index].error = false;
          $scope.user.goals[index].loading = true;
          GoalsFactory.update({goalId: $scope.user.goals[index].id}, {goal_subject: $scope.user.goals[index].subject},
            function(success){
              $scope.user.goals[index].loading = false;
              $scope.user.goals[index].error = false;
              $scope.user.goals[index].goal = success.goal;
              $scope.user.goals[index].goal_subject = success.goal_subject;
              $scope.user.goals[index].resource_uri = success.resource_uri;

              $scope.user.goals[index].changed = false;

            },
            function(error) {
              $scope.user.goals[index].errorMessage = error.data.goal.error[0];
              $scope.user.goals[index].loading = false;
              $scope.user.goals[index].error = true;

            });


        }
      }


    };



    //offers

    $scope.offerNeedSaving = function(index) {
      $scope.user.offers[index].changed = true;
    };


    $scope.createNewOffer = function() {
      $log.info('creating offer');

      var newOffer = {
        id: 0,
        subject: '',
        user: $scope.userUri,
        changed: true
      };

      $scope.user.offers.push(newOffer);

    };


    $scope.removeOffer = function(index) {

      var Offer = $resource($scope.user.offers[index].resource_uri);

      if ($scope.user.offers[index].id === 0) {
        $scope.user.offers.splice(index, 1);
      }
      else {
        Offer.delete().$promise.then(function(data) {
          $scope.user.offers.splice(index, 1);
        });
      }

    };


    $scope.saveCurrentOffer = function(index) {

      $scope.user.offers[index].errorMessage = '';
      $scope.user.offers[index].error = false;

      if ($scope.user.offers[index].subject === '') {
        $scope.user.offers[index].error = true;
        $scope.user.offers[index].errorMessage = 'Entering your offer is required.';
      }
      else {
        if ($scope.user.offers[index].id === 0) {
          //create new offer
          var newOffer = {
            offer_subject: $scope.user.offers[index].subject,
            user: $scope.userUri
          };
          $scope.user.offers[index].loading = true;
          $scope.user.offers[index].error = false;
          OffersFactory.save({}, newOffer,
            function(success){
              $scope.user.offers[index].loading = false;
              $scope.user.offers[index].error = false;
              $scope.user.offers[index].id = success.id;
              $scope.user.offers[index].offer = success.offer;
              $scope.user.offers[index].offer_subject = success.offer_subject;
              $scope.user.offers[index].resource_uri = success.resource_uri;
              $scope.user.offers[index].user = success.user;

              $scope.user.offers[index].changed = false;
            },
            function(error) {
              $scope.user.offers[index].errorMessage = error.data.offer.error[0];
              $scope.user.offers[index].loading = false;
              $scope.user.offers[index].error = true;

            });
        }
        else {
          //edit offer
          $scope.user.offers[index].error = false;
          $scope.user.offers[index].loading = true;
          OffersFactory.update({offerId: $scope.user.offers[index].id}, {offer_subject: $scope.user.offers[index].subject},
            function(success){
              $scope.user.offers[index].loading = false;
              $scope.user.offers[index].error = false;
              $scope.user.offers[index].offer = success.offer;
              $scope.user.offers[index].offer_subject = success.offer_subject;
              $scope.user.offers[index].resource_uri = success.resource_uri;

              $scope.user.offers[index].changed = false;

            },
            function(error) {
              $scope.user.offers[index].errorMessage = error.data.offer.error[0];
              $scope.user.offers[index].loading = false;
              $scope.user.offers[index].error = true;

            });


        }
      }


    };


  });