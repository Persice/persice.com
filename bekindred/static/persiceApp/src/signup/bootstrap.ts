// Angular 2
import {provide, enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';

/*
 * Angular Modules
 */

import {ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/common_dom';

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
// import {APP_SERVICES_PROVIDERS} from './services/services';



// import {HttpClient} from './core/http_client';

/*
 * App Component
 * our top level component that holds all of our components
 */
import {SignupComponent} from './components/signup.component';


/*
 * Universal injectables
 */
const UNIVERSAL_PROVIDERS = [
  ROUTER_PROVIDERS,
  ELEMENT_PROBE_PROVIDERS,
  FORM_PROVIDERS,
  HTTP_PROVIDERS,
  // APP_SERVICES_PROVIDERS,
];

/*
 * Platform injectables
 */
const PLATFORM_PROVIDERS = [
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  provide(ROUTER_PRIMARY_COMPONENT, { useValue: SignupComponent }),
];

const APP_PROVIDERS = [
  UNIVERSAL_PROVIDERS,
  PLATFORM_PROVIDERS
];

// enableProdMode();

export function main() {

  return bootstrap(
    SignupComponent,
    APP_PROVIDERS
  ).catch(err => console.error(err));

}

document.addEventListener('DOMContentLoaded', main);

