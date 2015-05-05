'use strict';

describe('E2E: login page', function() {
  var page;

  beforeEach(function() {
    browser.get('http://test1.com:8000/accounts/login/');
    page = require('./login.po.js');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Icebrāk - User Login');
  });

  it('should include welcome message', function() {
    expect(page.welcomeMessage.isPresent()).toBe(true);
    expect(page.welcomeMessage.getText()).toBe('Welcome. Please login.');
  });

  it('should include logo image', function() {
    expect(page.logoImg.isPresent()).toBe(true);
    expect(page.logoImg.getAttribute('src')).toMatch(/\/static\/img\/icebrak\-logo\.png$/);
  });

  it('should include login button', function() {
    expect(page.loginButton.isPresent()).toBe(true);
  });

  it('should include login notice', function() {
    expect(page.loginNotice.isPresent()).toBe(true);
    expect(page.loginNotice.getText()).toBe('icebrāk will never share your personal information with anyone. And, we will never post to a social network on your behalf.');
  });

});