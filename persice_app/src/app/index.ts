// App
export * from './app.component';

import { ANGULAR2_GOOGLE_MAPS_PROVIDERS } from './shared/components/map/core';
import { HttpClient } from './shared/core';

// import {provideStore} from '@ngrx/store';
// import * as devtools from '@ngrx/devtools';

// Application wide providers
export const APP_PROVIDERS = [
  ...ANGULAR2_GOOGLE_MAPS_PROVIDERS,
  HttpClient
];
