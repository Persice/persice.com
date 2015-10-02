/// <reference path="../typings/_custom.d.ts" />

// Angular 2
import {bind, bootstrap} from 'angular2/angular2';


/*
 * Common Injectables
 * our custom helper injectables to configure our app differently using the dependency injection system
 */
 import {
   JIT_CHANGEDETECTION_BINDINGS,
   DYNAMIC_CHANGEDETECTION_BINDINGS,
   PREGENERATED_CHANGEDETECTION_BINDINGS,
   BEST_CHANGEDETECTION_BINDINGS
 } from '../bindings/change_detection_bindings';
 import {
   PATH_LOCATION_BINDINGS,
   HASH_LOCATION_BINDINGS
 } from '../bindings/location_bindings';

/*
 * Angular Modules
 */
 import {FORM_BINDINGS} from 'angular2/angular2';
 import {ROUTER_BINDINGS, HashLocationStrategy, LocationStrategy} from 'angular2/router';
 import {ELEMENT_PROBE_BINDINGS} from 'angular2/debug';
 import {HTTP_BINDINGS} from 'angular2/http';

/*
 * App Services
 * our collection of injectables services
 */
// import {APP_SERVICES_BINDINGS} from './services/services';


/*
 * App Component
 * our top level component that holds all of our components
 */
 import {AppComponent} from './components/app.component';


/*
 * Universal injectables
 */
 const UNIVERSAL_BINDINGS = [
// angular's http/form/router services/bindings
ROUTER_BINDINGS,
ELEMENT_PROBE_BINDINGS,
FORM_BINDINGS,
HTTP_BINDINGS,
    // bind(LocationStrategy).toClass(HashLocationStrategy)
    // our collection of services from /services
    // APP_SERVICES_BINDINGS
    ];

/*
 * Platform injectables
 */
 const PLATFORM_BINDINGS = [
    // if we want to explicit change detection
    // BEST_CHANGEDETECTION_BINDINGS,

    // if we want to use hashBash url for the router
    HASH_LOCATION_BINDINGS,
    ];

    const APP_BINDINGS = [
    UNIVERSAL_BINDINGS,
    PLATFORM_BINDINGS
    ];

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Universal/Platform services/bindings into Angular's dependency injection
 */
 bootstrap(
    // Top Level Component
    AppComponent,
    // AppBindings
    APP_BINDINGS
    );

if (module.hot) {
   module.hot.accept(function() {
     bootstrap(
       AppComponent,
       APP_BINDINGS
       );
   });
 }

