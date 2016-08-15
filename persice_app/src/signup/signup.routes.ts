import { provideRouter, RouterConfig } from '@angular/router';
import { SignupInterestsComponent } from './interests';
import { SignupOffersComponent } from './offers';
import { SignupGoalsComponent } from './goals';
import { SignupConnectSocialAccountsComponent } from './connect-social-accounts';

const rootRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/interests',
    terminal: true
  },
  {
    path: 'interests',
    component: SignupInterestsComponent
  },
  {
    path: 'goals',
    component: SignupGoalsComponent
  },
  {
    path: 'offers',
    component: SignupOffersComponent
  },
  {
    path: 'connect',
    component: SignupConnectSocialAccountsComponent
  },
  {
    path: '**',
    redirectTo: '/interests',
    terminal: true
  }
];

export const routesSignup: RouterConfig = [
  ...rootRoutes
];

export const SIGNUP_ROUTER_PROVIDERS = [
  provideRouter(routesSignup)
];
