import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { SignupHeaderComponent } from './header';
import {
  InterestsService,
  KeywordsService,
  GoalsService,
  OffersService,
  UserAuthService,
  OnboardingService,
  WarningService
} from '../app/shared/services';
import { SignupStateService } from '../common/services';

@Component({
  template: <any>require('./signup.html'),
  selector: 'persice-signup',
  encapsulation: ViewEncapsulation.None,
  directives: [
    SignupHeaderComponent,
    ROUTER_DIRECTIVES
  ],
  providers: [
    InterestsService,
    GoalsService,
    OffersService,
    KeywordsService,
    UserAuthService,
    OnboardingService,
    WarningService,
    SignupStateService
  ]
})
export class SignupComponent implements OnInit {
  page: number = 1;
  cGoa: number = 0;
  cOff: number = 0;
  cInt: number = 0;
  showSkip = false;
  nextStep = '/goals';
  nextTitle = 'Next';
  is_complete = null;

  notificationMain = {
    body: '',
    title: '',
    active: false,
    type: ''
  };

  constructor(
    private router: Router,
    private location: Location,
    private goalsService: GoalsService,
    private offersService: OffersService,
    private interestsService: InterestsService,
    private userAuthService: UserAuthService,
    private onboardingService: OnboardingService,
    private warningService: WarningService,
    private signupStateService: SignupStateService
  ) {
  }

  ngOnInit() {
    this.signupStateService.counterEmitter.subscribe((state) => {
      this.onCounterChanged(state);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onRouteChanged(event.url);
      }
    });

    this.userAuthService.findOneByUri('me').subscribe((data) => {
      let res = data;
      this.cGoa = res.goals.length;
      this.cOff = res.offers.length;
      this.cInt = res.interests.length;
      this.is_complete = res.onboardingflow;
    });
  }

  onRouteChanged(url: string) {
    switch (url) {
      case '/interests':
        this.page = 1;
        this.showSkip = false;
        this.nextStep = '/goals';
        this.nextTitle = 'Next';
        break;
      case '/goals':
        this.page = 2;
        this.showSkip = true;
        this.nextStep = '/offers';
        this.nextTitle = 'Next';
        break;
      case '/offers':
        this.page = 3;
        this.showSkip = true;
        this.nextStep = '/connect';
        this.nextTitle = 'Next';
        break;
      case '/connect':
        this.page = 4;
        this.showSkip = true;
        this.nextStep = null;
        this.nextTitle = 'Go!';
        break;
      default:
        this.page = 1;
        this.showSkip = false;
        this.nextStep = '/goals';
        this.nextTitle = 'Next';
        break;
    }
  }

  next(event) {
    if (this.nextStep) {
      switch (this.nextStep) {
        case '/goals':
          //check if user selected less than 3 interests
          if (this.cInt < 3) {
            this.warningService.push(true);
            return;
          } else {
            this.completeOnboarding();
            this.warningService.push(false);
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

  skip(event) {
    if (this.nextStep) {
      this.router.navigate([this.nextStep]);
    } else {
      window.location.href = '/crowd/';
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
