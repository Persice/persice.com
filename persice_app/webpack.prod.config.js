// Persice production config

/*
 * Helper: root(), and rootDir() are defined at the bottom
 */
var helpers = require('./helpers');
// Webpack Plugins
var webpack = require('webpack');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var CompressionPlugin = require('compression-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var ENV = process.env.NODE_ENV = process.env.ENV = 'production';
var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 8080;

var metadata = {
  title: 'Persice',
  baseUrl: '/',
  host: HOST,
  port: PORT,
  ENV: ENV
};

/*
 * Config
 */
module.exports = {
  // static data for index.html
  metadata: metadata,

  devtool: 'source-map',
  debug: false,

  entry: {
    'polyfills': './src/polyfills.ts',
    'main': './src/main.ts', // our main app
    'signup': './src/signup/main.ts' // our signup app
  },

  // Config for our build files
  output: {
    path: helpers.root('../bekindred/static/dist'),
    publicPath: '/static/dist/',
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js'
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  module: {
    preLoaders: [{
      test: /\.ts$/,
      loader: 'tslint-loader',
      exclude: [
        helpers.root('node_modules')
      ]
    }, {
      test: /\.js$/,
      loader: 'source-map-loader',
      exclude: [
        helpers.root('node_modules/rxjs')
      ]
    }],
    loaders: [
      // Support for .ts files.
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        query: {
          // remove TypeScript helpers to be injected below by DefinePlugin
          'compilerOptions': {
            'removeComments': true
          }
        },
        exclude: [
          /\.(spec|e2e)\.ts$/,
          helpers.root('node_modules')
        ]
      },

      // Support for *.json files.
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: [helpers.root('node_modules')]
      },

      // Support for CSS as raw text
      {
        test: /\.css$/,
        loader: 'raw-loader',
        exclude: [helpers.root('node_modules')]
      },

      // support for .html as raw text
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [
          helpers.root('src/index.html')
        ]
      }

    ],
    noParse: [
      helpers.root('zone.js', 'dist'),
      helpers.root('angular2', 'bundles')
    ]

  },

  plugins: [
    new WebpackMd5Hash(),
    new DedupePlugin(),
    new OccurenceOrderPlugin(true),
    new CommonsChunkPlugin({
      name: 'polyfills',
      filename: 'polyfills.[chunkhash].bundle.js',
      chunks: Infinity
    }),
    // static assets
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: 'assets'
    }]),
    // generating html
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new DefinePlugin({
      // Environment helpers
      'process.env': {
        'ENV': JSON.stringify(metadata.ENV),
        'NODE_ENV': JSON.stringify(metadata.ENV)
      }
    }),
    new UglifyJsPlugin({
      // to debug prod builds uncomment //debug lines and comment //prod lines

      // beautify: true,//debug
      mangle: false,//debug
      // dead_code: false,//debug
      // unused: false,//debug
      // deadCode: false,//debug
      // compress : { screw_ie8 : true, keep_fnames: true, drop_debugger: false, dead_code: false, unused: false, }, // debug
      // comments: true,//debug

      beautify: false, //prod
      // mangle: {
      //   screw_ie8: true,
      //   except: ['RouterLink', 'NgFor', 'NgModel'] // needed for uglify RouterLink problem
      // }, // prod
      compress: { screw_ie8: true, warnings: false }, //prod
      comments: false //prod

    }),
    // include uglify in production
    new CompressionPlugin({
      algorithm: helpers.gzipMaxLevel,
      regExp: /\.css$|\.html$|\.js$|\.map$/,
      threshold: 2 * 1024
    })
  ],
  // Other module loader config
  tslint: {
    emitErrors: true,
    failOnHint: true,
    resourcePath: 'src',
  },

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
  // don't use devServer for production
  node: {
    global: 'window',
    progress: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
