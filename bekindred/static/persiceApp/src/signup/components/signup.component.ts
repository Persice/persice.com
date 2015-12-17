import {Component, ViewChild} from 'angular2/core';
import {RouteConfig, Router, Location, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

import {SignupInterestsComponent} from './signup_interests/signup_interests.component';
import {SignupGoalsComponent} from './signup_goals/signup_goals.component';
import {SignupOffersComponent} from './signup_offers/signup_offers.component';
import {SignupConnectComponent} from './signup_connect/signup_connect.component';
import {SignupHeaderComponent} from './signup_header/signup_header.component';


import {InterestsService} from '../../app/services/interests.service';
import {KeywordsService} from '../../app/services/keywords.service';
import {NotificationService} from '../../app/services/notification.service';

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
    KeywordsService,
    NotificationService

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
  @ViewChild(SignupOffersComponent) myElem3: SignupOffersComponent;
  @ViewChild(SignupGoalsComponent) myElem2: SignupGoalsComponent;
  @ViewChild(SignupConnectComponent) myElem4: SignupConnectComponent;



  page: number = 1;
  cGoa: number = 0;
  cOff: number = 0;
  cInt: number = 0;
  showSkip = false;
  nextStep = 'SignupGoals';

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
    public notificationService: NotificationService
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

      this.onRouteChanged(path);
    });
  }

  ngOnInit() {
    //create new observer and subscribe for notification service
    this.notificationService.addObserver('signupapp');
    this.notificationService.observer('signupapp')
      .subscribe(
      (data) => this.showNotification(data),
      (err) => {
        console.log('Notification error %s', err);
      },
      () => console.log('event completed')
      );
  }

  ngOnDestroy() {
    this.notificationService.observer('signupapp').unsubscribe();
    this.notificationService.removeObserver('signupapp');
  }

  showNotification(data: InterfaceNotification) {
    this.notificationMain.body = data.body;
    this.notificationMain.type = data.type;
    this.notificationMain.title = data.title;
    this.notificationMain.active = true;

    //autoclose notification if autoclose option enabled
    if (data.autoclose > 0) {
      this.closeNotification(data.autoclose);
    }

  }

  closeNotification(timeout) {
    setTimeout(
      () => {
        this.notificationMain.active = false;
      },
      timeout
    );
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


      switch (this.nextStep) {
        case 'SignupGoals':
          //check if user selected 3 interests
          if (this.cInt < 3) {
            this.notificationService.push({
              type: 'warning',
              title: '',
              body: `To continue, please select at least three interests.`,
              autoclose: 4000
            });
            return;
          }
          break;

        default:
          // code...
          break;
      }

      this.router.navigate([this.nextStep]);
    }
    else {
      window.location.href = '/#/crowd';
    }

  }

  skip(event) {
    if (this.nextStep) {
      this.router.navigate([this.nextStep]);
    }
    else {
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
