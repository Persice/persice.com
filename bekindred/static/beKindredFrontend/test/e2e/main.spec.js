'use strict';

describe('E2E: welcome page', function() {
  var page;

  beforeEach(function() {
    browser.get('http://172.17.2.120:3001/index.html');
    page = protractor.getInstance();
  });

  it('should include welcome message on welcome page', function() {
    var ele = by.id('main-info');
    expect(page.isElementPresent(ele)).toBe(true);
  });

});