// Angular 2
import * as ngCore from 'angular2/core';
import * as browser from 'angular2/platform/browser';

import {FORM_PROVIDERS} from 'angular2/common';
import {
ROUTER_PROVIDERS,
ROUTER_PRIMARY_COMPONENT,
HashLocationStrategy,
PathLocationStrategy,
LocationStrategy,
APP_BASE_HREF
} from 'angular2/router';
import {HTTP_PROVIDERS, JSONP_PROVIDERS} from 'angular2/http';

/*
 * App Services
 * our collection of injectables services
 */
import {APP_SERVICES_PROVIDERS} from '../app/services/services';


const ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
  ngCore.enableProdMode();
  ENV_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS_PROD_MODE);
}
else {
  ENV_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS);
}


import {HttpClient} from '../app/core/http_client';


/*
 * App Component
 * our top level component that holds all of our components
 */
import {SignupComponent} from './components/signup.component';


/*
 * Universal injectables
 */
const UNIVERSAL_PROVIDERS = [
  ...ENV_PROVIDERS,
  ...ROUTER_PROVIDERS,
  ...FORM_PROVIDERS,
  ...HTTP_PROVIDERS,
  ...JSONP_PROVIDERS,
  HttpClient,
  ...APP_SERVICES_PROVIDERS
];

/*
 * Platform injectables
 */
const PLATFORM_PROVIDERS = [
  ngCore.provide(LocationStrategy, { useClass: PathLocationStrategy }),
  ngCore.provide(ROUTER_PRIMARY_COMPONENT, { useValue: SignupComponent }),
  ngCore.provide(APP_BASE_HREF, { useValue: '/signup' }),
];

const APP_PROVIDERS = [
  UNIVERSAL_PROVIDERS,
  PLATFORM_PROVIDERS
];

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function main() {
  return browser.bootstrap(SignupComponent, APP_PROVIDERS)
    .catch(err => console.error(err));
}

/*
 * Vendors
 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
 * Also see custom_typings.d.ts as you also need to do `typings install x` where `x` is your module
 */

/*
 * Hot Module Reload
 * experimental version
 */

function bootstrapDomReady() {
  // bootstrap after document is ready
  return document.addEventListener('DOMContentLoaded', main);
}

if ('development' === process.env.ENV) {
  // activate hot module reload
  if (process.env.HMR) {
    if (document.readyState === 'complete') {
      main();
    } else {
      bootstrapDomReady();
    }
    module.hot.accept();
  } else {
    bootstrapDomReady();
  }
} else {
  bootstrapDomReady();
}
