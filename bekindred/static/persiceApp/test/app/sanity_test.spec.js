"use strict";
var testing_1 = require('angular2/testing');
testing_1.describe('Universal truths', function () {
    testing_1.it('should be able to test', function () {
        testing_1.expect(true).toBe(true);
    });
    testing_1.it('should do math', function () {
        testing_1.expect(1 + 1).toBe(2);
    });
    testing_1.it('null is not the same thing as undefined', function () { return testing_1.expect(null).not.toEqual(undefined); });
    xit('should skip this', function () {
        testing_1.expect(4).toEqual(40);
    });
});
