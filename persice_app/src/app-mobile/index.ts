// App
export * from './app-mobile.component';

import { ANGULAR2_GOOGLE_MAPS_PROVIDERS } from '../app/shared/components/map/core';
import { HttpClient } from '../app/shared/core';

// import {provideStore} from '@ngrx/store';
// import * as devtools from '@ngrx/devtools';
require('hammerjs');

// Application wide providers
export const APP_PROVIDERS = [
  ...ANGULAR2_GOOGLE_MAPS_PROVIDERS,
  HttpClient
];

export * from './app-mobile.routes';
