/// <reference path="../typings/_custom.d.ts" />

// Angular 2
import {bootstrap, provide} from 'angular2/angular2';


/*
 * Angular Modules
 */
import {FORM_PROVIDERS, ELEMENT_PROBE_PROVIDERS} from 'angular2/angular2';
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
import {APP_SERVICES_PROVIDERS} from './services/services';


/*
 * Google maps
 */
import {
MapsAPILoader,
NoOpMapsAPILoader,
ANGULAR2_GOOGLE_MAPS_PROVIDERS
} from './components/map/angular2_google_maps';

/*
 * App Component
 * our top level component that holds all of our components
 */
import {AppComponent} from './components/app.component';


/*
 * Universal injectables
 */
const UNIVERSAL_PROVIDERS = [
  ELEMENT_PROBE_PROVIDERS,
  ROUTER_PROVIDERS,
  FORM_PROVIDERS,
  HTTP_PROVIDERS,
  APP_SERVICES_PROVIDERS,
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

bootstrap(
  AppComponent,
  APP_PROVIDERS
);
