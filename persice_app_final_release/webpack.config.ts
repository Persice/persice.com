import 'ts-helpers';
import {
  DEV_PORT,
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
  MY_CLIENT_RULES,
  MY_VENDOR_DLLS,
  MY_COPY_FOLDERS
} from './constants';

const {
  ContextReplacementPlugin,
  DefinePlugin,
  ProgressPlugin,
  NoErrorsPlugin,
  IgnorePlugin,
  DllPlugin,
  DllReferencePlugin
} = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ForkCheckerPlugin } = require('awesome-typescript-loader');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const { hasProcessFlag, generateHash, dotenv, root, testDll } = require('./helpers.js');
const HASH = generateHash();

dotenv.config({ path: './.env.settings' });

const EVENT = process.env.npm_lifecycle_event;
const AOT = EVENT.includes('aot');
const PROD = EVENT.includes('prod');
const DEV_SERVER = EVENT.includes('webdev');
const DLL = EVENT.includes('dll');
const HMR = hasProcessFlag('hot');
const MOBILE_SERVER = process.env.NODE_SERVER === 'mobile';
const CORDOVA_BUILD = EVENT.includes('cordova');

const AWS_S3_CUSTOM_DOMAIN = process.env.AWS_S3_CUSTOM_DOMAIN;
const FACEBOOK_ID = PROD ? process.env.FACEBOOK_ID_PRODUCTION : process.env.FACEBOOK_ID_DEVELOPMENT;
const LINKEDIN_ID = PROD ? process.env.LINKEDIN_ID_PRODUCTION : process.env.LINKEDIN_ID_DEVELOPMENT;
const SERVER_URI = DEV_SERVER ? process.env.SERVER_URI_WEBPACK_DEV_SERVER : (PROD ? process.env.SERVER_URI_PRODUCTION : process.env.SERVER_URI_DEVELOPMENT);
const MEDIA_URI = PROD ? process.env.MEDIA_URI_PRODUCTION : process.env.MEDIA_URI_DEVELOPMENT;
const FACEBOOK_SCOPE = process.env.FACEBOOK_SCOPE;
const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;

// DEFINE PORT
let port: number;
if (PROD) {
  port = PROD_PORT;
} else {
  port = DEV_PORT;
}
const PORT = port;

if (DEV_SERVER) {
  testDll();
  console.log(`Starting dev server on: http://${HOST}:${PORT}`);
}

console.log('EVENT: ', EVENT);
console.log('BUILDING FOR CORDOVA: ', CORDOVA_BUILD);
console.log('PRODUCTION BUILD: ', PROD);
console.log('FACEBOOK APP: ', FACEBOOK_ID);
console.log('AWS3 DOMAIN: ', AWS_S3_CUSTOM_DOMAIN);
console.log('DEV SERVER: ', DEV_SERVER);
console.log('MOBILE: ', MOBILE_SERVER);
console.log('AOT: ', AOT);
console.log('DLL: ', DLL);

const CONSTANTS = {
  AOT: AOT,
  ENV: PROD || AOT || CORDOVA_BUILD ? JSON.stringify('production') : JSON.stringify('development'),
  HMR: HMR,
  HOST: JSON.stringify(HOST),
  PORT: PORT,
  CORDOVA_BUILD: CORDOVA_BUILD ? JSON.stringify('enabled') : JSON.stringify('disabled'),
  STORE_DEV_TOOLS: JSON.stringify(STORE_DEV_TOOLS),
  SERVER_URI: JSON.stringify(SERVER_URI),
  MEDIA_URI: JSON.stringify(MEDIA_URI),
  FACEBOOK_ID: JSON.stringify(FACEBOOK_ID),
  LINKEDIN_ID: JSON.stringify(LINKEDIN_ID),
  FACEBOOK_SCOPE: JSON.stringify(FACEBOOK_SCOPE),
  GOOGLE_MAP_API_KEY: JSON.stringify(GOOGLE_MAP_API_KEY)
};

const DLL_VENDORS = [
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/forms',
  '@angular/http',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/platform-server',
  '@angular/router',
  '@ngrx/core',
  '@ngrx/core/add/operator/select.js',
  '@ngrx/effects',
  '@ngrx/router-store',
  '@ngrx/store',
  '@ngrx/store-devtools',
  '@ngrx/store-log-monitor',
  'ngrx-store-freeze',
  'ngrx-store-logger',
  'rxjs',
  ...MY_VENDOR_DLLS
];

const COPY_FOLDERS = [
  { from: 'src/assets', to: 'assets' },
  ...MY_COPY_FOLDERS
];

if (!DEV_SERVER) {
  // COPY_FOLDERS.unshift({ from: 'src/index.html' });
} else {
  COPY_FOLDERS.push({ from: 'dll' });
}

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
    new IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ProgressPlugin(),
    new ForkCheckerPlugin(),
    new DefinePlugin(CONSTANTS),
    new NamedModulesPlugin(),
    ...MY_CLIENT_PLUGINS
  ];

  // PRODUCTION with or without AOT
  if (PROD && AOT && !CORDOVA_BUILD) {
    config.plugins.push(
      ...productionPluginsForOptimization,
      ...productionPluginsForTemplates,
      ...MY_CLIENT_PRODUCTION_PLUGINS
    );
  }

  // PRODUCTION with or without AOT
  if (PROD && AOT && CORDOVA_BUILD) {
    config.plugins.push(
      ...productionPluginsForOptimization,
      ...MY_CLIENT_PRODUCTION_PLUGINS
    );
  }

  // DEVELOPMENT (without dev server)
  if (!PROD && !DEV_SERVER && !AOT && !DLL) {
    config.plugins.push(
      ...developmentPluginsForTemplates
    );
  }

  // DEVELOPMENT + AOT (without dev server)
  if (!PROD && AOT) {
    config.plugins.push(
      ...productionPluginsForOptimization,
      ...developmentPluginsForTemplates
    );
  }

  if (DEV_SERVER) {
    config.plugins.push(
      new DllReferencePlugin({
        context: '.',
        manifest: require(`./dll/polyfill-manifest.json`)
      }),
      new DllReferencePlugin({
        context: '.',
        manifest: require(`./dll/vendor-manifest.json`)
      })
    );

    if (MOBILE_SERVER) {
      config.plugins.push(
        new HtmlWebpackPlugin({
          template: 'src/index-mobile.html',
          inject: false
        })
      );
    } else {
      config.plugins.push(
        new HtmlWebpackPlugin({
          template: 'src/index.html',
          inject: false
        })
      );
    }
  }

  if (DLL) {
    config.plugins.push(
      new DllPlugin({
        name: '[name]',
        path: root('dll/[name]-manifest.json'),
      })
    );
  } else {
    config.plugins.push(
      new CopyWebpackPlugin(COPY_FOLDERS)
    );
  }

  return config;
}();

// type definition for WebpackConfig at the bottom
const clientConfig = function webpackConfig(): WebpackConfig {

  let config: WebpackConfig = Object.assign({});

  config.cache = true;
  PROD ? config.devtool = PROD_SOURCE_MAPS : config.devtool = DEV_SOURCE_MAPS;
  if (DLL) {
    config.entry = {
      'main': [ './src/main.browser' ],
      'main-mobile': [ './src/main-mobile.browser' ],
      'polyfill': [
        'sockjs-client',
        '@angularclass/hmr',
        'ts-helpers',
        'zone.js',
        'core-js/client/shim.js',
        'core-js/es6/reflect.js',
        'core-js/es7/reflect.js',
        'querystring-es3',
        'strip-ansi',
        'url',
        'punycode',
        'events',
        'webpack-dev-server/client/socket.js',
        'webpack/hot/emitter.js',
        'zone.js/dist/long-stack-trace-zone.js'
      ],
      vendor: [ ...DLL_VENDORS ]
    };
  } else {

    if (DEV_SERVER) {
      if (MOBILE_SERVER) {
        config.entry = {
          'main-mobile': './src/main-mobile.browser'
        };
      } else {
        config.entry = {
          'main': './src/main.browser',
        };
      }
    } else {
      if (AOT) {
        if (CORDOVA_BUILD) {
          config.entry = {
            'main-mobile': './src/main-mobile.browser.aot'
          };
        } else {
          config.entry = {
            'main': './src/main.browser.aot',
            'main-mobile': './src/main-mobile.browser.aot'
          };
        }

      } else {
        config.entry = {
          'main': './src/main.browser',
          'main-mobile': './src/main-mobile.browser'
        };
      }
    }

  }

  if (!DLL) {
    config.output = {
      path: !CORDOVA_BUILD ? root('dist') : root('dist_cordova'),
      filename: PROD && !CORDOVA_BUILD ? '[name].' + HASH + '.prod.bundle.js' : '[name].bundle.js',
      sourceMapFilename: PROD && !CORDOVA_BUILD ? '[name].' + HASH + '.prod.bundle.map' : '[name].bundle.map',
      chunkFilename: PROD && !CORDOVA_BUILD ? '[id].' + HASH + '.chunk.js' : '[id].chunk.js',
    };
  } else {
    config.output = {
      path: root('dll'),
      filename: '[name].dll.js',
      library: '[name]'
    };
  }

  if (!DEV_SERVER && !DLL) {
    config.output.publicPath = PROD && !CORDOVA_BUILD ? AWS_S3_CUSTOM_DOMAIN + '/assets/js/' : 'assets/js/';
  }

  config.devServer = {
    contentBase: AOT ? './src/compiled' : './src',
    port: CONSTANTS.PORT,
    historyApiFallback: {
      index: MOBILE_SERVER ? 'index-mobile.html' : 'index.html'
    },
    host: '0.0.0.0',
    watchOptions: {
      aggregateTimeout: 0,
      poll: 300,
      ignored: /node_modules/
    }
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

DLL ? console.log('BUILDING DLLs') : console.log('BUILDING APP');
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
    quiet?: boolean;
    outputPath?: string;
    noInfo?: boolean;
    watchOptions?: any;
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
