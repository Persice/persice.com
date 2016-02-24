// Angular 2
import {provide, enableProdMode} from 'angular2/core';
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
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
  ...JSONP_PROVIDERS,
  HttpClient,
  ...APP_SERVICES_PROVIDERS,
  ANGULAR2_GOOGLE_MAPS_PROVIDERS
];

/*
 * Platform injectables
 */
const PLATFORM_PROVIDERS = [
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
  provide(ROUTER_PRIMARY_COMPONENT, { useValue: AppComponent }),
  provide(APP_BASE_HREF, { useValue: '/' }),
  provide(MapsAPILoader, { useClass: NoOpMapsAPILoader })
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
  bootstrap(AppComponent, APP_PROVIDERS)
    .catch(err => console.error(err));
});



// /*
//  * Modified for using hot module reload
//  */

// // typescript lint error 'Cannot find name "module"' fix
// declare let module: any;

// // activate hot module reload
// if (module.hot) {
//   bootstrap(AppComponent, APP_PROVIDERS)
//     .catch(err => console.error(err));

//   module.hot.accept();
// }
