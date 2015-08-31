(function() {
    'use strict';

    /**
     * @desc search input directive
     * @example <search-input></search-input>
     */
     angular
     .module('persice')
     .directive('searchInput', searchInput);

     function searchInput(Search, $location) {
        var directive = {
            scope: {
                id: '@id',
                class: '@class',
                query: '=query',
            },
            link: link,
            replace: true,
            template: [
            '<div class="ui searchinput huge left icon input">',
            '<input ng-change="searchQuery()" ng-model-options="{debounce: 600}" type="text" ng-model="query" placeholder="Search">',
            '<i ng-click="searchQuery()" class="circular search link icon"></i>',
            '<i ng-click="resetQuery()" ng-show="query.length" class="circular remove link icon"></i>',
            '</div>'
            ].join(''),
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, filter) {
            if (scope.query.length > 0) {
                Search.handleInput(scope.query);
            }
            element.bind('keydown', function(e) {
                if (e.keyCode === 13) {
                    Search.handleInput(scope.query);
                }
            });

            scope.resetQuery = function () {
                scope.query = '';
                Search.clearResultsAndQuery();
                $location.search('query', scope.query);
            };

            scope.searchQuery = function () {
                $location.search('query', scope.query);
                Search.handleInput(scope.query);
            };

        }



    }






})();
