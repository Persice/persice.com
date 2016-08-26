/**
 * @author: Persice
 */

const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); //Used to merge webpack configs
const commonConfig = require('./webpack.common.js'); //The settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HMR = helpers.hasProcessFlag('hot');
const HOST = 'localhost';
const PORT = 8080;

const FACEBOOK_ID = process.env.FACEBOOK_ID_DEVELOPMENT;
const FACEBOOK_SCOPE = process.env.FACEBOOK_SCOPE;

const METADATA = webpackMerge(commonConfig.metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR,
  FACEBOOK_ID: FACEBOOK_ID,
  FACEBOOK_SCOPE: FACEBOOK_SCOPE
});

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = webpackMerge(commonConfig, {
  // Switch loaders to debug mode.
  //
  // See: http://webpack.github.io/docs/configuration.html#debug
  debug: true,

  // Developer tool to enhance debugging
  //
  // See: http://webpack.github.io/docs/configuration.html#devtool
  // See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
  devtool: 'eval',

  // Options affecting the output of the compilation.
  //
  // See: http://webpack.github.io/docs/configuration.html#output
  output: {

    // The output directory as absolute path (required).
    //
    // See: http://webpack.github.io/docs/configuration.html#output-path
    path: helpers.root('dist'),
    publicPath: METADATA.isDevServer ? 'http://localhost:8080/assets/js/' : '/assets/js/',

    // Specifies the name of each output file on disk.
    // IMPORTANT: You must not specify an absolute path here!
    //
    // See: http://webpack.github.io/docs/configuration.html#output-filename
    filename: '[name].bundle.js',

    // The filename of the SourceMaps for the JavaScript files.
    // They are inside the output.path directory.
    //
    // See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
    sourceMapFilename: '[name].map',

    // The filename of non-entry chunks as relative path
    // inside the output.path directory.
    //
    // See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
    chunkFilename: '[id].chunk.js'

  },

  plugins: [
    // Plugin: DefinePlugin
    // Description: Define free variables.
    // Useful for having development builds with debug logging or adding global constants.
    //
    // Environment helpers
    //
    // See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
    new DefinePlugin({
      'ENV': JSON.stringify(METADATA.ENV),
      'HMR': METADATA.HMR,
      'FACEBOOK_ID': JSON.stringify(METADATA.FACEBOOK_ID),
      'FACEBOOK_SCOPE': JSON.stringify(METADATA.FACEBOOK_SCOPE),
      'process.env': {
        'ENV': JSON.stringify(METADATA.ENV),
        'NODE_ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'FACEBOOK_ID': JSON.stringify(METADATA.FACEBOOK_ID),
        'FACEBOOK_SCOPE': JSON.stringify(process.env.FACEBOOK_SCOPE)
      }
    }),
    // Plugin: HtmlWebpackPlugin
    // Description: Simplifies creation of HTML files to serve your webpack bundles.
    // This is especially useful for webpack bundles that include a hash in the filename
    // which changes every compilation.
    //
    // See: https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: 'templates/index.html',
      filename: 'index.html',
      chunks: ['polyfills', 'vendor', 'main'],
      chunksSortMode: 'dependency',
      minify: false
    }),
    new HtmlWebpackPlugin({
      template: 'templates/index_mobile.html',
      filename: 'index_mobile.html',
      chunks: ['polyfills', 'vendor', 'main-mobile'],
      chunksSortMode: 'dependency',
      minify: false
    })
  ],

  // Static analysis linter for TypeScript advanced options configuration
  // Description: An extensible linter for the TypeScript language.
  //
  // See: https://github.com/wbuchwalter/tslint-loader
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  },

  // Webpack Development Server configuration
  // Description: The webpack-dev-server is a little node.js Express server.
  // The server emits information about the compilation state to the client,
  // which reacts to those events.
  //
  // See: https://webpack.github.io/docs/webpack-dev-server.html
  devServer: {
    port: METADATA.port,
    host: METADATA.host,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    proxy: {
      '/api': {
        target: 'http://test-local.com:8000',
        secure: false
      },
      '/auth/facebook/callback': {
        target: 'http://test-local.com:8000',
        secure: false
      },
      '/socket.io': {
        target: 'http://test-local.com:8000',
        secure: false
      },
      '/goals': {
        target: 'http://test-local.com:8000',
        secure: false
      },
      '/social': {
        target: 'http://test-local.com:8000',
        secure: false
      },
      '/facebook/connect': {
        target: 'http://test-local.com:8000',
        secure: false
      },
      '/linkedin/connect': {
        target: 'http://test-local.com:8000',
        secure: false
      },
      '/twitter/connect': {
        target: 'http://test-local.com:8000',
          secure: false
      },
      '/media': {
        target: 'http://test-local.com:8000',
        secure: false
      }
    },
    outputPath: helpers.root('dist'),
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: true,
      assets: true,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: true
    }
  },

  node: {
    global: 'window',
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
