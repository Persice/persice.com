// App
export * from './signup.component';
export * from './signup.routes';

import { HttpClient } from '../app/shared/core';

// Application wide providers
export const APP_PROVIDERS = [
  HttpClient
];
