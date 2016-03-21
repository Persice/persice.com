/*
 * Providers provided by Angular
 */
import * as browser from 'angular2/platform/browser';
import * as ngCore from 'angular2/core';
import {
  ROUTER_PROVIDERS,
  ROUTER_DIRECTIVES,
  LocationStrategy,
  PathLocationStrategy,
  APP_BASE_HREF,
  ROUTER_PRIMARY_COMPONENT
} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';
import {HTTP_PROVIDERS} from 'angular2/http';

/*
 * App Component
 * our top level component that holds all of our components
 */
import {SignupComponent} from './components/signup.component';


import {APP_SERVICES_PROVIDERS} from '../app/services/services';


import {provideStore} from '@ngrx/store';
import * as devtools from '@ngrx/devtools';

import {HttpClient} from '../app/core/http_client';

/*
 * Application Providers/Directives/Pipes
 * providers/directives/pipes that only live in our browser environment
 */
// application_providers: providers that are global through out the application
const APPLICATION_PROVIDERS = [
  ...HTTP_PROVIDERS,
  ...ROUTER_PROVIDERS,
  ...FORM_PROVIDERS,
  ...APP_SERVICES_PROVIDERS,
  HttpClient,
  ngCore.provide(LocationStrategy, { useClass: PathLocationStrategy }),
  ngCore.provide(ROUTER_PRIMARY_COMPONENT, { useValue: SignupComponent }),
  ngCore.provide(APP_BASE_HREF, { useValue: '/signup' })
];

// application_directives: directives that are global through out the application
const APPLICATION_DIRECTIVES = [
  ...ROUTER_DIRECTIVES
];

// application_pipes: pipes that are global through out the application
const APPLICATION_PIPES = [

];



// Environment
if ('production' === ENV) {
  // Production
  ngCore.enableProdMode();
  APPLICATION_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS_PROD_MODE);
} else {
  // Development
  APPLICATION_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS);
}


/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function mainSignup() {
  return browser.bootstrap(SignupComponent, [
    ...APPLICATION_PROVIDERS,
    ngCore.provide(ngCore.PLATFORM_DIRECTIVES, { useValue: APPLICATION_DIRECTIVES, multi: true }),
    ngCore.provide(ngCore.PLATFORM_PIPES, { useValue: APPLICATION_PIPES, multi: true })
  ])
    .catch(err => console.error(err));
}


/*
 * Vendors
 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
 * You can also import them in vendors to ensure that they are bundled in one file
 * Also see custom-typings.d.ts as you also need to do `typings install x` where `x` is your module
 */


/*
 * Hot Module Reload
 */

function bootstrapDomReady() {
  // bootstrap after document is ready
  return document.addEventListener('DOMContentLoaded', mainSignup);
}

if ('development' === ENV) {
  // activate hot module reload
  if (HMR) {
    if (document.readyState === 'complete') {
      mainSignup();
    } else {
      bootstrapDomReady();
    }
    module.hot.accept();
  } else {
    bootstrapDomReady();
  }

  // fix for closing remodal after hot reload
  jQuery('.remodal-overlay').remove();
  jQuery('.remodal-wrapper').remove();
} else {
  bootstrapDomReady();
}




