import {Component, ViewChild} from 'angular2/core';
import {RouteConfig, Router, Location, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

import {SignupInterestsComponent} from './signup_interests/signup_interests.component';
import {SignupGoalsComponent} from './signup_goals/signup_goals.component';
import {SignupOffersComponent} from './signup_offers/signup_offers.component';
import {SignupConnectComponent} from './signup_connect/signup_connect.component';
import {SignupHeaderComponent} from './signup_header/signup_header.component';


import {InterestsService} from '../../app/services/interests.service';
import {KeywordsService} from '../../app/services/keywords.service';
import {GoalsService} from '../../app/services/goals.service';
import {OffersService} from '../../app/services/offers.service';
import {UserService} from '../../app/services/user.service';
import {UserAuthService} from '../../app/services/userauth.service';
import {OnboardingService} from '../../app/services/onboarding.service';

import {NotificationComponent} from '../../app/components/notification/notification.component';
import {InterfaceNotification} from '../../app/models/notification.model';

let view = require('./signup.html');

@Component({
  template: view,
  selector: 'persice-signup',
  directives: [
    SignupHeaderComponent,
    ROUTER_DIRECTIVES,
    NotificationComponent
  ],
  providers: [
    InterestsService,
    GoalsService,
    OffersService,
    KeywordsService,
    UserService,
    UserAuthService,
    OnboardingService
  ]
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
    data: { page: 1 }
  },
  {
    path: '/goals',
    component: SignupGoalsComponent,
    name: 'SignupGoals',
    data: { page: 2 }
  },
  {
    path: '/offers',
    component: SignupOffersComponent,
    name: 'SignupOffers',
    data: { page: 3 }
  },
  {
    path: '/connect',
    component: SignupConnectComponent,
    name: 'SignupConnect',
    data: { page: 4 }
  }
])
export class SignupComponent {

  @ViewChild(SignupInterestsComponent) myElem1: SignupInterestsComponent;
  @ViewChild(SignupGoalsComponent) myElem2: SignupGoalsComponent;
  @ViewChild(SignupOffersComponent) myElem3: SignupOffersComponent;




  page: number = 1;
  cGoa: number = 0;
  cOff: number = 0;
  cInt: number = 0;
  showSkip = false;
  nextStep = 'SignupGoals';
  nextTitle = 'Next';
  is_complete = null;

  router: Router;
  location: Location;

  timeoutId = null;

  notificationMain = {
    body: '',
    title: '',
    active: false,
    type: ''
  };

  constructor(
    router: Router,
    location: Location,
    private goalsService: GoalsService,
    private offersService: OffersService,
    private interestsService: InterestsService,
    private userService: UserService,
    private userAuthService: UserAuthService,
    private onboardingService: OnboardingService
  ) {
    this.router = router;
    this.location = location;

    let subs = null;

    this.router.subscribe((path) => {
      if (subs) {
        subs.unsubscribe();
        subs = null;
      }
      if (this.myElem1) {
        subs = this.myElem1.counter.subscribe(message => this.onCounterChanged(message));
      }

      if (this.myElem2) {
        subs = this.myElem2.counter.subscribe(message => this.onCounterChanged(message));
      }

      if (this.myElem3) {
        subs = this.myElem3.counter.subscribe(message => this.onCounterChanged(message));
      }

      this.onRouteChanged(path);
    });
  }

  ngOnInit() {

    this.userService.get().subscribe((data) => {
      let res = data.objects[0];
      this.cGoa = res.goals_count;
      this.cOff = res.offers_count;
      this.cInt = res.interest_count;
      this.is_complete = res.onboardingflow;
    });

    this.userAuthService.findOneByUri('me').subscribe((data) => {
      let res = data;
      this.is_complete = res.onboardingflow;
    });
  }

  ngOnDestroy() {

  }


  onRouteChanged(path) {
    switch (path) {
      case 'interests':
        this.page = 1;
        this.showSkip = false;
        this.nextStep = 'SignupGoals';
        this.nextTitle = 'Next';
        break;
      case 'goals':
        this.page = 2;
        this.showSkip = true;
        this.nextStep = 'SignupOffers';
        this.nextTitle = 'Next';
        break;
      case 'offers':
        this.page = 3;
        this.showSkip = true;
        this.nextStep = 'SignupConnect';
        this.nextTitle = 'Next';
        break;
      case 'connect':
        this.page = 4;
        this.showSkip = true;
        this.nextStep = null;
        this.nextTitle = 'Go!';
        break;
      default:
        this.page = 1;
        this.showSkip = false;
        this.nextStep = 'SignupGoals';
        this.nextTitle = 'Next';
        break;
    }
  }


  next(event) {
    console.log('clicked next');
    if (this.nextStep) {


      switch (this.nextStep) {
        case 'SignupGoals':
          //check if user selected 3 interests
          if (this.cInt < 3) {

            return;
          }
          break;

        default:
          break;
      }

      this.router.navigate([this.nextStep]);
    } else {
      this.completeOnboarding();
    }

  }

  skip(event) {
    if (this.nextStep) {
      this.router.navigate([this.nextStep]);
    } else {
      this.completeOnboarding();
    }

  }


  completeOnboarding() {
    if (this.is_complete === null) {
      this.onboardingService.complete().subscribe((data) => {
        window.location.href = '/#/crowd';
      }, (err) => {
        console.log(err);
      }, () => {

      });
    } else {
      window.location.href = '/#/crowd';
    }

  }

  onCounterChanged(event) {
    switch (event.type) {
      case 'interests':
        this.cInt = event.count;
        break;
      case 'goals':
        this.cGoa = event.count;
        break;
      case 'offers':
        this.cOff = event.count;
        break;

      default:
        break;
    }
  }
}
