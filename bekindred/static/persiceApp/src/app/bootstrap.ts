/// <reference path="../typings/_custom.d.ts" />

// Angular 2
import {bind, bootstrap, provide} from 'angular2/angular2';


/*
 * Common Injectables
 * our custom helper injectables to configure our app differently using the dependency injection system
 */
// import {
//   JIT_CHANGEDETECTION_BINDINGS,
//   DYNAMIC_CHANGEDETECTION_BINDINGS,
//   PREGENERATED_CHANGEDETECTION_BINDINGS,
//   BEST_CHANGEDETECTION_BINDINGS
// } from '../bindings/change_detection_bindings';

import {
PATH_LOCATION_BINDINGS,
HASH_LOCATION_BINDINGS
} from '../bindings/location_bindings';

/*
 * Angular Modules
 */
import {FORM_BINDINGS} from 'angular2/angular2';
import {
ROUTER_BINDINGS,
ROUTER_PRIMARY_COMPONENT,
HashLocationStrategy,
LocationStrategy
} from 'angular2/router';
import {HTTP_BINDINGS} from 'angular2/http';

/*
 * App Services
 * our collection of injectables services
 */
import {APP_SERVICES_BINDINGS} from './services/services';

/*
 * App Component
 * our top level component that holds all of our components
 */
import {AppComponent} from './components/app.component';


/*
 * Universal injectables
 */
const UNIVERSAL_BINDINGS = [
  ROUTER_BINDINGS,
  FORM_BINDINGS,
  HTTP_BINDINGS,
  APP_SERVICES_BINDINGS
];

/*
 * Platform injectables
 */
const PLATFORM_BINDINGS = [
// if we want to explicit change detection
// BEST_CHANGEDETECTION_BINDINGS,
  HASH_LOCATION_BINDINGS,
];

const APP_BINDINGS = [
  UNIVERSAL_BINDINGS,
  PLATFORM_BINDINGS,
  provide(ROUTER_PRIMARY_COMPONENT, { useValue: AppComponent })
];

bootstrap(
  AppComponent,
  APP_BINDINGS
);
