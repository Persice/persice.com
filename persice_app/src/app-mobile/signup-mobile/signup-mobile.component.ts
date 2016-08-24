import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { SignupHeaderMobileComponent } from './header';
import {
  InterestsService,
  KeywordsService,
  GoalsService,
  OffersService,
  UserAuthService,
  OnboardingService
} from '../../app/shared/services';
import { SignupStateService } from '../../common/services';

@Component({
  selector: 'persice-signup-mobile-app',
  encapsulation: ViewEncapsulation.None,
  template: <any>require('./signup-mobile.html'),
  directives: [
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
export class SignupMobileComponent implements OnInit, OnDestroy {
  cGoa: number = 0;
  cOff: number = 0;
  cInt: number = 0;
  counter: number = 0;
  page: number = 0;
  showBack = false;
  nextStep = '/goals';
  prevStep = null;
  title = 'Interests';
  nextTitle = 'Next';
  is_complete = null;
  isNextDisabled = true;

  notificationMain = {
    body: '',
    title: '',
    active: false,
    type: ''
  };

  routerSub;

  constructor(
    private router: Router,
    private location: Location,
    private userAuthService: UserAuthService,
    private onboardingService: OnboardingService,
    private signupStateService: SignupStateService
  ) {

  }

  ngOnInit() {
    this.onRouteChanged(this.location.path());
    this.signupStateService.counterEmitter.subscribe((state) => {
      this.onCounterChanged(state);
    });

    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.onRouteChanged(event.url);
      }
    });

    this.userAuthService.findOneByUri('me').subscribe((data) => {
      let res: any = data;
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

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  onRouteChanged(url: string) {
    console.log('route changed', url);
    switch (url) {
      case '/signup/interests':
        this.showBack = false;
        this.nextStep = '/goals';
        this.prevStep = null;
        this.title = 'Interests';
        this.nextTitle = 'Next';
        this.counter = this.cInt;
        this.page = 1;
        break;
      case '/signup/goals':
        this.showBack = true;
        this.nextStep = '/offers';
        this.prevStep = '/interests';
        this.title = 'Goals';
        this.nextTitle = 'Next';
        this.counter = this.cGoa;
        this.page = 2;
        this.isNextDisabled = false;
        break;
      case '/signup/offers':
        this.showBack = true;
        this.nextStep = '/connect';
        this.prevStep = '/goals';
        this.title = 'Offers';
        this.nextTitle = 'Next';
        this.counter = this.cOff;
        this.page = 3;
        this.isNextDisabled = false;
        break;
      case '/signup/connect':
        this.showBack = true;
        this.nextStep = null;
        this.prevStep = '/offers';
        this.title = 'Final Step';
        this.nextTitle = 'Go!';
        this.counter = null;
        this.page = 4;
        this.isNextDisabled = false;
        break;
      default:
        this.showBack = false;
        this.nextStep = '/goals';
        this.title = 'Interests';
        this.nextTitle = 'Next';
        this.counter = this.cInt;
        this.page = 1;
        this.isNextDisabled = false;
        break;
    }
  }

  next(event) {
    if (this.nextStep) {
      switch (this.nextStep) {
        case '/goals':
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

      this.router.navigateByUrl('/signup' + this.nextStep);
    } else {
      this.router.navigateByUrl('/crowd');
    }

  }

  back(event) {
    if (this.prevStep) {
      this.router.navigateByUrl('/signup' + this.prevStep);
    }
  }

  completeOnboarding() {
    if (this.is_complete === null) {
      this.onboardingService.complete().subscribe((data) => {
      }, (err) => {
      });
    }

  }

  onCounterChanged(event) {
    switch (event.type) {
      case 'interests':
        this.cInt = event.count;
        if (this.page === 1) {
          this.counter = this.cInt;
          this.isNextDisabled = this.cInt < 3;
        }
        break;
      case 'goals':
        this.cGoa = event.count;
        if (this.page === 2) {
          this.counter = this.cGoa;
        }
        break;
      case 'offers':
        this.cOff = event.count;
        if (this.page === 3) {
          this.counter = this.cOff;
        }
        break;

      default:
        break;
    }
  }

}
