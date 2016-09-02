// App
export * from './app.component';

// Routes
export * from './app.routes';
import { GOOGLE_MAPS_PROVIDERS } from '../common/google-map';
import { HttpClient } from '../common/core';

// Application wide providers
export const APP_PROVIDERS = [
  ...GOOGLE_MAPS_PROVIDERS,
  HttpClient
];
