// App
export * from './app-mobile.component';

import {
  ANGULAR2_GOOGLE_MAPS_PROVIDERS
} from '../app/shared/components/map/core';

// import {provideStore} from '@ngrx/store';
// import * as devtools from '@ngrx/devtools';
require('hammerjs');

import {HttpClient} from '../app/shared/core';

// Application wide providers
export const APP_PROVIDERS = [
  ...ANGULAR2_GOOGLE_MAPS_PROVIDERS,
  HttpClient
];

export * from './app-mobile.routes';
