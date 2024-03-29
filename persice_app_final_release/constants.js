"use strict";
const root = require('./helpers.js').root;
const ip = require('ip');

exports.HOST = 'localhost'; //ip.address();
exports.DEV_PORT = 8080;
exports.DEV_PORT_MOBILE = 8089;
exports.E2E_PORT = 4201;
exports.PROD_PORT = 8080; //8088;

exports.MY_VENDOR_DLLS = [
  // list vendors that you want to be included in your dlls files
  // this will speed up initial dev server build and incremental builds.
  // Be sure to run `npm run build:dll` if you make changes to this array.
];

exports.MY_COPY_FOLDERS = [
  // use this for folders you want to be copied in to Client dist
  // src/assets and index.html are already copied by default.
  // format is { from: 'folder_name', to: 'folder_name' }
];

/**
 * These constants set whether or not you will use proxy for Webpack DevServer
 * For advanced configuration details, go to:
 * https://webpack.github.io/docs/webpack-dev-server.html#proxy
 */
exports.USE_DEV_SERVER_PROXY = true;
exports.DEV_SERVER_PROXY_CONFIG = {
  '/api': 'http://test-local.com:8000',
  '/socket.io/': 'http://test-local.com:8000',
  '/media': 'http://test-local.com:8000',
  '/static': 'http://test-local.com:8000',
  '/assets': 'http://test-local.com:8000',
  '/public': 'http://test-local.com:8000'
};

/**
 * These constants set whether or not you will use proxy for Webpack DevServer
 * For advanced configuration details, go to:
 * https://webpack.github.io/docs/webpack-dev-server.html#proxy
 */
exports.USE_DEV_SERVER_STATS_CONFIG = true;
exports.DEV_SERVER_STATS_CONFIG = {
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
};

/**
 * These constants set the source maps that will be used on build.
 * For info on source map options, go to:
 * https://webpack.github.io/docs/configuration.html#devtool
 */
exports.DEV_SOURCE_MAPS = '#eval';
exports.PROD_SOURCE_MAPS = '#source-map';

/**
 * specifies which @ngrx dev tools will be available when you build and load
 * your app in dev mode. Options are: monitor | logger | both | none
 */
exports.STORE_DEV_TOOLS = 'none';

exports.EXCLUDE_SOURCE_MAPS = [
  // these packages have problems with their sourcemaps
  root('node_modules/@angular'),
  root('node_modules/rxjs')
];

exports.MY_CLIENT_PLUGINS = [
  // use this to import your own webpack config Client plugins.
];

exports.MY_CLIENT_PRODUCTION_PLUGINS = [
  // use this to import your own webpack config plugins for production use.
];

exports.MY_CLIENT_RULES = [
  // use this to import your own rules for Client webpack config.
];

exports.MY_TEST_RULES = [
  // use this to import your own rules for Test webpack config.
];

exports.MY_TEST_PLUGINS = [
  // use this to import your own Test webpack config plugins.
];

