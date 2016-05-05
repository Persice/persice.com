import {
  Component,
  ViewEncapsulation,
  OnInit
} from '@angular/core';

import {
  Router,
  ROUTER_DIRECTIVES,
  RouteConfig
} from '@angular/router-deprecated';
import {Location} from '@angular/common';

import {SignupHeaderMobileComponent} from './header';
import {SignupInterestsMobileComponent} from './interests';
import {SignupOffersMobileComponent} from './offers';
import {SignupGoalsMobileComponent} from './goals';
import {SignupConnectSocialAccountsMobileComponent} from './connect-social-accounts';


import {
  InterestsService,
  KeywordsService,
  GoalsService,
  OffersService,
  UserAuthService,
  OnboardingService
} from '../app/shared/services';

import {SignupStateService} from '../common/services';

@Component({
  selector: 'persice-signup-mobile-app',
  encapsulation: ViewEncapsulation.None,
  template: require('./signup-mobile.html'),
  directives: [
    ROUTER_DIRECTIVES,
    SignupHeaderMobileComponent
  ],
  providers: [
    InterestsService,
    GoalsService,
    OffersService,
    KeywordsService,
    UserAuthService,
    OnboardingService,
    SignupStateService
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
export class SignupMobileComponent implements OnInit {
  cGoa: number = 0;
  cOff: number = 0;
  cInt: number = 0;
  counter: number = 0;
  page: number = 0;
  showBack = false;
  nextStep = 'SignupGoals';
  prevStep = null;
  title = 'Interests';
  nextTitle = 'Next';
  is_complete = null;
  isNextDisabled = true;

  router: Router;
  location: Location;

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
    private userAuthService: UserAuthService,
    private onboardingService: OnboardingService,
    private signupStateService: SignupStateService
  ) {
    this.router = router;
    this.location = location;

    this.signupStateService.counterEmitter.subscribe((state) => {
      this.onCounterChanged(state);
    });

    this.router.subscribe((path) => {
      this.onRouteChanged(path);
    });
  }

  ngOnInit() {

    this.userAuthService.findOneByUri('me').subscribe((data) => {
      let res = data;
      this.cGoa = res.goals.length;
      this.cOff = res.offers.length;
      this.cInt = res.interests.length;
      this.onCounterChanged({
        type: 'interests',
        count: this.cInt
      });
      this.onCounterChanged({
        type: 'goals',
        count: this.cGoa
      });
      this.onCounterChanged({
        type: 'offers',
        count: this.cOff
      });
      this.is_complete = res.onboardingflow;
    });
  }

  onRouteChanged(path) {
    switch (path) {
      case 'interests':
        this.showBack = false;
        this.nextStep = 'SignupGoals';
        this.prevStep = null;
        this.title = 'Interests';
        this.nextTitle = 'Next';
        this.counter = this.cInt;
        this.page = 1;
        break;
      case 'goals':
        this.showBack = true;
        this.nextStep = 'SignupOffers';
        this.prevStep = 'SignupInterests';
        this.title = 'Goals';
        this.nextTitle = 'Next';
        this.counter = this.cGoa;
        this.page = 2;
        this.isNextDisabled = false;
        break;
      case 'offers':
        this.showBack = true;
        this.nextStep = 'SignupConnect';
        this.prevStep = 'SignupGoals';
        this.title = 'Offers';
        this.nextTitle = 'Next';
        this.counter = this.cOff;
        this.page = 3;
        this.isNextDisabled = false;
        break;
      case 'connect':
        this.showBack = true;
        this.nextStep = null;
        this.prevStep = 'SignupOffers';
        this.title = 'Final Step';
        this.nextTitle = 'Go!';
        this.counter = null;
        this.page = 4;
        this.isNextDisabled = false;
        break;
      default:
        this.showBack = false;
        this.nextStep = 'SignupGoals';
        this.title = 'Interests';
        this.nextTitle = 'Interests';
        this.counter = null;
        this.page = 1;
        this.isNextDisabled = false;
        break;
    }
  }


  next(event) {
    if (this.nextStep) {
      switch (this.nextStep) {
        case 'SignupGoals':
          //check if user selected less than 3 interests
          if (this.cInt < 3) {
            this.isNextDisabled = true;
            return;
          } else {
            this.completeOnboarding();
            this.isNextDisabled = false;
          }
          break;
        default:
          break;
      }

      this.router.navigate([this.nextStep]);
    } else {
      window.location.href = '/crowd/';
    }

  }

  back(event) {
    if (this.prevStep) {
      this.router.navigate([this.prevStep]);
    }
  }

  completeOnboarding() {
    if (this.is_complete === null) {
      this.onboardingService.complete().subscribe((data) => {
      }, (err) => {
      }, () => {

      });
    }

  }

  onCounterChanged(event) {
    switch (event.type) {
      case 'interests':
        this.cInt = event.count;
        if (this.page === 1) {
          this.counter = this.cInt;
          if (this.cInt < 3) {
            this.isNextDisabled = true;
          } else {
            this.isNextDisabled = false;
          }
        }
        break;
      case 'goals':
        this.cGoa = event.count;
        if (this.page === 2) {
          this.counter = this.cGoa;
        };
        break;
      case 'offers':
        this.cOff = event.count;
        if (this.page === 3) {
          this.counter = this.cOff;
        };
        break;

      default:
        break;
    }
  }

}
