/*
 * These are globally available services in any component or any other service
 */
import {provide} from '@angular/core';

// Angular 2
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy}
from '@angular/common';

// Angular 2 Http
import {HTTP_PROVIDERS, JSONP_PROVIDERS} from '@angular/http';
// Angular 2 Router
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
// Angular 2 forms
import { disableDeprecatedForms, provideForms } from '@angular/forms';

/*
* Application Providers/Directives/Pipes
* providers/directives/pipes that only live in our browser environment
*/
export const APPLICATION_PROVIDERS_MAIN = [
  // new Angular 2 forms
  disableDeprecatedForms(),
  provideForms(),
  ...HTTP_PROVIDERS,
  ...JSONP_PROVIDERS,
  ...ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
  provide(APP_BASE_HREF, { useValue: '/' })
];


export const APPLICATION_PROVIDERS_SIGNUP = [
  // new Angular 2 forms
  disableDeprecatedForms(),
  provideForms(),
  ...HTTP_PROVIDERS,
  ...JSONP_PROVIDERS,
  ...ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
  provide(APP_BASE_HREF, { useValue: '/signup' })
];

export const PROVIDERS_MAIN = [
  ...APPLICATION_PROVIDERS_MAIN
];

export const PROVIDERS_SIGNUP = [
  ...APPLICATION_PROVIDERS_SIGNUP
];