// App
export * from './app.component';

import { GOOGLE_MAPS_PROVIDERS } from '../common/google-map';
import { HttpClient } from './shared/core';

// import {provideStore} from '@ngrx/store';
// import * as devtools from '@ngrx/devtools';

// Application wide providers
export const APP_PROVIDERS = [
  ...GOOGLE_MAPS_PROVIDERS,
  HttpClient
];
