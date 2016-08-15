import { provideRouter, RouterConfig } from '@angular/router';
import { CrowdMobileComponent } from './crowd';
import { NoContentComponent } from './no-content';
import { ConnectionsMobileComponent } from './connections';
import { SettingsMobileComponent } from './settings';
import { EventsMobileComponent } from './events';
import { EventMobileComponent } from './events/event/event-mobile.component';
import { AttendeesMobileComponent } from './events/attendees';
import { UserProfileLoaderComponent } from './user-profile-loader';
import { TermsOfServiceMobileComponent } from './info/terms-of-service';
import { PrivacyPolicyMobileComponent } from './info/privacy-policy';
import { routesMessagesMobile } from './messages/';
import { routesEditMyProfile } from './edit-my-profile';

export const rootRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/crowd',
    terminal: true
  },
  {
    path: 'events',
    redirectTo: '/events/all',
    terminal: true
  },
  {
    path: 'crowd',
    component: CrowdMobileComponent
  },
  {
    path: 'pals',
    component: ConnectionsMobileComponent,
  },
  {
    path: 'settings',
    component: SettingsMobileComponent,
  },
  {
    path: 'events/:type',
    component: EventsMobileComponent,
  },
  {
    path: 'event/:eventId',
    component: EventMobileComponent,
  },
  {
    path: 'event/:eventId/attendees',
    component: AttendeesMobileComponent,
  },
  {
    path: 'privacy',
    component: PrivacyPolicyMobileComponent
  },
  {
    path: 'terms',
    component: TermsOfServiceMobileComponent
  },
  {
    path: ':username',
    component: UserProfileLoaderComponent
  },
  {
    path: '**',
    component: NoContentComponent
  },
];

export const routesAppMobile: RouterConfig = [
  ...routesMessagesMobile,
  ...routesEditMyProfile,
  ...rootRoutes
];

export const APP_MOBILE_ROUTER_PROVIDERS = [
  provideRouter(routesAppMobile)
];
