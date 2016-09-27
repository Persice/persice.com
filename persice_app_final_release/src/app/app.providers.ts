import { HttpClient } from '../common/core/http-client';
import { AuthGuard } from '../common/guards/auth.guard';

export const APP_PROVIDERS = [
  HttpClient,
  AuthGuard,
];
