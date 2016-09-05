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
import { LoginMobileComponent } from './login/login-mobile.component';
import { MainMobileComponent } from './main-mobile.component';
import { AuthGuard } from '../common/guards/auth.guard';
import { routesEditMyProfile } from './edit-my-profile/edit-my-profile.routes';
import { routesMessagesMobile } from './messages/messages-mobile.routes';
import { signupMobileRoutes } from './signup-mobile';

export const rootRoutes: RouterConfig = [
  {
    path: 'login',
    component: LoginMobileComponent
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
    path: '',
    component: MainMobileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/events/all',
        terminal: true
      },
      {
        path: 'events/:type',
        component: EventsMobileComponent,
      },
      {
        path: 'events',
        redirectTo: '/events/all'
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
        path: 'event/:eventId',
        component: EventMobileComponent,
      },
      {
        path: 'event/:eventId/attendees',
        component: AttendeesMobileComponent,
      },
      ...routesMessagesMobile,
      ...routesEditMyProfile,
      {
        path: ':username',
        component: UserProfileLoaderComponent
      },
      {
        path: '**',
        component: NoContentComponent
      }
    ]
  },

];

export const routesAppMobile: RouterConfig = [
  ...signupMobileRoutes,
  ...rootRoutes
];

export const APP_MOBILE_ROUTER_PROVIDERS = [
  provideRouter(routesAppMobile)
];
