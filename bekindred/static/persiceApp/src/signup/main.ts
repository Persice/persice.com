// Angular 2
import {provide, enableProdMode} from 'angular2/core';
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';

/*
 * Angular Modules
 */

const ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
  enableProdMode();
}
else {
  ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);
}


import {FORM_PROVIDERS} from 'angular2/common';
import {
ROUTER_PROVIDERS,
ROUTER_PRIMARY_COMPONENT,
HashLocationStrategy,
PathLocationStrategy,
APP_BASE_HREF,
LocationStrategy
} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

/*
 * App Services
 * our collection of injectables services
 */
import {APP_SERVICES_PROVIDERS} from '../app/services/services';



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
  ...ROUTER_PROVIDERS,
  ...ENV_PROVIDERS,
  ...FORM_PROVIDERS,
  ...HTTP_PROVIDERS,
  HttpClient,
  ...APP_SERVICES_PROVIDERS,
];

/*
 * Platform injectables
 */
const PLATFORM_PROVIDERS = [
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
  provide(APP_BASE_HREF, { useValue: '/signup' }),
  provide(ROUTER_PRIMARY_COMPONENT, { useValue: SignupComponent }),
];

const APP_PROVIDERS = [
  UNIVERSAL_PROVIDERS,
  PLATFORM_PROVIDERS
];

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */

document.addEventListener('DOMContentLoaded', function main() {
  bootstrap(SignupComponent, APP_PROVIDERS)
    .catch(err => console.error(err));
});



/*
 * Modified for using hot module reload
 */

// typescript lint error 'Cannot find name "module"' fix
declare let module: any;

// activate hot module reload
if (module.hot) {
  bootstrap(SignupComponent, APP_PROVIDERS)
    .catch(err => console.error(err));

  module.hot.accept();
}
