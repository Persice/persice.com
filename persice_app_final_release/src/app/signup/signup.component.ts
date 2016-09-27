import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { SignupStateService } from '../../common/services';
import { UserAuthService } from '../../common/services/userauth.service';
import { OnboardingService } from '../../common/services/onboarding.service';
import { WarningService } from '../../common/services/warning.service';
import { InterestsService } from '../../common/services/interests.service';
import { GoalsService } from '../../common/services/goals.service';
import { OffersService } from '../../common/services/offers.service';
import { KeywordsService } from '../../common/services/keywords.service';

@Component({
  templateUrl: './signup.component.html',
  selector: 'prs-signup',
  encapsulation: ViewEncapsulation.None,
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
export class SignupComponent implements OnInit, OnDestroy {
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

  routerSub;

  constructor(
    private router: Router,
    private location: Location,
    private userAuthService: UserAuthService,
    private onboardingService: OnboardingService,
    private warningService: WarningService,
    private signupStateService: SignupStateService
  ) {
  }

  ngOnInit() {
    this.onRouteChanged(this.location.path());
    this.signupStateService.counterEmitter.subscribe((state) => {
      this.onCounterChanged(state);
    });

    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onRouteChanged(event.url);
      }
    });

    this.userAuthService.findOneByUri('me').subscribe((data) => {
      if (!!data) {
        this.cGoa = data.goals.length;
        this.cOff = data.offers.length;
        this.cInt = data.interests.length;
        this.is_complete = data.onboardingflow;
      }

    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  onRouteChanged(url: string) {
    switch (url) {
      case '/signup/interests':
        this.page = 1;
        this.showSkip = false;
        this.nextStep = '/goals';
        this.nextTitle = 'Next';
        break;
      case '/signup/goals':
        this.page = 2;
        this.showSkip = true;
        this.nextStep = '/offers';
        this.nextTitle = 'Next';
        break;
      case '/signup/offers':
        this.page = 3;
        this.showSkip = true;
        this.nextStep = '/connect';
        this.nextTitle = 'Next';
        break;
      case '/signup/connect':
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
      this.router.navigateByUrl('/signup' + this.nextStep);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  skip(event) {
    if (this.nextStep) {
      this.router.navigateByUrl('/signup' + this.nextStep);
    } else {
      this.router.navigateByUrl('/');
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
