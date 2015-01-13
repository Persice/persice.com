'use strict';
angular.module('beKindred')
.factory('GoalsFactory', ['$resource', function($resource){
  return $resource('/api/v1/goal/:goalId/:param',
    {goalId: '@goalId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        },
        save: {
            method:'POST'
        },
        update: {
            method: 'PATCH'
        },
        delete: {
            method:'DELETE'
        }
    });
}])
.factory('FriendsFactory', ['$resource', function($resource){
  return $resource('/api/v1/friends/:friendId/:param',
    {friendId: '@friendId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        },
        save: {
            method:'POST'
        },
        update: {
            method: 'PATCH'
        },
        delete: {
            method:'DELETE'
        }
    });
}])
.factory('SubjectsFactory', ['$resource', function($resource){
  return $resource('/api/v1/subject/:subjectId/:param',
    {subjectId: '@subjectId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        },
        save: {
            method:'POST'
        },
        update: {
            method: 'PATCH'
        },
        delete: {
            method:'DELETE'
        }
    });
}])
.factory('OffersFactory', ['$resource', function($resource){
  return $resource('/api/v1/offer/:offerId/:param',
    {offerId: '@offerId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        },
        save: {
            method:'POST'
        },
        update: {
            method: 'PATCH'
        },
        delete: {
            method:'DELETE'
        }
    });
}])
.factory('UsersFactory', ['$resource', function($resource){
  return $resource('/api/v1/user/:userId/:param',
    {userId: '@userId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        },
        save: {
            method:'POST'
        },
        update: {
            method: 'PATCH'
        },
        delete: {
            method:'DELETE'
        }
    });
}])
.factory('MessagesFactory', ['$resource', function($resource){
  return $resource('/api/v1/messages/:messageId/:param',
    {messageId: '@messageId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        },
        save: {
            method:'POST'
        },
        update: {
            method: 'PATCH'
        },
        delete: {
            method:'DELETE'
        }
    });
}])
.factory('FiltersFactory', ['$resource', function($resource){
  return $resource('/api/v1/filter/state/:filterId/:param',
    {filterId: '@filterId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        },
        save: {
            method:'POST'
        },
        update: {
            method: 'PATCH'
        },
        delete: {
            method:'DELETE'
        }
    });
}])
.factory('PhotosFactory', ['$resource', function($resource){
  return $resource('/api/v1/photo/:photoId/:param',
    {photoId: '@photoId'} , {
        query: {
            method: 'GET',
            isArray:false,
            cache : false
        },
        save: {
            method:'POST'
        },
        update: {
            method: 'PATCH'
        },
        delete: {
            method:'DELETE'
        }
    });
}]);