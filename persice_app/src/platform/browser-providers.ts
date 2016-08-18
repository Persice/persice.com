/*
 * These are globally available services in any component or any other service
 */
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_PROVIDERS, JSONP_PROVIDERS } from '@angular/http';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { APP_MOBILE_ROUTER_PROVIDERS } from '../app-mobile';
import { APP_ROUTER_PROVIDERS } from '../app';
import { NG2_UI_AUTH_PROVIDERS } from 'ng2-ui-auth';
import { AuthGuard } from '../common/guards/auth.guard';
const FACEBOOK_ID = '634990373263225';

const AUTH_PROVIDERS = [
  AuthGuard,
  NG2_UI_AUTH_PROVIDERS({
    tokenPrefix: 'persice',
    providers: {
      facebook: {
        redirectUri: 'http://test-local.com:8000/auth/facebook/callback/',
        clientId: FACEBOOK_ID,
        display: 'popup',
        scope: ["email", "user_about_me", "user_birthday", "user_likes", "user_friends", "user_managed_groups", "user_photos", "user_work_history", "user_religion_politics", "user_location"]
      },
    }
  })
];
/*
 * Application Providers/Directives/Pipes
 * providers/directives/pipes that only live in our browser environment
 */
export const APPLICATION_PROVIDERS_MAIN = [
  // new Angular 2 forms
  disableDeprecatedForms(),
  provideForms(),
  ...HTTP_PROVIDERS,
  ...JSONP_PROVIDERS,
  ...APP_ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: PathLocationStrategy},
  {provide: APP_BASE_HREF, useValue: '/'}
];

export const APPLICATION_PROVIDERS_MAIN_MOBILE = [
  // new Angular 2 forms
  disableDeprecatedForms(),
  provideForms(),
  ...HTTP_PROVIDERS,
  ...JSONP_PROVIDERS,
  ...APP_MOBILE_ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: PathLocationStrategy}
];

export const PROVIDERS_MAIN = [
  ...AUTH_PROVIDERS,
  ...APPLICATION_PROVIDERS_MAIN
];

export const PROVIDERS_MAIN_MOBILE = [
  ...AUTH_PROVIDERS,
  ...APPLICATION_PROVIDERS_MAIN_MOBILE
];
