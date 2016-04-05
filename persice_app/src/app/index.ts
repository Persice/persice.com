// App
export * from './app.component';

import {APP_SERVICES_PROVIDERS} from './services/services';

import {
  MapsAPILoader,
  NoOpMapsAPILoader,
  ANGULAR2_GOOGLE_MAPS_PROVIDERS
} from './components/map/core';

// import {provideStore} from '@ngrx/store';
// import * as devtools from '@ngrx/devtools';

import {HttpClient} from './core/http_client';

// Application wide providers
export const APP_PROVIDERS = [
  ...APP_SERVICES_PROVIDERS,
  ...ANGULAR2_GOOGLE_MAPS_PROVIDERS,
  HttpClient
];
