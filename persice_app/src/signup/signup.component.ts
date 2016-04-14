import {
  Component,
  ViewChild,
  ViewEncapsulation,
  OnInit
} from 'angular2/core';
import {
  RouteConfig,
  Router,
  Location,
  RouteParams,
  ROUTER_DIRECTIVES
} from 'angular2/router';

import {SignupInterestsComponent} from './interests';
import {SignupGoalsComponent} from './goals';
import {SignupOffersComponent} from './offers';
import {SignupConnectComponent} from './connect-social-accounts';
import {SignupHeaderComponent} from './header';


import {
  InterestsService,
  KeywordsService,
  GoalsService,
  OffersService,
  UserAuthService,
  OnboardingService,
  WarningService
} from '../app/shared/services';


@Component({
  template: require('./signup.html'),
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
    WarningService
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
export class SignupComponent implements OnInit {

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
    private warningService: WarningService
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
        subs = this.myElem1.counter.subscribe(message => {
          this.onCounterChanged(message);
          if (message.count >= 3) {
            this.warningService.push(false);
          }
        });
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

    this.userAuthService.findOneByUri('me').subscribe((data) => {
      let res = data;
      this.cGoa = res.goals.length;
      this.cOff = res.offers.length;
      this.cInt = res.interests.length;
      this.is_complete = res.onboardingflow;
    });
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
    if (this.nextStep) {
      switch (this.nextStep) {
        case 'SignupGoals':
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
