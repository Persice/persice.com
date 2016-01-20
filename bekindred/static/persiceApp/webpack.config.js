// @Persice

/*
 * Helper: root(), and rootDir() are defined at the bottom
 */
var path = require('path');
// Webpack Plugins
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ENV = process.env.ENV = process.env.NODE_ENV = 'development';

var metadata = {
  title: 'Persice',
  baseUrl: '/',
  host: '0.0.0.0',
  port: 8080,
  ENV: ENV
};

/*
 * Config
 */

module.exports = {
  // static data for index.html
  metadata: metadata,
  // for faster builds use 'eval'
  devtool: 'eval',
  debug: true,
  verbose: false,
  displayErrorDetails: true,
  entry: {
    'vendor': './src/vendor.ts',
    // 'main': './src/main.ts'
    'signup': './src/signup/main.ts'
  },
  context: __dirname,
  // Config for our build files
  output: {
    path: root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js',
  },

  resolve: {
    // ensure loader extensions match
    extensions: ['', '.ts', '.js', '.json', '.css', '.html']
    // alias: {
    //   'TweenLite': 'gsap/src/uncompressed/TweenLite.js',
    //   'TweenMax': 'gsap/src/uncompressed/TweenMax.js',
    //   'TimelineLite': 'gsap/src/uncompressed/TimelineLite.js',
    //   'CSSPlugin': 'gsap/src/uncompressed/plugins/CSSPlugin.js',
    // },
  },

  module: {
    preLoaders: [{
      test: /\.ts$/,
      loader: 'tslint-loader',
      exclude: [/node_modules/]
    }],
    loaders: [
      // Support for .ts files.
      {
        test: /\.ts$/,
        loader: 'ts',
        query: {
          'ignoreDiagnostics': [
            2403, // 2403 -> Subsequent variable declarations
            2300, // 2300 -> Duplicate identifier
            2374, // 2374 -> Duplicate number index signature
            2375, // 2375 -> Duplicate string index signature
            2339
          ]
        },
        exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      },

      // Support for *.json files.
      {
        test: /\.json$/,
        loader: 'json-loader'
      },

      // Support for CSS as raw text
      {
        test: /\.css$/,
        loader: 'raw-loader'
      },

      // support for .html as raw text
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }

      // if you add a loader include the resolve file extension above
    ]
  },

  plugins: [
    new HotModuleReplacementPlugin(),
    new ProvidePlugin({
      _: 'lodash'
    }),
    new DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(metadata.ENV),
        'NODE_ENV': JSON.stringify(metadata.ENV)
      }
    }),
    new CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    })
    // new ProvidePlugin({TweenMax: "TweenMax"})
    // static assets
    // new CopyWebpackPlugin([{
    //   from: 'src/assets',
    //   to: 'assets'
    // }]),
    // generating html
    // new HtmlWebpackPlugin({
    //   template: 'src/index.html',
    //   inject: false
    // }),
  ],

  // Other module loader config
  tslint: {
    emitErrors: false,
    failOnHint: false
  },
  // our Webpack Development Server config
  devServer: {
    port: metadata.port,
    // host: metadata.host,
    hot: true,
    inline: true,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    contentBase: 'src/assets',
    publicPath: '/dist',
  },
  // we need this due to problems with es6-shim
  node: {
    global: 'window',
    progress: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

// Helper functions

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}
