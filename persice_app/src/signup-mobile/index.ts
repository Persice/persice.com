// App
export * from './signup-mobile.component';
import { HttpClient } from '../app/shared/core';

// Application wide providers
export const APP_PROVIDERS = [
  HttpClient
];

export * from './signup-mobile.routes';
