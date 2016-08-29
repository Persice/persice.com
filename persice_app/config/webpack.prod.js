/**
 * @author: Persice
 */

const helpers = require('./helpers'); // Helper: root(), and rootDir() are defined at the bottom
const webpackMerge = require('webpack-merge'); // Used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // The settings that are common to prod and dev
const HASH = helpers.generateHash(); // Generate unique hash used for cache busting
/**
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * Webpack Constants
 */
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const FACEBOOK_ID = process.env.FACEBOOK_ID_PRODUCTION;
const FACEBOOK_SCOPE = process.env.FACEBOOK_SCOPE;

const AWS_S3_CUSTOM_DOMAIN = process.env.AWS_S3_CUSTOM_DOMAIN;

const METADATA = webpackMerge(commonConfig.metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: false,
  FACEBOOK_ID: FACEBOOK_ID,
  FACEBOOK_SCOPE: FACEBOOK_SCOPE
});

module.exports = webpackMerge(commonConfig, {
  // Switch loaders to debug mode.
  //
  // See: http://webpack.github.io/docs/configuration.html#debug
  debug: false,

  // Developer tool to enhance debugging
  //
  // See: http://webpack.github.io/docs/configuration.html#devtool
  // See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
  devtool: 'source-map',

  entry: {
    'polyfills': './src/polyfills.browser.ts', // our browser polyfills (es6-promise, etc)
    'vendor': './src/vendor.browser.ts', // our vendor (angular2, rxjs)
    'main': './src/main.browser.ts', // persice main desktop app
    'main-mobile': './src/main-mobile.browser.ts', // persice main mobile app
  },

  // Options affecting the output of the compilation.
  //
  // See: http://webpack.github.io/docs/configuration.html#output
  output: {

    // The output directory as absolute path (required).
    //
    // See: http://webpack.github.io/docs/configuration.html#output-path
    path: helpers.root('dist'),
    publicPath: AWS_S3_CUSTOM_DOMAIN + '/assets/js/',
    // publicPath: 'http://test-local.com:8000/assets/js/',

    // Specifies the name of each output file on disk.
    // IMPORTANT: You must not specify an absolute path here!
    //
    // See: http://webpack.github.io/docs/configuration.html#output-filename
    filename: '[name].' + HASH + '.prod.bundle.js',

    // The filename of the SourceMaps for the JavaScript files.
    // They are inside the output.path directory.
    //
    // See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
    sourceMapFilename: '[name].' + HASH + '.prod.bundle.map',

    // The filename of non-entry chunks as relative path
    // inside the output.path directory.
    //
    // See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
    chunkFilename: '[id].' + HASH + '.prod.chunk.js'

  },

  // Options affecting the normal modules.
  //
  // See: http://webpack.github.io/docs/configuration.html#module
  module: {

    // An array of applied pre and post loaders.
    //
    // See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
    preLoaders: [

      // Tslint loader support for *.ts files
      //
      // See: https://github.com/wbuchwalter/tslint-loader
      // { test: /\.ts$/, loader: 'tslint-loader', exclude: [helpers.root('node_modules')] },

      // Source map loader support for *.js files
      // Extracts SourceMaps for source files that as added as sourceMappingURL comment.
      //
      // See: https://github.com/webpack/source-map-loader
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular'),
          helpers.root('node_modules/@ngrx')
        ]
      }

    ],
  },

  // Add additional plugins to the compiler.
  //
  // See: http://webpack.github.io/docs/configuration.html#plugins
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

    // Plugin: DedupePlugin
    // Description: Prevents the inclusion of duplicate code into your bundle
    // and instead applies a copy of the function at runtime.
    //
    // See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    // See: https://github.com/webpack/docs/wiki/optimization#deduplication
    new DedupePlugin(),

    // Plugin: UglifyJsPlugin
    // Description: Minimize all JavaScript output of chunks.
    // Loaders are switched into minimizing mode.
    //
    // See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
    new UglifyJsPlugin({
      // beautify: true, //debug
      // mangle: false, //debug
      // dead_code: false, //debug
      // unused: false, //debug
      // deadCode: false, //debug
      // compress: {
      //   screw_ie8: true,
      //   keep_fnames: true,
      //   drop_debugger: false,
      //   dead_code: false,
      //   unused: false
      // }, // debug
      // comments: true, //debug

      beautify: false, //prod
      mangle: { screw_ie8: true }, //prod
      compress: { screw_ie8: true, warnings: false }, //prod
      comments: false //prod
    }),

    /**
     * Plugin: NormalModuleReplacementPlugin
     * Description: Replace resources that matches resourceRegExp with newResource
     *
     * See: http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
     */

    new NormalModuleReplacementPlugin(
      /angular2-hmr/,
      helpers.root('node_modules/angular2-hmr/prod.js')
    ),

    // Plugin: CompressionPlugin
    // Description: Prepares compressed versions of assets to serve
    // them with Content-Encoding
    //
    // See: https://github.com/webpack/compression-webpack-plugin
    new CompressionPlugin({
      regExp: /\.css$|\.html$|\.js$|\.map$/,
      threshold: 2 * 1024
    }),

    // Plugin: HtmlWebpackPlugin
    // Description: Simplifies creation of HTML files to serve your webpack bundles.
    // This is especially useful for webpack bundles that include a hash in the filename
    // which changes every compilation.
    //
    // See: https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: 'templates/production/index.html',
      filename: 'index.html',
      chunks: ['polyfills', 'vendor', 'main'],
      chunksSortMode: 'dependency',
      minify: false
    }),
    new HtmlWebpackPlugin({
      template: 'templates/production/index_mobile.html',
      filename: 'index_mobile.html',
      chunks: ['polyfills', 'vendor', 'main-mobile'],
      chunksSortMode: 'dependency',
      minify: false
    }),
    // Plugin: CopyWebpackPlugin
    // Description: Copy files and directories in webpack.
    //
    // Copies project static assets.
    //
    // See: https://www.npmjs.com/package/copy-webpack-plugin
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: 'assets'
    }])
  ],

  // Static analysis linter for TypeScript advanced options configuration
  // Description: An extensible linter for the TypeScript language.
  //
  // See: https://github.com/wbuchwalter/tslint-loader
  tslint: {
    emitErrors: true,
    failOnHint: true,
    resourcePath: 'src'
  },

  // Html loader advanced options
  //
  // See: https://github.com/webpack/html-loader#advanced-options
  // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
  htmlLoader: {
    minimize: true,
    removeAttributeQuotes: false,
    caseSensitive: true,
    customAttrSurround: [
      [/#/, /(?:)/],
      [/\*/, /(?:)/],
      [/\[?\(?/, /(?:)/]
    ],
    customAttrAssign: [/\)?\]?=/]
  },

  node: {
    global: 'window',
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
