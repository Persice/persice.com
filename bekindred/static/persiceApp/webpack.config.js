// @Persice App Webpack config

/*
 * Helper
 * env(), getBanner(), root(), and rootDir()
 * are defined at the bottom
 */
 var sliceArgs = Function.prototype.call.bind(Array.prototype.slice);
 var toString = Function.prototype.call.bind(Object.prototype.toString);
 var NODE_ENV = process.env.NODE_ENV || 'development';
 var pkg = require('./package.json');
 var publicDir = __dirname + "/src/public";

// Polyfill
Object.assign = require('object-assign');

// Node
var path = require('path');

// NPM
var webpack = require('webpack');

// Webpack Plugins
var OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var DedupePlugin = webpack.optimize.DedupePlugin;
var DefinePlugin = webpack.DefinePlugin;
var BannerPlugin = webpack.BannerPlugin;
var BundleTracker = require('webpack-bundle-tracker');
var PathRewriterPlugin = require('webpack-path-rewriter');
var WebpackNotifierPlugin = require('webpack-notifier');

console.log('Build environment: ', NODE_ENV);
/*
 * Config
 */
 module.exports = {
  devtool: env({
    'development': 'eval',
    'all': 'source-map'
  }),

  debug: env({
    'development': true,
    'all': false
  }),
  cache: env({
    // 'development': false
    'all': true
  }),
  verbose: true,
  displayErrorDetails: true,
  context: __dirname,
  stats: env({
    'all': {
      colors: true,
      reasons: true
    }
  }),

  // our Development Server config
  devServer: {
    inline: true,
    colors: true,
    hot: true,
    contentBase: 'src/public',
    historyApiFallback: true,
    publicPath: '/__build__',
  },

  //
  entry: {
    'angular2': [
      // Angular 2 Deps
      '@reactivex/rxjs',
      'zone.js',
      'reflect-metadata',
      // to ensure these modules are grouped together in one file
      'angular2/angular2',
      'angular2/core',
      'angular2/router',
      'angular2/http'
      ],
      'app': [
      // App
      './src/app/bootstrap'
      ],
    },

  // Config for our build files
  output: {
    path: root('__build__'),
    filename: env({
      'development': '[name].js',
      'all': '[name].[hash].min.js'
    }),
    sourceMapFilename: env({
      'development': '[name].js.map',
      'all': '[name].[hash].min.js.map'
    }),
    chunkFilename: '[id].chunk.js',
    publicPath: './static/persiceApp/src/public/',
  },

  resolve: {
    root: __dirname,
    modulesDirectories: [
    'node_modules', 'src', 'src/app', '.'
    ],
    extensions: ['', '.ts', '.js', '.json'],
    alias: {
      'rx': '@reactivex/rxjs',
      'app': 'src/app',
      // 'common': 'src/common',
      'bindings': 'src/bindings',
      'components': 'src/app/components',
      'services': 'src/app/services'
        // 'stores': 'src/app/stores'
      }
    },

    module: {
      loaders: [
      // Support for *.json files.
      {
        test: /\.json$/,
        loader: 'json'
      },

      // Support for CSS as raw text
      {
        test: /\.css$/,
        loader: 'raw'
      },
      // // Support for images
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader?limit=50000&name=[path][name].[ext]"
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader"
      },
      // support for .html as raw text
      {
        test: /\.html$/,
        loader: 'raw'
      },

      // Support for .ts files.
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader?ignoreWarnings[]=2304',
        exclude: [/test/, /node_modules/]
      },

      ],
      noParse: [
      /rtts_assert\/src\/rtts_assert/,
      /reflect-metadata/
      ],
      preLoaders: [{
        test: /\.ts$/,
        loader: "tslint"
      }],
      tslint: {
        emitErrors: true,
        failOnHint: false
      }
    },
    plugins: env({
      'production': [
      new UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_debugger: env({
            'development': false,
            'all': true
          })
        },
        output: {
          comments: false
        },
        beautify: false
      }),
      new BannerPlugin(getBanner(), {
        entryOnly: true
      }),
      new BundleTracker({
        filename: './webpack-stats-prod.json'
      })
      ],
      'development': [
      /* Dev Plugin */
      // new webpack.HotModuleReplacementPlugin(),
      new BundleTracker({
        filename: './webpack-stats-dev.json'
      }),

      new WebpackNotifierPlugin({
        title: "Persice",
        // contentImage: path.join(publicDir, 'images/logo.svg')
      }),

      ],
      'all': [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'VERSION': JSON.stringify(pkg.version)
      }),
      new OccurenceOrderPlugin(),
      new DedupePlugin(),

      new CommonsChunkPlugin({
        name: 'angular2',
        minChunks: Infinity,
        filename: env({
          'development': 'angular2.js',
          'all': 'angular2.min.js'
        })
      }),
      new CommonsChunkPlugin({
        name: 'common',
        filename: env({
          'development': 'common.js',
          'all': 'common.min.js'
        })
      })
      ]

    }),

  /*
   * When using `templateUrl` and `styleUrls` please use `__filename`
   * rather than `module.id` for `moduleId` in `@View`
   */
   node: {
    crypto: false,
    __filename: true
  }
};

// Helper functions

function env(configEnv) {
  if (configEnv === undefined) {
    return configEnv;
  }
  switch (toString(configEnv[NODE_ENV])) {
    case '[object Object]':
    return Object.assign({}, configEnv.all || {}, configEnv[NODE_ENV]);
    case '[object Array]':
    return [].concat(configEnv.all || [], configEnv[NODE_ENV]);
    case '[object Undefined]':
    return configEnv.all;
    default:
    return configEnv[NODE_ENV];
  }
}

function getBanner() {
  return 'Persice App v' + pkg.version + ' by @sasha7 from @Toptal';
}

function root(args) {
  args = sliceArgs(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function rootNode(args) {
  args = sliceArgs(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}
