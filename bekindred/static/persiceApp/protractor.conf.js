// @Persice Protractor config

exports.config = {
  // baseUrl: 'http://test1.com:8000/',
  baseUrl: 'http://localhost:8080/',

  allScriptsTimeout:  60000,

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000,
    showTiming: true
  },

  capabilities: {
    // 'browserName': 'chrome',
    // 'chromeOptions': {
    //   'args': ['show-fps-counter=true']
    // },
    //phantomjs
    'browserName': 'phantomjs',
    'phantomjs.binary.path': require('phantomjs').path,
    'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
  },

  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.47.1.jar',

  specs: [
    'test/**/*.e2e.js'
  ],

  onPrepare: function() {
    browser.ignoreSynchronization = true;
  }

};
