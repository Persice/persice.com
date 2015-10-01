/// <reference path="../../typings/_custom.d.ts" />

/*
 * Angular 2 decorators and services
 */
import {Directive, Component, View, ElementRef} from 'angular2/angular2';
import {RouteConfig, Router} from 'angular2/router';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';

/*
 * Angular Directives
 */
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

/*
 * Components
 */

import {LeftNavComponent} from './leftnav/leftnav.component';
import {TopHeaderComponent} from './topheader/topheader.component';
import {UsersListComponent} from './userslist/userslist.component';
import {FilterComponent} from './filter/filter.component';


import {AuthUser} from '../models/user.model';
let view = require('./app.html');





/*
 * Persice App Component
 * Top Level Component
 */
@Component({
  selector: 'persice-app',
  viewBindings: [HTTP_BINDINGS]
})
@View({
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES,
    LeftNavComponent,
    TopHeaderComponent,
    UsersListComponent,
    FilterComponent
  ],
  styles: [`
  `],
  template: view
})
export class AppComponent {
  crowd: Array<any>;
  constructor(public http: Http) {

  }
  onInit() {


    this.http.get('/api/v1/matchfeed/?format=json&filter=true')
      .toRx()
      .map(res => res.json())
      .subscribe(data => this.setCrowdList(data.objects));

  }


  setCrowdList(data) {
    this.crowd = data;
  }


}
