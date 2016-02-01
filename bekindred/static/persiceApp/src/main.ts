// Angular 2
import {provide, enableProdMode} from 'angular2/core';
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
import {FORM_PROVIDERS} from 'angular2/common';
import {
ROUTER_PROVIDERS,
ROUTER_PRIMARY_COMPONENT,
HashLocationStrategy,
LocationStrategy
} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

/*
 * App Services
 * our collection of injectables services
 */
import {APP_SERVICES_PROVIDERS} from './app/services/services';


const ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
  enableProdMode();
}
else {
  ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);
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
  HttpClient,
  ...APP_SERVICES_PROVIDERS,
  ANGULAR2_GOOGLE_MAPS_PROVIDERS
];

/*
 * Platform injectables
 */
const PLATFORM_PROVIDERS = [
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  provide(ROUTER_PRIMARY_COMPONENT, { useValue: AppComponent }),
  provide(MapsAPILoader, { useClass: NoOpMapsAPILoader })
];

const APP_PROVIDERS = [
  UNIVERSAL_PROVIDERS,
  PLATFORM_PROVIDERS
];

export function main() {

  return bootstrap(
    AppComponent,
    APP_PROVIDERS
  ).catch(err => console.error(err));

}

document.addEventListener('DOMContentLoaded', main);
