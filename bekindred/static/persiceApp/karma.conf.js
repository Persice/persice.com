// @AngularClass
var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  var _config = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    proxies: {
      '/media/images/': '/base/src/public/images/',
      '/static/persiceApp/src/public/images/': '/base/src/public/images/',
      '/static/persiceApp/src/public/icons/': '/base/src/public/icons/',
      '/static/img/': '/base/src/public/images/',
    },


    junitReporter: {
      outputDir: 'test/results/',
      outputFile: 'test-results.xml',
      useBrowserName: false
    },


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [{
      pattern: './src/public/**/*.jpg',
      watched: false,
      included: false,
      served: true
    }, {
      pattern: './src/public/**/*.svg',
      watched: false,
      included: false,
      served: true
    }, {
      pattern: './src/public/lib/es6-shim.js',
      watched: false
    }, {
      pattern: './src/public/lib/jquery-2.1.4.js',
      watched: false
    }, {
      pattern: './src/public/lib/jstz.js',
      watched: false
    }, {
      pattern: './src/public/lib/circle-progress.js',
      watched: false
    }, {
      pattern: './src/public/lib/imgLiquid.js',
      watched: false
    }, {
      pattern: './src/public/lib/ion.rangeSlider.js',
      watched: false
    }, {
      pattern: './src/public/lib/jquery.dotdotdot.js',
      watched: false
    }, {
      pattern: './src/public/lib/jquery.matchHeight.js',
      watched: false
    }, {
      pattern: './src/public/lib/jquery.minimalect.js',
      watched: false
    }, {
      pattern: './src/public/lib/picker.js',
      watched: false
    }, {
      pattern: './src/public/lib/picker.date.js',
      watched: false
    }, {
      pattern: './src/public/lib/picker.time.js',
      watched: false
    }, {
      pattern: './src/public/lib/remodal.js',
      watched: false
    }, {
      pattern: './src/public/lib/slick.js',
      watched: false
    }, {
      pattern: './src/public/lib/svg4everybody.js',
      watched: false
    }, {
      pattern: './src/public/lib/tokenfield.js',
      watched: false
    }, {
      pattern: './src/public/lib/jqueryui/core.js',
      watched: false
    }, {
      pattern: './src/public/lib/jqueryui/widget.js',
      watched: false
    }, {
      pattern: './src/public/lib/jqueryui/position.js',
      watched: false
    }, {
      pattern: './src/public/lib/jqueryui/menu.js',
      watched: false
    }, {
      pattern: './src/public/lib/jqueryui/autocomplete.js',
      watched: false
    }, {
      pattern: './src/public/js/init.js',
      watched: false
    }, {
      pattern: 'spec.bundle.js',
      watched: false
    },

    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec.bundle.js': ['webpack', 'sourcemap', 'coverage'],
    },

    webpack: {

      resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json'],
        alias: {
          'app': 'src/app',
          'common': 'src/common',
        }
      },
      devtool: 'inline-source-map', //'inline-source-map',
      module: {
        loaders: [{
          test: /\.ts$/,
          loader: 'ts-loader',
          query: {
            'ignoreDiagnostics': [
            2309,
            2403
            ]
          }
        }, {
          test: /\.json$/,
          loader: 'json'
        }, {
          test: /\.html$/,
          loader: 'raw'
        }, {
          test: /\.css$/,
          loader: 'raw'
        }]
      },
      quiet: false,
      stats: {
        colors: true,
        reasons: true
      },
      debug: true,
      resolve: webpackConfig.resolve
    },

    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },


    coverageReporter: {
      reporters: [{
        type: 'html',
        dir: 'test/coverage/'
      }, {
        type: 'text'
      }, {
        type: 'text-summary'
      }],
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'junit'],

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
  };
  config.set(_config);
};
