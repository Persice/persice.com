// Persice

module.exports = function(config) {
  var testWebpackConfig = require('./webpack.test.js');

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
      pattern: './src/assets/**/*.png',
      watched: false,
      included: false,
      served: true
    }, {
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
      pattern: './lib/js/croppie.js',
      watched: false
    }, {
      pattern: './lib/js/ion.rangeSlider.js',
      watched: false
    }, {
      pattern: './lib/js/jquery.minimalect.js',
      watched: false
    }, {
      pattern: './lib/js/jquery.matcheight.js',
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
      pattern: './lib/js/tokenfield.js',
      watched: false
    }, {
      pattern: './lib/js/typeahead.js',
      watched: false
    }, {
      pattern: './config/spec-bundle.js',
      watched: false
    }],


    proxies: {
      '/media/images/': '/base/src/assets/images/',
      '/static/assets/images/': '/base/src/assets/images/',
      '/static/assets/icons/': '/base/src/assets/icons/',
      '/static/img/': '/base/src/assets/images/'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'] },

    // Webpack Config at ./webpack.test.js
    webpack: testWebpackConfig,

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      stats: 'errors-only'
    },

    coverageReporter: {
      dir: 'coverage/',
      subdir: function(browser) {
        // normalization process to keep a consistent browser name across different
        // OS
        return browser.toLowerCase().split(/[ /-]/)[0];
      },
      reporters: [
        { type: 'text-summary' },
        // { type: 'text' },
        { type: 'html' },
        { type: 'cobertura', subdir: 'cobertura', file: 'coverage.xml' },
        { type: 'json', subdir: '.' }
      ],
      // check: {
        // global: {
        //   statements: 60,
        //   branches: 60,
        //   functions: 60,
        //   lines: 60,
        //   excludes: []
        // },
        // each: {
        //   statements: 60,
        //   branches: 60,
        //   functions: 60,
        //   lines: 60,
        //   excludes: [],
        //   overrides: {}
        // }
      // },
    },

    // Webpack please don't spam the console when running in karma!
    webpackServer: { noInfo: true },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'coverage'],

    junitReporter: {
      outputDir: 'test_results/',
      outputFile: 'test_results.xml',
      useBrowserName: false
    },

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
    browsers: [
      // 'Chrome'
      'PhantomJS'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });

};
