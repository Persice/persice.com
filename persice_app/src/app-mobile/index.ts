// App
export * from './app-mobile.component';

// Routes
export * from './app-mobile.routes';

import { GOOGLE_MAPS_PROVIDERS } from '../common/google-map';
import { HttpClient } from '../common/core';
// import {provideStore} from '@ngrx/store';
// import * as devtools from '@ngrx/devtools';
require('hammerjs');

// Application wide providers
export const APP_PROVIDERS = [
  ...GOOGLE_MAPS_PROVIDERS,
  HttpClient
];


