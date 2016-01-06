// @AngularClass
var path = require('path');

module.exports = function(config) {
  var testWebpackConfig = require('./webpack.test.config.js');
  config.set({

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [],

    // list of files / patterns to load in the browser
    // we are building the test environment in ./spec-bundle.js
    files: [{
      pattern: './src/assets/**/*.jpg',
      watched: false,
      included: false,
      served: true
    }, {
      pattern: './src/assets/**/*.svg',
      watched: false,
      included: false,
      served: true
    }, {
      pattern: './src/assets/lib/jquery-2.1.4.js',
      watched: false
    }, {
      pattern: './src/assets/lib/jstz.js',
      watched: false
    }, {
      pattern: './src/assets/lib/circle-progress.js',
      watched: false
    }, {
      pattern: './src/assets/lib/imgLiquid.js',
      watched: false
    }, {
      pattern: './src/assets/lib/ion.rangeSlider.js',
      watched: false
    }, {
      pattern: './src/assets/lib/jquery.dotdotdot.js',
      watched: false
    }, {
      pattern: './src/assets/lib/jquery.matchHeight.js',
      watched: false
    }, {
      pattern: './src/assets/lib/jquery.minimalect.js',
      watched: false
    }, {
      pattern: './src/assets/lib/picker.js',
      watched: false
    }, {
      pattern: './src/assets/lib/picker.date.js',
      watched: false
    }, {
      pattern: './src/assets/lib/picker.time.js',
      watched: false
    }, {
      pattern: './src/assets/lib/remodal.js',
      watched: false
    }, {
      pattern: './src/assets/lib/slick.js',
      watched: false
    }, {
      pattern: './src/assets/lib/svg4everybody.js',
      watched: false
    }, {
      pattern: './src/assets/lib/tokenfield.js',
      watched: false
    }, {
      pattern: './src/assets/lib/jqueryui/core.js',
      watched: false
    }, {
      pattern: './src/assets/lib/jqueryui/widget.js',
      watched: false
    }, {
      pattern: './src/assets/lib/jqueryui/position.js',
      watched: false
    }, {
      pattern: './src/assets/lib/jqueryui/menu.js',
      watched: false
    }, {
      pattern: './src/assets/lib/jqueryui/autocomplete.js',
      watched: false
    }, {
      pattern: './src/assets/lib/tag-it.js',
      watched: false
    }, {
      pattern: './src/assets/js/init.js',
      watched: false
    }, {
      pattern: 'spec-bundle.js',
      watched: false
    }],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec-bundle.js': ['webpack', 'sourcemap']
    },

    // Webpack Config at ./webpack.test.config.js
    webpack: testWebpackConfig,

    coverageReporter: {
      dir: 'coverage/',
      reporters: [{
        type: 'text-summary'
      }, {
        type: 'html'
      }],
    },

    junitReporter: {
      outputDir: 'test/results/',
      outputFile: 'test-results.xml',
      useBrowserName: false
    },

    proxies: {
      '/media/images/': '/base/src/assets/images/',
      '/static/persiceApp/src/assets/images/': '/base/src/assets/images/',
      '/static/persiceApp/src/assets/icons/': '/base/src/assets/icons/',
      '/static/img/': '/base/src/assets/images/',
    },

    // Webpack please don't spam the console when running in karma!
    webpackServer: {
      noInfo: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });

};
