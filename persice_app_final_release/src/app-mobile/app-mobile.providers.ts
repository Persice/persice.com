import { HttpClient } from '../common/core/http-client';
import { AuthGuard } from '../common/guards/auth.guard';

export const APP_MOBILE_PROVIDERS = [
  HttpClient,
  AuthGuard,
];
