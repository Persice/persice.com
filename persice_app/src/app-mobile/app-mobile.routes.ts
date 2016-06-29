import {provideRouter, RouterConfig} from '@angular/router';

import {CrowdMobileComponent} from './crowd';
import {NoContentComponent} from './no-content';
import {ConnectionsMobileComponent} from './connections';
import {SettingsMobileComponent} from './settings';
import {EventsMobileComponent} from './events';
import {AttendeesMobileComponent} from './events/attendees';
import {MyProfileMobileComponent} from './my-profile';
import {TermsOfServiceMobileComponent} from './info/terms-of-service';
import {PrivacyPolicyMobileComponent} from './info/privacy-policy';

export const rootRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/crowd',
    terminal: true
  },
  {
    path: 'crowd',
    component: CrowdMobileComponent
  },
  {
    path: 'connections',
    component: ConnectionsMobileComponent,
  },
  {
    path: 'settings',
    component: SettingsMobileComponent,
  },
  {
    path: 'events',
    component: EventsMobileComponent,
  },
  {
    path: 'attendees',
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
    component: MyProfileMobileComponent
  },
  {
    path: '**',
    component: NoContentComponent
  },
];

import {routesMessagesMobile} from './messages/';
import {routesEditMyProfile} from './edit-my-profile';

export const routesAppMobile: RouterConfig = [
  ...routesMessagesMobile,
  ...routesEditMyProfile,
  ...rootRoutes
];

export const APP_MOBILE_ROUTER_PROVIDERS = [
  provideRouter(routesAppMobile)
];
