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


import {HomePageComponent} from './homepage/homepage.component';
import {CrowdPageComponent} from './crowdpage/crowdpage.component';
import {MessagePageComponent} from './messagepage/messagepage.component';
import {ConnectionPageComponent} from './connectionpage/connectionpage.component';
import {EventsPageComponent} from './eventspage/eventspage.component';


import {HeaderMainComponent} from './headermain/headermain.component';
import {HeaderSubComponent} from './headersub/headersub.component';
import {LoadingIndicatorComponent} from './loadingindicator/loadingindicator.component';
import {AutofocusDirective} from '../directives/autofocus.directive';


import {AuthUserModel} from '../models/user.model';

let view = require('./app.html');


/*
 * Persice App Component
 * Top Level Component
 */
@RouteConfig([
  // 'as' will be renamed to 'name' => https://github.com/angular/angular/issues/4622
  new Route({ path: '/', component: HomePageComponent, as: 'Home' }),
  new Route({ path: '/crowd/:version', component: CrowdPageComponent, as: 'Crowd' }),
  new Route({ path: '/message', component: MessagePageComponent, as: 'Message' }),
  new Route({ path: '/connection', component: ConnectionPageComponent, as: 'Connection' }),
  new Route({ path: '/events', component: EventsPageComponent, as: 'Events' })
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
    LoadingIndicatorComponent,
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
