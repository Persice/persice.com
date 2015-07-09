/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var LoginPage = function() {
    this.welcomeMessage = element(by.id('welcomeMessage'));
    this.logoImg = element(by.id('loginLogo'));
    this.loginButton = element(by.id('loginButton'));
    this.loginNotice = element(by.id('loginNotice'));
};

module.exports = new LoginPage();