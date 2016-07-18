import { provideRouter, RouterConfig } from '@angular/router';
import { SignupInterestsMobileComponent } from './interests';
import { SignupOffersMobileComponent } from './offers';
import { SignupGoalsMobileComponent } from './goals';
import { SignupConnectSocialAccountsMobileComponent } from './connect-social-accounts';

const rootRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/interests',
    terminal: true
  },
  {
    path: 'interests',
    component: SignupInterestsMobileComponent
  },
  {
    path: 'goals',
    component: SignupGoalsMobileComponent
  },
  {
    path: 'offers',
    component: SignupOffersMobileComponent
  },
  {
    path: 'connect',
    component: SignupConnectSocialAccountsMobileComponent
  },
  {
    path: '**',
    redirectTo: '/interests',
    terminal: true
  }
];

export const routesSignupMobile: RouterConfig = [
  ...rootRoutes
];

export const SIGNUP_MOBILE_ROUTER_PROVIDERS = [
  provideRouter(routesSignupMobile)
];
