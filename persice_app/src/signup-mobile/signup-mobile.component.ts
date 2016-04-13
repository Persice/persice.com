import {
  Component,
  ViewEncapsulation
} from 'angular2/core';

import {
  Router,
  ROUTER_DIRECTIVES,
  RouteConfig
} from 'angular2/router';

import {SignupHeaderMobileComponent} from './header';
import {SignupInterestsMobileComponent} from './interests';
import {SignupOffersMobileComponent} from './offers';
import {SignupGoalsMobileComponent} from './goals';
import {SignupConnectSocialAccountsMobileComponent} from './connect-social-accounts';


@Component({
  selector: 'persice-signup-mobile-app',
  encapsulation: ViewEncapsulation.None,
  template: require('./signup-mobile.html'),
  directives: [
    ROUTER_DIRECTIVES,
    SignupHeaderMobileComponent
  ]
})
@RouteConfig([
  {
    path: '/',
    redirectTo: ['SignupInterests']
  },
  {
    path: '/interests',
    component: SignupInterestsMobileComponent,
    name: 'SignupInterests',
    data: { page: 1 }
  },
  {
    path: '/goals',
    component: SignupGoalsMobileComponent,
    name: 'SignupGoals',
    data: { page: 2 }
  },
  {
    path: '/offers',
    component: SignupOffersMobileComponent,
    name: 'SignupOffers',
    data: { page: 3 }
  },
  {
    path: '/connect',
    component: SignupConnectSocialAccountsMobileComponent,
    name: 'SignupConnect',
    data: { page: 4 }
  }
])
export class SignupMobileComponent {

}
