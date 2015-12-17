import {Component} from 'angular2/core';
import {RouteConfig, Router, Location, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

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
  name: 'SignupInterests',
  data: {page: 1}
},
{
  path: '/goals',
  component: SignupGoalsComponent,
  name: 'SignupGoals',
  data: {page: 2}
},
{
  path: '/offers',
  component: SignupOffersComponent,
  name: 'SignupOffers',
  data: {page: 3}
},
{
  path: '/connect',
  component: SignupConnectComponent,
  name: 'SignupConnect',
  data: {page: 4}
}
])
export class SignupComponent {
  page: number = 1;
  cGoa: number = 0;
  cOff: number = 0;
  cInt: number = 0;
  page: number = 1;
  showSkip = false;
  nextStep = 'SignupGoals';

  router: Router;
  location: Location;

  constructor(router: Router, location: Location) {
    this.router = router;
    this.location = location;
    this.router.subscribe((path) => this.onRouteChanged(path));
  }

  onRouteChanged(path) {
    switch (path) {
      case 'interests':
        this.page = 1;
        this.showSkip = false;
        this.nextStep = 'SignupGoals';
        break;
      case 'goals':
        this.page = 2;
        this.showSkip = true;
        this.nextStep = 'SignupOffers';
        break;
      case 'offers':
        this.page = 3;
        this.showSkip = true;
        this.nextStep = 'SignupConnect';
        break;
      case 'connect':
        this.page = 4;
        this.showSkip = true;
        this.nextStep = null;
        break;
       default:
        this.page = 1;
        this.showSkip = false;
        this.nextStep = 'SignupGoals';
        break;
    }
  }


  next(event) {
    console.log('clicked next');
    if (this.nextStep) {
      this.router.navigate([this.nextStep]);
    }
    else {
      window.location.href = '/#/crowd';
    }

  }

  skip(event) {
    console.log('clicked skip');
    if (this.nextStep) {
      this.router.navigate([this.nextStep]);
    }
    else {
      window.location.href = '/#/crowd';
    }

  }
}
