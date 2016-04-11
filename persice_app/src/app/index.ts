// App
export * from './app.component';

import {
  MapsAPILoader,
  NoOpMapsAPILoader,
  ANGULAR2_GOOGLE_MAPS_PROVIDERS
} from './shared/components/map/core';

// import {provideStore} from '@ngrx/store';
// import * as devtools from '@ngrx/devtools';

import {HttpClient} from './shared/core';

// Application wide providers
export const APP_PROVIDERS = [
  ...ANGULAR2_GOOGLE_MAPS_PROVIDERS,
  HttpClient
];
