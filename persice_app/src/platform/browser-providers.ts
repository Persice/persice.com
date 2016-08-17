/*
 * These are globally available services in any component or any other service
 */
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_PROVIDERS, JSONP_PROVIDERS } from '@angular/http';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { APP_MOBILE_ROUTER_PROVIDERS } from '../app-mobile';
import { APP_ROUTER_PROVIDERS } from '../app';
import { SIGNUP_MOBILE_ROUTER_PROVIDERS } from '../signup-mobile';

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
  ...APP_ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: PathLocationStrategy},
  {provide: APP_BASE_HREF, useValue: '/'}
];

export const APPLICATION_PROVIDERS_MAIN_MOBILE = [
  // new Angular 2 forms
  disableDeprecatedForms(),
  provideForms(),
  ...HTTP_PROVIDERS,
  ...JSONP_PROVIDERS,
  ...APP_MOBILE_ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: PathLocationStrategy}
];

export const APPLICATION_PROVIDERS_SIGNUP_MOBILE = [
  // new Angular 2 forms
  disableDeprecatedForms(),
  provideForms(),
  ...HTTP_PROVIDERS,
  ...JSONP_PROVIDERS,
  ...SIGNUP_MOBILE_ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: PathLocationStrategy},
  {provide: APP_BASE_HREF, useValue: '/signup'}
];

export const PROVIDERS_MAIN = [
  ...APPLICATION_PROVIDERS_MAIN
];

export const PROVIDERS_MAIN_MOBILE = [
  ...APPLICATION_PROVIDERS_MAIN_MOBILE
];


export const PROVIDERS_SIGNUP_MOBILE = [
  ...APPLICATION_PROVIDERS_SIGNUP_MOBILE
];
