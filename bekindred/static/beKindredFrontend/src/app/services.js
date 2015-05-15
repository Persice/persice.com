'use strict';
angular
    .module('icebrak')
    .factory('GoalsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/goal/:goalId/:param', {
            goalId: '@goalId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('LikesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/likes/:likeId/:param', {
            likeId: '@likeId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('ProfileFactory', ['$resource', function($resource) {
        return $resource('/api/v1/profile/:profileId/:param', {
            profileId: '@profileId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('LocationFactory', ['$resource', function($resource) {
        return $resource('/api/v1/location/:locationId/:param', {
            locationId: '@locationId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('ConnectionsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/connections/:connectionId/:param', {
            connectionId: '@connectionId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('FriendsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/friends/:friendId/:param', {
            friendId: '@friendId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('MutualFriendsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/mutual/friends/:friendId/:param', {
            friendId: '@friendId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('SubjectsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/subject/:subjectId/:param', {
            subjectId: '@subjectId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('OffersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/offer/:offerId/:param', {
            offerId: '@offerId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('InterestsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/interest/:interestId/:param', {
            interestId: '@interestId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('InterestSubjectFactory', ['$resource', function($resource) {
        return $resource('/api/v1/interest_subject/:interestId/:param', {
            interestId: '@interestId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('UsersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/auth/user/:userId/:param', {
            userId: '@userId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('MessagesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/messages/:messageId/:param', {
            messageId: '@messageId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('InboxFactory', ['$resource', function($resource) {
        return $resource('/api/v1/inbox/last/:inboxId/:param', {
            inboxId: '@inboxId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('FiltersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/filter/state/:filterId/:param', {
            filterId: '@filterId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('PhotosFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photo/:photoId/:param', {
            photoId: '@photoId'
        }, {
            query: {
                method: 'GET',
                isArray: false,
                cache: false
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH'
            },
            delete: {
                method: 'DELETE'
            }
        });
    }]);