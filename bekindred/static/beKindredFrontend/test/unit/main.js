'use strict';

describe('controllers', function() {
    var scope;

    beforeEach(module('icebrak'));

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));

    it('Unit: MainController', inject(function($controller) {
        expect(scope.greetingMessage).toBeUndefined();

        $controller('MainCtrl', {
            $scope: scope
        });

        expect(scope.greetingMessage).toEqual('Welcome to');
    }));
});