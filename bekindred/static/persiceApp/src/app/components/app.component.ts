/// <reference path="../../typings/_custom.d.ts" />

/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/angular2';
import {HTTP_BINDINGS} from 'angular2/http';

/*
 * Angular Directives
 */
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
import {RouteConfig, ROUTER_DIRECTIVES, Route} from 'angular2/router';



/*
 * Components
 */


import {HomeComponent} from './home/home.component';
import {CrowdComponent} from './crowd/crowd.component';
import {MessageComponent} from './message/message.component';
import {ConnectionComponent} from './connection/connection.component';
import {EventsComponent} from './events/events.component';
import {ProfileComponent} from './profile/profile.component';


import {HeaderMainComponent} from './headermain/headermain.component';
import {HeaderSubComponent} from './headersub/headersub.component';
import {LoadingComponent} from './loading/loading.component';
import {NotificationComponent} from './notification/notification.component';

import {AuthUserModel} from '../models/user.model';

/*
 * Services available to child components
 */
import {FilterService} from '../services/filter.service';
import {UserService} from '../services/user.service';
import {NotificationService} from '../services/notification.service';

let view = require('./app.html');


/*
 * Persice App Component
 * Top Level Component
 */
@RouteConfig([
  // 'as' will be renamed to 'name' => https://github.com/angular/angular/issues/4622
  new Route({
    path: '/',
    component: HomeComponent,
    name: 'Home'
  }),
  new Route({
    path: '/crowd/:version',
    component: CrowdComponent,
    name: 'Crowd'
  }),
  new Route({
    path: '/messages',
    component: MessageComponent,
    name: 'Messages'
  }),
  new Route({
    path: '/connections',
    component: ConnectionComponent,
    name: 'Connections'
  }),
  new Route({
    path: '/events',
    component: EventsComponent,
    name: 'Events'
  }),
  new Route({
    path: '/profilepage',
    component: ProfileComponent,
    name: 'Profile'
  })
])
@Component({
  selector: 'persice-app',
  viewBindings: [HTTP_BINDINGS],
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES,
    HeaderMainComponent,
    HeaderSubComponent,
    LoadingComponent,
    NotificationComponent
  ],
  styles: [`
   `],
  template: view,
  providers: [FilterService, UserService, NotificationService]
})
export class AppComponent {
  user: AuthUserModel;
  image: string;
  loading: boolean;
  notificationOther = {
    body: '',
    title: '',
    active: false,
    type: ''
  };

  constructor(
    public userService: UserService,
    public notificationService: NotificationService
  ) {
    //default image
    this.image = this.userService.getDefaultImage();
  }
  onInit() {
    // Get AuthUser info for the app
    this.userService.get()
      .subscribe(data => this.assignAuthUser(data));

    //create new observer and subscribe for notification service
    this.notificationService.addObserver('app');
    this.notificationService.observer('app')
      .subscribe(
      (data) => this.showNotification(data),
      (err) => console.log(err),
      () => console.log('event completed')
      );
  }

  onDestroy() {
    this.notificationService.observer('app').unsubscribe();
    this.notificationService.removeObserver('app');
  }

  showNotification(data) {
    this.notificationOther.body = data.content;
    this.notificationOther.type = data.type;
    this.notificationOther.active = true;
    setTimeout(
      () => {
        this.notificationOther.active = false;
      },
      4000
    );
  }

  // Assign AuthUser user from the /me Api
  assignAuthUser(data) {
    this.user = new AuthUserModel(data.objects[0]);
    this.image = this.user.info.image;
  }




}
