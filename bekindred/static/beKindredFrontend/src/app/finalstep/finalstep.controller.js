(function() {
  'use strict';

  /**
   * class FinalStepController
   * classDesc Connect with LinkedIn and Twitter or skip to mathcfeed
   * @ngInject
   */
  function FinalStepController($log, USER_ID, UsersFactory, User) {
    var vm = this;

    vm.loading = false;
    vm.link = link;
    vm.refreshUser = refreshUser;
    vm.twitter = User.twitter_provider;
    vm.linkedin = User.linkedin_provider;
    vm.firstName = User.first_name;



    function link(provider) {
      var w = 400;
      var h = 300;


      var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
      var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

      var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      var left = ((width / 2) - (w / 2)) + dualScreenLeft;
      var top = ((height / 2) - (h / 2)) + dualScreenTop;


      var settings = 'height=' + h + ',width=' + w + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes';
      var url = '/social/associate/' + provider + '/?next=/goals/close_login_popup';
      var newWindow = window.open(url, 'Connecting...', settings);

      if (window.focus) {
        newWindow.focus();
      }
    }


    function refreshUser() {
      vm.loading = true;
      UsersFactory.get({
        format: 'json'
      }, {
        userId: USER_ID
      }).$promise.then(function(data) {
        vm.twitter = data.twitter_provider;
        vm.linkedin = data.linkedin_provider;
        vm.firstName = data.first_name;
        vm.loading = false;
      });
    }


  }

  angular
    .module('icebrak')
    .controller('FinalStepController', FinalStepController);



})();