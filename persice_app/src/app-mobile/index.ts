// App
export * from './app-mobile.component';

import { GOOGLE_MAPS_PROVIDERS } from '../common/google-map';
import { HttpClient } from '../app/shared/core';

// import {provideStore} from '@ngrx/store';
// import * as devtools from '@ngrx/devtools';
require('hammerjs');

// Application wide providers
export const APP_PROVIDERS = [
  ...GOOGLE_MAPS_PROVIDERS,
  HttpClient
];

export * from './app-mobile.routes';
