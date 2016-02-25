// Angular 2

import * as ng from 'angular2/core';
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
import {APP_SERVICES_PROVIDERS} from './app/services/services';


const ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
  ng.enableProdMode();
  ENV_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS_PROD_MODE);
}
else {
  ENV_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS);
}


import {HttpClient} from './app/core/http_client';

/*
 * Google maps
 */
import {
MapsAPILoader,
NoOpMapsAPILoader,
ANGULAR2_GOOGLE_MAPS_PROVIDERS
} from './app/components/map/core';

/*
 * App Component
 * our top level component that holds all of our components
 */
import {AppComponent} from './app/components/app.component';


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
  ...APP_SERVICES_PROVIDERS,
  ANGULAR2_GOOGLE_MAPS_PROVIDERS
];

/*
 * Platform injectables
 */
const PLATFORM_PROVIDERS = [
  ng.provide(LocationStrategy, { useClass: PathLocationStrategy }),
  ng.provide(ROUTER_PRIMARY_COMPONENT, { useValue: AppComponent }),
  ng.provide(APP_BASE_HREF, { useValue: '/' }),
  ng.provide(MapsAPILoader, { useClass: NoOpMapsAPILoader })
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
  return browser.bootstrap(AppComponent, APP_PROVIDERS)
    .catch(err => console.error(err));
}

/*
 * Vendors
 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
 * Also see custom_typings.d.ts as you also need to do `typings install x` where `x` is your module
 */



/*
 * Hot Module Reload
 */
if ('development' === process.env.ENV) {
  // activate hot module reload
  if ('hot' in module) {
    if (document.readyState === 'complete') {
      main();
    } else {
      document.addEventListener('DOMContentLoaded', main);
    }
    module.hot.accept();
  }

} else {
  // bootstrap after document is ready
  document.addEventListener('DOMContentLoaded', main);
}

