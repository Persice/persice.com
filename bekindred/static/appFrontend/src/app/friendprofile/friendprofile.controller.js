(function() {
    'use strict';

    angular
        .module('persice')
        .controller('FriendProfileController', FriendProfileController);

    /**
     * class FriendProfileController
     * classDesc Connect with LinkedIn and Twitter or skip to mathcfeed
     * @ngInject
     */
    function FriendProfileController($scope, userId, Connection, UserProfile, USER_PHOTO, $log, $state, FriendsFactory) {
        var vm = this;

        $log.info(UserProfile);
        vm.userInfo = {
            id: userId,
            first_name: UserProfile.first_name,
            photo: UserProfile.image
        };

        vm.middleActive = true;
        vm.friendshipId = Connection.objects[0].id;
        vm.unFriend = unFriend;

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