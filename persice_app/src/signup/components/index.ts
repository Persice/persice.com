// App
export * from './signup.component';

import {APP_SERVICES_PROVIDERS} from '../../app/services/services';

import {HttpClient} from '../../app/core/http_client';

// Application wide providers
export const APP_PROVIDERS = [
  ...APP_SERVICES_PROVIDERS,
  HttpClient
];
