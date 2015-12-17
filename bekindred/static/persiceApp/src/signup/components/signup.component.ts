import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {SignupInterestsComponent} from './signup_interests/signup_interests.component';
import {SignupGoalsComponent} from './signup_goals/signup_goals.component';
import {SignupOffersComponent} from './signup_offers/signup_offers.component';
import {SignupConnectComponent} from './signup_connect/signup_connect.component';
import {SignupHeaderComponent} from './signup_header/signup_header.component';

let view = require('./signup.html');

@Component({
  template: view,
  selector: 'persice-signup',
  directives: [SignupHeaderComponent, ROUTER_DIRECTIVES]
})
@RouteConfig([
  {
    path: '/',
    redirectTo: ['SignupInterests']
  },
  {
    path: '/interests',
    component: SignupInterestsComponent,
    name: 'SignupInterests'
  },
  {
    path: '/goals',
    component: SignupGoalsComponent,
    name: 'SignupGoals'
  },
  {
    path: '/offers',
    component: SignupOffersComponent,
    name: 'SignupOffers'
  },
  {
    path: '/connect',
    component: SignupConnectComponent,
    name: 'SignupConnect'
  }
])
export class SignupComponent {

}
