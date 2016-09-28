/* tslint:disable: variable-name max-line-length */
/**
 * Try to not make your own edits to this file, use the constants folder instead.
 * If more constants should be added file an issue or create PR.
 */
import 'ts-helpers';
import {
  DEV_PORT,
  DEV_PORT_MOBILE,
  PROD_PORT,
  EXCLUDE_SOURCE_MAPS,
  HOST,
  USE_DEV_SERVER_PROXY,
  DEV_SERVER_PROXY_CONFIG,
  DEV_SERVER_STATS_CONFIG,
  USE_DEV_SERVER_STATS_CONFIG,
  DEV_SOURCE_MAPS,
  PROD_SOURCE_MAPS,
  STORE_DEV_TOOLS,
  MY_CLIENT_PLUGINS,
  MY_CLIENT_PRODUCTION_PLUGINS,
  MY_CLIENT_RULES
} from './constants';

const {
  ContextReplacementPlugin,
  DefinePlugin,
  ProgressPlugin,
  NoErrorsPlugin,
  IgnorePlugin
} = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ForkCheckerPlugin } = require('awesome-typescript-loader');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const includeClientPackages = require('./helpers.js').includeClientPackages;
const hasProcessFlag = require('./helpers.js').hasProcessFlag;
const root = require('./helpers.js').root;
const HASH = require('./helpers.js').generateHash(); // Generate unique hash used for cache busting
const dotenv = require('./helpers').dotenv;

dotenv.config({path: './.env.settings'});

const ENV = process.env.npm_lifecycle_event;
const AOT = ENV === 'build:aot' || ENV === 'build:aot:dev' || ENV === 'server:aot' || ENV === 'watch:aot';
const isProd = ENV === 'build:prod' || ENV === 'server:prod' || ENV === 'watch:prod' || ENV === 'build:aot';
const HMR = hasProcessFlag('hot');

const isMobileDevServerEnabled = process.env.NODE_ENV === 'mobile';
const isDevServer = process.env.NODE_SERVER === 'dev';

const AWS_S3_CUSTOM_DOMAIN = process.env.AWS_S3_CUSTOM_DOMAIN;
const FACEBOOK_ID = isProd ? process.env.FACEBOOK_ID_PRODUCTION : process.env.FACEBOOK_ID_DEVELOPMENT;
const LINKEDIN_ID = isProd ? process.env.LINKEDIN_ID_PRODUCTION : process.env.LINKEDIN_ID_DEVELOPMENT;
const FACEBOOK_SCOPE = process.env.FACEBOOK_SCOPE;
const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;

// DEFINE PORT
let port: number;
if (isProd) {
  port = PROD_PORT;
} else {
  if (isMobileDevServerEnabled) {
    port = DEV_PORT_MOBILE;
  } else {
    port = DEV_PORT;
  }
}
const PORT = port;

console.log('PRODUCTION BUILD: ', isProd);
console.log('AWS3 DOMAIN: ', AWS_S3_CUSTOM_DOMAIN);
console.log('DEV SERVER: ', isDevServer);
console.log('MOBILE DEV SERVER ENABLED: ', isMobileDevServerEnabled);
console.log('AOT: ', AOT);
if (ENV === 'webdev') {
  console.log(`Starting dev server on: http://${HOST}:${PORT}`);
}

const CONSTANTS = {
  AOT: AOT,
  ENV: isProd || AOT ? JSON.stringify('production') : JSON.stringify('development'),
  HMR: HMR,
  HOST: JSON.stringify(HOST),
  PORT: PORT,
  STORE_DEV_TOOLS: JSON.stringify(STORE_DEV_TOOLS),
  FACEBOOK_ID:  JSON.stringify(FACEBOOK_ID),
  LINKEDIN_ID:  JSON.stringify(LINKEDIN_ID),
  FACEBOOK_SCOPE:  JSON.stringify(FACEBOOK_SCOPE),
  GOOGLE_MAP_API_KEY:  JSON.stringify(GOOGLE_MAP_API_KEY)
};

const commonConfig = function webpackConfig(): WebpackConfig {
  let config: WebpackConfig = Object.assign({});

  config.module = {
    rules: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [ EXCLUDE_SOURCE_MAPS ]
      },
      {
        test: /\.ts$/,
        loaders: [
          '@angularclass/hmr-loader',
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular2-router-loader?loader=system&genDir=src/compiled/src/app&aot=' + AOT
        ],
        exclude: [ /\.(spec|e2e|d)\.ts$/ ]
      },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.html/, loader: 'raw-loader', exclude: [ root('src/index.html'), root('src/index-mobile.html') ] },
      { test: /\.css$/, loader: 'raw-loader' },
      ...MY_CLIENT_RULES
    ]
  };

  let productionPluginsForTemplates = [
    new HtmlWebpackPlugin({
      template: 'templates/production/index.html',
      filename: 'index.html',
      chunks: [ 'main' ],
      chunksSortMode: 'dependency',
      minify: false
    }),
    new HtmlWebpackPlugin({
      template: 'templates/production/index-mobile.html',
      filename: 'index-mobile.html',
      chunks: [ 'main-mobile' ],
      chunksSortMode: 'dependency',
      minify: false
    }),
  ];

  let productionPluginsForOptimization = [
    new NoErrorsPlugin(),
    new UglifyJsPlugin({
      beautify: false,
      comments: false
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
  ];

  let developmentPluginsForTemplates = [
    new HtmlWebpackPlugin({
      template: 'templates/development/index.html',
      filename: 'index.html',
      chunks: [ 'main' ],
      chunksSortMode: 'dependency',
      minify: false
    }),
    new HtmlWebpackPlugin({
      template: 'templates/development/index-mobile.html',
      filename: 'index-mobile.html',
      chunks: [ 'main-mobile' ],
      chunksSortMode: 'dependency',
      minify: false
    })
  ];

  config.plugins = [
    new AssetsPlugin({
      path: root('/'),
      filename: 'webpack-assets.json',
      prettyPrint: true
    }),
    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      root('./src')
    ),
    // new ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ProgressPlugin(),
    new ForkCheckerPlugin(),
    new DefinePlugin(CONSTANTS),
    new NamedModulesPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets'
      }
    ]),
    ...MY_CLIENT_PLUGINS
  ];

  // PRODUCTION with or wuthout AOT
  if (isProd && !isDevServer) {
    config.plugins.push(
      ...productionPluginsForOptimization,
      ...productionPluginsForTemplates,
      ...MY_CLIENT_PRODUCTION_PLUGINS
    );
  }

  // DEVELOPMENT (with not dev server)
  if (!isProd && !isDevServer && !AOT) {
    config.plugins.push(
      ...developmentPluginsForTemplates
    );
  }

  // DEVELOPMENT + AOT (with not dev server)
  if (!isProd && !isDevServer && AOT) {
    config.plugins.push(
      ...productionPluginsForOptimization,
      ...developmentPluginsForTemplates
    );
  }

  return config;
}();

// type definition for WebpackConfig at the bottom
const clientConfig = function webpackConfig(): WebpackConfig {

  let config: WebpackConfig = Object.assign({});

  config.cache = true;
  isProd ? config.devtool = PROD_SOURCE_MAPS : config.devtool = DEV_SOURCE_MAPS;

  if (AOT) {
    config.entry = {
      'main': './src/main.browser.aot',
      'main-mobile': './src/main-mobile.browser.aot'
    };
  } else {
    config.entry = {
      'main': './src/main.browser',
      'main-mobile': './src/main-mobile.browser'
    };
  }

  config.output = {
    path: root('dist'),
    filename: isProd ? '[name].' + HASH + '.prod.bundle.js' : '[name].bundle.js',
    sourceMapFilename: isProd ? '[name].' + HASH + '.prod.bundle.map' : '[name].bundle.map',
    chunkFilename: isProd ? '[id].' + HASH + '.chunk.js' : '[id].chunk.js',
  };

  if (!isDevServer) {
    config.output.publicPath = isProd ? AWS_S3_CUSTOM_DOMAIN + '/assets/js/' : '/assets/js/';
  }

  config.devServer = {
    contentBase: AOT ? './src/compiled' : './src',
    port: CONSTANTS.PORT,
    historyApiFallback: {
      index: isMobileDevServerEnabled ? 'index-mobile.html' : 'index.html'
    },
    host: '0.0.0.0'
  };

  if (USE_DEV_SERVER_PROXY) {
    Object.assign(config.devServer, {
      proxy: DEV_SERVER_PROXY_CONFIG
    });
  }

  if (USE_DEV_SERVER_STATS_CONFIG) {
    Object.assign(config.devServer, {
      stats: DEV_SERVER_STATS_CONFIG
    });
  }

  config.node = {
    global: true,
    process: true,
    Buffer: false,
    crypto: true,
    module: false,
    clearImmediate: false,
    setImmediate: false,
    clearTimeout: true,
    setTimeout: true
  };

  return config;

}();

const defaultConfig = {
  resolve: {
    extensions: [ '.ts', '.js', '.json' ],
    modules: [ root('src'), 'node_modules' ],

  }
};

console.log('BUILDING APP');
module.exports = webpackMerge({}, defaultConfig, commonConfig, clientConfig);

// Types
interface WebpackConfig {
  cache?: boolean;
  target?: string;
  devtool?: string;
  entry: any;
  externals?: any;
  output: any;
  module?: any;
  plugins?: Array<any>;
  resolve?: {
    extensions?: Array<string>;
  };
  devServer?: {
    contentBase?: string;
    port?: number;
    historyApiFallback?: any;
    hot?: boolean;
    inline?: boolean;
    proxy?: any;
    host?: string;
    outputPath?: string;
  };
  node?: {
    process?: boolean;
    global?: boolean;
    Buffer?: boolean;
    crypto?: boolean;
    module?: boolean;
    clearImmediate?: boolean;
    setImmediate?: boolean
    clearTimeout?: boolean;
    setTimeout?: boolean;
    __dirname?: boolean;
    __filename?: boolean;
  };
}
