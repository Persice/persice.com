/// <reference path="../../typings/_custom.d.ts" />

/*
 * Angular 2 decorators and services
 */
import {Component, provide} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';

/*
 * Angular Directives
 */
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Route} from 'angular2/router';

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
import {AutofocusDirective} from '../directives/autofocus.directive';


import {AuthUserModel} from '../models/user.model';

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
    as: 'Home'
  }),
  new Route({
    path: '/crowd/:version',
    component: CrowdComponent,
    as: 'Crowd'
  }),
  new Route({
    path: '/messages',
    component: MessageComponent,
    as: 'Messages'
  }),
  new Route({
    path: '/connections',
    component: ConnectionComponent,
    as: 'Connections'
  }),
  new Route({
    path: '/events',
    component: EventsComponent,
    as: 'Events'
  }),
  new Route({
    path: '/profilepage',
    component: ProfileComponent,
    as: 'Profile'
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
    AutofocusDirective
  ],
  styles: [`
   `],
  template: view
})
export class AppComponent {
  user: AuthUserModel;
  image: string;
  loading: boolean;

  constructor(public http: Http) {
    //default image
    this.image = '/static/persiceApp/src/public/images/avatar_user_m.jpg';
  }
  onInit() {
    // Get AuthUser info for the app
    this.http.get('/api/v1/me/?format=json')
      .map(res => res.json())
      .subscribe(data => this.assignAuthUser(data));
  }

  // Assign AuthUser user from the /me Api
  assignAuthUser(data) {
    this.user = new AuthUserModel(data.objects[0]);
    this.image = this.user.info.image;
  }




}
