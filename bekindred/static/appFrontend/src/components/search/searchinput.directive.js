(function() {
    'use strict';

    /**
     * @desc search input directive
     * @example <search-input></search-input>
     */
     angular
     .module('persice')
     .directive('searchInput', searchInput);

     function searchInput(Search) {
        var directive = {
            scope: {
                id: '@id',
                class: '@class'
            },
            link: link,
            template: [
            '<div class="ui searchpage huge left icon input">',
            '<input type="text" ng-model="query" placeholder="Search">',
            '<i ng-click="resetQuery()" class="circular search link icon"></i>',
            '</div>'
            ].join(''),
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {
            element.bind('keydown', function(e) {
                if (e.keyCode === 13) {
                    Search.handleInput(scope.query);
                }
            });

            scope.resetQuery = function () {
                Search.query = '';
                scope.query = '';
            };

        }



    }






})();
