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
      pattern: './lib/js/jquery-2.1.4.js',
      watched: false
    }, {
      pattern: './lib/js/jstz.js',
      watched: false
    }, {
      pattern: './lib/js/circle-progress.js',
      watched: false
    }, {
      pattern: './lib/js/ion.rangeSlider.js',
      watched: false
    }, {
      pattern: './lib/js/jquery.dotdotdot.js',
      watched: false
    }, {
      pattern: './lib/js/jquery.matchHeight.js',
      watched: false
    }, {
      pattern: './lib/js/jquery.minimalect.js',
      watched: false
    }, {
      pattern: './lib/js/picker.js',
      watched: false
    }, {
      pattern: './lib/js/picker.date.js',
      watched: false
    }, {
      pattern: './lib/js/picker.time.js',
      watched: false
    }, {
      pattern: './lib/js/remodal.js',
      watched: false
    }, {
      pattern: './lib/js/swiper.js',
      watched: false
    }, {
      pattern: './lib/js/svg4everybody.js',
      watched: false
    }, {
      pattern: './lib/js/tokenfield.js',
      watched: false
    }, {
      pattern: './lib/js/jqueryui/core.js',
      watched: false
    }, {
      pattern: './lib/js/jqueryui/widget.js',
      watched: false
    }, {
      pattern: './lib/js/jqueryui/position.js',
      watched: false
    }, {
      pattern: './lib/js/jqueryui/menu.js',
      watched: false
    }, {
      pattern: './lib/js/jqueryui/autocomplete.js',
      watched: false
    }, {
      pattern: './lib/js/tag-it.js',
      watched: false
    }, {
      pattern: './lib/js/init.js',
      watched: false
    }, {
      pattern: 'spec-bundle.js',
      watched: false
    }],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec-bundle.js': ['coverage', 'webpack', 'sourcemap']
    },

    // Webpack Config at ./webpack.test.config.js
    webpack: testWebpackConfig,

    coverageReporter: {
      dir: 'coverage/',
      reporters: [{
        type: 'text'
      }, {
        type: 'json'
      }, {
        type: 'html'
      }],
    },

    junitReporter: {
      outputDir: 'test_results/',
      outputFile: 'test_results.xml',
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
    reporters: ['mocha', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });

};
